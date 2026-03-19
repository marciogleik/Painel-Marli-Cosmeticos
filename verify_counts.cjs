const { createClient } = require('@supabase/supabase-js');

const url = 'https://yrdwpcjkrdbjgleeoltc.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHdwY2prcmRiamdsZWVvbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg1MzI4MywiZXhwIjoyMDg3NDI5MjgzfQ.ZhmnKKPvoao2ih8-B1fsViqfTt0MUoFVOxqFD2VjfkA';
const supabase = createClient(url, key);

async function check() {
  let from = 0;
  let to = 999;
  let hasMore = true;
  const stats = {};
  let total = 0;

  while (hasMore) {
    const { data: records, error } = await supabase.from('patient_records').select('title').range(from, to).order('created_at', { ascending: false });
    if (error || !records || records.length === 0) {
      hasMore = false;
    } else {
      records.forEach(r => {
        total++;
        stats[r.title] = (stats[r.title] || 0) + 1;
      });
      from += 1000;
      to += 1000;
      if (records.length < 1000) hasMore = false;
    }
  }
  console.log('Total Processed:', total);
  console.log('Record Types:', JSON.stringify(stats, null, 2));
}
check();
