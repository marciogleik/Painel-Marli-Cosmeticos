import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== Deno.env.get("WHATSAPP_API_KEY")) return unauthorized();

  const body = await req.json();
  const { professional_id, date, start_time, client_name, client_phone, service_ids, notes } = body;

  if (!professional_id || !date || !start_time || !client_name) {
    return new Response(JSON.stringify({ error: "professional_id, date, start_time, and client_name are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Resolve services and calculate total duration
  let totalDuration = 30; // default
  let serviceDetails: { service_id: string; service_name: string; duration_minutes: number; price: number | null }[] = [];

  if (service_ids && service_ids.length > 0) {
    // Get professional custom prices
    const { data: profServices } = await supabase
      .from("professional_services")
      .select("service_id, custom_price, services(id, name, duration_minutes, base_price)")
      .eq("professional_id", professional_id)
      .in("service_id", service_ids);

    if (profServices && profServices.length > 0) {
      totalDuration = 0;
      serviceDetails = profServices.map((ps: any) => {
        totalDuration += ps.services.duration_minutes;
        return {
          service_id: ps.services.id,
          service_name: ps.services.name,
          duration_minutes: ps.services.duration_minutes,
          price: ps.custom_price ?? ps.services.base_price,
        };
      });
    }
  }

  // Calculate end_time
  const [sh, sm] = start_time.split(":").map(Number);
  const endMinutes = sh * 60 + sm + totalDuration;
  const endTime = `${pad(Math.floor(endMinutes / 60))}:${pad(endMinutes % 60)}:00`;
  const startTimeFull = `${start_time.length === 5 ? start_time + ":00" : start_time}`;

  // Check conflicts (appointments)
  const { data: conflicts } = await supabase
    .from("appointments")
    .select("id, client_name")
    .eq("professional_id", professional_id)
    .eq("date", date)
    .not("status", "in", '("cancelado","falta")')
    .lt("start_time", endTime)
    .gt("end_time", startTimeFull);

  if (conflicts && conflicts.length > 0) {
    return new Response(JSON.stringify({
      error: "Horário indisponível",
      conflict_with: conflicts[0].client_name || "outro cliente",
    }), {
      status: 409,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check blocked slots
  const { data: blockedConflicts } = await supabase
    .from("blocked_slots")
    .select("id, reason")
    .eq("professional_id", professional_id)
    .eq("date", date)
    .lt("start_time", endTime)
    .gt("end_time", startTimeFull);

  if (blockedConflicts && blockedConflicts.length > 0) {
    return new Response(JSON.stringify({
      error: "Horário bloqueado",
      reason: blockedConflicts[0].reason || "Indisponível",
    }), {
      status: 409,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Try to find existing client by phone
  let clientId: string | null = null;
  if (client_phone) {
    const cleanPhone = client_phone.replace(/\D/g, "");
    const { data: existingClient } = await supabase
      .from("clients")
      .select("id")
      .or(`phone.ilike.%${cleanPhone}%,phone2.ilike.%${cleanPhone}%`)
      .limit(1)
      .maybeSingle();

    if (existingClient) clientId = existingClient.id;
  }

  // Create appointment
  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      professional_id,
      date,
      start_time: startTimeFull,
      end_time: endTime,
      client_name,
      client_phone: client_phone || null,
      client_id: clientId,
      status: "agendado",
      notes: notes || `Agendado via WhatsApp`,
    })
    .select("id")
    .single();

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Insert appointment services
  if (serviceDetails.length > 0) {
    const servicesToInsert = serviceDetails.map((s) => ({
      appointment_id: appointment.id,
      service_id: s.service_id,
      service_name: s.service_name,
      duration_minutes: s.duration_minutes,
      price: s.price,
    }));

    await supabase.from("appointment_services").insert(servicesToInsert);
  }

  return new Response(JSON.stringify({
    success: true,
    appointment_id: appointment.id,
    date,
    start_time: startTimeFull,
    end_time: endTime,
    professional_id,
    client_name,
    services: serviceDetails.map((s) => s.service_name),
  }), {
    status: 201,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
