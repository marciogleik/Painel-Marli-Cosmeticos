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

const csvPath = 'OsClientesMarli.csv';

function cleanPhone(p) {
    if (!p) return "";
    return p.replace(/\D/g, '').trim();
}

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

function validateAndFormatDate(dStr) {
    if (!dStr || !dStr.includes('/')) return null;
    const parts = dStr.split('/');
    if (parts.length !== 3) return null;
    const d = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const y = parseInt(parts[2]);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12 && y >= 1900 && y <= 2100) {
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return null;
}

async function run() {
    console.log("🚀 Starting robust CLIENTS import...");

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const totalLines = lines.length - 1;
    
    let processed = 0;
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    const BATCH_SIZE = 25; // Small batch for reliability

    for (let i = 1; i < lines.length; i += BATCH_SIZE) {
        const batch = lines.slice(i, i + BATCH_SIZE);
        const records = [];

        for (const line of batch) {
            const cols = parseCSVLine(line, ';');
            if (cols.length < 2) continue;

            const name = (cols[0] || "").trim();
            const phone = cleanPhone(cols[20]);
            const cpf = (cols[1] || "").trim();
            const birth = validateAndFormatDate(cols[4]);
            const address = `${cols[6] || ""} ${cols[7] || ""}, ${cols[10] || ""}, ${cols[12] || ""}-${cols[11] || ""}`.trim();
            const notes = (cols[13] || "").trim();
            const city = (cols[12] || "").trim();

            if (!name) continue;

            // Simple check in DB to avoid dupes (Optional but safer)
            // Note: In bulk, we might want to just insert and let RLS/Policies handle it
            // but since we want to be helpful, let's keep records list
            records.push({
                full_name: name,
                phone: phone || null,
                cpf: cpf || null,
                birth_date: birth,
                address: address || null,
                notes: notes || null,
                city: city || null,
                is_active: true
            });
        }

        if (records.length > 0) {
            // We use upsert if we have a unique constraint or just insert
            const { error } = await supabase.from('clients').insert(records);
            
            if (error) {
                if (error.message.includes('RLS')) {
                    console.error("\n❌ Error: Row Level Security block. You need to temporarily disable RLS or use a Service Role Key.");
                    process.exit(1);
                }
                console.error(`Batch ${i} error:`, error.message);
                errors += records.length;
            } else {
                created += records.length;
            }
        }

        processed += batch.length;
        if (processed % 100 < BATCH_SIZE) {
            process.stdout.write(`Progress: ${processed}/${totalLines} (${created} imported)\r`);
        }
    }

    console.log(`\n\n✅ Done! Total processed: ${processed}. Imported: ${created}. Errors: ${errors}.`);
}

run().catch(console.error);
