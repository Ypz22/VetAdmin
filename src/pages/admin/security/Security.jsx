import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import { Label } from "../../../components/Label";
import Button from "../../../components/Button";
import Badge from "../../../components/Badget";
import "./security.css";

const Security = () => {
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
                            <input type="password" placeholder="Ingresa tu contrasena actual" className="input inputSecurity" />
                        </div>
                        <div className="securityFormGroup">
                            <Label>Nueva contraseña</Label>
                            <input type="password" placeholder="Ingresa tu nueva contrasena" className="input inputSecurity" />
                        </div>
                        <div className="securityFormGroup">
                            <Label>Confirmar nueva contraseña</Label>
                            <input type="password" placeholder="Confirma tu nueva contrasena" className="input inputSecurity" />
                        </div>
                        <Button
                            type="button"
                            className="btn btn-security"
                            label={
                                "Actualizar contraseña"
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="securityHeader">
                    <CardTitle className="securityHeaderTitle" >Sesiones activas</CardTitle>
                </CardHeader>
                <CardContent className="securityContent">
                    <div className="sessionsList">
                        {[{ device: "MacBook Pro - Chrome", location: "Madrid, Espana", time: "Sesion actual", current: true },
                        { device: "iPhone 15 - Safari", location: "Madrid, Espana", time: "Hace 2 horas", current: false },
                        { device: "iPad Pro - Safari", location: "Madrid, Espana", time: "Hace 1 dia", current: false },].map((session) => (
                            <div key={session.time} className="sessionRecord">
                                <div className="sessionInfo">
                                    <p>{session.device}</p>
                                    <p className="sessionRecordP">{session.location} &middot; {session.time}</p>
                                </div>
                                {
                                    session.current ? (
                                        <Badge className="badgeActive" label={"Actual"} />
                                    ) : (
                                        <Button
                                            type="button"
                                            className="btn btnSecurityLogout"
                                            label={
                                                "Cerrar sesión"
                                            }
                                        />
                                    )
                                }
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default Security;