const fs = require('fs');

async function check() {
  const envContent = fs.readFileSync('.env', 'utf-8');
  const URL = envContent.split('\n').find(l => l.startsWith('VITE_SUPABASE_URL=')).split('=')[1];
  
  // To bypass auth we could use the service role, but bypasses the 'gestor' check. 
  // Let's do it with an invalid token to see if it even reaches the function.
  
  const response = await fetch(`${URL}/functions/v1/generate-invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer foo'
    },
    body: JSON.stringify({ role: 'profissional', professional_id: '00000000-0000-0000-0000-000000000005' })
  });
  
  console.log("Status:", response.status);
  console.log("Body:", await response.text());
}
check();
