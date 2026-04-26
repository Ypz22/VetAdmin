import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { Icons } from "../../components/Named-lucide.jsx";
import { useAuthUser } from "../../queries/auth.queries.js";
import { useProfileById } from "../../queries/profiles.queries.js";
import { useAppointments } from "../../queries/appointments.queries.js";
import { useServices } from "../../queries/services.queries.js";
import { usePets } from "../../queries/pets.queries.js";
import NewAppointmentGeneral from "../newAppointmentGeneral/NewAppointmentGeneral.jsx";
import { useDoctors } from "../../hooks/useDoctors.js";
import { SPECIES_ICONS } from "../../constants/species.js";
import { useAppointmentDialog } from "../../hooks/useAppointmentDialog.js";


function filterAppointmentsToday(appointments = []) {
    const today = new Date().toISOString().split("T")[0];

    return appointments.filter(
        appointment => appointment.appointment_date === today
    );
}



const WelcomeBanner = () => {
    const navigate = useNavigate();
    const { data: services = [] } = useServices();
    const { data: patients = [] } = usePets();
    const { doctors } = useDoctors();
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
    const auth = useAuthUser();
    const userId = auth.data?.id;

    const profile = useProfileById(userId, { enabled: !!userId });

    const { data: appointments = [] } = useAppointments();

    const todayAppointments = filterAppointmentsToday(appointments);

    return (
        <div className="welcomeBanner">
            <div className="welcomeBanner-container">
                <div className="welcomeBanner-text">
                    <h2>Buenos días, {profile.data?.full_name ?? "Cargando..."}</h2>
                    <p>Tienes {todayAppointments.length} citas programadas para hoy.</p>
                </div>
                <div className="welcomeBanner-buttons">
                    <Button
                        type="button"
                        className="buttonNewAppointment"
                        onClick={() => setNewAppointmentOpen(true)}
                        label={
                            <>
                                <Icons.CalendarPlus className="welcomeCalendarPlusIcon" /> Nueva cita
                            </>}
                    />
                    <Button
                        type="button"
                        className="buttonSearchPatient"
                        onClick={() => navigate("/register?focusSearch=1")}
                        label={
                            <>
                                <Icons.Search className="welcomeSearchIcon" /> Buscar paciente
                            </>
                        }
                    />
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
    )
}

export default WelcomeBanner;
