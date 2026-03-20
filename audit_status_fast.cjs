const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function auditStatus() {
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      env[key] = value;
    }
  });

  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_ROLE_KEY);
  
  // 1. Total Count in DB
  const { count: totalInDB } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
  
  // 2. Count inserted today (2026-03-20)
  // We use current time which is 11:27, start of day is 00:00
  const startOfDay = '2026-03-20T00:00:00Z';
  const { count: insertedToday } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfDay);

  // 3. Fast peek for examples of missing records
  // We'll fetch a sample of existing to compare
  const { data: dbSample } = await supabase
    .from('appointments')
    .select('date, client_phone, client_name')
    .order('date', { ascending: false })
    .limit(5000);

  const keySet = new Set(dbSample.map(a => `${a.date}_${a.client_phone ? a.client_phone.replace(/\D/g, '') : ''}_${a.client_name.trim().toLowerCase()}`));

  // 4. Read CSV and check samples
  const csvContent = fs.readFileSync(path.join(process.cwd(), 'agendamentosMarli2026.csv'), 'utf8');
  const csvRows = csvContent.split('\n').slice(1).filter(r => r.trim() !== '');
  
  let missingSamples = [];
  for (let i = 0; i < csvRows.length && missingSamples.length < 5; i++) {
    const cols = csvRows[i].split(';');
    if (cols.length < 8) continue;
    
    const rawDatePart = cols[0].split(' ')[0];
    const dParts = rawDatePart.split('/');
    const isoDate = `${dParts[2]}-${dParts[1]}-${dParts[0]}`;
    const normPhone = cols[2].replace(/\D/g, '');
    const clientName = cols[1].trim().toLowerCase();
    
    const key = `${isoDate}_${normPhone}_${clientName}`;
    if (!keySet.has(key)) {
      missingSamples.push({
        cliente: cols[1].trim(),
        data: cols[0],
        telefone: cols[2]
      });
    }
  }

  console.log(JSON.stringify({
    totalInDB,
    insertedToday,
    missingSamples,
    csvTotal: csvRows.length
  }, null, 2));
}

auditStatus();
