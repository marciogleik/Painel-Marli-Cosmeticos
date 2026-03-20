const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Levenshtein distance for fuzzy matching
function levenshtein(a, b) {
  const tmp = [];
  for (let i = 0; i <= a.length; i++) tmp[i] = [i];
  for (let j = 0; j <= b.length; j++) tmp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
}

async function runProCheck() {
  console.log('--- Analisando Profissionais do CSV vs Banco ---');
  
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
      env[key] = value;
    }
  });

  const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_ROLE_KEY);

  // 2. Fetch DB Pros
  const { data: dbPros } = await supabase.from('professionals').select('name');
  const dbNames = dbPros.map(p => p.name);

  // 3. Count CSV Pros
  const csvContent = fs.readFileSync(path.join(__dirname, 'agendamentosMarli2026.csv'), 'utf8');
  const csvLines = csvContent.split('\n');
  const proCounts = {};
  
  csvLines.slice(1).forEach(line => {
    const cols = line.split(';');
    if (cols.length < 8) return;
    const name = cols[6].trim();
    if (!name) return;
    proCounts[name] = (proCounts[name] || 0) + 1;
  });

  // 4. Find closest for each missing
  const results = [];
  const dbNamesLower = dbNames.map(n => n.toLowerCase());

  Object.entries(proCounts).forEach(([csvName, count]) => {
    const csvLower = csvName.toLowerCase();
    
    // Check if exact or substring match exists
    const exactIdx = dbNamesLower.indexOf(csvLower);
    const subMatch = dbNames.find(dbN => dbN.toLowerCase().includes(csvLower) || csvLower.includes(dbN.toLowerCase().split(' ')[0]));
    
    if (exactIdx === -1 && !subMatch) {
      // Find closest using Levenshtein
      let bestMatch = null;
      let minDistance = Infinity;
      
      dbNames.forEach(dbN => {
        const dist = levenshtein(csvLower, dbN.toLowerCase());
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = dbN;
        }
      });

      results.push({
        csvName,
        closestDbMatch: bestMatch,
        distance: minDistance,
        count
      });
    }
  });

  // Sort by count DESC
  results.sort((a, b) => b.count - a.count);

  console.log('\n| Profissional no CSV | Sugestão no Banco | Registros |');
  console.log('|---------------------|-------------------|-----------|');
  results.forEach(r => {
    console.log(`| ${r.csvName.padEnd(19)} | ${r.closestDbMatch.padEnd(17)} | ${r.count.toString().padEnd(9)} |`);
  });
}

runProCheck();
