const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const key = envContent.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1];
const supabase = createClient('https://yrdwpcjkrdbjgleeoltc.supabase.co', key);

async function run() {
  console.log("Checking schema collisions...");
  const { error: err1 } = await supabase.from('invitations').insert({
    role: 'profissional',
    expires_at: new Date().toISOString(),
    created_by: '00000000-0000-0000-0000-000000000000',
    professional_id: '00000000-0000-0000-0000-000000000005'
  });
  console.log("Insert 1 error:", err1?.message || "No error");
  
  const { error: err2 } = await supabase.from('invitations').insert({
    role: 'profissional',
    expires_at: new Date().toISOString(),
    created_by: '00000000-0000-0000-0000-000000000000',
    professional_id: '00000000-0000-0000-0000-000000000005'
  });
  console.log("Insert 2 error:", err2?.message || "No error");
}
run();
