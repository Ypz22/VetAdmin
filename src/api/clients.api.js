import { supabase } from "../config/supabaseClient";
import { fetchProfileById, getAuthUserOrThrow } from "./profiles.api";

export async function fetchClients({ search = "" } = {}) {
    let query = supabase.from("clients").select("*");

    if (search) query = query.ilike("full_name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchClientById(id) {
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchClientsCount() {
    const { count, error } = await supabase
        .from("clients")
        .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);

    return count;
}

export async function createClient({ full_name, email, phone }) {

    const user = await getAuthUserOrThrow();

    const profile = await fetchProfileById(user.id);

    const { data, error } = await supabase
        .from("clients")
        .insert({ veterinary_id: profile.veterinary_id, full_name, email, phone })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function updateClient({ id, full_name, email, phone }) {

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;

    const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function deleteClient(id) {
    const { data, error } = await supabase
        .from("clients")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}