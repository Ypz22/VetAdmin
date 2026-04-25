import { supabase } from "../config/supabaseClient.js"; // ajusta la ruta si aplica

const validarPassword = (password) => {
    const errores = [];

    if (!password) errores.push("La contraseña es obligatoria.");
    if (password && password.length < 8) errores.push("Mínimo 8 caracteres.");
    if (password && password.length > 72) errores.push("Máximo 72 caracteres.");
    if (password && /\s/.test(password)) errores.push("No debe contener espacios.");
    if (password && !/[a-z]/.test(password)) errores.push("Debe tener al menos 1 letra minúscula.");
    if (password && !/[A-Z]/.test(password)) errores.push("Debe tener al menos 1 letra mayúscula.");
    if (password && !/\d/.test(password)) errores.push("Debe tener al menos 1 número.");
    if (password && !/[^A-Za-z0-9]/.test(password)) errores.push("Debe tener al menos 1 símbolo.");

    return errores;
};

export function validarCambioPassword({ newPassword, confirmPassword }) {
    const errores = [];

    errores.push(...validarPassword(newPassword));

    if (!confirmPassword) errores.push("Debes confirmar la contraseña.");
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        errores.push("Las contraseñas no coinciden.");
    }

    return errores;
};

export async function loginWithPassword({ email, password }) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(error.message);
    }

    const user = authData.user;

    const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("must_change_password")
        .eq("id", user.id)
        .single();

    if (profileError) {
        throw new Error(profileError.message);
    }

    if (profileData?.must_change_password) {
        return { status: "must_change_password", userId: user.id };
    }

    return { status: "success", user };
}

export async function changePassword({ newPassword, userId }) {
    const errores = validarPassword(newPassword);
    if (errores.length > 0) {
        throw new Error(errores[0]);
    }

    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) {
        throw new Error(updateError.message);
    }

    const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", userId);

    if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
    }

    return { status: "success" };
}

export async function changePasswordWithCurrent({ currentPassword, newPassword, confirmPassword }) {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.email) {
        throw new Error("No se pudo obtener el usuario actual.");
    }

    const errores = validarCambioPassword({ newPassword, confirmPassword });
    if (errores.length > 0) {
        throw new Error(errores[0]);
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password: currentPassword,
    });

    if (loginError) {
        throw new Error("La contraseña actual no es correcta.");
    }

    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    });

    if (updateError) {
        throw new Error(updateError.message);
    }

    return { status: "success" };
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }

    return { status: "success" };
}
