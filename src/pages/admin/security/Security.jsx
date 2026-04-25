import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Label } from "../../../components/Label";
import Button from "../../../components/Button";
import Badge from "../../../components/Badget";
import Input from "../../../components/Input.jsx";
import toast from "react-hot-toast";
import { useAuthUser } from "../../../queries/auth.queries.js";
import { useChangePasswordWithCurrent, useLogout } from "../../../queries/credentials.queries.js";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState.js";
import "./security.css";

function getCurrentSession(userEmail) {
    return {
        id: "current",
        device: navigator.userAgent.includes("Mac") ? "Mac - Navegador actual" : "Navegador actual",
        location: userEmail || "Sesión activa",
        time: "Sesión actual",
        current: true,
    };
}

const Security = () => {
    const auth = useAuthUser();
    const userEmail = auth.data?.email ?? "";
    const [form, setForm] = React.useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [savedSessions, setSavedSessions] = useLocalStorageState("admin_security_sessions", [
        { id: "saved-1", device: "iPhone 15 - Safari", location: "Móvil registrado", time: "Hace 2 horas", current: false },
        { id: "saved-2", device: "iPad - Safari", location: "Tablet registrada", time: "Hace 1 día", current: false },
    ]);
    const changePasswordMutation = useChangePasswordWithCurrent();
    const logoutMutation = useLogout({
        onSuccess: () => {
            toast.success("Sesión cerrada.");
            window.location.href = "/";
        },
    });

    const sessions = React.useMemo(
        () => [getCurrentSession(userEmail), ...savedSessions],
        [savedSessions, userEmail]
    );

    const handleSubmit = () => {
        changePasswordMutation.mutate(form, {
            onSuccess: () => {
                toast.success("Contraseña actualizada correctamente.");
                setForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    return (
        <div className="securityPage">
            <Card>
                <CardHeader className="securityHeader">
                    <CardTitle className="securityHeaderTitle">
                        <Icons.Shield className="sizeIcon5 icon" />
                        Cambiar contraseña
                    </CardTitle>
                </CardHeader>
                <CardContent className="securityContent">
                    <div className="securityForm">
                        <div className="securityFormGroup">
                            <Label>Contraseña actual</Label>
                            <Input
                                type="password"
                                placeholder="Ingresa tu contrasena actual"
                                className="input inputSecurity"
                                value={form.currentPassword}
                                onChange={(event) => setForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                            />
                        </div>
                        <div className="securityFormGroup">
                            <Label>Nueva contraseña</Label>
                            <Input
                                type="password"
                                placeholder="Ingresa tu nueva contrasena"
                                className="input inputSecurity"
                                value={form.newPassword}
                                onChange={(event) => setForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                            />
                        </div>
                        <div className="securityFormGroup">
                            <Label>Confirmar nueva contraseña</Label>
                            <Input
                                type="password"
                                placeholder="Confirma tu nueva contrasena"
                                className="input inputSecurity"
                                value={form.confirmPassword}
                                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                            />
                        </div>
                        <Button
                            type="button"
                            className="btn btn-security"
                            label={changePasswordMutation.isPending ? "Actualizando..." : "Actualizar contraseña"}
                            disabled={changePasswordMutation.isPending}
                            onClick={handleSubmit}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="securityHeader">
                    <CardTitle className="securityHeaderTitle">Sesiones activas</CardTitle>
                </CardHeader>
                <CardContent className="securityContent">
                    <div className="sessionsList">
                        {sessions.map((session) => (
                            <div key={session.id} className="sessionRecord">
                                <div className="sessionInfo">
                                    <p>{session.device}</p>
                                    <p className="sessionRecordP">{session.location} · {session.time}</p>
                                </div>
                                {session.current ? (
                                    <Badge className="badgeActive" label="Actual" />
                                ) : (
                                    <Button
                                        type="button"
                                        className="btn btnSecurityLogout"
                                        label="Eliminar registro"
                                        onClick={() => setSavedSessions((prev) => prev.filter((item) => item.id !== session.id))}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="securityActions">
                        <Button
                            type="button"
                            className="btn btnSecurityLogoutAll"
                            label={logoutMutation.isPending ? "Cerrando..." : "Cerrar sesión actual"}
                            disabled={logoutMutation.isPending}
                            onClick={() => logoutMutation.mutate()}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Security;
