import Button from "../../components/Button";
import { Icons } from "../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/Card";
import { Avatar, AvatarFallback } from "../../components/Avatar";
import Badge from "../../components/Badget";
import { useMemo, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import "./agenda.css";
import { useAllDataAppointments } from "../../queries/appointments.queries";
import { useServices } from "../../queries/services.queries";
import React from "react";
import NewAppointmentGeneral from "../newAppointmentGeneral/NewAppointmentGeneral.jsx";
import { usePets } from "../../queries/pets.queries";
import PaginationControls from "../../components/PaginationControls.jsx";
import Input from "../../components/Input.jsx";
import { useSearchParams } from "react-router-dom";
import { useDoctors } from "../../hooks/useDoctors.js";
import { getDoctorNameById } from "../../utils/doctors.js";
import { SPECIES_ICONS } from "../../constants/species.js";
import { useAppointmentDialog } from "../../hooks/useAppointmentDialog.js";

const STATUS_LABELS = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
};

const typeColors = {
    vacunacion: "type-vacunacion",
    consulta_general: "type-revision-general",
    revision_general: "type-revision-general",
    cirugia_menor: "type-cirugia-menor",
    cirugia: "type-cirugia",
    desparasitacion: "type-desparasitacion",
    control_postoperatorio: "type-control",
    control: "type-control",
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

function normalizeServiceName(name = "") {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "_");
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
    const [searchParams] = useSearchParams();
    const { data: appointments = [] } = useAllDataAppointments();
    const { data: services = [] } = useServices();
    const { data: patients = [] } = usePets();
    const { doctors } = useDoctors();
    const [appointmentsPage, setAppointmentsPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
    const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "all");
    const [serviceFilter, setServiceFilter] = useState(searchParams.get("service") ?? "all");
    const [doctorFilter, setDoctorFilter] = useState(searchParams.get("doctor") ?? "all");
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

    const weekDates = useMemo(() => {
        const today = new Date();
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

    React.useEffect(() => {
        setSearchTerm(searchParams.get("search") ?? "");
        setStatusFilter(searchParams.get("status") ?? "all");
        setServiceFilter(searchParams.get("service") ?? "all");
        setDoctorFilter(searchParams.get("doctor") ?? "all");

        if (
            searchParams.get("search") ||
            searchParams.get("status") ||
            searchParams.get("service") ||
            searchParams.get("doctor")
        ) {
            setFilterOpen(true);
        }
    }, [searchParams]);

    React.useEffect(() => {
        const appointmentId = searchParams.get("appointmentId");
        if (!appointmentId || appointments.length === 0) return;

        const appointmentIndex = weekDates.findIndex(
            (date) => getDateOnly(date) === appointments.find((item) => item.id === appointmentId)?.appointment_date
        );

        if (appointmentIndex >= 0) {
            setSelectedDay(appointmentIndex);
            setAppointmentsPage(1);
            setExpandedItem(appointmentId);
            setFilterOpen(true);
        }
    }, [appointments, searchParams, weekDates]);

    const appointmentsBySelectedDay = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return appointments
            .filter((app) => app.appointment_date === currentDateKey)
            .filter((app) => {
                const petName = app.pets?.name?.toLowerCase() ?? "";
                const ownerName = app.pets?.owner_id?.full_name?.toLowerCase() ?? "";
                const ownerPhone = app.pets?.owner_id?.phone?.toLowerCase() ?? "";
                const serviceName = app.services?.name?.toLowerCase() ?? "";
                const doctorName = getDoctorNameById(doctors, app.doctor_id).toLowerCase();
                const notes = app.notes?.toLowerCase() ?? "";
                const appointmentId = app.id?.toLowerCase() ?? "";
                const status = app.status?.toLowerCase() ?? "";

                const matchesSearch =
                    normalizedSearch === "" ||
                    petName.includes(normalizedSearch) ||
                    ownerName.includes(normalizedSearch) ||
                    ownerPhone.includes(normalizedSearch) ||
                    serviceName.includes(normalizedSearch) ||
                    doctorName.includes(normalizedSearch) ||
                    notes.includes(normalizedSearch) ||
                    appointmentId.includes(normalizedSearch) ||
                    status.includes(normalizedSearch);

                const matchesStatus = statusFilter === "all" || app.status === statusFilter;
                const matchesService =
                    serviceFilter === "all" ||
                    app.services?.name?.toLowerCase() === serviceFilter.toLowerCase();
                const matchesDoctor =
                    doctorFilter === "all" ||
                    app.doctor_id === doctorFilter;

                return matchesSearch && matchesStatus && matchesService && matchesDoctor;
            })
            .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time));
    }, [appointments, currentDateKey, searchTerm, statusFilter, serviceFilter, doctorFilter, doctors]);

    React.useEffect(() => {
        setAppointmentsPage(1);
        if (!searchParams.get("appointmentId")) {
            setExpandedItem(null);
        }
    }, [searchTerm, statusFilter, serviceFilter, doctorFilter, selectedDay, searchParams]);

    const totalPages = Math.max(1, Math.ceil(appointmentsBySelectedDay.length / itemsPerPage));
    const safePage = Math.min(appointmentsPage, totalPages);
    const visibleAppointmentsBySelectedDay = appointmentsBySelectedDay.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage
    );

    const weekCounts = useMemo(() => {
        return weekDates.map((date) => {
            const dateKey = getDateOnly(date);
            return appointments.filter((app) => app.appointment_date === dateKey).length;
        });
    }, [appointments, weekDates]);

    const totalCount = appointmentsBySelectedDay.length;
    const confirmedCount = appointmentsBySelectedDay.filter((a) => a.status === "confirmed").length;
    const pendingCount = appointmentsBySelectedDay.filter((a) => a.status === "pending").length;
    const activeFiltersCount = [searchTerm.trim() !== "", statusFilter !== "all", serviceFilter !== "all", doctorFilter !== "all"]
        .filter(Boolean)
        .length;

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
                            onClick={() => setFilterOpen((prev) => !prev)}
                            label={
                                <>
                                    <Icons.Filter className="sizeIcon4" />
                                    {activeFiltersCount > 0
                                        ? `Filtrar (${activeFiltersCount})`
                                        : "Filtrar"}
                                    <Icons.ChevronDown className={`icon ${filterOpen ? "iconOpen" : ""}`} />
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

                {filterOpen && (
                    <Card className="agendaFiltersPanel">
                        <CardContent className="agendaFiltersPanelContent">
                            <div className="agendaFilterField agendaFilterFieldSearch">
                                <label htmlFor="agenda-search">Buscar</label>
                                <div className="agendaSearchInputWrapper">
                                    <Icons.Search className="agendaSearchInputIcon" />
                                    <Input
                                        id="agenda-search"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        className="agendaSearchInput"
                                        placeholder="Mascota, propietario, servicio o estado"
                                    />
                                </div>
                            </div>

                            <div className="agendaFilterField">
                                <label htmlFor="agenda-status-filter">Estado</label>
                                <select
                                    id="agenda-status-filter"
                                    className="agendaFilterSelect"
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                >
                                    <option value="all">Todos</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="confirmed">Confirmada</option>
                                    <option value="cancelled">Cancelada</option>
                                </select>
                            </div>

                            <div className="agendaFilterField">
                                <label htmlFor="agenda-service-filter">Servicio</label>
                                <select
                                    id="agenda-service-filter"
                                    className="agendaFilterSelect"
                                    value={serviceFilter}
                                    onChange={(event) => setServiceFilter(event.target.value)}
                                >
                                    <option value="all">Todos</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.name}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="agendaFilterField">
                                <label htmlFor="agenda-doctor-filter">Doctor</label>
                                <select
                                    id="agenda-doctor-filter"
                                    className="agendaFilterSelect"
                                    value={doctorFilter}
                                    onChange={(event) => setDoctorFilter(event.target.value)}
                                >
                                    <option value="all">Todos</option>
                                    {doctors.map((doctor) => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                type="button"
                                className="agendaFilterResetButton btn"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setServiceFilter("all");
                                    setDoctorFilter("all");
                                }}
                                label="Limpiar filtros"
                            />
                        </CardContent>
                    </Card>
                )}

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
                                onClick={() => {
                                    setSelectedDay(idx)
                                    setAppointmentsPage(1)
                                    setExpandedItem(null)
                                }}
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
                                <>
                                    <div className="agendaAppointmentsList">
                                        {visibleAppointmentsBySelectedDay.map((app) => {
                                            const key = app.id;
                                            const isExpanded = expandedItem === key;

                                            const petName = app.pets?.name ?? "Mascota";
                                            const ownerName = app.pets?.owner_id?.full_name ?? "Propietario";
                                            const ownerPhone = app.pets?.owner_id?.phone ?? "Sin teléfono";
                                            const serviceName = app.services?.name ?? "Servicio";
                                            const doctorName = getDoctorNameById(doctors, app.doctor_id);
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
                                                        ${typeColors[normalizeServiceName(serviceName)] || "type-default"}`}
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
                                                                            <Icons.UserRound className="sizeIcon4" />
                                                                            <span>{doctorName}</span>
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
                                    <PaginationControls
                                        currentPage={safePage}
                                        totalItems={appointmentsBySelectedDay.length}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={setAppointmentsPage}
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
        </div>
    );
};

export default Agenda;
