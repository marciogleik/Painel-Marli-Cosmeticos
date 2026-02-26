import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function parseDateBR(val: any): string | null {
  if (!val && val !== 0) return null;
  if (typeof val === "number") {
    const utcDays = Math.floor(val) - 25569;
    const utcMs = utcDays * 86400 * 1000;
    const d = new Date(utcMs);
    return d.toISOString().split("T")[0];
  }
  const str = String(val).trim();
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function cleanPhone(val: string): string {
  if (!val) return "";
  // Remove +55 prefix and non-digit chars except for formatting
  let clean = val.replace(/^\+55\s*/, "").trim();
  return clean;
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

    // Load existing clients for dedup
    const existingClients = new Map<string, string>();
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
      data.forEach((c: any) => existingClients.set(c.full_name.toLowerCase().trim(), c.id));
      if (data.length < pageSize) break;
      from += pageSize;
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    const insertBatch: any[] = [];
    const skippedNames: string[] = [];

    for (const row of records) {
      const name = String(row.nome || "").trim();
      if (!name || name.length < 2) { skipped++; skippedNames.push(name || "(vazio)"); continue; }

      const cpf = String(row.cpf || "").trim() || null;
      const birthDate = parseDateBR(row.nascimento) || null;
      const endereco = String(row.endereco || "").trim();
      const numero = String(row.numero || "").trim();
      const bairro = String(row.bairro || "").trim();
      const fullAddress = [endereco, numero, bairro].filter(Boolean).join(", ") || null;
      const city = String(row.cidade || "").trim() || null;
      const notes = String(row.observacao || "").trim() || null;
      const phone = cleanPhone(String(row.telefone || "")) || null;

      const existingId = existingClients.get(name.toLowerCase().trim());

      if (existingId) {
        // Update existing client
        if (!dryRun) {
          const updatePayload: Record<string, any> = {};
          if (cpf) updatePayload.cpf = cpf;
          if (birthDate) updatePayload.birth_date = birthDate;
          if (fullAddress) updatePayload.address = fullAddress;
          if (city) updatePayload.city = city;
          if (notes) updatePayload.notes = notes;
          if (phone) updatePayload.phone = phone;

          if (Object.keys(updatePayload).length > 0) {
            const { error } = await supabaseAdmin.from("clients").update(updatePayload).eq("id", existingId);
            if (error) { errors++; console.error("Update error:", name, error.message); }
            else { updated++; }
          } else {
            skipped++;
          }
        } else {
          updated++;
        }
        continue;
      }

      // New client
      insertBatch.push({
        full_name: name,
        cpf,
        birth_date: birthDate,
        address: fullAddress,
        city,
        notes,
        phone,
      });

      if (!dryRun && insertBatch.length >= 500) {
        const chunk = insertBatch.splice(0, 500);
        const { error } = await supabaseAdmin.from("clients").insert(chunk);
        if (error) { errors += chunk.length; console.error("Batch insert error:", error.message); }
        else { inserted += chunk.length; }
      }
    }

    if (dryRun) {
      inserted = insertBatch.length;
    } else if (insertBatch.length > 0) {
      const { error } = await supabaseAdmin.from("clients").insert(insertBatch);
      if (error) { errors += insertBatch.length; console.error("Final batch error:", error.message); }
      else { inserted += insertBatch.length; }
    }

    console.log(`Client import: ${inserted} inserted, ${updated} updated, ${skipped} skipped, ${errors} errors`);

    return new Response(
      JSON.stringify({ inserted, updated, skipped, errors, total: records.length, skippedNames }),
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
