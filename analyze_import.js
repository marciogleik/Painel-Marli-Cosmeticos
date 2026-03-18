import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Read .env manually
const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1');
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyze() {
    console.log("Fetching existing data from Supabase...");
    
    // Fetch all clients - using pagination since there might be many
    let allClients = [];
    let from = 0;
    while (true) {
        const { data, error } = await supabase.from('clients').select('full_name, phone').range(from, from + 999);
        if (error) { console.error("Error fetching clients:", error); break; }
        if (!data || data.length === 0) break;
        allClients = allClients.concat(data);
        from += 1000;
    }
    console.log(`Found ${allClients.length} clients in DB.`);

    // Fetch all appointments
    let allAppointments = [];
    from = 0;
    while (true) {
        const { data, error } = await supabase.from('appointments').select('date, start_time, professional_id, client_name').range(from, from + 999);
        if (error) { console.error("Error fetching appointments:", error); break; }
        if (!data || data.length === 0) break;
        allAppointments = allAppointments.concat(data);
        from += 1000;
    }
    console.log(`Found ${allAppointments.length} appointments in DB.`);

    const { data: professionals } = await supabase.from('professionals').select('id, name');
    const { data: services } = await supabase.from('services').select('id, name');

    const clientMap = new Map();
    allClients.forEach(c => {
        const name = (c.full_name || "").toLowerCase().trim();
        const phone = (c.phone || "").replace(/\D/g, '');
        const key = `${name}_${phone}`;
        clientMap.set(key, true);
    });

    const aptMap = new Map();
    allAppointments.forEach(a => {
        // start_time in DB is "HH:mm:ss", CSV is "HH:mm"
        const time = a.start_time ? a.start_time.slice(0, 5) : "";
        const key = `${a.date}_${time}_${a.professional_id}`;
        aptMap.set(key, true);
    });

    const proMap = new Map();
    professionals.forEach(p => proMap.set(p.name.toLowerCase().trim(), p.id));

    console.log("Reading CSV file...");
    const csvPath = 'AGENDAMENTOS-Tabela 1.csv';
    if (!fs.existsSync(csvPath)) {
        console.error("CSV file not found:", csvPath);
        return;
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');
    
    let totalProcessed = 0;
    let missingClients = new Map();
    let missingAptsCount = 0;
    let existingAptsCount = 0;
    let proNotFound = new Set();

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV splitting for ; delimiter
        // Note: some fields might have ; in them if quoted, but our CSV seems simple
        const cols = line.split(';');
        const dataStr = cols[0]; // "19/12/2026 09:30"
        const clientName = cols[1];
        const phone = cols[2];
        const professionalName = cols[6];

        if (!dataStr || !clientName) continue;
        totalProcessed++;

        const dtParts = dataStr.split(' ');
        if (dtParts.length < 2) continue;
        const [datePart, timePart] = dtParts;
        const [d, m, y] = datePart.split('/');
        const isoDate = `${y}-${m}-${d}`;
        const time = timePart.slice(0, 5);

        // Check client
        const cleanName = clientName.toLowerCase().trim();
        const cleanPhone = (phone || "").replace(/\D/g, '');
        const clientKey = `${cleanName}_${cleanPhone}`;
        
        if (!clientMap.has(clientKey)) {
            missingClients.set(clientKey, { name: clientName, phone: phone });
        }

        // Check appointment
        const proNameLower = (professionalName || "").toLowerCase().trim();
        const proId = proMap.get(proNameLower);
        
        if (!proId) {
            proNotFound.add(professionalName);
        }

        // For uniqueness, if proId is not found, we use the original name as fallback
        const aptKey = `${isoDate}_${time}_${proId || professionalName}`;
        
        if (!aptMap.has(aptKey)) {
            missingAptsCount++;
        } else {
            existingAptsCount++;
        }

        if (totalProcessed % 5000 === 0) {
            console.log(`Processed ${totalProcessed} lines...`);
        }
    }

    console.log("\n--- ANALYSIS RESULTS ---");
    console.log(`Total items in CSV: ${totalProcessed}`);
    console.log(`Clients from CSV not found in DB: ${missingClients.size}`);
    console.log(`Appointments from CSV already in DB: ${existingAptsCount}`);
    console.log(`Appointments from CSV MISSING in DB: ${missingAptsCount}`);
    
    if (proNotFound.size > 0) {
        console.log("Professionals in CSV not found in DB IDs map:", Array.from(proNotFound));
    }
    
    // Write missing clients to a temporary file for the user to see if needed
    const missingClientsList = Array.from(missingClients.values());
    fs.writeFileSync('/tmp/missing_clients.json', JSON.stringify(missingClientsList, null, 2));
    console.log("List of missing clients saved to /tmp/missing_clients.json");
}

analyze().catch(err => console.error(err));
