const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const url = 'https://yrdwpcjkrdbjgleeoltc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHdwY2prcmRiamdsZWVvbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg1MzI4MywiZXhwIjoyMDg3NDI5MjgzfQ.ZhmnKKPvoao2ih8-B1fsViqfTt0MUoFVOxqFD2VjfkA';
const supabase = createClient(url, key);

async function reconcile() {
  console.log('--- RECONCILIATION REPORT ---');

  // 1. Clients
  try {
    const clientsTxt = fs.readFileSync('OsClientesMarli.csv', 'utf8');
    const clientsLines = clientsTxt.split('\n');
    const csvClientCodes = new Set();
    clientsLines.slice(1).forEach(l => {
      const p = l.split(';');
      if (p.length > 19) {
        const code = p[19].trim();
        if (code && !isNaN(code)) csvClientCodes.add(code);
      }
    });

    let dbClientCodes = new Set();
    let from = 0;
    let to = 999;
    let hasMore = true;

    while (hasMore) {
      const { data: records, error } = await supabase.from('clients').select('external_id').range(from, to);
      if (error || !records || records.length === 0) {
        hasMore = false;
      } else {
        records.forEach(c => {
          if (c.external_id) dbClientCodes.add(c.external_id);
        });
        from += 1000;
        to += 1000;
        if (records.length < 1000) hasMore = false;
      }
    }

    console.log('1. Clients:');
    console.log('   CSV Unique Codes (Backup):', csvClientCodes.size);
    console.log('   DB Unique Codes (System):', dbClientCodes.size);
    
    let missingClients = [];
    csvClientCodes.forEach(code => {
       if (!dbClientCodes.has(code)) missingClients.push(code);
    });
    console.log('   Missing in DB:', missingClients.length);
    if (missingClients.length > 0) {
       console.log('   First 5 missing codes:', missingClients.slice(0, 5));
    }
  } catch (e) {
    console.error('Error in Client Reconciliation:', e.message);
  }

  // 2. Appointments
  try {
    const { count: dbAppts } = await supabase.from('appointments').select('*', { count: 'exact', head: true });
    console.log('\n2. Appointments:');
    console.log('   DB Total Records:', dbAppts);
    // Assuming appointments were imported via SQL chunks and verified previously
  } catch (e) {
    console.error('Error in Appointment Reconciliation:', e.message);
  }

  // 3. Fichas (Patient Records)
  try {
    const fichasTxt = fs.readFileSync('FichasDaMarli.csv', 'utf8');
    const fichasLines = fichasTxt.split('\n');
    const csvFichaCodes = new Set();
    fichasLines.forEach(l => {
      const p = l.split(';');
      if (p.length > 4) {
        const code = p[4].trim();
        if (code && !isNaN(code)) csvFichaCodes.add(code);
      }
    });

    const { count: dbFichas } = await supabase.from('patient_records').select('*', { count: 'exact', head: true });
    console.log('\n3. Patient Records (Fichas):');
    console.log('   CSV Unique Codes:', csvFichaCodes.size);
    console.log('   DB Total Records:', dbFichas);
  } catch (e) {
    console.error('Error in Ficha Reconciliation:', e.message);
  }

  console.log('\n--- END OF REPORT ---');
}

reconcile();
