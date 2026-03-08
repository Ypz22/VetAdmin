import { supabase } from "../config/supabaseClient";

export async function fetchProfile({ search = "" } = {}) {
    let query = supabase.from("profiles").select("*");

    if (search) query = query.ilike("full_name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchProfileClientsCount() {
    const { count, error } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "client");

    if (error) throw new Error(error.message);

    return count ?? 0;
}

export async function fetchProfileById(id) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function getAuthUserOrThrow() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) throw new Error("No se pudo obtener el usuario.");
    return data.user;
}

export async function createProfile({ full_name, role, must_change_password = true }) {

    const user = await getAuthUserOrThrow();

    const id = user.id;
    const veterinary_id = user.veterinary_id;

    const { data, error } = await supabase
        .from("profiles")
        .insert({ id, veterinary_id, full_name, role, must_change_password })

    if (error) throw new Error(error.message);

    return data;

}

export async function updateProfile({ full_name, role, must_change_password }) {

    const user = await getAuthUserOrThrow();

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (role !== undefined) updates.role = role;
    if (must_change_password !== undefined)
        updates.must_change_password = must_change_password;

    const { data, error } = await supabase
        .from("profiles")
        .update({ veterinary_id: user.veterinary_id, full_name, role, must_change_password })
        .eq("id", user.id)

    if (error) throw new Error(error.message);

    return data;
}

export async function deleteProfile() {

    const user = await getAuthUserOrThrow();
    const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id)

    if (error) throw new Error(error.message);

    return { status: "success" };
}