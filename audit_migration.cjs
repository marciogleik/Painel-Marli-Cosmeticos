const { createClient } = require('@supabase/supabase-js');

const url = 'https://yrdwpcjkrdbjgleeoltc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHdwY2prcmRiamdsZWVvbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg1MzI4MywiZXhwIjoyMDg3NDI5MjgzfQ.ZhmnKKPvoao2ih8-B1fsViqfTt0MUoFVOxqFD2VjfkA';
const supabase = createClient(url, key);

async function check() {
  let from = 0;
  let to = 999;
  let hasMore = true;
  let mangledCount = 0;
  let organizedCount = 0;
  let total = 0;

  while (hasMore) {
    const { data: records, error } = await supabase.from('patient_records').select('id, content').range(from, to);
    if (error || !records || records.length === 0) {
      hasMore = false;
    } else {
      records.forEach(r => {
        total++;
        const str = JSON.stringify(r.content || {}).toLowerCase();
        if (str.includes('procedimento realizado')) {
           if (str.includes('| --- | ---')) {
              organizedCount++;
           } else {
              mangledCount++;
           }
        }
      });
      from += 1000;
      to += 1000;
      if (records.length < 1000) hasMore = false;
    }
  }
  console.log('Results:');
  console.log('Total Records Analyzed:', total);
  console.log('Still Mangled:', mangledCount);
  console.log('Already Organized:', organizedCount);
}
check();
