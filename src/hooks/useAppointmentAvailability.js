import React from "react";
import { APPOINTMENT_TIME_SLOTS, getAvailableAppointmentSlots } from "../utils/appointmentSlots.js";

export function useAppointmentAvailability({
    appointments = [],
    appointmentForm,
    setAppointmentForm,
}) {
    const availableTimeSlots = React.useMemo(
        () => getAvailableAppointmentSlots(appointments, appointmentForm.date, appointmentForm.doctor_id),
        [appointments, appointmentForm.date, appointmentForm.doctor_id]
    );

    React.useEffect(() => {
        if (appointmentForm.time && !availableTimeSlots.includes(appointmentForm.time)) {
            setAppointmentForm((prev) => ({ ...prev, time: "" }));
        }
    }, [appointmentForm.time, availableTimeSlots, setAppointmentForm]);

    return {
        availableTimeSlots,
        fallbackTimeSlots: appointmentForm.date ? availableTimeSlots : APPOINTMENT_TIME_SLOTS,
    };
}
