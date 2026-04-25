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
import { useAllDataAppointments } from "../../../queries/appointments.queries.js";
import { APPOINTMENT_TIME_SLOTS, getAvailableAppointmentSlots } from "../../../utils/appointmentSlots.js";
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
    const { data: appointments = [] } = useAllDataAppointments();

    const availableTimeSlots = React.useMemo(
        () => getAvailableAppointmentSlots(appointments, appointmentForm.date),
        [appointments, appointmentForm.date]
    );

    React.useEffect(() => {
        if (appointmentForm.time && !availableTimeSlots.includes(appointmentForm.time)) {
            setAppointmentForm((prev) => ({ ...prev, time: "" }));
        }
    }, [appointmentForm.time, availableTimeSlots, setAppointmentForm]);

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
                                            {(appointmentForm.date ? availableTimeSlots : APPOINTMENT_TIME_SLOTS).map((time) => (
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
                                    {appointmentForm.date && availableTimeSlots.length === 0 && (
                                        <span className="newAppointmentHelperText">
                                            No hay horarios disponibles para esa fecha.
                                        </span>
                                    )}
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
                                    <Label className="newAppointmentLabel">Estado inicial</Label>
                                    <div className="newAppointmentStaticValue">
                                        <Badge className="badge pending" label="Pendiente" />
                                        <span>El propietario recibira un correo para confirmar la cita.</span>
                                    </div>
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
                                        !appointmentForm.services?.trim()

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
