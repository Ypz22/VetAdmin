import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { appointmentId, action } = await request.json();
    const nextStatus =
      action === "confirm" ? "confirmed" : action === "cancel" ? "cancelled" : null;

    if (!appointmentId || !nextStatus) {
      throw new Error("Solicitud de respuesta inválida.");
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({ status: nextStatus })
      .eq("id", appointmentId)
      .select(`*,services(*), pets(*, owner_id: clients(*)) `)
      .single();

    if (error || !data) {
      throw new Error(error?.message || "No se pudo actualizar la cita.");
    }

    return new Response(JSON.stringify({ appointment: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error procesando la cita." }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
