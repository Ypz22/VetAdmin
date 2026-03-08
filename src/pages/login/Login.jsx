import React from "react";
import Form from "../../components/Form.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./login.css";
import { validarCambioPassword } from "../../api/credentials.api.js";
import { friendlyError } from "../../utils/friendlyError.js";
import { useChangePassword, useLogin } from "../../queries/credentials.queries.js";

const Login = () => {
    const [mode, setMode] = React.useState("login");
    const [userId, setUserId] = React.useState(null);
    const [showPasswords, setShowPasswords] = React.useState(false);
    const navigate = useNavigate();

    const loginMutation = useLogin();
    const changePasswordMutation = useChangePassword();

    const inputs =
        mode === "login"
            ? [
                {
                    type: "email",
                    name: "email",
                    placeholder: "Correo electrónico..",
                    required: true,
                    autoComplete: "email",
                },
                {
                    type: showPasswords ? "text" : "password",
                    name: "password",
                    placeholder: "Contraseña..",
                    required: true,
                    autoComplete: "current-password",
                },
            ]
            : [
                {
                    type: showPasswords ? "text" : "password",
                    name: "newPassword",
                    placeholder: "Nueva contraseña..",
                    required: true,
                    autoComplete: "new-password",
                },
                {
                    type: showPasswords ? "text" : "password",
                    name: "confirmPassword",
                    placeholder: "Confirmar contraseña..",
                    required: true,
                    autoComplete: "new-password",
                },
            ];

    const handleSubmit = async (data) => {
        const toastId = "auth";

        try {
            if (mode === "changePassword") {
                const errores = validarCambioPassword(data);
                if (errores.length > 0) {
                    toast.error(errores[0], { id: toastId });
                    return;
                }

                if (!userId) {
                    toast.error("No se encontró el usuario. Inicia sesión nuevamente.", { id: toastId });
                    setUserId(null);
                    setMode("login");
                    return;
                }
            }

            toast.loading(
                mode === "login" ? "Iniciando sesión..." : "Actualizando contraseña...",
                { id: toastId }
            );

            if (mode === "login") {
                const result = await loginMutation.mutateAsync(data);

                if (result.status === "must_change_password") {
                    setUserId(result.userId);
                    setMode("changePassword");
                    toast.error("Debes cambiar tu contraseña para continuar.", { id: toastId });
                    return;
                }

                toast.success("Login exitoso 🐾", { id: toastId });
                navigate("/home");
                return;
            }

            await changePasswordMutation.mutateAsync({
                newPassword: data.newPassword,
                userId,
            });

            toast.success("Contraseña actualizada con éxito 🐾", { id: toastId });

            setUserId(null);
            setMode("login");
        } catch (error) {
            toast.error(friendlyError(error?.message), { id: toastId });
        }
    };

    const isSubmitting = loginMutation.isPending || changePasswordMutation.isPending;

    const dataConfig = {
        id: "login-form",
        className: "login-form",
        bottom: (
            <div>
                <label className="remember-label">
                    <input
                        type="checkbox"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                    />{" "}
                    Mostrar Contraseñas
                </label>
            </div>
        ),
        buttons: [
            {
                type: "submit",
                label: isSubmitting
                    ? "Procesando..."
                    : mode === "login"
                        ? "Iniciar Sesión"
                        : "Cambiar Contraseña",
                className: "login-button",
                disabled: isSubmitting,
            },
        ],
    };

    return (
        <div className="full-page flex">
            <div className="login-img-section">
                <h2>Clínica</h2>
                <h2 className="label-vet-login">Veterinaria</h2>
            </div>

            <div className="login-form-section flex center-aling">
                <div className="img"></div>

                <Form
                    id={dataConfig.id}
                    className={dataConfig.className}
                    buttons={dataConfig.buttons}
                    inputs={inputs}
                    onSubmitFunction={handleSubmit}
                    bottom={dataConfig.bottom}
                />
            </div>
        </div>
    );
};

export default Login;
