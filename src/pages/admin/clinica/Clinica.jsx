import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Button from "../../../components/Button.jsx";
import Input from "../../../components/Input.jsx";
import { Label } from "../../../components/Label.jsx";
import "./clinica.css";
import { useVeterinaryByUser } from "../../../queries/veterinaries.queries.js";


const Clinica = () => {

    const { data: veterinary } = useVeterinaryByUser();

    return (
        <div className="clinica">
            <Card className="clinica-info">
                <CardHeader className="clinica-info-header">
                    <CardTitle className="clinica-info-title" >Información de la clínica</CardTitle>
                    <Button
                        type="button"
                        className="btn btn-clinica"
                        label={
                            <>
                                <Icons.Pencil className="icon-header-clinica" />
                                Editar
                            </>
                        }
                    />
                </CardHeader>
                <CardContent className="clinica-info-content">
                    <div className="clinica-info-grid">
                        <div className="clinica-info-item">
                            <Label className="clinica-label">Nombre de la clínica</Label>
                            <Input
                                type="text"
                                value={`${veterinary?.name || ""}`}
                                readOnly
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label">NIF / CIF</Label>
                            <Input
                                type="text"
                                value="B12345678"
                                readOnly
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label" ><Icons.Mail className="icon-header-clinica" />Email</Label>
                            <Input
                                type="text"
                                value={`${veterinary?.email || ""}`}
                                readOnly
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label"><Icons.Phone className="icon-header-clinica" />Teléfono</Label>
                            <Input
                                type="text"
                                value={`${veterinary?.phone || ""}`}
                                readOnly
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label"><Icons.MapPin className="icon-header-clinica" />Dirección</Label>
                            <Input
                                type="text"
                                value={`${veterinary?.address || ""}`}
                                readOnly
                                className="input input-clinica"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="clinica-schedule-header">
                    <CardTitle className="clinica-schedule-title">
                        <Icons.Clock className="sizeIcon5 icon" />
                        Horario de atención
                    </CardTitle>
                </CardHeader>
                <CardContent className="clinica-schedule-content">
                    <div className="clinica-schedule-grid">
                        {[{ day: "Lunes - Viernes", hours: "9:00 - 20:00" }, { day: "Sábados", hours: "10:00 - 14:00" }, { day: "Domingos", hours: "Cerrado" }, { day: "Urgencias 24h", hours: "Disponible" }].map((item) => (
                            <div key={item.day} className="clinica-schedule-item">
                                <span className="clinica-schedule-day" >{item.day}</span>
                                <span className={`${item.hours === "Cerrado" ? "scheduleClose" : item.hours === "Disponible" ? "scheduleOpen" : "scheduelNormal"}`} >{item.hours}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default Clinica;