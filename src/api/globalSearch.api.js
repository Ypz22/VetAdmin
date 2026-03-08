import { supabase } from "../config/supabaseClient.js";

export async function globalSearch(term) {
    const q = (term ?? "").trim();
    if (q.length < 2) return [];

    const { data, error } = await supabase.rpc("global_search", { q, lim: 5 });
    if (error) throw new Error(error.message);

    return data ?? [];
}
