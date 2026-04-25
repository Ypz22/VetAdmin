export const APPOINTMENT_TIME_SLOTS = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
];

export function getAvailableAppointmentSlots(appointments, selectedDate) {
    if (!selectedDate) return APPOINTMENT_TIME_SLOTS;

    const occupiedTimes = new Set(
        appointments
            .filter(
                (appointment) =>
                    appointment.appointment_date === selectedDate &&
                    appointment.status !== "cancelled"
            )
            .map((appointment) => appointment.appointment_time?.slice(0, 5))
            .filter(Boolean)
    );

    return APPOINTMENT_TIME_SLOTS.filter((time) => !occupiedTimes.has(time));
}
