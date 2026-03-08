import { useState } from "react";
import { Icons } from "../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import Button from "../../components/Button";
import { Avatar, AvatarFallback } from "../../components/Avatar";
import Badge from "../../components/Badget";
import DashboardHeader from "../../components/DashboardHeader";
import "./calendar.css";
import { useAllDataAppointments, useCreateAppointment } from "../../queries/appointments.queries";
import { getInitials, toTitleCase } from "../../utils/stringUtils";
import NewAppointmentGeneral from "../newAppointmentGeneral/NewAppointmentGeneral.jsx";
import { useServices } from "../../queries/services.queries";
import { usePets } from "../../queries/pets.queries";
import toast from "react-hot-toast";


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

const Calendar = () => {

    const { data: events = [] } = useAllDataAppointments();
    const { data: services = [] } = useServices();
    const { data: patients = [] } = usePets();
    const createAppointmentMutation = useCreateAppointment();
    const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
    const [appointmentForm, setAppointmentForm] = useState({});
    const [emptyAppointmentForm, setEmptyAppointmentForm] = useState({})

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
            day === selectedDate
        );
    });

    const eventDates = new Set(
        events
            .filter((e) => {
                const [year, month] = e.appointment_date.split("-").map(Number);
                return year === currentYear && month - 1 === currentMonth;
            })
            .map((e) => {
                const [, , day] = e.appointment_date.split("-").map(Number);
                return day;
            })
    );

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1))
    }
    const handleNextMonth = () => {
        setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1))
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
                                            onClick={() => setSelectedDate(day)}
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
                                <div className="events-list">
                                    {selectedEvents.map((event, index) => (
                                        <div key={index} className="event-item">
                                            <div className="event-info">
                                                <Avatar className="event-avatar">
                                                    <AvatarFallback className="event-avatar-fallback">
                                                        {getInitials(event.pets.owner_id.full_name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="event-details">
                                                    <p className="event-pet">{event.pets.name}</p>
                                                    <p className="event-owner">{event.pets.owner_id.full_name}</p>
                                                </div>
                                            </div>
                                            <div className="event-meta">
                                                <div className="event-time">
                                                    <Icons.Clock className="icon" />
                                                    {event.appointment_time.slice(0, 5)}
                                                </div>
                                                <Badge className={`badge ${event.status}`} label={getStatusLabel(event.status)} />
                                            </div>
                                        </div>
                                    ))}
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
    )
};

export default Calendar;