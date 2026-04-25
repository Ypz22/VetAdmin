import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Button from "../../../components/Button.jsx";
import Input from "../../../components/Input.jsx";
import { Label } from "../../../components/Label.jsx";
import { useUpdateVeterinary, useVeterinaryByUser } from "../../../queries/veterinaries.queries.js";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState.js";
import toast from "react-hot-toast";
import "./clinica.css";

const DEFAULT_SCHEDULE = [
    { day: "Lunes - Viernes", hours: "9:00 - 20:00" },
    { day: "Sábados", hours: "10:00 - 14:00" },
    { day: "Domingos", hours: "Cerrado" },
    { day: "Urgencias 24h", hours: "Disponible" },
];

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    address: "",
    taxId: "",
};

const Clinica = () => {
    const { data: veterinary } = useVeterinaryByUser();
    const updateVeterinaryMutation = useUpdateVeterinary();
    const [isEditing, setIsEditing] = React.useState(false);
    const [form, setForm] = React.useState(EMPTY_FORM);
    const settingsKey = React.useMemo(
        () => `admin_clinic_settings_${veterinary?.id ?? "default"}`,
        [veterinary?.id]
    );
    const [localSettings, setLocalSettings] = useLocalStorageState(settingsKey, {
        taxId: "",
        schedule: DEFAULT_SCHEDULE,
    });

    React.useEffect(() => {
        if (!veterinary) return;

        setForm({
            name: veterinary.name ?? "",
            email: veterinary.email ?? "",
            phone: veterinary.phone ?? "",
            address: veterinary.address ?? "",
            taxId: localSettings.taxId ?? "",
        });
    }, [veterinary, localSettings.taxId]);

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleScheduleChange = (index, hours) => {
        setLocalSettings((prev) => ({
            ...prev,
            schedule: prev.schedule.map((item, itemIndex) =>
                itemIndex === index ? { ...item, hours } : item
            ),
        }));
    };

    const handleSave = () => {
        if (!veterinary?.id) return;

        updateVeterinaryMutation.mutate(
            {
                id: veterinary.id,
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address: form.address.trim(),
            },
            {
                onSuccess: () => {
                    setLocalSettings((prev) => ({
                        ...prev,
                        taxId: form.taxId.trim(),
                    }));
                    setIsEditing(false);
                    toast.success("La información de la clínica fue actualizada.");
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            }
        );
    };

    return (
        <div className="clinica">
            <Card className="clinica-info">
                <CardHeader className="clinica-info-header">
                    <CardTitle className="clinica-info-title">Información de la clínica</CardTitle>
                    <Button
                        type="button"
                        className="btn btn-clinica"
                        label={
                            <>
                                <Icons.Pencil className="icon-header-clinica" />
                                {isEditing ? "Editando" : "Editar"}
                            </>
                        }
                        onClick={() => setIsEditing((prev) => !prev)}
                    />
                </CardHeader>
                <CardContent className="clinica-info-content">
                    <div className="clinica-info-grid">
                        <div className="clinica-info-item">
                            <Label className="clinica-label">Nombre de la clínica</Label>
                            <Input
                                type="text"
                                value={form.name}
                                onChange={(event) => handleChange("name", event.target.value)}
                                readOnly={!isEditing}
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label">NIF / CIF</Label>
                            <Input
                                type="text"
                                value={form.taxId}
                                onChange={(event) => handleChange("taxId", event.target.value)}
                                readOnly={!isEditing}
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label"><Icons.Mail className="icon-header-clinica" />Email</Label>
                            <Input
                                type="text"
                                value={form.email}
                                onChange={(event) => handleChange("email", event.target.value)}
                                readOnly={!isEditing}
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item">
                            <Label className="clinica-label"><Icons.Phone className="icon-header-clinica" />Teléfono</Label>
                            <Input
                                type="text"
                                value={form.phone}
                                onChange={(event) => handleChange("phone", event.target.value)}
                                readOnly={!isEditing}
                                className="input input-clinica"
                            />
                        </div>
                        <div className="clinica-info-item clinica-info-item-full">
                            <Label className="clinica-label"><Icons.MapPin className="icon-header-clinica" />Dirección</Label>
                            <Input
                                type="text"
                                value={form.address}
                                onChange={(event) => handleChange("address", event.target.value)}
                                readOnly={!isEditing}
                                className="input input-clinica"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="clinica-actions">
                            <Button
                                type="button"
                                className="btn btn-outline"
                                label="Cancelar"
                                onClick={() => {
                                    setIsEditing(false);
                                    setForm({
                                        name: veterinary?.name ?? "",
                                        email: veterinary?.email ?? "",
                                        phone: veterinary?.phone ?? "",
                                        address: veterinary?.address ?? "",
                                        taxId: localSettings.taxId ?? "",
                                    });
                                }}
                            />
                            <Button
                                type="button"
                                className="btn btn-clinica-primary"
                                label={updateVeterinaryMutation.isPending ? "Guardando..." : "Guardar cambios"}
                                disabled={updateVeterinaryMutation.isPending}
                                onClick={handleSave}
                            />
                        </div>
                    )}
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
                        {localSettings.schedule.map((item, index) => (
                            <div key={item.day} className="clinica-schedule-item">
                                <span className="clinica-schedule-day">{item.day}</span>
                                {isEditing ? (
                                    <Input
                                        type="text"
                                        value={item.hours}
                                        onChange={(event) => handleScheduleChange(index, event.target.value)}
                                        className="input input-clinica input-clinica-schedule"
                                    />
                                ) : (
                                    <span className={`${item.hours === "Cerrado" ? "scheduleClose" : item.hours === "Disponible" ? "scheduleOpen" : "scheduelNormal"}`}>
                                        {item.hours}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Clinica;
