import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { clients } = await req.json();

    if (!Array.isArray(clients) || clients.length === 0) {
      return new Response(JSON.stringify({ error: "No clients provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get existing client names for dedup
    const { data: existing } = await supabase
      .from("clients")
      .select("full_name");

    const existingNames = new Set(
      (existing || []).map((c: any) => c.full_name.trim().toLowerCase())
    );

    const toInsert = clients
      .filter((c: any) => c.full_name && !existingNames.has(c.full_name.trim().toLowerCase()))
      .map((c: any) => ({
        full_name: c.full_name.trim(),
        cpf: c.cpf || null,
        birth_date: c.birth_date || null,
        address: c.address || null,
        city: c.city || null,
        phone: c.phone || null,
        email: c.email || null,
        notes: c.notes || null,
        is_active: true,
      }));

    let inserted = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    // Insert one by one to handle unique constraint violations gracefully
    for (const client of toInsert) {
      const { error } = await supabase.from("clients").insert(client);
      if (error) {
        if (error.message.includes("duplicate key")) {
          // Try without the conflicting field
          const retry = { ...client };
          if (error.message.includes("cpf")) retry.cpf = null;
          if (error.message.includes("phone")) retry.phone = null;
          
          const { error: retryErr } = await supabase.from("clients").insert(retry);
          if (retryErr) {
            errors++;
            if (errorMessages.length < 5) errorMessages.push(`${client.full_name}: ${retryErr.message}`);
          } else {
            inserted++;
          }
        } else {
          errors++;
          if (errorMessages.length < 5) errorMessages.push(`${client.full_name}: ${error.message}`);
        }
      } else {
        inserted++;
      }
    }

    return new Response(
      JSON.stringify({
        total: clients.length,
        skipped_duplicates: clients.length - toInsert.length,
        inserted,
        errors,
        errorMessages,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
