import React from "react";
import { Card, CardContent } from "../../../components/Card.jsx";
import { Icons } from "../../../components/Named-lucide.jsx";
import { useAllDataAppointments, useAppointmentsCount } from "../../../queries/appointments.queries.js";
import { usePetsAndOwner } from "../../../queries/pets.queries.js";

function getMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatCurrency(amount = 0) {
    return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
}

const StatsCards = () => {
    const { data: appointments = [] } = useAllDataAppointments();
    const { data: pets = [] } = usePetsAndOwner();
    const { data: appointmentsCount = 0 } = useAppointmentsCount();

    const todayKey = new Date().toISOString().split("T")[0];
    const currentMonthKey = getMonthKey();

    const stats = React.useMemo(() => {
        const activePatients = pets.filter(
            (pet) => (pet.status ?? "").toLowerCase() === "activo"
        ).length;

        const todayAppointments = appointments.filter(
            (appointment) =>
                appointment.appointment_date === todayKey &&
                appointment.status !== "cancelled"
        ).length;

        const monthlyConsultations = appointments.filter(
            (appointment) =>
                appointment.appointment_date?.slice(0, 7) === currentMonthKey &&
                appointment.status === "confirmed"
        ).length;

        const monthlyRevenue = appointments
            .filter(
                (appointment) =>
                    appointment.appointment_date?.slice(0, 7) === currentMonthKey &&
                    appointment.status === "confirmed"
            )
            .reduce(
                (total, appointment) => total + Number(appointment.services?.price ?? 0),
                0
            );

        return [
            {
                label: "Pacientes activos",
                value: activePatients,
                helper: `${pets.length} registrados`,
                icon: "PawPrint",
            },
            {
                label: "Citas hoy",
                value: todayAppointments,
                helper: `${appointmentsCount} citas totales`,
                icon: "CalendarCheck",
            },
            {
                label: "Consultas este mes",
                value: monthlyConsultations,
                helper: "Solo confirmadas",
                icon: "Stethoscope",
            },
            {
                label: "Ingresos mensuales",
                value: formatCurrency(monthlyRevenue),
                helper: "Basado en citas confirmadas",
                icon: "TrendingUp",
            },
        ];
    }, [appointments, appointmentsCount, currentMonthKey, pets, todayKey]);

    return (
        <div className="statsCards-container">
            {stats.map((stat) => {
                const Icon = Icons[stat.icon];

                return (
                    <Card key={stat.label} className="statsCard">
                        <CardContent className="statsCardContent">
                            <div className="statsCardIcon">
                                <div className="statsCardInfo">
                                    <p className="label">{stat.label}</p>
                                    <p className="value">{stat.value}</p>
                                    <span className="statsCardHelper">{stat.helper}</span>
                                </div>

                                <div className="statsCardIconWrapper">
                                    <Icon className="icon" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default StatsCards;
