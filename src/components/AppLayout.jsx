import Sidebar from "../pages/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "../App.css";

export default function AppLayout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
