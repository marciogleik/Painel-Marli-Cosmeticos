import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Verify the caller is a gestor
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401, headers: corsHeaders });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Não autorizado" }), { status: 401, headers: corsHeaders });
  }

  // Check gestor role
  const { data: roleData } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "gestor")
    .maybeSingle();

  if (!roleData) {
    return new Response(JSON.stringify({ error: "Apenas gestores podem gerar convites" }), { status: 403, headers: corsHeaders });
  }

  const { role, professional_id } = await req.json();
  const validRoles = ["gestor", "profissional"];
  if (!validRoles.includes(role)) {
    return new Response(JSON.stringify({ error: "Função inválida" }), { status: 400, headers: corsHeaders });
  }

  // If professional_id provided, check it exists and has no user_id yet
  if (professional_id) {
    const { data: prof } = await supabaseAdmin
      .from("professionals")
      .select("id, user_id")
      .eq("id", professional_id)
      .single();

    if (!prof) {
      return new Response(JSON.stringify({ error: "Profissional não encontrado" }), { status: 404, headers: corsHeaders });
    }
    if (prof.user_id) {
      return new Response(JSON.stringify({ error: "Esta profissional já possui uma conta vinculada" }), { status: 400, headers: corsHeaders });
    }
  }

  // Create invitation (expires in 1 hour)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const insertData: Record<string, unknown> = { role, expires_at: expiresAt, created_by: user.id };
  if (professional_id) insertData.professional_id = professional_id;

  const { data, error } = await supabaseAdmin
    .from("invitations")
    .insert(insertData)
    .select("token")
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ token: data.token }), { status: 200, headers: corsHeaders });
});
