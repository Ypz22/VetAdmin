import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/Dialog.jsx";
import { Icons } from "../../components/Named-lucide.jsx";
import { toCapitalizeCase } from "../../utils/stringUtils.js";
import Badge from "../../components/Badget";
import { Label } from "../../components/Label";
import Input from "../../components/Input";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "../../components/Select";
import { Textarea } from "../../components/Textarea.jsx";
import Button from "../../components/Button";
import { getSpeciesColor } from "../../utils/randomColor";
import "./newAppointmentGeneral.css";

const NewAppointmentGeneral = ({
    newAppointmentOpen,
    setNewAppointmentOpen,
    appointmentForm,
    setAppointmentForm,
    speciesIcons,
    handleDialogChangeAppointment,
    handleNewAppointmentSubmit,
    services,
    patients = [],
}) => {
    const selectedPatient = patients.find(
        (patient) => patient.id === appointmentForm.patient_id
    );

    const color = getSpeciesColor(selectedPatient?.species?.toLowerCase() || "");
    const species = selectedPatient?.species?.toLowerCase() || "";
    const iconKey = speciesIcons?.[species] || "PawPrint";
    const Icon = Icons?.[iconKey] || Icons.PawPrint;

    return (
        <Dialog
            className="newAppointmentDialog"
            open={newAppointmentOpen}
            onOpenChange={handleDialogChangeAppointment}
        >
            <DialogContent className="newPatientDialogContent">
                <DialogHeader>
                    <div className="newPatientDialogHeader">
                        <div className="newPatientIconContainer">
                            <Icons.CalendarPlus className="newPatientIcon" />
                        </div>
                        <div className="newPatientHeaderText">
                            <DialogTitle className="newPatientHeaderDialogtitle">
                                Agendar cita
                            </DialogTitle>

                            <DialogDescription className="newAppointmentDialogDescription">
                                Selecciona un paciente y completa los datos de la cita.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="newAppointmentBody">
                    <div className="newAppointmentForm">
                        <div className="newAppointmentField">
                            <Label className="newAppointmentLabel">
                                Paciente <span className="newAppointmentRequired">*</span>
                            </Label>

                            <Select
                                value={appointmentForm.patient_id ?? ""}
                                onValueChange={(value) =>
                                    setAppointmentForm({
                                        ...appointmentForm,
                                        patient_id: value,
                                    })
                                }
                            >
                                <SelectTrigger className="newAppointmentSelectTrigger">
                                    <SelectValue placeholder="Selecciona un paciente" />
                                </SelectTrigger>

                                <SelectContent className="newAppointmentSelectContent">
                                    {patients.map((patient) => (
                                        <SelectItem
                                            key={patient.id}
                                            value={patient.id}
                                            className="newAppointmentSelectItem"
                                        >
                                            {patient.name} - {patient.owner_id?.full_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedPatient && (
                            <div className="newAppointmentPatientSummary">
                                <div
                                    className="newAppointmentPatientIconWrap"
                                    style={{ backgroundColor: color.bg, color: color.text }}
                                >
                                    <Icon className="sizeIcon4" />
                                </div>

                                <div className="newAppointmentPatientInfo">
                                    <p className="newAppointmentPatientName">
                                        {selectedPatient.name}
                                    </p>
                                    <p className="newAppointmentPatientMeta">
                                        {selectedPatient.breed} &middot;{" "}
                                        {selectedPatient.owner_id?.full_name}
                                    </p>
                                </div>

                                <div className="newAppointmentPatientStatus">
                                    <Badge
                                        variant="badge-outline"
                                        className={`patientDetailsBadge status-${selectedPatient.status?.toLowerCase() === "en tratamiento"
                                            ? "en-tratamiento"
                                            : selectedPatient.status?.toLowerCase()
                                            }`}
                                        label={toCapitalizeCase(selectedPatient.status)}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="newAppointmentRow">
                            <div className="newAppointmentField">
                                <Label htmlFor="appointDate" className="newAppointmentLabel">
                                    Fecha <span className="newAppointmentRequired">*</span>
                                </Label>
                                <Input
                                    className="newAppointmentInput"
                                    id="appointDate"
                                    type="date"
                                    value={appointmentForm.date ?? ""}
                                    onChange={(e) =>
                                        setAppointmentForm({
                                            ...appointmentForm,
                                            date: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="newAppointmentField">
                                <Label className="newAppointmentLabel">
                                    Hora <span className="newAppointmentRequired">*</span>
                                </Label>
                                <Select
                                    value={appointmentForm.time ?? ""}
                                    onValueChange={(value) =>
                                        setAppointmentForm({
                                            ...appointmentForm,
                                            time: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="newAppointmentSelectTrigger">
                                        <SelectValue placeholder="Selecciona una hora" />
                                    </SelectTrigger>

                                    <SelectContent className="newAppointmentSelectContent">
                                        {[
                                            "08:00",
                                            "08:30",
                                            "09:00",
                                            "09:30",
                                            "10:00",
                                            "10:30",
                                            "11:00",
                                            "11:30",
                                            "12:00",
                                            "12:30",
                                            "13:00",
                                            "13:30",
                                            "14:00",
                                            "14:30",
                                            "15:00",
                                            "15:30",
                                            "16:00",
                                            "16:30",
                                            "17:00",
                                        ].map((time) => (
                                            <SelectItem
                                                key={time}
                                                value={time}
                                                className="newAppointmentSelectItem"
                                            >
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="newAppointmentColumn">
                            <div className="newAppointmentField">
                                <Label className="newAppointmentLabel">
                                    Tipo de consulta <span className="newAppointmentRequired">*</span>
                                </Label>

                                <Select
                                    value={appointmentForm.services ?? ""}
                                    onValueChange={(value) =>
                                        setAppointmentForm({
                                            ...appointmentForm,
                                            services: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="newAppointmentSelectTrigger">
                                        <SelectValue placeholder="Selecciona tipo" />
                                    </SelectTrigger>

                                    <SelectContent className="newAppointmentSelectContent">
                                        {services.map((service) => (
                                            <SelectItem
                                                key={service.id}
                                                value={service.id}
                                                className="newAppointmentSelectItem"
                                            >
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="newAppointmentField">
                                <Label className="newAppointmentLabel">
                                    Estado general <span className="newAppointmentRequired">*</span>
                                </Label>

                                <Select
                                    value={appointmentForm.status ?? ""}
                                    onValueChange={(value) =>
                                        setAppointmentForm({
                                            ...appointmentForm,
                                            status: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="newAppointmentSelectTrigger">
                                        <SelectValue placeholder="Estado general" />
                                    </SelectTrigger>

                                    <SelectContent className="newAppointmentSelectContent">
                                        <SelectItem value="confirmed" className="newAppointmentSelectItem">
                                            Confirmada
                                        </SelectItem>
                                        <SelectItem value="pending" className="newAppointmentSelectItem">
                                            Pendiente
                                        </SelectItem>
                                        <SelectItem value="cancelled" className="newAppointmentSelectItem">
                                            Cancelada
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="newAppointmentField">
                                <Label className="newAppointmentLabel">Veterinario</Label>

                                <Select
                                    value={appointmentForm.vet ?? ""}
                                    onValueChange={(value) =>
                                        setAppointmentForm({
                                            ...appointmentForm,
                                            vet: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="newAppointmentSelectTrigger newAppointmentVetTrigger">
                                        <SelectValue placeholder="Seleccionar veterinario" />
                                    </SelectTrigger>

                                    <SelectContent className="newAppointmentSelectContent">
                                        <SelectItem value="dra-garcia" className="newAppointmentSelectItem">
                                            Dra. Garcia
                                        </SelectItem>
                                        <SelectItem value="dr-martinez" className="newAppointmentSelectItem">
                                            Dr. Martinez
                                        </SelectItem>
                                        <SelectItem value="dra-fernandez" className="newAppointmentSelectItem">
                                            Dra. Fernandez
                                        </SelectItem>
                                        <SelectItem value="dr-lopez" className="newAppointmentSelectItem">
                                            Dr. Lopez
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="newAppointmentField newAppointmentFieldFull">
                                <Label className="newAppointmentLabel">
                                    Motivo / Observaciones
                                </Label>

                                <Textarea
                                    className="newPatientTextarea"
                                    id="appointNotes"
                                    placeholder="Describe brevemente el motivo de la cita..."
                                    rows={3}
                                    value={appointmentForm.notes ?? ""}
                                    onChange={(e) =>
                                        setAppointmentForm({
                                            ...appointmentForm,
                                            notes: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <DialogFooter className="newAppointmentDialogFooter">
                            <Button
                                type="button"
                                className="btn buttonCancel"
                                label="Cancelar"
                                onClick={() => {
                                    setNewAppointmentOpen(false);
                                    setAppointmentForm({});
                                }}
                            />

                            <Button
                                className="btn buttonSave"
                                onClick={handleNewAppointmentSubmit}
                                disabled={
                                    !appointmentForm.patient_id?.trim() ||
                                    !appointmentForm.date?.trim() ||
                                    !appointmentForm.time?.trim() ||
                                    !appointmentForm.services?.trim() ||
                                    !appointmentForm.status?.trim()
                                }
                                label={
                                    <>
                                        <Icons.Check className="newPatientCheckIcon" />
                                        Confirmar cita
                                    </>
                                }
                            />
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NewAppointmentGeneral;