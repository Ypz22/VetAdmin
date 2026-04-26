import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

function sanitizeRole(role: unknown) {
  return role === "owner" ? "owner" : "staff";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = request.headers.get("Authorization") ?? "";

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const userClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  try {
    const { data: authData, error: authError } = await userClient.auth.getUser();

    if (authError || !authData?.user) {
      throw new Error("No se pudo validar al administrador.");
    }

    const adminUser = authData.user;

    const { data: adminProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id, veterinary_id, role")
      .eq("id", adminUser.id)
      .single();

    if (profileError || !adminProfile) {
      throw new Error("No se encontró el perfil del administrador.");
    }

    const body = await request.json();
    const action = body?.action;

    if (action === "list_members") {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, must_change_password, veterinary_id")
        .eq("veterinary_id", adminProfile.veterinary_id)
        .neq("role", "client")
        .order("full_name", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      const { data: usersPage, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) {
        throw new Error(usersError.message);
      }

      const usersById = new Map(
        (usersPage?.users ?? []).map((user) => [user.id, user])
      );

      const members = await Promise.all(
        (profiles ?? []).map(async (profile) => {
          const authUser = usersById.get(profile.id);

          if (!authUser) {
            return {
              id: profile.id,
              full_name: profile.full_name,
              role: profile.role,
              email: "Sin correo",
              status: "inactive",
              must_change_password: profile.must_change_password ?? false,
            };
          }

          return {
            id: profile.id,
            full_name: profile.full_name,
            role: profile.role,
            email: authUser.email ?? "Sin correo",
            status: authUser.banned_until ? "inactive" : "active",
            must_change_password: profile.must_change_password ?? false,
          };
        })
      );

      return jsonResponse({ members });
    }

    if (adminProfile.role !== "owner") {
      throw new Error("Solo el propietario puede gestionar empleados.");
    }

    if (action === "create_member") {
      const fullName = String(body?.full_name ?? "").trim();
      const email = String(body?.email ?? "").trim().toLowerCase();
      const password = String(body?.password ?? "");
      const role = sanitizeRole(body?.role);

      if (!fullName || !email || !password) {
        throw new Error("Completa nombre, correo y contraseña temporal.");
      }

      const { data: createdUser, error: createUserError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

      if (createUserError || !createdUser.user) {
        throw new Error(createUserError?.message || "No se pudo crear la cuenta del empleado.");
      }

      const userId = createdUser.user.id;

      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          veterinary_id: adminProfile.veterinary_id,
          full_name: fullName,
          role,
          must_change_password: true,
        });

      if (insertError) {
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(insertError.message);
      }

      return jsonResponse({
        member: {
          id: userId,
          full_name: fullName,
          role,
          email,
          status: "active",
          must_change_password: true,
        },
      });
    }

    throw new Error("Acción de equipo no válida.");
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "No se pudo completar la gestión del equipo." },
      400,
    );
  }
});
