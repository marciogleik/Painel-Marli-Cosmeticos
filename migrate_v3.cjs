const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const STATUS_MAP = {
  'Atendido': 'atendido',
  'Agendado': 'agendado',
  'Cancelado': 'cancelado',
  'Faltou': 'falta',
  'Espera': 'espera',
  'Confirmado': 'confirmado',
  'Atendendo': 'atendendo'
};

async function runMigration() {
  const args = process.argv.slice(2);
  const loteIndex = parseInt(args[0]); // 1, 2, 3, 4, 5

  // 1. Load .env
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[key] = value;
    }
  });

  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_ROLE_KEY);

  // 2. Load Lookups
  console.log('Carregando lookups...');
  const { data: pros } = await supabase.from('professionals').select('id, name');
  
  // Load ALL clients (paginated)
  let clients = [];
  let from = 0; let to = 999; let done = false;
  while (!done) {
    const { data, error } = await supabase.from('clients').select('id, full_name, phone').range(from, to);
    if (error) break;
    clients = clients.concat(data);
    if (data.length < 1000) done = true;
    from += 1000; to += 1000;
  }
  
  const normalizePhone = (p) => p ? p.replace(/\D/g, '') : '';
  const clientPhoneMap = new Map();
  const clientNameMap = new Map();
  clients.forEach(c => {
    const norm = normalizePhone(c.phone);
    if (norm) clientPhoneMap.set(norm, c.id);
    clientNameMap.set(c.full_name.trim().toLowerCase(), c.id);
  });

  const proMap = new Map();
  pros.forEach(p => {
    proMap.set(p.name.split(' ')[0].toLowerCase(), p.id);
    proMap.set(p.name.toLowerCase(), p.id);
  });

  // 3. Process CSV for MISSING records
  console.log('Lendo CSV e filtrando faltantes...');
  const csvContent = fs.readFileSync(path.join(__dirname, 'agendamentosMarli2026.csv'), 'utf8');
  const csvLines = csvContent.split('\n');
  const csvRows = csvLines.slice(1).filter(line => line.trim() !== '');

  // We need to know WHICH ones are missing. We can use audit_v3 logic.
  // Or better, read the audit_report_v3.json if it has the CSV original index.
  const auditReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'audit_report_v3.json'), 'utf8'));
  
  // The audit report has matched: 0 previously. OH WAIT, I fixed it but matched was 21k.
  // I'll regenerate the list of missing TO INSERT in this script.
  
  // For safety, let's just re-fetch existing DB appointments to be 100% sure of current state
  console.log('Verificando estado atual do banco...');
  let existingApps = new Set();
  from = 0; to = 999; done = false;
  while (!done) {
    const { data } = await supabase.from('appointments').select('date, client_phone').range(from, to);
    if (!data) break;
    data.forEach(a => existingApps.add(`${a.date}_${normalizePhone(a.client_phone)}`));
    if (data.length < 1000) done = true;
    from += 1000; to += 1000;
  }

  const toInsert = [];
  const missingPros = new Set();
  csvRows.forEach(line => {
    const cols = line.split(';');
    if (cols.length < 8) return;
    const rawDate = cols[0];
    const datePart = rawDate.split(' ')[0];
    const timePart = rawDate.split(' ')[1] || '08:00';
    const dateParts = datePart.split('/');
    const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const normPhone = normalizePhone(cols[2]);
    
    if (!existingApps.has(`${isoDate}_${normPhone}`)) {
      // Map IDs
      const clientId = clientPhoneMap.get(normPhone) || clientNameMap.get(cols[1].trim().toLowerCase());
      const proNameRaw = cols[6].trim();
      const proSearch = proNameRaw.toLowerCase();
      const professionalId = proMap.get(proSearch) || proMap.get(proSearch.split(' ')[0]);
      
      if (!professionalId) {
        missingPros.add(proNameRaw);
      }

      if (clientId && professionalId) {
        // Calculate end_time (start + 30m)
        const [h, m] = timePart.split(':').map(Number);
        let eh = h;
        let em = m + 30;
        if (em >= 60) { eh++; em -= 60; }
        const endTimeStr = `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}:00`;

        toInsert.push({
          client_id: clientId,
          professional_id: professionalId,
          date: isoDate,
          start_time: `${timePart}:00`,
          end_time: endTimeStr,
          status: STATUS_MAP[cols[7].trim()] || 'agendado',
          notes: cols[5].trim(),
          client_name: cols[1].trim(),
          client_phone: cols[2].trim(),
          executed_by: cols[9] ? cols[9].trim() : null
        });
      }
    }
  });

  // Sort chronologically
  toInsert.sort((a, b) => a.date.localeCompare(b.date));

  console.log(`Total para inserir: ${toInsert.length}`);
  if (missingPros.size > 0) {
    console.log(`Profissionais ignorados por falta de cadastro: ${Array.from(missingPros).join(', ')}`);
  }

  // 4. Batch Logic
  const pageSize = 1000;
  const batches = [];
  for (let i = 0; i < toInsert.length; i += pageSize) {
    batches.push(toInsert.slice(i, i + pageSize));
  }

  if (isNaN(loteIndex) || loteIndex < 1 || loteIndex > batches.length) {
    console.log(`\n--- RESUMO DE LOTES DISPONÍVEIS ---`);
    batches.forEach((b, i) => {
      const first = b[0].date;
      const last = b[b.length - 1].date;
      console.log(`Lote ${i+1}: ${b.length} registros | Período: ${first} até ${last}`);
    });
    console.log('\nUse: node migrate_v3.cjs <numero_do_lote> para executar.');
    return;
  }

  const currentBatch = batches[loteIndex - 1];
  console.log(`\nExecutando Lote ${loteIndex} (${currentBatch.length} registros)...`);
  
  const { data, error } = await supabase.from('appointments').insert(currentBatch);
  if (error) {
    console.error('Erro na inserção:', error.message);
  } else {
    console.log(`Sucesso! Lote ${loteIndex} inserido.`);
  }
}

runMigration();
