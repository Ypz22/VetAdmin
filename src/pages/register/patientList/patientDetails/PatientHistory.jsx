import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../../components/Dialog.jsx";
import { Icons } from "../../../../components/Named-lucide.jsx";
import Badge from "../../../../components/Badget.jsx";
import { useAllDataAppointments } from "../../../../queries/appointments.queries.js";
import Input from "../../../../components/Input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/Select.jsx";
import PaginationControls from "../../../../components/PaginationControls.jsx";

const STATUS_LABELS = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
};

function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? status;
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

const PatientHistory = ({ selectedPatient, historyOpen, setHistoryOpen }) => {
    const { data: appointments = [] } = useAllDataAppointments();
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [dateFrom, setDateFrom] = React.useState("");
    const [dateTo, setDateTo] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const patientAppointments = React.useMemo(() => {
        if (!selectedPatient) return [];

        return appointments
            .filter((appointment) => appointment.pet_id === selectedPatient.id)
            .sort((a, b) => {
                const first = `${b.appointment_date}T${b.appointment_time ?? "00:00:00"}`;
                const second = `${a.appointment_date}T${a.appointment_time ?? "00:00:00"}`;
                return new Date(first) - new Date(second);
            });
    }, [appointments, selectedPatient]);

    const filteredAppointments = React.useMemo(() => {
        return patientAppointments.filter((appointment) => {
            const matchesStatus =
                statusFilter === "all" || appointment.status === statusFilter;
            const matchesFrom = !dateFrom || appointment.appointment_date >= dateFrom;
            const matchesTo = !dateTo || appointment.appointment_date <= dateTo;

            return matchesStatus && matchesFrom && matchesTo;
        });
    }, [patientAppointments, statusFilter, dateFrom, dateTo]);

    React.useEffect(() => {
        if (!historyOpen) {
            setStatusFilter("all");
            setDateFrom("");
            setDateTo("");
            setCurrentPage(1);
        }
    }, [historyOpen]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, dateFrom, dateTo, selectedPatient]);

    const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedAppointments = filteredAppointments.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage
    );

    return (
        <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
            <DialogContent className="patientHistoryDialogContent">
                <DialogHeader>
                    <div className="patientHistoryHeader">
                        <div className="patientHistoryHeaderIcon">
                            <Icons.NotebookText className="sizeIcon5" />
                        </div>
                        <div className="patientHistoryHeaderText">
                            <DialogTitle className="patientHistoryDialogTitle">
                                Historial completo
                            </DialogTitle>
                            <DialogDescription>
                                {selectedPatient?.name ?? "Paciente"} - {patientAppointments.length} cita{patientAppointments.length === 1 ? "" : "s"} registrada{patientAppointments.length === 1 ? "" : "s"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {patientAppointments.length === 0 ? (
                    <div className="patientHistoryEmptyState">
                        <div className="patientHistoryEmptyIcon">
                            <Icons.Stethoscope className="sizeIcon5" />
                        </div>
                        <p className="patientHistoryEmptyTitle">No hay historial disponible</p>
                        <p className="patientHistoryEmptyText">
                            Este paciente todavia no tiene citas registradas.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="patientHistoryFilters">
                            <div className="patientHistoryFilterItem">
                                <span className="patientHistoryFilterLabel">Estado</span>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="patientHistorySelectTrigger">
                                        <SelectValue placeholder="Todos los estados" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="confirmed">Confirmadas</SelectItem>
                                        <SelectItem value="cancelled">Canceladas</SelectItem>
                                        <SelectItem value="pending">Pendientes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="patientHistoryFilterItem">
                                <span className="patientHistoryFilterLabel">Desde</span>
                                <Input
                                    type="date"
                                    className="patientHistoryDateInput"
                                    value={dateFrom}
                                    max={dateTo || undefined}
                                    onChange={(event) => setDateFrom(event.target.value)}
                                />
                            </div>

                            <div className="patientHistoryFilterItem">
                                <span className="patientHistoryFilterLabel">Hasta</span>
                                <Input
                                    type="date"
                                    className="patientHistoryDateInput"
                                    value={dateTo}
                                    min={dateFrom || undefined}
                                    onChange={(event) => setDateTo(event.target.value)}
                                />
                            </div>
                        </div>

                        {filteredAppointments.length === 0 ? (
                            <div className="patientHistoryEmptyState patientHistoryFilteredEmptyState">
                                <div className="patientHistoryEmptyIcon">
                                    <Icons.SearchX className="sizeIcon5" />
                                </div>
                                <p className="patientHistoryEmptyTitle">No hay resultados</p>
                                <p className="patientHistoryEmptyText">
                                    No existen citas que coincidan con los filtros seleccionados.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="patientHistoryList">
                                    {paginatedAppointments.map((appointment) => (
                                        <div key={appointment.id} className="patientHistoryCard">
                                            <div className="patientHistoryCardTop">
                                                <div>
                                                    <p className="patientHistoryService">
                                                        {appointment.services?.name ?? "Servicio"}
                                                    </p>
                                                    <p className="patientHistoryDate">
                                                        {formatDate(appointment.appointment_date)} - {appointment.appointment_time?.slice(0, 5) ?? "Sin hora"}
                                                    </p>
                                                </div>
                                                <Badge
                                                    className={`badge ${appointment.status}`}
                                                    label={getStatusLabel(appointment.status)}
                                                />
                                            </div>

                                            <div className="patientHistoryMeta">
                                                <div className="patientHistoryMetaItem">
                                                    <Icons.Clock3 className="sizeIcon4" />
                                                    <span>
                                                        {appointment.services?.duration_minutes
                                                            ? `${appointment.services.duration_minutes} min`
                                                            : "Duracion no definida"}
                                                    </span>
                                                </div>
                                                <div className="patientHistoryMetaItem">
                                                    <Icons.UserRound className="sizeIcon4" />
                                                    <span>{appointment.pets?.owner_id?.full_name ?? "Propietario"}</span>
                                                </div>
                                            </div>

                                            <div className="patientHistoryNotes">
                                                <span>Notas</span>
                                                <p>{appointment.notes || "Sin notas registradas."}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <PaginationControls
                                    currentPage={safePage}
                                    totalItems={filteredAppointments.length}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PatientHistory;
