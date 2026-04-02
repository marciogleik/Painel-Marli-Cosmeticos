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
      Deno.env.get("SB_URL")!,
      Deno.env.get("SB_SERVICE_ROLE_KEY")!
    );

    // Verify the caller is a gestor
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Sessão expirada ou não autorizado. Faça login novamente." }), { status: 401, headers: corsHeaders });
    }

    const token = authHeader.replace("Bearer ", "");
    const authResponse = await supabaseAdmin.auth.getUser(token);
    
    if (authResponse.error || !authResponse.data?.user) {
      console.error("Auth error:", authResponse.error?.message);
      return new Response(JSON.stringify({ error: "Sessão inválida ou expirada. Por favor, saia e entre novamente no sistema." }), { status: 401, headers: corsHeaders });
    }

    const user = authResponse.data.user;

    // Check gestor role
    const { data: roleData, error: roleSearchError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "gestor")
      .maybeSingle();

    if (roleSearchError) {
      console.error("Error checking role:", roleSearchError.message);
      return new Response(JSON.stringify({ error: "Erro ao verificar permissões: " + roleSearchError.message }), { status: 500, headers: corsHeaders });
    }

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Apenas gestores podem gerar convites" }), { status: 403, headers: corsHeaders });
    }

    const { role, professional_id } = await req.json();
    const validRoles = ["gestor", "profissional"];
    if (!validRoles.includes(role)) {
      return new Response(JSON.stringify({ error: "Função inválida: " + role }), { status: 400, headers: corsHeaders });
    }

    // If professional_id provided, check it exists and has no user_id yet
    if (professional_id) {
      const { data: prof, error: profError } = await supabaseAdmin
        .from("professionals")
        .select("id, user_id")
        .eq("id", professional_id)
        .maybeSingle();

      if (profError) {
        console.error("Error checking professional:", profError.message);
        return new Response(JSON.stringify({ error: "Erro ao buscar profissional: " + profError.message }), { status: 500, headers: corsHeaders });
      }

      if (!prof) {
        return new Response(JSON.stringify({ error: "A profissional selecionada não foi encontrada no banco de dados." }), { status: 404, headers: corsHeaders });
      }
      if (prof.user_id) {
        return new Response(JSON.stringify({ error: "Esta profissional já possui uma conta vinculada e ativa." }), { status: 400, headers: corsHeaders });
      }
    }

    // Create invitation (expires in 24 hours now to be more useful)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const insertData: Record<string, unknown> = { role, expires_at: expiresAt, created_by: user.id };
    if (professional_id) insertData.professional_id = professional_id;

    const { data, error: insertError } = await supabaseAdmin
      .from("invitations")
      .insert(insertData)
      .select("token")
      .single();

    if (insertError) {
      console.error("Error inserting invitation:", insertError.message);
      return new Response(JSON.stringify({ error: "Erro ao salvar convite: " + insertError.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ token: data.token }), { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error("Unhandled error in generate-invite:", error.message);
    return new Response(JSON.stringify({ error: "Erro interno no servidor: " + error.message }), { status: 500, headers: corsHeaders });
  }
});
