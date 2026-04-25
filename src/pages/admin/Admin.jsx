import React from "react";
import { Icons } from "../../components/Named-lucide";
import { Card, CardContent } from "../../components/Card";
import Button from "../../components/Button";
import Clinica from "./clinica/Clinica";
import Team from "./team/Team";
import Billing from "./billing/Billing";
import Notification from "./notification/Notification";
import Security from "./security/Security";
import DashboardHeader from "../../components/DashboardHeader";
import "./admin.css";

const tabs = [
    { id: "clinica", label: "Clinica", icon: "Building2" },
    { id: "equipo", label: "Equipo", icon: "Users" },
    { id: "facturacion", label: "Facturacion", icon: "CreditCard" },
    { id: "notificaciones", label: "Notificaciones", icon: "Bell" },
    { id: "seguridad", label: "Seguridad", icon: "Shield" },
]

const Admin = () => {
    const [activeTab, setActiveTab] = React.useState("clinica");

    return (
        <div className="admin">
            <DashboardHeader />
            <div className="page-content">
                <div className="admin-header">
                    <h1>Administración</h1>
                    <p>Configuracion general de la clinica y el sistema</p>
                </div>

                <div className="admin-content">
                    <Card className="admin-tabs">
                        <CardContent className="admin-tabs-content">
                            <nav className="admin-tabs-nav">
                                {tabs.map((tab) => {
                                    const Icon = Icons[tab.icon];
                                    return (
                                        <Button
                                            key={tab.id}
                                            type="button"
                                            className={`btn-tabs-nav ${activeTab === tab.id ? "btn-active-tab" : "btn-outline-tab"}`}
                                            label={
                                                <>
                                                    <Icon className="sizeIcon5 icon" />
                                                    {tab.label}
                                                </>
                                            }
                                            onClick={() => setActiveTab(tab.id)}
                                        />
                                    )
                                })}
                            </nav>
                        </CardContent>
                    </Card>

                    <div>
                        {activeTab === "clinica" && <Clinica />}
                        {activeTab === "equipo" && <Team />}
                        {activeTab === "facturacion" && <Billing />}
                        {activeTab === "notificaciones" && <Notification />}
                        {activeTab === "seguridad" && <Security />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
