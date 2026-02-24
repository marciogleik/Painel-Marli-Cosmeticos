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

  const { token, email, password, full_name, birth_date } = await req.json();

  // Validate inputs
  if (!token || !email || !password || !full_name) {
    return new Response(JSON.stringify({ error: "Todos os campos obrigatórios devem ser preenchidos" }), { status: 400, headers: corsHeaders });
  }

  if (password.length < 6) {
    return new Response(JSON.stringify({ error: "A senha deve ter pelo menos 6 caracteres" }), { status: 400, headers: corsHeaders });
  }

  // Verify invitation
  const { data: invite, error: inviteError } = await supabaseAdmin
    .from("invitations")
    .select("*")
    .eq("token", token)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (inviteError || !invite) {
    return new Response(JSON.stringify({ error: "Convite inválido ou expirado" }), { status: 400, headers: corsHeaders });
  }

  // Create user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, birth_date },
  });

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400, headers: corsHeaders });
  }

  const userId = userData.user.id;

  // Assign role
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: invite.role });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 500, headers: corsHeaders });
  }

  // Mark invitation as used
  await supabaseAdmin
    .from("invitations")
    .update({ used_at: new Date().toISOString(), used_by: userId })
    .eq("id", invite.id);

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });
});
