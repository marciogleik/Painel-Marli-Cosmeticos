const { createClient } = require('@supabase/supabase-js');

const url = 'https://yrdwpcjkrdbjgleeoltc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHdwY2prcmRiamdsZWVvbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg1MzI4MywiZXhwIjoyMDg3NDI5MjgzfQ.ZhmnKKPvoao2ih8-B1fsViqfTt0MUoFVOxqFD2VjfkA';
const supabase = createClient(url, key);

async function migrate() {
  console.log('Starting global migration...');

  // 1. Fetch templates
  const { data: templates } = await supabase.from('anamnesis_templates').select('id, name, fields');
  const templateMap = {};
  const templateByName = {};
  templates.forEach(t => {
    templateMap[t.id] = t;
    templateByName[t.name.toLowerCase().trim()] = t;
  });

  // 2. Fetch records in batches
  let from = 0;
  let to = 999;
  let hasMore = true;
  let totalProcessed = 0;
  let updatedCount = 0;

  while (hasMore) {
    console.log(`Processing batch ${from} to ${to}...`);
    const { data: records, error } = await supabase.from('patient_records').select('*').range(from, to).order('created_at', { ascending: false });
    
    if (error) {
      console.error('Batch error:', error.message);
      hasMore = false;
      break;
    }

    if (!records || records.length === 0) {
      hasMore = false;
      break;
    }

    for (const record of records) {
      totalProcessed++;
      let content = record.content;
      if (!content) continue;

      const strContent = JSON.stringify(content).toLowerCase();
      // Skip if already has markdown table (simple heuristic)
      if (strContent.includes('| --- | ---')) continue;

      let changed = false;
      let answers = {};
      let templateId = (content && content.templateId);
      let template = templateMap[templateId] || templateByName[(record.title || "").toLowerCase().trim()];

      if (!template && record.title) {
        template = templateByName[record.title.toLowerCase().trim()];
      }

      if (!template) continue;

      // Logic to extract answers from various formats
      if (content.answers) {
        answers = { ...content.answers };
      } else if (Array.isArray(content)) {
        // Find clinical fields in array
        const obsField = content.find(item => 
          item.label === "Observação" || 
          item.label === "Descrição" || 
          item.label.includes("Acompanhamento") ||
          item.label.includes("Técnicas")
        );
        if (obsField && typeof obsField.value === 'string') {
          const lines = obsField.value.split("\n");
          template.fields.forEach(f => {
            const target = f.label.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
            const line = lines.find(l => {
              const lp = l.split(":");
              return lp.length >= 2 && lp[0].toLowerCase().replace(/[^a-z0-9]/g, "").trim().includes(target);
            });
            if (line) {
              answers[f.id] = line.split(":").slice(1).join(":").trim();
            }
          });
        }
      }

      // Check all fields in answers for clinical data patterns
      const tableField = template.fields.find(f => {
         const lbl = f.label.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
         return f.type === 'modelo_padrao' && (lbl.includes('procedimento') || lbl.includes('evolucao') || lbl.includes('tecnica') || lbl.includes('acompanhamento'));
      });

      if (!tableField) continue;
      const tableFieldId = tableField.id;

      for (const [fid, val] of Object.entries(answers)) {
        if (typeof val !== 'string') continue;

        if (val.toLowerCase().includes('data') && (val.toLowerCase().includes('procedimento') || val.toLowerCase().includes('realizado') || val.toLowerCase().includes('obs'))) {
          // Parsing logic
          const legacyHeaders = ["Data", "Procedimento Realizado", "Observação", "Procedimento", "Realizado"];
          let cleanValue = val;
          legacyHeaders.forEach(h => {
            const regex = new RegExp(h, "gi");
            cleanValue = cleanValue.replace(regex, "");
          });
          
          const trimmed = cleanValue.trim();
          const dateRegex = /(\d{2}\/\d{2}(\/\d{2,4})?)/g;
          const matches = [...trimmed.matchAll(dateRegex)];
          
          let markdownTable = "";
          if (matches.length > 0) {
            markdownTable = "Data | Procedimento Realizado | Observação\n--- | --- | ---\n";
            for (let i = 0; i < matches.length; i++) {
              const match = matches[i];
              const dateStr = match[1];
              const start = match.index + dateStr.length;
              const end = i + 1 < matches.length ? matches[i + 1].index : trimmed.length;
              const procStr = trimmed.substring(start, end).trim();
              markdownTable += `${dateStr} | ${procStr} | \n`;
            }
          } else {
            // Check if it's just a clinical dump without dates
             markdownTable = "Data | Procedimento Realizado | Observação\n--- | --- | ---\n | " + trimmed + " | ";
          }

          answers[tableFieldId] = markdownTable;
          if (fid !== tableFieldId) answers[fid] = "";
          changed = true;
        }
      }

      if (changed) {
        const updatedContent = { answers, templateId: template.id, templateFields: template.fields };
        const { error: updateErr } = await supabase.from('patient_records').update({ 
          content: updatedContent, 
          title: record.title || template.name 
        }).eq('id', record.id);
        
        if (updateErr) console.error(`  Error updating record ${record.id}:`, updateErr.message);
        else updatedCount++;
      }
    }

    if (records.length < 1000) {
      hasMore = false;
    } else {
      from += 1000;
      to += 1000;
    }
  }

  console.log(`Global migration finished. Total analyzed: ${totalProcessed}, Updated: ${updatedCount}`);
}

migrate();
if (!String.prototype.matchAll) {
  String.prototype.matchAll = function(regex) {
    const matches = [];
    let match;
    while ((match = regex.exec(this)) !== null) {
      matches.push(match);
    }
    return matches;
  };
}
