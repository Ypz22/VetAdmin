import { useState } from "react";
import { Icons } from "../../../components/Named-lucide.jsx";
import { Avatar, AvatarFallback } from "../../../components/Avatar.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card.jsx";
import Button from "../../../components/Button.jsx";
import Badge from "../../../components/Badget.jsx";
import { useAllDataAppointments } from "../../../queries/appointments.queries.js";
import { getInitials } from "../../../utils/stringUtils.js";
import PaginationControls from "../../../components/PaginationControls.jsx";

const STATUS_LABELS = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
};

function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? status;
}

const AppointmentsTable = () => {
    const { data: appointments = [] } = useAllDataAppointments();
    const [todayPage, setTodayPage] = useState(1);
    const [upcomingPage, setUpcomingPage] = useState(1);
    const itemsPerPage = 5;

    const today = new Date().toLocaleDateString("en-CA");

    const todayAppointments = appointments.filter(
        (a) => a.appointment_date === today
    );

    const upcomingAppointments = appointments.filter(
        (a) => a.appointment_date > today
    );

    const totalTodayPages = Math.max(1, Math.ceil(todayAppointments.length / itemsPerPage));
    const safeTodayPage = Math.min(todayPage, totalTodayPages);

    const totalUpcomingPages = Math.max(1, Math.ceil(upcomingAppointments.length / itemsPerPage));
    const safeUpcomingPage = Math.min(upcomingPage, totalUpcomingPages);

    const paginatedTodayAppointments = todayAppointments.slice(
        (safeTodayPage - 1) * itemsPerPage,
        safeTodayPage * itemsPerPage
    );

    const paginatedUpcomingAppointments = upcomingAppointments.slice(
        (safeUpcomingPage - 1) * itemsPerPage,
        safeUpcomingPage * itemsPerPage
    );

    return (
        <>
            <Card className="appointmentsTable">
                <CardHeader className="appointmentsTableHeader">
                    <CardTitle className="appointmentsTableHeaderTitle">Citas de hoy</CardTitle>
                    <Button
                        type="button"
                        className="buttonViewAllAppointments"
                        label={
                            <>
                                <Icons.MoreHorizontal className="viewAllAppointmentsIcon" />
                            </>
                        }
                    />
                </CardHeader>

                {todayAppointments.length === 0 ? (
                    <CardContent className="patientDetailsEmptyState">
                        <div className="patientDetailsEmptyStateIcon">
                            <Icons.PawPrint className="sizeIcon6" />
                        </div>
                        <p className="patientDetailsEmptyStateP">No hay citas para hoy</p>
                        <p className="patientDetailsEmptyStateSubP">
                            Cuando agendes una cita, aparecerá aquí
                        </p>
                    </CardContent>
                ) : (
                    <CardContent className="appointmentsTableContent">
                        <div className="appointmentsTableBody">
                            {paginatedTodayAppointments.map((appointment) => (
                                <div
                                    key={`${appointment.appointment_time}-${appointment.pets.name}`}
                                    className="appointmentRow"
                                >
                                    <div className="appointmentInfo">
                                        <Icons.Clock className="appointmentTimeIcon" />
                                        <span>{appointment.appointment_time}</span>
                                    </div>

                                    <Avatar className="appointmentAvatar">
                                        <AvatarFallback className="appointmentAvatarFallback">
                                            {getInitials(appointment.pets.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="appointmentDetails">
                                        <p className="appointmentPet">{appointment.pets.name}</p>
                                        <p className="appointmentOwner">
                                            {appointment.pets.owner_id.full_name} &middot;{" "}
                                            {appointment.pets.species}
                                        </p>
                                    </div>

                                    <span className="appointmentSpan">{appointment.services.name}</span>

                                    <Badge
                                        className={`appointmentStatus ${appointment.status}`}
                                        variant="outline"
                                        label={getStatusLabel(appointment.status)}
                                    />
                                </div>
                            ))}
                        </div>
                        <PaginationControls
                            currentPage={safeTodayPage}
                            totalItems={todayAppointments.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setTodayPage}
                        />
                    </CardContent>
                )}
            </Card>

            <Card className="appointmentsTable">
                <CardHeader className="appointmentsTableHeader">
                    <CardTitle className="appointmentsTableHeaderTitle">Citas próximas</CardTitle>
                    <Button
                        type="button"
                        className="buttonViewAllAppointments"
                        label={
                            <>
                                <Icons.MoreHorizontal className="viewAllAppointmentsIcon" />
                            </>
                        }
                    />
                </CardHeader>

                {upcomingAppointments.length === 0 ? (
                    <CardContent className="patientDetailsEmptyState">
                        <div className="patientDetailsEmptyStateIcon">
                            <Icons.PawPrint className="sizeIcon6" />
                        </div>
                        <p className="patientDetailsEmptyStateP">No hay citas próximas</p>
                        <p className="patientDetailsEmptyStateSubP">
                            Agenda una cita para verla aquí
                        </p>
                    </CardContent>
                ) : (
                    <CardContent className="appointmentsTableContent">
                        <div className="appointmentsTableBody">
                            {paginatedUpcomingAppointments.map((appointment) => (
                                <div
                                    key={`${appointment.appointment_time}-${appointment.pets.name}`}
                                    className="appointmentRow"
                                >
                                    <div className="appointmentInfo">
                                        <Icons.Clock className="appointmentTimeIcon" />
                                        <span>{appointment.appointment_time}</span>
                                    </div>

                                    <Avatar className="appointmentAvatar">
                                        <AvatarFallback className="appointmentAvatarFallback">
                                            {getInitials(appointment.pets.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="appointmentDetails">
                                        <p className="appointmentPet">{appointment.pets.name}</p>
                                        <p className="appointmentOwner">
                                            {appointment.pets.owner_id.full_name} &middot;{" "}
                                            {appointment.pets.species}
                                        </p>
                                    </div>

                                    <span className="appointmentSpan">{appointment.services.name}</span>

                                    <Badge
                                        className={`appointmentStatus ${appointment.status}`}
                                        variant="outline"
                                        label={getStatusLabel(appointment.status)}
                                    />
                                </div>
                            ))}
                        </div>
                        <PaginationControls
                            currentPage={safeUpcomingPage}
                            totalItems={upcomingAppointments.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setUpcomingPage}
                        />
                    </CardContent>
                )}
            </Card>
        </>
    );
};

export default AppointmentsTable;
