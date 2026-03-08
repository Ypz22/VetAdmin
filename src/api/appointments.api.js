import { supabase } from "../config/supabaseClient";
import { fetchProfileById, getAuthUserOrThrow } from "./profiles.api";


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
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function createAppointment({ appointment_date, appointment_time, status, pet_id, service_id, notes }) {
    const user = await getAuthUserOrThrow();

    const profile = await fetchProfileById(user.id);


    const { data, error } = await supabase
        .from("appointments")
        .insert({ appointment_date, appointment_time, status, pet_id, service_id, notes, veterinary_id: profile.veterinary_id });

    if (error) throw new Error(error.message);

    return data;
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
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}

export async function deleteAppointment(id) {
    const { data, error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}