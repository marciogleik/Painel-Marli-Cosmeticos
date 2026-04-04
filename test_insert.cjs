const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const envContent = fs.readFileSync('.env', 'utf-8');
const key = envContent.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY=')).split('=')[1];
const supabase = createClient('https://yrdwpcjkrdbjgleeoltc.supabase.co', key);

async function run() {
  console.log("Testing insert...");
  // Simulate the server insert
  const insertData = {
    role: 'profissional',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_by: '00000000-0000-0000-0000-000000000000', // Mock UUID, might fail if foreign key requires real user
    professional_id: '00000000-0000-0000-0000-000000000005'
  };
  
  // We don't have a gestor ID inside this context easily unless we query one
  const { data: users } = await supabase.from('user_roles').select('user_id').eq('role', 'gestor').limit(1);
  if(users && users[0]) {
      insertData.created_by = users[0].user_id;
  }
  
  const { data, error } = await supabase
      .from("invitations")
      .insert(insertData)
      .select("token")
      .single();
      
  console.log("Insert result:", data, "Error:", error);
}
run();
