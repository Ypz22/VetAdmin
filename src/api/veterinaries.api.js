import { supabase } from "../config/supabaseClient";
import { getAuthUserOrThrow } from "./profiles.api";
import { fetchProfileById } from "./profiles.api";

export async function fetchVeterinaries({ search = "" } = {}) {
    let query = supabase.from("veterinaries").select("*");

    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchVeterinaryById(id) {
    const { data, error } = await supabase
        .from("veterinaries")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchVeterinaryByUser() {

    const user = await getAuthUserOrThrow();

    const profile = await fetchProfileById(user.id);

    const { data, error } = await supabase
        .from("veterinaries")
        .select("*")
        .eq("id", profile.veterinary_id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}