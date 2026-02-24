import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { email, password, full_name } = await req.json();

  // Create user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (userError) {
    return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
  }

  const userId = userData.user.id;

  // Assign gestor role
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: "gestor" });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true, user_id: userId }), { status: 200 });
});
