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

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== Deno.env.get("WHATSAPP_API_KEY")) return unauthorized();

  const url = new URL(req.url);
  const professionalId = url.searchParams.get("professional_id");
  const date = url.searchParams.get("date"); // YYYY-MM-DD
  const durationMinutes = parseInt(url.searchParams.get("duration_minutes") || "30", 10);
  const slotInterval = parseInt(url.searchParams.get("slot_interval") || "30", 10);

  if (!professionalId || !date) {
    return new Response(JSON.stringify({ error: "professional_id and date are required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Get day of week (JS: 0=Sunday)
  const dateObj = new Date(date + "T12:00:00Z");
  const dayOfWeek = dateObj.getUTCDay();

  // Fetch professional schedule for this day
  const { data: schedule } = await supabase
    .from("professional_schedules")
    .select("start_time, end_time")
    .eq("professional_id", professionalId)
    .eq("day_of_week", dayOfWeek)
    .eq("is_active", true)
    .maybeSingle();

  if (!schedule) {
    return new Response(JSON.stringify({ available_slots: [], message: "Profissional não atende neste dia" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Fetch existing appointments (excluding cancelled/falta)
  const { data: appointments } = await supabase
    .from("appointments")
    .select("start_time, end_time")
    .eq("professional_id", professionalId)
    .eq("date", date)
    .not("status", "in", '("cancelado","falta")');

  // Fetch blocked slots
  const { data: blocked } = await supabase
    .from("blocked_slots")
    .select("start_time, end_time")
    .eq("professional_id", professionalId)
    .eq("date", date);

  const occupied = [
    ...(appointments || []),
    ...(blocked || []),
  ].map((s) => {
    const [sh, sm] = s.start_time.split(":").map(Number);
    const [eh, em] = s.end_time.split(":").map(Number);
    return { start: sh * 60 + sm, end: eh * 60 + em };
  });

  // Parse schedule times
  const [startH, startM] = schedule.start_time.split(":").map(Number);
  const [endH, endM] = schedule.end_time.split(":").map(Number);
  const schedStart = startH * 60 + startM;
  const schedEnd = endH * 60 + endM;

  // Generate available slots
  const availableSlots: string[] = [];
  for (let t = schedStart; t + durationMinutes <= schedEnd; t += slotInterval) {
    const slotEnd = t + durationMinutes;
    const hasConflict = occupied.some((o) => t < o.end && slotEnd > o.start);
    if (!hasConflict) {
      availableSlots.push(`${pad(Math.floor(t / 60))}:${pad(t % 60)}`);
    }
  }

  return new Response(JSON.stringify({ available_slots: availableSlots, date, professional_id: professionalId }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
