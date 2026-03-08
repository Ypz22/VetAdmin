import { supabase } from "../config/supabaseClient";
import { getAuthUserOrThrow, fetchProfileById } from "./profiles.api";

export async function fetchPets({ search = "" } = {}) {
    let query = supabase.from("pets").select("*");

    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchPetsAndOwner() {
    const { data, error } = await supabase
        .from("pets")
        .select("*, owner_id: clients(*)")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return data;
}

export async function fetchPetById(id) {
    const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function createPet({ name, species, age, owner_id, weight, breed, chip, status, notes }) {

    const user = await getAuthUserOrThrow();

    const profile = await fetchProfileById(user.id);


    const { data, error } = await supabase
        .from("pets")
        .insert({ name, species, owner_id, veterinary_id: profile.veterinary_id, age, weight, breed, chip, status, notes });

    if (error) throw new Error(error.message);

    return data;
}

export async function updatePet({ id, name, species, age, weight, breed, notes }) {

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (species !== undefined) updates.species = species;
    if (age !== undefined) updates.age = age;
    if (weight !== undefined) updates.weight = weight;
    if (breed !== undefined) updates.breed = breed;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
        .from("pets")
        .update(updates)
        .eq("id", id)
        .select("*, owner_id: clients(*)")
        .single();

    if (error) throw new Error(error.message);

    return data;
}

export async function deletePet(id) {
    const { data, error } = await supabase
        .from("pets")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    return data;
}