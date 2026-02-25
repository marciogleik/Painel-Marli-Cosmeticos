import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROF_MAP: Record<string, string> = {
  "dhionara": "00000000-0000-0000-0000-000000000001",
  "dhiani": "00000000-0000-0000-0000-000000000002",
  "luciane": "00000000-0000-0000-0000-000000000003",
  "tais": "00000000-0000-0000-0000-000000000004",
  "bruna": "00000000-0000-0000-0000-000000000005",
  "michele": "00000000-0000-0000-0000-000000000006",
  "patricia": "00000000-0000-0000-0000-000000000007",
  "jenifer": "00000000-0000-0000-0000-000000000008",
  "cris": "00000000-0000-0000-0000-000000000009",
};

function matchProfessional(name: string): string | null {
  if (!name) return null;
  const lower = String(name).toLowerCase().trim();
  for (const [key, id] of Object.entries(PROF_MAP)) {
    if (lower.startsWith(key) || lower.includes(key)) return id;
  }
  return null;
}

function parseDateStr(dateVal: any): string | null {
  if (!dateVal && dateVal !== 0) return null;
  if (typeof dateVal === "number") {
    const utcDays = Math.floor(dateVal) - 25569;
    const utcMs = utcDays * 86400 * 1000;
    return new Date(utcMs).toISOString();
  }
  const str = String(dateVal).trim();
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`;
}

function parseDescription(desc: string): Record<string, string>[] {
  if (!desc) return [];
  // Split by <br/> and parse Q&A pairs
  const parts = desc.split(/<br\s*\/?>/i).map(s => s.trim()).filter(Boolean);
  const fields: Record<string, string>[] = [];
  
  for (const part of parts) {
    // Match "Question?: Answer" or "Question: Answer"
    const match = part.match(/^(.+?)\??\s*:\s*(.+)$/);
    if (match) {
      fields.push({ label: match[1].trim(), value: match[2].trim() });
    } else if (part.length > 0) {
      fields.push({ label: "Observação", value: part });
    }
  }
  return fields;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { records, dryRun } = await req.json();

    if (!records || !Array.isArray(records)) {
      return new Response(JSON.stringify({ error: "Missing records array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load clients for lookup
    const allClients: any[] = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabaseAdmin
        .from("clients")
        .select("id, full_name")
        .order("full_name")
        .range(from, from + pageSize - 1);
      if (error) break;
      if (!data || data.length === 0) break;
      allClients.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }
    
    const clientMap = new Map<string, string>();
    allClients.forEach((c: any) => {
      clientMap.set(c.full_name.toLowerCase().trim(), c.id);
    });

    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    const batch: any[] = [];
    const skippedClients = new Set<string>();
    const skippedProfs = new Set<string>();

    for (const row of records) {
      const clientName = String(row.cliente || "").trim();
      const profName = String(row.profissional || "").trim();
      const fichaType = String(row.ficha || "").trim();
      const descricao = String(row.descricao || "").trim();
      const dataStr = row.data;

      const profId = matchProfessional(profName);
      if (!profId) { skipped++; skippedProfs.add(profName); continue; }

      const clientId = clientName ? (clientMap.get(clientName.toLowerCase().trim()) || null) : null;
      if (!clientId) { skipped++; skippedClients.add(clientName); continue; }

      const createdAt = parseDateStr(dataStr) || new Date().toISOString();
      const content = parseDescription(descricao);

      batch.push({
        client_id: clientId,
        professional_id: profId,
        record_type: "anamnese",
        title: fichaType || "Anamnese",
        content: JSON.stringify(content),
        created_at: createdAt,
        updated_at: createdAt,
      });

      if (!dryRun && batch.length >= 500) {
        const chunk = batch.splice(0, 500);
        const { error } = await supabaseAdmin.from("patient_records").insert(chunk);
        if (error) {
          console.error("Batch error:", error.message);
          errors += chunk.length;
        } else {
          inserted += chunk.length;
        }
      }
    }

    if (dryRun) {
      inserted = batch.length;
    } else if (batch.length > 0) {
      const { error } = await supabaseAdmin.from("patient_records").insert(batch);
      if (error) {
        console.error("Final batch error:", error.message);
        errors += batch.length;
      } else {
        inserted += batch.length;
      }
    }

    console.log(`Fichas import: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);

    return new Response(
      JSON.stringify({ 
        inserted, skipped, errors, total: records.length,
        skippedClients: Array.from(skippedClients),
        skippedProfs: Array.from(skippedProfs),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Import error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
