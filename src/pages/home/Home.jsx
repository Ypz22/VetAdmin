import React from "react";
import WelcomeBanner from "./WelcomeBanner.jsx";
import './home.css'
import '../../styles/dashboardHeader.css'
import '../../styles/cards.css'
import './statsCards/statsCards.css'
import "./appointmentsTable/appointmentsTable.css";
import StatsCards from "./statsCards/StatsCards.jsx";
import AppointmentsTable from "./appointmentsTable/AppointmentsTable.jsx";
import DashboardHeader from "../../components/DashboardHeader.jsx";

const Home = () => {

    return (
        <div className="home">
            <DashboardHeader />
            <div className="page-content">
                <WelcomeBanner />
                <StatsCards />
                <AppointmentsTable />
            </div>
        </div>
    );
}

export default Home;