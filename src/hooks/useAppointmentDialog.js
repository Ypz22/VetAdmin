import React from "react";
import toast from "react-hot-toast";
import { useCreateAppointment } from "../queries/appointments.queries.js";
import { toTitleCase } from "../utils/stringUtils.js";

export function useAppointmentDialog({ resolvePetId, resolvePatientName }) {
    const createAppointmentMutation = useCreateAppointment();
    const [newAppointmentOpen, setNewAppointmentOpen] = React.useState(false);
    const [appointmentForm, setAppointmentForm] = React.useState({});

    const resetAppointmentForm = React.useCallback(() => {
        setAppointmentForm({});
    }, []);

    const handleDialogChangeAppointment = React.useCallback((open) => {
        setNewAppointmentOpen(open);
        if (!open) {
            resetAppointmentForm();
        }
    }, [resetAppointmentForm]);

    const handleNewAppointmentSubmit = React.useCallback(() => {
        createAppointmentMutation.mutate({
            appointment_date: appointmentForm.date,
            appointment_time: appointmentForm.time,
            pet_id: resolvePetId(appointmentForm),
            service_id: appointmentForm.services,
            doctor_id: appointmentForm.doctor_id,
            notes: appointmentForm.notes,
            baseUrl: window.location.origin,
        }, {
            onSuccess: ({ appointment, emailSent, emailError }) => {
                const patientName = resolvePatientName({ appointment, appointmentForm }) ?? "la mascota";

                toast.success(
                    emailSent
                        ? `Cita para ${toTitleCase(patientName)} creada y enviada al propietario`
                        : `Cita para ${toTitleCase(patientName)} creada en pendiente`
                );

                if (!emailSent && emailError) {
                    toast.error(emailError);
                }

                resetAppointmentForm();
                setNewAppointmentOpen(false);
            },
            onError: (error) => {
                toast.error("Error al crear cita: " + error.message);
            },
        });
    }, [appointmentForm, createAppointmentMutation, resetAppointmentForm, resolvePatientName, resolvePetId]);

    return {
        appointmentForm,
        createAppointmentMutation,
        handleDialogChangeAppointment,
        handleNewAppointmentSubmit,
        newAppointmentOpen,
        resetAppointmentForm,
        setAppointmentForm,
        setNewAppointmentOpen,
    };
}
