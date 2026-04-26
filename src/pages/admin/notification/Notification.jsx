import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Switch from "../../../components/Switch.jsx";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState.js";
import "./notification.css";

const DEFAULT_NOTIFICATIONS = [
    { id: "appointment_reminders", title: "Recordatorios de citas", description: "Enviar recordatorios a propietarios 24h antes de la cita", enabled: true },
    { id: "new_appointments", title: "Nuevas citas", description: "Notificar cuando se agende una nueva cita", enabled: true },
    { id: "cancellations", title: "Cancelaciones", description: "Notificar cuando se cancele una cita", enabled: true },
    { id: "lab_results", title: "Resultados de laboratorio", description: "Notificar cuando los resultados esten listos", enabled: false },
    { id: "vaccines", title: "Recordatorios de vacunas", description: "Enviar alertas de vacunas proximas a vencer", enabled: true },
    { id: "daily_summary", title: "Resumen diario", description: "Enviar un resumen de actividad al final del dia", enabled: false },
];

const Notification = ({ veterinary }) => {
    const storageKey = React.useMemo(
        () => `admin_notifications_${veterinary?.id ?? "default"}`,
        [veterinary?.id]
    );
    const [settings, setSettings] = useLocalStorageState(storageKey, DEFAULT_NOTIFICATIONS);

    const toggleSetting = (id, enabled) => {
        setSettings((prev) =>
            prev.map((setting) =>
                setting.id === id ? { ...setting, enabled } : setting
            )
        );
    };

    return (
        <Card>
            <CardHeader className="notificationHeader">
                <CardTitle className="notificationHeaderTitle">Preferencias de notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="notificationContent">
                <div className="notificationSettings">
                    {settings.map((setting) => (
                        <div key={setting.id} className="notificationSetting">
                            <div className="notificationSettingInfo">
                                <p className="title">{setting.title}</p>
                                <p className="description">{setting.description}</p>
                            </div>
                            <Switch
                                checked={setting.enabled}
                                onCheckedChange={(checked) => toggleSetting(setting.id, checked)}
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Notification;
