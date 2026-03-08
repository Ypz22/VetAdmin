import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/Dialog.jsx";
import { Icons } from "../../../components/Named-lucide.jsx";
import { toCapitalizeCase } from "../../../utils/stringUtils.js";
import Badge from "../../../components/Badget.jsx";
import { Label } from "../../../components/Label.jsx";
import Input from "../../../components/Input.jsx";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
    SelectItem,
} from "../../../components/Select.jsx";
import { Textarea } from "../../../components/Textarea.jsx";
import Button from "../../../components/Button.jsx";
import { getSpeciesColor } from "../../../utils/randomColor.js";
import "./newAppointment.css";


const NewAppointment = ({
    newAppointmentOpen,
    setNewAppointmentOpen,
    selectedPatient,
    appointmentForm,
    setAppointmentForm,
    speciesIcons,
    handleDialogChangeAppointment,
    handleNewAppointmentSubmit,
    services,
}) => {

    const color = getSpeciesColor(selectedPatient?.species.toLowerCase() || "");
    const species = selectedPatient?.species.toLowerCase() || "";
    const iconKey = speciesIcons?.[species] || "PawPrint";
    const Icon = Icons?.[iconKey] || Icons.PawPrint;

    return (
        <Dialog
            className="newAppointmentDialog"
            open={newAppointmentOpen}
            onOpenChange={handleDialogChangeAppointment}
        >
            <DialogContent className="newPatientDialogContent">
                <DialogHeader >
                    <div className="newPatientDialogHeader">
                        <div className="newPatientIconContainer">
                            <Icons.CalendarPlus className="newPatientIcon" />
                        </div>
                        <div className="newPatientHeaderText">
                            <DialogTitle className="newPatientHeaderDialogtitle">
                                Agendar cita
                            </DialogTitle>

                            <DialogDescription className="newAppointmentDialogDescription">
                                Programar una cita para {toCapitalizeCase(
                                    selectedPatient?.name
                                )} ({toCapitalizeCase(selectedPatient?.owner_id.full_name)})
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {selectedPatient && (
                    <div className="newAppointmentBody">
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
                                    {selectedPatient.owner_id.full_name}
                                </p>
                            </div>

                            <div className="newAppointmentPatientStatus">
                                <Badge
                                    variant="badge-outline"
                                    className={`patientDetailsBadge status-${selectedPatient.status.toLowerCase() === "en tratamiento"
                                        ? "en-tratamiento"
                                        : selectedPatient.status.toLowerCase()
                                        }`}
                                    label={toCapitalizeCase(selectedPatient.status)}
                                />
                            </div>
                        </div>

                        <div className="newAppointmentForm">
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
                                        className="newAppointmentSelect"
                                        value={appointmentForm.time ?? ""}
                                        onValueChange={(value) =>
                                            setAppointmentForm({ ...appointmentForm, time: value })
                                        }
                                    >
                                        <SelectTrigger className="newAppointmentSelectTrigger">
                                            <SelectValue
                                                className="newAppointmentSelectValue"
                                                placeholder="Selecciona una hora"
                                            />
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
                                                    className="newAppointmentSelectItem"
                                                    key={time}
                                                    value={time}
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
                                        Tipo de consulta{" "}
                                        <span className="newAppointmentRequired">*</span>
                                    </Label>

                                    <Select
                                        className="newAppointmentSelect"
                                        value={appointmentForm.services ?? ""}
                                        onValueChange={(value) =>
                                            setAppointmentForm({ ...appointmentForm, services: value })
                                        }
                                    >
                                        <SelectTrigger className="newAppointmentSelectTrigger">
                                            <SelectValue
                                                className="newAppointmentSelectValue"
                                                placeholder="Selecciona tipo"
                                            />
                                        </SelectTrigger>

                                        <SelectContent className="newAppointmentSelectContent">
                                            {services.map((service) => (
                                                <SelectItem className="newAppointmentSelectItem" value={service.id} key={service.id}>
                                                    {service.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="newAppointmentField">
                                    <Label className="newAppointmentLabel">
                                        Estado general{" "}
                                        <span className="newAppointmentRequired">*</span>
                                    </Label>

                                    <Select
                                        className="newAppointmentSelect"
                                        value={appointmentForm.status ?? ""}
                                        onValueChange={(value) =>
                                            setAppointmentForm({ ...appointmentForm, status: value })
                                        }
                                    >
                                        <SelectTrigger className="newAppointmentSelectTrigger">
                                            <SelectValue
                                                className="newAppointmentSelectValue"
                                                placeholder="Estado general"
                                            />
                                        </SelectTrigger>

                                        <SelectContent className="newAppointmentSelectContent">
                                            <SelectItem className="newAppointmentSelectItem" value="confirmed">
                                                Confirmada
                                            </SelectItem>
                                            <SelectItem className="newAppointmentSelectItem" value="pending">
                                                Pendiente
                                            </SelectItem>
                                            <SelectItem className="newAppointmentSelectItem" value="cancelled">
                                                Cancelada
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="newAppointmentField">
                                    <Label className="newAppointmentLabel">Veterinario</Label>

                                    <Select
                                        className="newAppointmentSelect"
                                        value={appointmentForm.vet ?? ""}
                                        onValueChange={(value) =>
                                            setAppointmentForm({ ...appointmentForm, vet: value })
                                        }
                                    >
                                        <SelectTrigger className="newAppointmentSelectTrigger newAppointmentVetTrigger">
                                            <SelectValue
                                                className="newAppointmentSelectValue"
                                                placeholder="Seleccionar veterinario"
                                            />
                                        </SelectTrigger>

                                        <SelectContent className="newAppointmentSelectContent">
                                            <SelectItem className="newAppointmentSelectItem" value="dra-garcia">
                                                Dra. Garcia
                                            </SelectItem>
                                            <SelectItem className="newAppointmentSelectItem" value="dr-martinez">
                                                Dr. Martinez
                                            </SelectItem>
                                            <SelectItem className="newAppointmentSelectItem" value="dra-fernandez">
                                                Dra. Fernandez
                                            </SelectItem>
                                            <SelectItem className="newAppointmentSelectItem" value="dr-lopez">
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
                )}
            </DialogContent>
        </Dialog>
    );
};

export default NewAppointment;