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

const csvPath = 'professionals_2026-03-02.csv';

function parseCSVLine(line, delimiter = ',') {
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

async function run() {
    console.log("🚀 Importing Professionals...");
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    
    const pros = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        if (cols.length < 2) continue;
        pros.push({
            id: cols[0],
            name: cols[1],
            is_active: cols[2] === 'true'
        });
    }

    const { error } = await supabase.from('professionals').upsert(pros);
    if (error) {
        console.error("Error importing professionals:", error.message);
    } else {
        console.log(`✅ Successfully imported ${pros.length} professionals.`);
    }
}

run();
