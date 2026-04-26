import { supabase } from "../config/supabaseClient.js";

async function resolveFunctionError(error) {
    if (error?.context && typeof error.context.json === "function") {
        try {
            const payload = await error.context.json();
            if (payload?.error) {
                return payload.error;
            }
        } catch {
            // noop
        }
    }

    return error?.message || "No se pudo completar la operación del equipo.";
}

export async function fetchTeamMembers() {
    const { data, error } = await supabase.functions.invoke("manage-team-members", {
        body: {
            action: "list_members",
        },
    });

    if (error) throw new Error(await resolveFunctionError(error));
    if (data?.error) throw new Error(data.error);

    return data?.members ?? [];
}

export async function createTeamMember({ full_name, email, password, role }) {
    const { data, error } = await supabase.functions.invoke("manage-team-members", {
        body: {
            action: "create_member",
            full_name,
            email,
            password,
            role,
        },
    });

    if (error) throw new Error(await resolveFunctionError(error));
    if (data?.error) throw new Error(data.error);

    return data?.member ?? null;
}
