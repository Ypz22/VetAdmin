import { supabase } from "../config/supabaseClient";
import { fetchProfileById, getAuthUserOrThrow } from "./profiles.api";

function normalizeFunctionErrorMessage(error) {
    const message = error?.message || "";

    if (message.includes("Failed to send a request to the Edge Function")) {
        return "La Edge Function de Supabase no está disponible. Debes desplegar `send-appointment-email` y `respond-appointment` en tu proyecto.";
    }

    if (message.includes("FunctionsFetchError")) {
        return "No se pudo conectar con las Edge Functions de Supabase.";
    }

    return message || "No se pudo completar la acción con la Edge Function.";
}


export async function fetchAppointments({ search = "" } = {}) {
    let query = supabase.from("appointments").select("*");

    if (search) query = query.ilike("status", `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchAllDataAppointments() {
    let query = supabase
        .from("appointments")
        .select(`*,services(*), pets(*, owner_id: clients(*)) `);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchAppointmentsCount() {
    const { count, error } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);

    return count ?? 0;
}

export async function fetchAppointmentsCountToday() {
    const { count, error } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("appointment_date", new Date().toISOString().split('T')[0]);

    if (error) throw new Error(error.message);

    return count ?? 0;
}


export async function fetchAppointmentById(id) {
    const { data, error } = await supabase
        .from("appointments")
        .select(`*,services(*), pets(*, owner_id: clients(*)) `)
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function createAppointment({ appointment_date, appointment_time, pet_id, service_id, notes, baseUrl }) {
    const user = await getAuthUserOrThrow();

    const profile = await fetchProfileById(user.id);


    const { data, error } = await supabase
        .from("appointments")
        .insert({
            appointment_date,
            appointment_time,
            status: "pending",
            pet_id,
            service_id,
            notes,
            veterinary_id: profile.veterinary_id,
        })
        .select(`*,services(*), pets(*, owner_id: clients(*)) `)
        .single();

    if (error) throw new Error(error.message);

    let emailSent = false;
    let emailError = null;

    try {
        const resolvedBaseUrl =
            baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

        const { error: functionError } = await supabase.functions.invoke(
            "send-appointment-email",
            {
                body: {
                    appointmentId: data.id,
                    baseUrl: resolvedBaseUrl,
                },
            }
        );

        if (functionError) {
            throw functionError;
        }

        emailSent = true;
    } catch (sendError) {
        emailError = normalizeFunctionErrorMessage(sendError);
    }

    return { appointment: data, emailSent, emailError };
}

export async function updateAppointment({ id, appointment_date, appointment_time, status, pet_id, service_id, notes }) {
    const updates = {};
    if (appointment_date !== undefined) updates.appointment_date = appointment_date;
    if (appointment_time !== undefined) updates.appointment_time = appointment_time;
    if (status !== undefined) updates.status = status;
    if (pet_id !== undefined) updates.pet_id = pet_id;
    if (service_id !== undefined) updates.service_id = service_id;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
        .from("appointments")
        .update(updates)
        .select(`*,services(*), pets(*, owner_id: clients(*)) `)
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}

export async function respondToAppointment({ appointmentId, action }) {
    const normalizedAction = action === "confirm" ? "confirmed" : action === "cancel" ? "cancelled" : null;

    if (!normalizedAction) {
        throw new Error("Acción de cita no válida.");
    }

    const { data, error } = await supabase.functions.invoke("respond-appointment", {
        body: {
            appointmentId,
            action,
        },
    });

    if (error) throw new Error(normalizeFunctionErrorMessage(error));
    if (data?.error) throw new Error(data.error);

    return {
        status: normalizedAction,
        appointment: data?.appointment ?? null,
    };
}

export async function deleteAppointment(id) {
    const { data, error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}
