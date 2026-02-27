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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== Deno.env.get("WHATSAPP_API_KEY")) return unauthorized();

  const url = new URL(req.url);
  const professionalId = url.searchParams.get("professional_id");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (professionalId) {
    // Services linked to a specific professional
    const { data, error } = await supabase
      .from("professional_services")
      .select("service_id, custom_price, services(id, name, duration_minutes, base_price, category, requires_evaluation)")
      .eq("professional_id", professionalId)
      .eq("is_active", true);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const services = (data || []).map((ps: any) => ({
      id: ps.services.id,
      name: ps.services.name,
      duration_minutes: ps.services.duration_minutes,
      price: ps.custom_price ?? ps.services.base_price,
      category: ps.services.category,
      requires_evaluation: ps.services.requires_evaluation,
    }));

    return new Response(JSON.stringify({ services }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // All active services
  const { data, error } = await supabase
    .from("services")
    .select("id, name, duration_minutes, base_price, category, requires_evaluation")
    .eq("is_active", true)
    .order("name");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ services: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
