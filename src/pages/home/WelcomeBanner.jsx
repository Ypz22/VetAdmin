import React from "react";
import Button from "../../components/Button.jsx";
import { Icons } from "../../components/Named-lucide.jsx";
import { useAuthUser } from "../../queries/auth.queries.js";
import { useProfileById } from "../../queries/profiles.queries.js";
import { useAppointments, useCreateAppointment } from "../../queries/appointments.queries.js";
import { useServices } from "../../queries/services.queries.js";
import { usePets } from "../../queries/pets.queries.js";
import { toTitleCase } from "../../utils/stringUtils.js";
import toast from "react-hot-toast";
import NewAppointmentGeneral from "../newAppointmentGeneral/NewAppointmentGeneral.jsx";


export function filterAppointmentsToday(appointments = []) {
    const today = new Date().toISOString().split("T")[0];

    return appointments.filter(
        appointment => appointment.appointment_date === today
    );
}



const WelcomeBanner = ({ nameUser }) => {
    const { data: services = [] } = useServices();
    const { data: patients = [] } = usePets();
    const createAppointmentMutation = useCreateAppointment();
    const [newAppointmentOpen, setNewAppointmentOpen] = React.useState(false);
    const [appointmentForm, setAppointmentForm] = React.useState({});
    const [emptyAppointmentForm, setEmptyAppointmentForm] = React.useState({})

    const handleDialogChangeAppointment = (open) => {
        setNewAppointmentOpen(open);
        if (!open) {
            setAppointmentForm({});
        }
    };

    function handleNewAppointmentSubmit() {
        createAppointmentMutation.mutate({
            appointment_date: appointmentForm.date,
            appointment_time: appointmentForm.time,
            status: appointmentForm.status,
            pet_id: appointmentForm.patient_id,
            service_id: appointmentForm.services,
            notes: appointmentForm.notes,
        })
        toast.success(`Cita para ${toTitleCase(appointmentForm.vet)} programada exitosamente`)
        setAppointmentForm(emptyAppointmentForm)
        setNewAppointmentOpen(false)
    }

    const speciesIcons = {
        perro: "Dog",
        gato: "Cat",
        ave: "Bird",
        conejo: "Rabbit",
    }
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
                speciesIcons={speciesIcons}
                handleDialogChangeAppointment={handleDialogChangeAppointment}
                handleNewAppointmentSubmit={handleNewAppointmentSubmit}
                services={services}
                patients={patients}
            />
        </div>
    )
}

export default WelcomeBanner;