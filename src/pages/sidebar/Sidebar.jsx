import { useEffect, useMemo } from "react";
import Button from "../../components/Button";
import { Icons } from "../../components/Named-lucide";
import { Avatar, AvatarFallback } from "../../components/Avatar.jsx";
import toast from "react-hot-toast";
import "./sidebar.css";
import { friendlyError } from "../../utils/friendlyError.js";
import { useAuthUser } from "../../queries/auth.queries.js";
import { useProfileById } from "../../queries/profiles.queries.js";
import { useVeterinaryById } from "../../queries/veterinaries.queries.js";
import { useAppointmentsCountConfirmed } from "../../queries/appointments.queries.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../../queries/credentials.queries.js";

const ROLE_LABELS = {
    owner: "Propietario",
    staff: "Personal",
    client: "Cliente",
};

const Sidebar = () => {
    const { data: appointmentsCountConfirmed } = useAppointmentsCountConfirmed();
    const navigate = useNavigate();
    const location = useLocation();
    const logoutMutation = useLogout({
        onSuccess: () => {
            toast.success("Sesión cerrada correctamente");
            navigate("/", { replace: true });
        },
        onError: (error) => {
            toast.error(friendlyError(error?.message));
        },
    });

    const navItems = [
        { icon: "LayoutDashboard", label: "Panel de control", navigate: "/home" },
        { icon: "Calendar", label: "Calendario", navigate: "/calendar" },
        { icon: "CalendarDays", label: "Agenda", navigate: "/agenda" },
        { icon: "ClipboardList", label: "Registro", navigate: "/register" },
        { icon: "Settings", label: "Administración", navigate: "/admin" },
    ];

    const auth = useAuthUser();
    const userId = auth.data?.id;

    const profile = useProfileById(userId, { enabled: !!userId });
    const vetId = profile.data?.veterinary_id;

    const veterinary = useVeterinaryById(vetId, { enabled: !!vetId });

    const nameUser = profile.data?.full_name || "";
    const roleUser = useMemo(() => {
        const role = profile.data?.role;
        return ROLE_LABELS[role] || "Usuario";
    }, [profile.data?.role]);

    const nameVet = veterinary.data?.name || "";

    const isLoading = auth.isLoading || profile.isLoading || veterinary.isLoading;
    const errorMessage =
        auth.error?.message || profile.error?.message || veterinary.error?.message;

    useEffect(() => {
        if (errorMessage) toast.error(friendlyError(errorMessage));
    }, [errorMessage]);

    return (
        <aside className="sidebar">
            <div className="container-header">
                <div className="container-icon">
                    <Icons.PawPrint className="iconHeader sizeIcon5" />
                </div>
                <h1>{isLoading ? "Cargando..." : nameVet || "Clínica"}</h1>
            </div>

            <div className="divider"></div>

            <nav className="navSidebar">
                <ul>
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.navigate ||
                            location.pathname.startsWith(item.navigate + "/");
                        const Icon = Icons[item.icon];

                        return (
                            <li key={item.label}>
                                <Button
                                    type="button"
                                    onClick={() => navigate(item.navigate)}
                                    className={`buttonSidebar ${isActive ? "activeIndex" : "noActiveIndex"
                                        }`}
                                    label={
                                        <>
                                            <Icon
                                                className={`iconItem sizeIcon5 ${isActive ? "activeIcon" : "noActiveIcon"
                                                    }`}
                                            />
                                            <span className="labelButtonSidebar">{item.label}</span>
                                            <Icons.ChevronRight
                                                className={`iconArrow ${isActive ? "activeIcon" : "noActiveIcon"
                                                    }`}
                                            />
                                        </>
                                    }
                                />
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="bottomSidebar">
                <div className="divider"></div>

                <div className="footer-sidebar">
                    <Button
                        type="button"
                        className="buttonBottomSidebar"
                        label={
                            <>
                                <Icons.Bell className="sizeIcon5" />
                                <span className="labelButtonBottomSidebar">Notificaciones</span>
                                <span className="labelNotifications">{appointmentsCountConfirmed}</span>
                            </>
                        }
                    />

                    <div className="userInfo-container">
                        <Avatar className="avatarUser">
                            <AvatarFallback className="avatarFallbackUser">
                                <Icons.User className="iconUser" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="infoUser">
                            <p className="nameUser">{isLoading ? "..." : nameUser || "..."}</p>
                            <p className="roleUser">{isLoading ? "..." : roleUser || "..."}</p>
                        </div>

                        <Button
                            type="button"
                            className="buttonLogout"
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                            title="Cerrar sesión"
                            aria-label="Cerrar sesión"
                            label={<Icons.LogOut className="iconLogout" />}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
