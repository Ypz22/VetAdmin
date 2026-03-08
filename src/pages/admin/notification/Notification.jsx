import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Switch from "../../../components/Switch.jsx";
import "./notification.css";

const Notification = () => {
    return (
        <Card>
            <CardHeader className="notificationHeader">
                <CardTitle className="notificationHeaderTitle" >Preferencias de notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="notificationContent">
                <div className="notificationSettings">
                    {[
                        { title: "Recordatorios de citas", description: "Enviar recordatorios a propietarios 24h antes de la cita", default: true },
                        { title: "Nuevas citas", description: "Notificar cuando se agende una nueva cita", default: true },
                        { title: "Cancelaciones", description: "Notificar cuando se cancele una cita", default: true },
                        { title: "Resultados de laboratorio", description: "Notificar cuando los resultados esten listos", default: false },
                        { title: "Recordatorios de vacunas", description: "Enviar alertas de vacunas proximas a vencer", default: true },
                        { title: "Resumen diario", description: "Enviar un resumen de actividad al final del dia", default: false }
                    ].map((settings) => (
                        <div key={settings.title} className="notificationSetting">
                            <div className="notificationSettingInfo">
                                <p className="title">{settings.title}</p>
                                <p className="description">{settings.description}</p>
                            </div>
                            <Switch defaultChecked={settings.default} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Notification;