import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// 1. Load Environment
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const firstEq = line.indexOf('=');
    if (firstEq !== -1) {
        const key = line.substring(0, firstEq).trim();
        let value = line.substring(firstEq + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
        }
        env[key] = value;
    }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

const csvPath = 'AGENDAMENTOS-Tabela 1.csv';
const servicesPath = 'services_2026-03-02.csv';

function parseCSVLine(line, delimiter = ';') {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === delimiter && !inQuotes) {
            parts.push(current.trim());
            current = '';
        } else current += char;
    }
    parts.push(current.trim());
    return parts;
}

const proMap = {
    "tais": "00000000-0000-0000-0000-000000000004",
    "dhionara": "00000000-0000-0000-0000-000000000001",
    "dhiani": "00000000-0000-0000-0000-000000000002",
    "bruna": "00000000-0000-0000-0000-000000000005",
    "luciane": "00000000-0000-0000-0000-000000000003",
    "michele": "00000000-0000-0000-0000-000000000006",
    "patricia": "00000000-0000-0000-0000-000000000007",
    "juliana": "10000000-0000-0000-0000-000000000901",
    "nadiha": "10000000-0000-0000-0000-000000000902"
};

async function run() {
    console.log("🚀 Starting faithfulness-first import...");
    
    // Load durations
    const svcDurations = new Map();
    if (fs.existsSync(servicesPath)) {
        const sContent = fs.readFileSync(servicesPath, 'utf-8');
        sContent.split('\n').slice(1).forEach(l => {
            const c = l.split(',');
            if (c.length > 2) svcDurations.set(c[1].toLowerCase().trim(), parseInt(c[2]));
        });
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const totalLines = lines.length - 1;
    
    let processed = 0;
    let created = 0;
    let skipped = 0;

    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i], ';');
        if (cols.length < 8) continue;

        const dataStr = cols[0];
        const clientName = cols[1];
        const phone = cols[2];
        const service = cols[4];
        const notes = cols[5];
        const proName = cols[6].toLowerCase().trim();
        const status = (cols[7] || "agendado").toLowerCase().trim();

        const proId = proMap[proName] || "00000000-0000-0000-0000-000000000000";
        const parts = dataStr.split(' ');
        if (parts.length < 2) continue;
        const [dt, tm] = parts;
        const [d, m, y] = dt.split('/');
        const isoDate = `${y}-${m}-${d}`;
        const startTime = tm + ":00";
        
        let duration = svcDurations.get(service.toLowerCase().trim()) || 30;
        const [h, min] = tm.split(':').map(Number);
        const totalMin = h * 60 + min + duration;
        const endTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}:00`;

        // Check if exists
        const { data: existing } = await supabase
            .from('appointments')
            .select('id')
            .eq('date', isoDate)
            .eq('start_time', startTime)
            .eq('professional_id', proId)
            .ilike('client_name', clientName)
            .limit(1);

        if (existing && existing.length > 0) {
            skipped++;
        } else {
            const { data: newApt, error: aptError } = await supabase
                .from('appointments')
                .insert({
                    client_name: clientName,
                    client_phone: phone,
                    professional_id: proId,
                    date: isoDate,
                    start_time: startTime,
                    end_time: endTime,
                    status: status === "atendido" ? "atendido" : (status === "faltou" ? "falta" : status),
                    notes: notes,
                    executed_by: cols[9] || null
                })
                .select()
                .single();

            if (newApt) {
                await supabase.from('appointment_services').insert({
                    appointment_id: newApt.id,
                    service_name: service,
                    duration_minutes: duration
                });
                created++;
            }
        }

        processed++;
        if (processed % 100 === 0) {
            console.log(`Progress: ${processed}/${totalLines} (${created} created, ${skipped} skipped)`);
        }
    }

    console.log(`\n✅ Done! Total processed: ${processed}. Created: ${created}. Skipped: ${skipped}.`);
}

run().catch(console.error);
