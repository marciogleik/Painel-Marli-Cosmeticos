const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function runAudit() {
  console.log('--- Invocando Auditoria V3 (DATA + TELEFONE) ---');
  
  // 1. Load .env manually
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  const env = {};
  envLines.forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[key] = value;
    }
  });

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Fetch all appointments from DB (paginated)
  console.log('Buscando agendamentos do Supabase...');
  let dbAppointments = [];
  let from = 0;
  let to = 999;
  let done = false;

  while (!done) {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, client_id, date, client_phone, client_name, status')
      .range(from, to);
    
    if (error) {
      console.error('Erro ao buscar agendamentos:', error.message);
      return;
    }
    
    dbAppointments = dbAppointments.concat(data);
    if (data.length < 1000) done = true;
    from += 1000;
    to += 1000;
  }
  console.log(`Total no Banco: ${dbAppointments.length}`);

  // Fetch all clients from DB (paginated)
  console.log('Buscando clientes do Supabase...');
  let dbClients = [];
  from = 0;
  to = 999;
  done = false;

  while (!done) {
    const { data, error } = await supabase
      .from('clients')
      .select('id, full_name, phone')
      .range(from, to);
    
    if (error) {
      console.error('Erro ao buscar clientes:', error.message);
      return;
    }
    
    dbClients = dbClients.concat(data);
    if (data.length < 1000) done = true;
    from += 1000;
    to += 1000;
  }
  console.log(`Total Clientes no Banco: ${dbClients.length}`);

  // Normalize phone helper
  const normalizePhone = (phone) => {
    if (!phone) return '';
    return phone.toString().replace(/\D/g, '');
  };

  // Map DB Appointments for lookup
  const dbMap = new Map();
  console.log('Exemplos de chaves no Banco:');
  dbAppointments.slice(0, 5).forEach((app, i) => {
    const normPhone = normalizePhone(app.client_phone);
    const key = `${app.date}_${normPhone}`;
    console.log(`  DB Key ${i}: [${key}] (Original: Date=${app.date}, Phone=${app.client_phone})`);
    if (!dbMap.has(key)) dbMap.set(key, []);
    dbMap.get(key).push(app);
  });
  dbAppointments.slice(5).forEach(app => {
    const key = `${app.date}_${normalizePhone(app.client_phone)}`;
    if (!dbMap.has(key)) dbMap.set(key, []);
    dbMap.get(key).push(app);
  });

  // Map DB Clients by Phone and Name for analysis
  const clientPhoneMap = new Map();
  const clientNameMap = new Map();
  dbClients.forEach(c => {
    const normalized = normalizePhone(c.phone);
    if (normalized) clientPhoneMap.set(normalized, c);
    clientNameMap.set(c.full_name.trim().toLowerCase(), c);
  });

  // 3. Read CSV
  console.log('Lendo arquivo CSV: agendamentosMarli2026.csv ...');
  const csvContent = fs.readFileSync(path.join(__dirname, 'agendamentosMarli2026.csv'), 'utf8');
  const csvLines = csvContent.split('\n');
  const headers = csvLines[0].split(';');
  
  // Data;Cliente;Telefone;Email;Serviço;Observação;Profissional;Status;Data Ação;Executado por
  const csvRows = csvLines.slice(1).filter(line => line.trim() !== '');
  
  let totalCsv = csvRows.length;
  let matched = 0;
  let missing = [];
  
  console.log('Exemplos de chaves no CSV:');
  csvRows.forEach((line, idx) => {
    const cols = line.split(';');
    if (cols.length < 8) return;
    
    // Format date from DD/MM/YYYY HH:MM to YYYY-MM-DD
    const datePartOnly = cols[0].split(' ')[0];
    const dateParts = datePartOnly.split('/');
    if (dateParts.length !== 3) return;
    const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    
    const clientName = cols[1].trim();
    const phone = cols[2].trim();
    const normalizedPhone = normalizePhone(phone);
    
    const key = `${isoDate}_${normalizedPhone}`;
    
    if (idx < 5) {
       console.log(`  CSV Key ${idx}: [${key}] (Original: Date=${cols[0]}, Phone=${phone})`);
    }

    if (dbMap.has(key)) {
      matched++;
    } else {
      missing.push({
        idx: idx + 2,
        date: isoDate,
        clientName,
        phone: normalizedPhone,
        status: cols[7].trim(),
        service: cols[4].trim(),
        professional: cols[6].trim()
      });
    }
  });

  // 4. Analyze Missing
  let missingWithExistingClient = 0;
  let missingCompletelyNew = 0;
  
  missing.forEach(m => {
    const existingByPhone = m.phone ? clientPhoneMap.get(m.phone) : null;
    const existingByName = clientNameMap.get(m.clientName.toLowerCase());
    
    if (existingByPhone || existingByName) {
      missingWithExistingClient++;
    } else {
      missingCompletelyNew++;
    }
  });

  // 5. Results
  console.log('\n--- RELATÓRIO DE AUDITORIA V3 ---');
  console.log(`Total de registros no CSV:         ${totalCsv}`);
  console.log(`Total encontrados no Supabase:     ${matched}`);
  console.log(`Total NÃO encontrados (faltando):  ${missing.length}`);
  console.log('---------------------------------');
  console.log(`Desses faltando:`);
  console.log(`- Clientes cujo nome/fone já existe: ${missingWithExistingClient}`);
  console.log(`- Clientes COMPLETAMENTE novos:      ${missingCompletelyNew}`);
  console.log('---------------------------------');

  // Save detailed missing report for the batch insert phase
  const report = {
    totalCsv,
    matched,
    missingCount: missing.length,
    missingWithExistingClient,
    missingCompletelyNew,
    missingDetails: missing.slice(0, 100) // First 100 for confirmation display if needed
  };
  fs.writeFileSync(path.join(__dirname, 'audit_report_v3.json'), JSON.stringify(report, null, 2));
  console.log('Relatório detalhado salvo em: audit_report_v3.json');
}

runAudit();
