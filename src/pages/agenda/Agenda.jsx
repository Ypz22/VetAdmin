import Button from "../../components/Button";
import { Icons } from "../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Avatar, AvatarFallback } from "../../components/Avatar";
import Badge from "../../components/Badget";
import { useMemo, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import "./agenda.css";
import { useAllDataAppointments, useCreateAppointment } from "../../queries/appointments.queries";
import { useServices } from "../../queries/services.queries";
import React from "react";
import NewAppointmentGeneral from "../newAppointment/NewAppointmentGeneral";
import { usePets } from "../../queries/pets.queries";
import toast from "react-hot-toast";
import { toTitleCase } from "../../utils/stringUtils";

const STATUS_LABELS = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
};

const typeColors = {
    Vacunación: "type-vacunacion",
    Vacunacion: "type-vacunacion",
    "Consulta general": "type-revision-general",
    "Revision general": "type-revision-general",
    "Cirugía menor": "type-cirugia-menor",
    "Cirugia menor": "type-cirugia-menor",
    Cirugía: "type-cirugia",
    Cirugia: "type-cirugia",
    Desparasitación: "type-desparasitacion",
    Desparasitacion: "type-desparasitacion",
    "Control postoperatorio": "type-control",
    Control: "type-control",
};

function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? status;
}

function getDateOnly(date) {
    return date.toISOString().split("T")[0];
}

function formatWeekday(date) {
    const weekday = date.toLocaleDateString("es-ES", { weekday: "long" });
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

function formatShortDay(date) {
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
    }).replace(".", "");
}

function formatFullDate(date) {
    const formatted = date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1).replace(".", "");
}

function formatTime(time) {
    return time?.slice(0, 5) || "";
}

function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

const Agenda = () => {
    const { data: appointments = [] } = useAllDataAppointments();
    const { data: services = [] } = useServices();
    const { data: patients = [] } = usePets();
    const createAppointmentMutation = useCreateAppointment();
    const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
    const [appointmentForm, setAppointmentForm] = React.useState({});
    const [emptyAppointmentForm, setEmptyAppointmentForm] = React.useState({})

    const handleDialogChangeAppointment = (open) => {
        setNewAppointmentOpen(open);
        if (!open) {
            setAppointmentForm({});
        }
    };

    function handleNewAppointmentSubmit() {
        createAppointmentMutation.mutate({
            appointment_date: appointmentForm.date,
            appointment_time: appointmentForm.time,
            status: appointmentForm.status,
            pet_id: appointmentForm.patient_id,
            service_id: appointmentForm.services,
            notes: appointmentForm.notes,
        })
        toast.success(`Cita para ${toTitleCase(appointmentForm.vet)} programada exitosamente`)
        setAppointmentForm(emptyAppointmentForm)
        setNewAppointmentOpen(false)
    }

    const speciesIcons = {
        perro: "Dog",
        gato: "Cat",
        ave: "Bird",
        conejo: "Rabbit",
    }

    const today = new Date();

    const weekDates = useMemo(() => {
        return [-2, -1, 0, 1, 2].map((offset) => {
            const d = new Date(today);
            d.setHours(0, 0, 0, 0);
            d.setDate(today.getDate() + offset);
            return d;
        });
    }, []);

    const [selectedDay, setSelectedDay] = useState(2);
    const [expandedItem, setExpandedItem] = useState(null);

    const currentDate = weekDates[selectedDay];
    const currentDateKey = getDateOnly(currentDate);

    const appointmentsBySelectedDay = useMemo(() => {
        return appointments
            .filter((app) => app.appointment_date === currentDateKey)
            .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
    }, [appointments, currentDateKey]);

    const weekCounts = useMemo(() => {
        return weekDates.map((date) => {
            const dateKey = getDateOnly(date);
            return appointments.filter((app) => app.appointment_date === dateKey).length;
        });
    }, [appointments, weekDates]);

    const totalCount = appointmentsBySelectedDay.length;
    const confirmedCount = appointmentsBySelectedDay.filter((a) => a.status === "confirmed").length;
    const pendingCount = appointmentsBySelectedDay.filter((a) => a.status === "pending").length;

    return (
        <div>
            <DashboardHeader />
            <div className="agenda page-content">
                <div className="agendaHeader">
                    <div className="agendaHeaderTitle">
                        <h1>Agenda</h1>
                        <p>Vista semanal de todas las citas programadas</p>
                    </div>

                    <div className="agendaHeaderButtons">
                        <Button
                            type="button"
                            className="agendaFilterButton btn"
                            label={
                                <>
                                    <Icons.Filter className="sizeIcon4" />
                                    Filtrar
                                    <Icons.ChevronDown className="icon" />
                                </>
                            }
                        />
                        <Button
                            type="button"
                            className="agendaNewAppointmentButton btn"
                            onClick={() => setNewAppointmentOpen(true)}
                            label={
                                <>
                                    <Icons.Plus className="sizeIcon4" />
                                    Nueva cita
                                </>
                            }
                        />
                    </div>
                </div>

                <div className="agendaWeekdays">
                    {weekDates.map((date, idx) => {
                        const count = weekCounts[idx];
                        const isSelected = idx === selectedDay;
                        const isToday = idx === 2;

                        return (
                            <Button
                                key={getDateOnly(date)}
                                type="button"
                                className={`btnAgendaWeekdays ${isSelected ? "btnSelected" : "btnDisable"}`}
                                label={
                                    <>
                                        <span className="btnAgendaDay">{formatWeekday(date)}</span>
                                        <span
                                            className={`btnAgendaDate ${isSelected ? "btnAgendaDateSelected" : "btnAgendaDateDisable"
                                                }`}
                                        >
                                            {formatShortDay(date)}
                                        </span>

                                        {isToday && !isSelected && <span className="today" />}

                                        {count > 0 && (
                                            <span className="btnAgendaCount">
                                                {count} cita{count > 1 ? "s" : ""}
                                            </span>
                                        )}
                                    </>
                                }
                                onClick={() => setSelectedDay(idx)}
                            />
                        );
                    })}
                </div>

                <div className="agendaContent">
                    <div className="agendaStatsCards">
                        <Card className="agendaStatsCard">
                            <CardContent className="agendaStatsCardContent">
                                <p className="total">Total citas</p>
                                <p className="countTotal">{totalCount}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="agendaStatsCardContent">
                                <p className="total">Confirmadas</p>
                                <p className="countComplete">{confirmedCount}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="agendaStatsCardContent">
                                <p className="total">Pendientes</p>
                                <p className="countPending">{pendingCount}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="agendaAppointmentsCard">
                        <CardHeader className="agendaAppointmentsCardHeader">
                            <CardTitle className="agendaAppointmentsCardTitle">
                                {formatFullDate(currentDate)}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="agendaAppointmentsCardContent">
                            {appointmentsBySelectedDay.length === 0 ? (
                                <div className="agendaNoAppointments">
                                    <div className="agendaNoAppointmentsIcon">
                                        <Icons.Stethoscope className="sizeIcon6" />
                                    </div>
                                    <p>No hay citas para este día</p>
                                </div>
                            ) : (
                                <div className="agendaAppointmentsList">
                                    {appointmentsBySelectedDay.map((app) => {
                                        const key = app.id;
                                        const isExpanded = expandedItem === key;

                                        const petName = app.pets?.name ?? "Mascota";
                                        const ownerName = app.pets?.owner_id?.full_name ?? "Propietario";
                                        const ownerPhone = app.pets?.owner_id?.phone ?? "Sin teléfono";
                                        const serviceName = app.services?.name ?? "Servicio";
                                        const duration = app.services?.duration_minutes
                                            ? `${app.services.duration_minutes} min`
                                            : "Sin duración";

                                        return (
                                            <Button
                                                key={key}
                                                type="button"
                                                onClick={() => setExpandedItem(isExpanded ? null : key)}
                                                className={`btnAgendaAppointment
                                                    ${isExpanded ? "agendaAppointmentExpanded" : "agendaAppointmentCollapsed"}
                                                    ${typeColors[serviceName] || "type-default"}`}
                                                label={
                                                    <>
                                                        <div className="agendaAppointmentMain">
                                                            <div className="agendaAppointmentTime">
                                                                <span className="time">{formatTime(app.appointment_time)}</span>
                                                                <span className="duration">{duration}</span>
                                                            </div>

                                                            <Avatar className="agendaAppointmentAvatar">
                                                                <AvatarFallback>
                                                                    {getInitials(ownerName)}
                                                                </AvatarFallback>
                                                            </Avatar>

                                                            <div className="agendaAppointmentPetOwner">
                                                                <p className="pet">{petName}</p>
                                                                <p className="owner">{ownerName}</p>
                                                            </div>

                                                            <div className="agendaAppointmentRoom">
                                                                <Icons.MapPin className="icon" />
                                                                Sala
                                                            </div>

                                                            <Badge
                                                                className={`agendaAppointmentTypeBadge ${app.status}`}
                                                                label={getStatusLabel(app.status)}
                                                            />
                                                        </div>

                                                        {isExpanded && (
                                                            <div className="agendaAppointmentDetails">
                                                                <div className="agendaAppointmentDetailsRow">
                                                                    <div className="agendaAppointmentDetailsType">
                                                                        <Icons.Stethoscope className="sizeIcon4" />
                                                                        <span>{serviceName}</span>
                                                                    </div>

                                                                    <div className="agendaAppointmentDetailsType">
                                                                        <Icons.Phone className="sizeIcon4" />
                                                                        <span>{ownerPhone}</span>
                                                                    </div>

                                                                    <div className="agendaAppointmentDetailsType">
                                                                        <Icons.Clock className="sizeIcon4" />
                                                                        <span>Duración: {duration}</span>
                                                                    </div>
                                                                </div>

                                                                {app.notes && (
                                                                    <p className="agendaAppointmentNotes">
                                                                        Notas: {app.notes}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <NewAppointmentGeneral
                newAppointmentOpen={newAppointmentOpen}
                setNewAppointmentOpen={setNewAppointmentOpen}
                appointmentForm={appointmentForm}
                setAppointmentForm={setAppointmentForm}
                speciesIcons={speciesIcons}
                handleDialogChangeAppointment={handleDialogChangeAppointment}
                handleNewAppointmentSubmit={handleNewAppointmentSubmit}
                services={services}
                patients={patients}
            />
        </div>
    );
};

export default Agenda;