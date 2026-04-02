import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    if (inviteError) {
      console.error("Invite error:", inviteError);
      return new Response(JSON.stringify({ error: "Erro ao validar convite" }), { status: 500, headers: corsHeaders });
    }

    if (!invite) {
      return new Response(JSON.stringify({ error: "Convite inválido ou expirado" }), { status: 400, headers: corsHeaders });
    }

    // Create user
    console.log("Creating user:", email);
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, birth_date },
    });

    if (userError) {
      console.error("User creation error:", userError.message);
      return new Response(JSON.stringify({ error: userError.message }), { status: 400, headers: corsHeaders });
    }

    const userId = userData.user.id;

    // Assign role
    console.log("Assigning role:", invite.role, "to user:", userId);
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: invite.role });

    if (roleError) {
      console.error("Role assignment error:", roleError.message);
      return new Response(JSON.stringify({ error: "Erro ao atribuir papel: " + roleError.message }), { status: 500, headers: corsHeaders });
    }

    // Link professional record if professional_id is set on the invitation
    if (invite.professional_id) {
      console.log("Linking professional:", invite.professional_id);
      const { error: linkError } = await supabaseAdmin
        .from("professionals")
        .update({ user_id: userId })
        .eq("id", invite.professional_id);

      if (linkError) {
        console.error("Error linking professional:", linkError.message);
      }
    }

    // Mark invitation as used
    await supabaseAdmin
      .from("invitations")
      .update({ used_at: new Date().toISOString(), used_by: userId })
      .eq("id", invite.id);

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error("Unhandled error in register-invite:", error.message);
    return new Response(JSON.stringify({ error: "Erro interno no servidor: " + error.message }), { status: 500, headers: corsHeaders });
  }
});
