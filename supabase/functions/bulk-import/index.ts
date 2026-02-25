import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { appointments } = await req.json();

    if (!appointments || !Array.isArray(appointments)) {
      return new Response(JSON.stringify({ error: "Missing appointments array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let inserted = 0;
    let errors = 0;
    const BATCH = 500;

    for (let i = 0; i < appointments.length; i += BATCH) {
      const batch = appointments.slice(i, i + BATCH);
      const { error } = await supabaseAdmin
        .from("appointments")
        .insert(batch);

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
  } catch (e) {
    console.error("Import error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
