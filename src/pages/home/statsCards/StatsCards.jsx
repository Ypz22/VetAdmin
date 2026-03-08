import React from "react";
import { Card, CardContent } from "../../../components/Card.jsx";
import { Icons } from "../../../components/Named-lucide.jsx";
import { useAppointments, useAppointmentsCountConfirmed } from "../../../queries/appointments.queries.js";
import { useProfileClientCount } from "../../../queries/profiles.queries.js";
import { useServices } from "../../../queries/services.queries.js";
import { useClientsCount } from "../../../queries/clients.queries.js";


const StatsCards = () => {
    const { data: appointments = [] } = useAppointments();

    const { data: appointmentsCountConfirmed = 0 } = useAppointmentsCountConfirmed();
    const { data: services = [] } = useServices();
    const { data: clientsCount = 0 } = useClientsCount();


    let totalServices = 0;

    services.map(service => {
        appointments.map(appointment => {
            if (appointment.service_id === service.id) {
                totalServices += service.price;
            }
        })
    })

    const stats = [
        {
            label: "Pacientes activos",
            value: clientsCount,
            change: "+12%",
            icon: "PawPrint",
            color: "bg-accent/10 text-accent",
            iconColor: "text-accent",
        },
        {
            label: "Citas hoy",
            value: appointmentsCountConfirmed,
            change: "+3",
            icon: "CalendarCheck",
            color: "bg-chart-5/10 text-chart-5",
            iconColor: "text-chart-5",
        },
        {
            label: "Consultas este mes",
            value: appointments.length,
            change: "+8%",
            icon: "Stethoscope",
            color: "bg-chart-2/10 text-chart-2",
            iconColor: "text-chart-2",
        },
        {
            label: "Ingresos mensuales",
            value: `$${totalServices}`,
            change: "+15%",
            icon: "TrendingUp",
            color: "bg-primary/10 text-primary",
            iconColor: "text-primary",
        },
    ]

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
                                    <span className="statsCardChangeSpan">
                                        <Icons.TrendingUp className="statsCardChangeIcon" />
                                        {stat.change}
                                    </span>
                                </div>
                                <div className={`statsCardIconWrapper ${stat.iconColor}`}>
                                    <Icon className={`icon`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    );
};

export default StatsCards;