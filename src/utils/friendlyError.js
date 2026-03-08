export function friendlyError(msg) {
    const raw = msg || "";
    const m = raw.toLowerCase();

    if (m.includes("invalid login credentials"))
        return "Correo o contraseña incorrectos.";

    if (m.includes("email not confirmed"))
        return "Debes confirmar tu correo antes de iniciar sesión.";

    if (m.includes("user already registered"))
        return "Este correo ya está registrado.";

    if (m.includes("too many requests"))
        return "Demasiados intentos. Intenta nuevamente en unos minutos.";

    if (m.includes("password should be at least") || m.includes("password must be at least"))
        return "La contraseña es muy corta.";

    if (m.includes("new password should be different"))
        return "La nueva contraseña debe ser diferente a la anterior.";

    if (m.includes("network") || m.includes("failed to fetch"))
        return "No hay conexión. Revisa tu internet e intenta de nuevo.";

    return raw || "Ocurrió un error.";
};
