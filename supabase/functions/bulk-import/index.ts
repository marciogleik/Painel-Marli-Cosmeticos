import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROF_MAP: Record<string, string> = {
  "patricia": "00000000-0000-0000-0000-000000000007",
  "dhionara": "00000000-0000-0000-0000-000000000001",
  "dhiani": "00000000-0000-0000-0000-000000000002",
  "bruna": "00000000-0000-0000-0000-000000000005",
  "luciane": "00000000-0000-0000-0000-000000000003",
  "tais": "00000000-0000-0000-0000-000000000004",
  "michele": "00000000-0000-0000-0000-000000000006",
};

const STATUS_MAP: Record<string, string> = {
  "agendado": "agendado",
  "confirmado": "confirmado",
  "atendido": "atendido",
  "cancelado": "cancelado",
  "em espera": "espera",
  "falta": "falta",
  "não compareceu": "falta",
};

function excelDateToISO(serial: number): { date: string; time: string } {
  // Excel serial date: days since 1899-12-30
  const utcDays = Math.floor(serial) - 25569;
  const utcMs = utcDays * 86400 * 1000;
  const d = new Date(utcMs);
  const date = d.toISOString().split("T")[0];
  
  const fractionalDay = serial - Math.floor(serial);
  const totalSeconds = Math.round(fractionalDay * 86400);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`;
  
  return { date, time };
}

function parseDateStr(dateVal: any): { date: string; time: string } | null {
  if (!dateVal && dateVal !== 0) return null;
  
  // Handle Excel serial number
  if (typeof dateVal === "number") {
    return excelDateToISO(dateVal);
  }
  
  // Handle string date
  const str = String(dateVal).trim();
  if (!str) return null;
  const parts = str.split(" ");
  const dateParts = parts[0].split("/");
  if (dateParts.length !== 3) return null;
  const [day, month, year] = dateParts;
  const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const time = parts[1] ? `${parts[1]}:00` : "09:00:00";
  return { date, time };
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + minutes;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}:00`;
}

function matchProfessional(name: string): string | null {
  if (!name) return null;
  const lower = String(name).toLowerCase().trim();
  for (const [key, id] of Object.entries(PROF_MAP)) {
    if (lower.startsWith(key) || lower.includes(key)) return id;
  }
  return null;
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

    const { rows, appointments } = await req.json();

    // If pre-transformed appointments are sent, insert directly
    if (appointments && Array.isArray(appointments)) {
      let inserted = 0;
      let errors = 0;
      const BATCH = 500;
      for (let i = 0; i < appointments.length; i += BATCH) {
        const batch = appointments.slice(i, i + BATCH);
        const { error } = await supabaseAdmin.from("appointments").insert(batch);
        if (error) {
          console.error(`Batch ${i} error:`, error.message);
          errors += batch.length;
        } else {
          inserted += batch.length;
        }
      }
      return new Response(
        JSON.stringify({ inserted, errors, total: appointments.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If raw rows are sent, transform and insert
    if (!rows || !Array.isArray(rows)) {
      return new Response(JSON.stringify({ error: "Missing rows or appointments" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load clients for lookup
    const { data: existingClients } = await supabaseAdmin
      .from("clients")
      .select("id, full_name")
      .order("full_name");
    const clientMap = new Map<string, string>();
    (existingClients ?? []).forEach((c: any) => {
      clientMap.set(c.full_name.toLowerCase().trim(), c.id);
    });

    // Load services for duration
    const { data: services } = await supabaseAdmin
      .from("services")
      .select("name, duration_minutes");
    const svcDuration = new Map<string, number>();
    (services ?? []).forEach((s: any) => {
      svcDuration.set(s.name.toLowerCase().trim(), s.duration_minutes);
    });

    let skipped = 0;
    let inserted = 0;
    let errors = 0;
    const transformedBatch: any[] = [];

    for (const row of rows) {
      const parsed = parseDateStr(row["Data"]);
      if (!parsed) { skipped++; continue; }
      const profId = matchProfessional(row["Profissional"]);
      if (!profId) { skipped++; continue; }

      const status = STATUS_MAP[(String(row["Status"] || "")).toLowerCase().trim()] || "agendado";
      const clientName = String(row["Cliente"] || "").trim();
      const phone = String(row["Telefone"] || "").trim();
      const serviceName = String(row["Serviço"] || "").trim();
      const notes = String(row["Observação"] || "").trim();
      const executedBy = String(row["Executado por"] || "").trim();

      let duration = 30;
      if (serviceName) {
        const svcLower = serviceName.toLowerCase();
        for (const [svcName, dur] of svcDuration.entries()) {
          if (svcLower.includes(svcName) || svcName.includes(svcLower)) {
            duration = dur;
            break;
          }
        }
      }

      const clientId = clientName ? (clientMap.get(clientName.toLowerCase().trim()) || null) : null;
      const endTime = addMinutes(parsed.time, duration);

      transformedBatch.push({
        date: parsed.date,
        start_time: parsed.time,
        end_time: endTime,
        professional_id: profId,
        client_id: clientId,
        client_name: clientName || null,
        client_phone: phone || null,
        status,
        notes: notes || null,
        executed_by: executedBy || null,
      });

      // Insert in batches of 500
      if (transformedBatch.length >= 500) {
        const batch = transformedBatch.splice(0, 500);
        const { error } = await supabaseAdmin.from("appointments").insert(batch);
        if (error) {
          console.error("Batch insert error:", error.message);
          errors += batch.length;
        } else {
          inserted += batch.length;
        }
      }
    }

    // Insert remaining
    if (transformedBatch.length > 0) {
      const { error } = await supabaseAdmin.from("appointments").insert(transformedBatch);
      if (error) {
        console.error("Final batch error:", error.message);
        errors += transformedBatch.length;
      } else {
        inserted += transformedBatch.length;
      }
    }

    console.log(`Done: ${inserted} inserted, ${skipped} skipped, ${errors} errors`);

    return new Response(
      JSON.stringify({ inserted, skipped, errors, total: rows.length }),
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
