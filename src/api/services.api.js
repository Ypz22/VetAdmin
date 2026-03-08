import { supabase } from "../config/supabaseClient";
import { getAuthUserOrThrow, fetchProfileById } from "./profiles.api";

export async function fetchServices({ search = "" } = {}) {
    let query = supabase.from("services").select("*");

    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchServiceById(id) {
    const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function createService({ name, duration_minutes, price, active, description }) {
    const user = await getAuthUserOrThrow();

    const profile = await fetchProfileById(user.id);

    const { data, error } = await supabase
        .from("services")
        .insert({ name, duration_minutes, price, active, description, veterinary_id: profile.veterinary_id });

    if (error) throw new Error(error.message);

    return data;
}

export async function updateService({ id, name, duration_minutes, price, active, description }) {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (duration_minutes !== undefined) updates.duration_minutes = duration_minutes;
    if (price !== undefined) updates.price = price;
    if (active !== undefined) updates.active = active;
    if (description !== undefined) updates.description = description;

    const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}

export async function deleteService(id) {
    const { data, error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}