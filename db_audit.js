import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yrdwpcjkrdbjgleeoltc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHdwY2prcmRiamdsZWVvbHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTMyODMsImV4cCI6MjA4NzQyOTI4M30.SWI_T6QaDf8WxQBBlFlkEQcCdurl6KJp0L2CT0kTYAE";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runAudit() {
  console.log("--- DATABASE INTEGRITY AUDIT ---");

  // 1. Professionals
  console.log("\n[Professionals]");
  const { data: pros, error: errPros } = await supabase.from('professionals').select('*');
  if (errPros) console.error("Error fetching professionals:", errPros);
  else {
    const nullNames = pros.filter(p => !p.name);
    if (nullNames.length) console.log(`- FOUND ${nullNames.length} professionals with null/empty names.`);
    
    const nullIds = pros.filter(p => !p.id);
    if (nullIds.length) console.log(`- FOUND ${nullIds.length} professionals with null IDs (critical).`);

    const inactive = pros.filter(p => !p.is_active);
    console.log(`- Total professionals in DB: ${pros.length} (${inactive.length} inactive)`);
    
    if (pros.length > 0) {
        console.log("- Professionals Sample (IDs):", pros.slice(0, 3).map(p => p.id).join(", "));
    }
  }

  // 2. Appointments with orphaned refs
  console.log("\n[Appointments]");
  const { data: appts, error: errAppts } = await supabase.from('appointments').select('id, client_id, professional_id, status, client_name');
  if (errAppts) console.error("Error fetching appointments:", errAppts);
  else {
    const orphanedClients = appts.filter(a => !a.client_id && a.client_name);
    if (orphanedClients.length) console.log(`- FOUND ${orphanedClients.length} appointments with client_name but NO client_id.`);
    
    const missingClientRef = appts.filter(a => !a.client_id && !a.client_name);
    if (missingClientRef.length) console.log(`- FOUND ${missingClientRef.length} appointments with NO client reference at all.`);

    const proIds = new Set(pros.map(p => p.id));
    const badProRefs = appts.filter(a => !proIds.has(a.professional_id));
    if (badProRefs.length) console.log(`- FOUND ${badProRefs.length} appointments referencing non-existent professional IDs.`);
    
    const invalidStatus = appts.filter(a => !['agendado', 'confirmado', 'atendido', 'cancelado', 'falta', 'espera'].includes(a.status));
    if (invalidStatus.length) console.log(`- FOUND ${invalidStatus.length} appointments with invalid status values.`);
    
    if (!orphanedClients.length && !missingClientRef.length && !badProRefs.length && !invalidStatus.length) console.log("- Overall checks: OK");
  }

  // 3. Patient Records
  console.log("\n[Patient Records]");
  const { data: records, error: errRecords } = await supabase.from('patient_records').select('id, client_id, content, record_type');
  if (errRecords) console.error("Error fetching patient records:", errRecords);
  else {
    const nullContent = records.filter(r => !r.content);
    if (nullContent.length) console.log(`- FOUND ${nullContent.length} records with NULL content.`);
    
    const invalidJson = records.filter(r => {
        if (!r.content) return false;
        try {
            if (typeof r.content === 'string') JSON.parse(r.content);
            return false;
        } catch { return true; }
    });
    if (invalidJson.length) console.log(`- FOUND ${invalidJson.length} records with INVALID JSON strings.`);
    else console.log("- Content check: OK");
  }

  // 4. Clients
  console.log("\n[Clients]");
  const { data: clients, error: errClients } = await supabase.from('clients').select('id, full_name, phone, cpf, birth_date');
  if (errClients) console.error("Error fetching clients:", errClients);
  else {
    const missingName = clients.filter(c => !c.full_name);
    if (missingName.length) console.log(`- FOUND ${missingName.length} clients with NO name.`);
    
    const phones = clients.map(c => c.phone).filter(Boolean);
    const dupPhones = phones.filter((p, i) => phones.indexOf(p) !== i);
    if (dupPhones.length) console.log(`- FOUND ${new Set(dupPhones).size} duplicate phone numbers used across clients.`);

    const inactive = pros.filter(p => !p.is_active);
    console.log(`- Total professionals in DB: ${pros.length} (${inactive.length} inactive)`);
  }

  // 4. Clients
  console.log("\n[Clients]");
  const { data: clientsList, error: errClientsList, count: totalClientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
  if (errClientsList) console.error("Error fetching clients:", errClientsList);
  else {
    console.log(`- Total clients in DB (exact count): ${totalClientsCount}`);
  }

  // 5. Specific Service Cleanup Check
  console.log("\n[Service Cleanup Check]");
  const badServiceId = 'e2c80295-0033-4c71-ad11-60ba502c99d2';
  const { count: refCount, error: errRef } = await supabase.from('appointment_services').select('*', { count: 'exact', head: true }).eq('service_id', badServiceId);
  if (errRef) console.error("Error checking service references:", errRef);
  else {
    console.log(`- Service ID ${badServiceId} is referenced by ${refCount} appointment services.`);
  }

  // 6. Professional Inconsistencies
  console.log("\n[Professional Inconsistencies]");
  const { data: pros2, error: errPros2 } = await supabase.from('professionals').select('*').in('name', ['Marcia', 'Rafaela']);
  if (errPros2) console.error("Error fetching professionals:", errPros2);
  else {
    pros2.forEach(p => {
        console.log(`- Pro: ${p.name}, ID: ${p.id}, Role: ${p.role_description || 'NULL'}`);
    });
  }

  // 7. Category as Service Check
  console.log("\n[Category as Service Check]");
  const { data: catAppts, error: errCatAppts } = await supabase.from('appointment_services').select('service_name, appointment_id').ilike('service_name', 'Injetáveis');
  if (errCatAppts) console.error("Error fetching category-like services:", errCatAppts);
  else {
    console.log(`- Found ${catAppts.length} entries where 'Injetáveis' is used as a service name.`);
  }

runAudit();
