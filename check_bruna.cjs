const { createClient } = require('@supabase/supabase-js');
const url = 'https://yrdwpcjkrdbjgleeoltc.supabase.co';
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.log("No key available in env, searching via bash injection...");
  const fs = require('fs');
  const envContent = fs.readFileSync('.env', 'utf-8');
  const keyLine = envContent.split('\n').find(l => l.startsWith('SUPABASE_SERVICE_ROLE_KEY='));
  if (keyLine) {
    global.key = keyLine.split('=')[1];
  }
} else {
  global.key = key;
}

const supabase = createClient(url, global.key);

async function check() {
  const { data, error } = await supabase
    .from('professionals')
    .select('id, name, user_id')
    .ilike('name', '%Bruna Castanheira%');
  
  if (error) console.error(error);
  console.log(data);
}

check();
