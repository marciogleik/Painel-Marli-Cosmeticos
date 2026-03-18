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

const FICHA_CSV = 'FichasDosClientes.csv';
const CLIENTS_CSV = 'OsClientesMarli.csv';

function cleanCPF(c) {
    if (!c) return "";
    return c.replace(/\D/g, '').trim();
}

function parseCSV(content, delimiter = ';') {
    const records = [];
    let currentRecord = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === delimiter && !inQuotes) {
            currentRecord.push(currentField.trim());
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
            currentRecord.push(currentField.trim());
            if (currentRecord.length > 1 || currentRecord[0] !== '') {
                records.push(currentRecord);
            }
            currentRecord = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRecord.length > 0) {
        currentRecord.push(currentField.trim());
        records.push(currentRecord);
    }
    return records;
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

async function verify() {
    console.log("📂 Loading clients Map...");
    const clientsCSVContent = fs.readFileSync(CLIENTS_CSV, 'utf-8');
    const clientsRows = parseCSV(clientsCSVContent, ';');
    const legacyClientMap = new Map();
    for (let i = 1; i < clientsRows.length; i++) {
        const row = clientsRows[i];
        if (row.length < 20) continue;
        legacyClientMap.set(row[19], { name: row[0], cpf: cleanCPF(row[1]) });
    }

    console.log("🔍 Fetching DB clients...");
    const { data: dbClients } = await supabase.from('clients').select('id, full_name, cpf');
    const dbClientMap = new Map();
    dbClients.forEach(c => {
        dbClientMap.set(`${c.full_name.toLowerCase().trim()}|${cleanCPF(c.cpf)}`, c.id);
        if (!cleanCPF(c.cpf)) dbClientMap.set(c.full_name.toLowerCase().trim(), c.id);
    });

    console.log("📝 Running TEST import (first 10 records)...");
    const fichasContent = fs.readFileSync(FICHA_CSV, 'utf-8');
    const fichaRows = parseCSV(fichasContent, ';');
    
    const testSize = Math.min(fichaRows.length, 11);
    const results = [];

    for (let i = 1; i < testSize; i++) {
        const row = fichaRows[i];
        const codLegacy = row[0];
        const legacyInfo = legacyClientMap.get(codLegacy);
        
        let clientId = null;
        if (legacyInfo) {
            clientId = dbClientMap.get(`${legacyInfo.name.toLowerCase().trim()}|${legacyInfo.cpf}`) || dbClientMap.get(legacyInfo.name.toLowerCase().trim());
        }
        if (!clientId) clientId = dbClientMap.get(row[1].toLowerCase().trim());

        results.push({
            row: i,
            cod: codLegacy,
            name: row[1],
            found_in_db: !!clientId,
            clientId: clientId,
            record_title: row[5]
        });
    }

    console.table(results);

    const matchCount = results.filter(r => r.found_in_db).length;
    console.log(`\nMatch rate: ${matchCount}/${results.length} (${(matchCount/results.length*100).toFixed(1)}%)`);
    
    if (matchCount > 0) {
        console.log("\n🚀 Verification successful! Matches found. Ready for full import.");
    } else {
        console.log("\n⚠️ No matches found in the first 10 records. Checking why...");
    }
}

verify().catch(console.error);
