const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const key = envContent.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1];
const supabase = createClient('https://yrdwpcjkrdbjgleeoltc.supabase.co', key);

async function run() {
  console.log("Checking invitations...");
  const { data, error } = await supabase.from('invitations').select('id, expires_at').eq('professional_id', '00000000-0000-0000-0000-000000000005');
  console.log("Invitations for Bruna:", data, "Error:", error);
}
run().then(() => console.log("Done."));
