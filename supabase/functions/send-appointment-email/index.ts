import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "";

const supabase = createClient(supabaseUrl, serviceRoleKey);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { appointmentId, baseUrl } = await request.json();

    if (!appointmentId || !baseUrl) {
      throw new Error("Faltan appointmentId o baseUrl.");
    }

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Configura SUPABASE_URL y SERVICE_ROLE_KEY.");
    }

    if (!resendApiKey || !fromEmail) {
      throw new Error("Configura RESEND_API_KEY y RESEND_FROM_EMAIL.");
    }

    const { data: appointment, error } = await supabase
      .from("appointments")
      .select(`
        *,
        services(*),
        pets(
          *,
          owner_id:clients(*)
        )
      `)
      .eq("id", appointmentId)
      .single();

    if (error) {
      throw new Error(`Error consultando cita: ${error.message}`);
    }

    if (!appointment) {
      throw new Error("No se encontró la cita.");
    }

    const ownerEmail = "jeffersonyepez621@gmail.com";;

    if (!ownerEmail) {
      throw new Error("El propietario no tiene correo registrado.");
    }

    const confirmUrl = `${baseUrl}/appointment/respond?appointmentId=${appointmentId}&action=confirm`;
    const cancelUrl = `${baseUrl}/appointment/respond?appointmentId=${appointmentId}&action=cancel`;

    const petName = appointment.pets?.name ?? "tu mascota";
    const serviceName = appointment.services?.name ?? "consulta";
    const appointmentDate = appointment.appointment_date ?? "Sin fecha";
    const appointmentTime =
      appointment.appointment_time?.slice(0, 5) ?? "Sin hora";

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: ownerEmail,
        subject: "Confirmación de cita veterinaria",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
            <h2>Tu cita está pendiente de confirmación</h2>

            <p>Hola, tienes una cita para <strong>${petName}</strong>.</p>

            <p><strong>Servicio:</strong> ${serviceName}</p>
            <p><strong>Fecha:</strong> ${appointmentDate}</p>
            <p><strong>Hora:</strong> ${appointmentTime}</p>

            <div style="margin-top: 24px;">
              <a href="${confirmUrl}" style="display: inline-block; margin-right: 12px; padding: 12px 18px; border-radius: 8px; background: #2f6f68; color: #ffffff; text-decoration: none;">
                Confirmar cita
              </a>

              <a href="${cancelUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #b45309; color: #ffffff; text-decoration: none;">
                Cancelar cita
              </a>
            </div>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      throw new Error(`Error Resend: ${errorText}`);
    }

    const resendResult = await emailResponse.json();

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Correo enviado correctamente.",
        resend: resendResult,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error("ERROR EDGE FUNCTION:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});