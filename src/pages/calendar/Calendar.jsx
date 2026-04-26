import React, { useState } from "react";
import { Icons } from "../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import Button from "../../components/Button";
import { Avatar, AvatarFallback } from "../../components/Avatar";
import Badge from "../../components/Badget";
import DashboardHeader from "../../components/DashboardHeader";
import "./calendar.css";
import { useAllDataAppointments, useUpdateAppointment } from "../../queries/appointments.queries";
import { getInitials } from "../../utils/stringUtils";
import NewAppointmentGeneral from "../newAppointmentGeneral/NewAppointmentGeneral.jsx";
import { useServices } from "../../queries/services.queries";
import { usePets } from "../../queries/pets.queries";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/Dialog.jsx";
import { friendlyError } from "../../utils/friendlyError.js";
import PaginationControls from "../../components/PaginationControls.jsx";
import { useDoctors } from "../../hooks/useDoctors.js";
import { getDoctorNameById } from "../../utils/doctors.js";
import { SPECIES_ICONS } from "../../constants/species.js";
import { useAppointmentDialog } from "../../hooks/useAppointmentDialog.js";


const DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const STATUS_LABELS = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
};

function getDaysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(month, year) {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
}

function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? status;
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

const Calendar = () => {

    const { data: events = [] } = useAllDataAppointments();
    const { data: services = [] } = useServices();
    const { data: patients = [] } = usePets();
    const { doctors } = useDoctors();
    const updateAppointmentMutation = useUpdateAppointment();
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [eventsPage, setEventsPage] = useState(1);
    const [doctorFilter, setDoctorFilter] = useState("all");
    const itemsPerPage = 5;
    const {
        appointmentForm,
        handleDialogChangeAppointment,
        handleNewAppointmentSubmit,
        newAppointmentOpen,
        setAppointmentForm,
        setNewAppointmentOpen,
    } = useAppointmentDialog({
        resolvePetId: (form) => form.patient_id,
        resolvePatientName: ({ appointment }) => appointment?.pets?.name,
    });

    function handleAppointmentStatusUpdate(status) {
        if (!selectedAppointment) return;

        updateAppointmentMutation.mutate(
            {
                id: selectedAppointment.id,
                status,
            },
            {
                onSuccess: (updatedRows) => {
                    const updatedAppointment = Array.isArray(updatedRows) ? updatedRows[0] : updatedRows;
                    setSelectedAppointment(updatedAppointment ?? { ...selectedAppointment, status });
                    toast.success(
                        status === "cancelled"
                            ? "La cita fue cancelada."
                            : "La cita fue confirmada."
                    );
                },
                onError: (error) => {
                    toast.error(friendlyError(error?.message));
                },
            }
        );
    }
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());

    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

    const selectedEvents = events.filter((e) => {
        const [year, month, day] = e.appointment_date.split("-").map(Number);

        return (
            year === currentYear &&
            month - 1 === currentMonth &&
            day === selectedDate &&
            (doctorFilter === "all" || e.doctor_id === doctorFilter)
        );
    }).sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));

    const totalPages = Math.max(1, Math.ceil(selectedEvents.length / itemsPerPage));
    const safePage = Math.min(eventsPage, totalPages);
    const visibleSelectedEvents = selectedEvents.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage
    );

    const eventDates = new Set(
        events
            .filter((e) => {
                const [year, month] = e.appointment_date.split("-").map(Number);
                return year === currentYear && month - 1 === currentMonth && (doctorFilter === "all" || e.doctor_id === doctorFilter);
            })
            .map((e) => {
                const [, , day] = e.appointment_date.split("-").map(Number);
                return day;
            })
    );

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
        setEventsPage(1)
    }
    const handleNextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
        setEventsPage(1)
    }
    return (
        <div>
            <DashboardHeader />
            <div className="page-content calendar-page">
                <div className="calendar-header">
                    <div className="calendar-header-info">
                        <h1>Calendario</h1>
                        <p>Gestiona las citas y eventos de la clinica</p>
                    </div>
                    <Button
                        className="btn btn-calendar-header"
                        onClick={() => setNewAppointmentOpen(true)}
                        label={
                            <>
                                <Icons.Plus className="sizeIcon4 " />
                                Nueva cita
                            </>
                        }
                    />
                </div>
                <div className="calendar-content">
                    <Card >
                        <CardHeader className="calendar-card-header">
                            <CardTitle className="calendar-card-title">
                                {MONTHS[currentMonth]} {currentYear}
                            </CardTitle>
                            <div className="calendar-nav">
                                <Button
                                    type="button"
                                    className="btn btn-nav"
                                    label={<Icons.ChevronLeft className="sizeIcon4" />}
                                    onClick={handlePrevMonth}
                                />
                                <Button
                                    type="button"
                                    className="btn btn-nav"
                                    label={<Icons.ChevronRight className="sizeIcon4" />}
                                    onClick={handleNextMonth}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="calendar-card-content">

                            <div className="calendar-grid">
                                {DAYS.map((day) => (
                                    <div key={day} className="calendar-grid-date" >{day}</div>
                                ))}
                            </div>
                            <div className="calendar-grid calendar-days">
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={i} className="firstDay" />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1
                                    const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth()
                                    const isSelected = day === selectedDate
                                    const hasEvent = eventDates.has(day)
                                    return (
                                        <Button
                                            key={day}
                                            onClick={() => {
                                                setSelectedDate(day)
                                                setEventsPage(1)
                                            }}
                                            className={`btnDay ${isSelected ? "btnSelected" : isToday ? "btnToday" : "btnOutlineDay"
                                                }`}
                                            label={
                                                <>
                                                    {day}
                                                    {hasEvent && !isSelected && <span className="btnDaySpan"></span>}
                                                </>
                                            }
                                        />
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="events-card-header">
                            <CardTitle className="events-card-title">
                                {selectedDate} de {MONTHS[currentMonth]}
                            </CardTitle>
                            <select
                                className="calendarDoctorFilter"
                                value={doctorFilter}
                                onChange={(event) => {
                                    setDoctorFilter(event.target.value);
                                    setEventsPage(1);
                                }}
                            >
                                <option value="all">Todos los doctores</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.full_name}
                                    </option>
                                ))}
                            </select>
                            <p className="events-count">
                                {selectedEvents.length === 0 ? (
                                    "Sin citas programadas"
                                ) : (
                                    `${selectedEvents.length} cita${selectedEvents.length > 1 ? "s" : ""} programada${selectedEvents.length > 1 ? "s" : ""}`
                                )}
                            </p>
                        </CardHeader>
                        <CardContent className="events-card-content">
                            {selectedEvents.length === 0 ? (
                                <div className="no-events">
                                    <div className="no-events-icon">
                                        <Icons.PawPrint className="sizeIcon5" />
                                    </div>
                                    <p className="no-events-text">
                                        No hay citas para este dia
                                    </p>
                                    <Button
                                        className="btn btn-schedule-event"
                                        label={
                                            <>
                                                <Icons.Plus className="sizeIcon5" />
                                                Agendar cita
                                            </>
                                        }
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="events-list">
                                        {visibleSelectedEvents.map((event) => (
                                            <Button
                                                key={event.id}
                                                type="button"
                                                className="event-item"
                                                onClick={() => setSelectedAppointment(event)}
                                                label={
                                                    <>
                                                        <div className="event-info">
                                                            <Avatar className="event-avatar">
                                                                <AvatarFallback className="event-avatar-fallback">
                                                                    {getInitials(event.pets?.owner_id?.full_name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="event-details">
                                                                <p className="event-pet">{event.pets?.name ?? "Mascota"}</p>
                                                                <p className="event-owner">{event.pets?.owner_id?.full_name ?? "Propietario"}</p>
                                                                <p className="event-owner">{getDoctorNameById(doctors, event.doctor_id)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="event-meta">
                                                            <div className="event-time">
                                                                <Icons.Clock className="icon" />
                                                                {event.appointment_time.slice(0, 5)}
                                                            </div>
                                                            <Badge className={`badge ${event.status}`} label={getStatusLabel(event.status)} />
                                                        </div>
                                                    </>
                                                }
                                            />
                                        ))}
                                    </div>
                                    <PaginationControls
                                        currentPage={safePage}
                                        totalItems={selectedEvents.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setEventsPage}
                                    />
                                </>
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
                speciesIcons={SPECIES_ICONS}
                handleDialogChangeAppointment={handleDialogChangeAppointment}
                handleNewAppointmentSubmit={handleNewAppointmentSubmit}
                services={services}
                patients={patients}
                doctors={doctors}
            />
            <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
                {selectedAppointment && (
                    <DialogContent className="appointmentDetailsDialog">
                        <DialogHeader>
                            <div className="appointmentDetailsHeader">
                                <div className="appointmentDetailsIcon">
                                    <Icons.CalendarCheck className="sizeIcon5" />
                                </div>
                                <div>
                                    <DialogTitle>Detalle de la cita</DialogTitle>
                                    <DialogDescription>
                                        {selectedAppointment.pets?.name ?? "Mascota"} - {getStatusLabel(selectedAppointment.status)}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="appointmentDetailsBody">
                            <div className="appointmentDetailsMain">
                                <Avatar className="appointmentDetailsAvatar">
                                    <AvatarFallback>
                                        {getInitials(selectedAppointment.pets?.owner_id?.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="appointmentDetailsPet">{selectedAppointment.pets?.name ?? "Mascota"}</p>
                                    <p className="appointmentDetailsOwner">{selectedAppointment.pets?.owner_id?.full_name ?? "Propietario"}</p>
                                </div>
                                <Badge className={`badge ${selectedAppointment.status}`} label={getStatusLabel(selectedAppointment.status)} />
                            </div>

                            <div className="appointmentDetailsGrid">
                                <div className="appointmentDetailsItem">
                                    <Icons.Calendar className="sizeIcon4" />
                                    <div>
                                        <span>Fecha</span>
                                        <p>{formatDate(selectedAppointment.appointment_date)}</p>
                                    </div>
                                </div>
                                <div className="appointmentDetailsItem">
                                    <Icons.Clock className="sizeIcon4" />
                                    <div>
                                        <span>Hora</span>
                                        <p>{selectedAppointment.appointment_time?.slice(0, 5) ?? "Sin hora"}</p>
                                    </div>
                                </div>
                                <div className="appointmentDetailsItem">
                                    <Icons.Stethoscope className="sizeIcon4" />
                                    <div>
                                        <span>Servicio</span>
                                        <p>{selectedAppointment.services?.name ?? "Servicio"}</p>
                                    </div>
                                </div>
                                <div className="appointmentDetailsItem">
                                    <Icons.UserRound className="sizeIcon4" />
                                    <div>
                                        <span>Doctor</span>
                                        <p>{getDoctorNameById(doctors, selectedAppointment.doctor_id)}</p>
                                    </div>
                                </div>
                                <div className="appointmentDetailsItem">
                                    <Icons.Timer className="sizeIcon4" />
                                    <div>
                                        <span>Duración</span>
                                        <p>
                                            {selectedAppointment.services?.duration_minutes
                                                ? `${selectedAppointment.services.duration_minutes} min`
                                                : "Sin duración"}
                                        </p>
                                    </div>
                                </div>
                                <div className="appointmentDetailsItem">
                                    <Icons.Phone className="sizeIcon4" />
                                    <div>
                                        <span>Teléfono</span>
                                        <p>{selectedAppointment.pets?.owner_id?.phone ?? "Sin teléfono"}</p>
                                    </div>
                                </div>
                                <div className="appointmentDetailsItem">
                                    <Icons.Mail className="sizeIcon4" />
                                    <div>
                                        <span>Correo</span>
                                        <p>{selectedAppointment.pets?.owner_id?.email ?? "Sin correo"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="appointmentDetailsNotes">
                                <span>Notas</span>
                                <p>{selectedAppointment.notes || "Sin notas registradas."}</p>
                            </div>

                            <div className="appointmentDetailsActions">
                                {selectedAppointment.status !== "confirmed" && (
                                    <Button
                                        type="button"
                                        className="btn appointmentConfirmButton"
                                        onClick={() => handleAppointmentStatusUpdate("confirmed")}
                                        disabled={updateAppointmentMutation.isPending}
                                        label="Confirmar cita"
                                    />
                                )}

                                {selectedAppointment.status !== "cancelled" && (
                                    <Button
                                        type="button"
                                        className="btn appointmentCancelButton"
                                        onClick={() => handleAppointmentStatusUpdate("cancelled")}
                                        disabled={updateAppointmentMutation.isPending}
                                        label="Cancelar cita"
                                    />
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    )
};

export default Calendar;
