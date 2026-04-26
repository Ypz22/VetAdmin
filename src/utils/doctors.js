export function getDoctorsForVeterinary(profiles = [], veterinaryId) {
    return profiles
        .filter(
            (profile) =>
                profile.veterinary_id === veterinaryId &&
                profile.role !== "client"
        )
        .sort((a, b) => (a.full_name ?? "").localeCompare(b.full_name ?? ""));
}

export function getDoctorsFromTeamMembers(members = []) {
    return members
        .filter((member) => member.role !== "client")
        .sort((a, b) => (a.full_name ?? a.name ?? "").localeCompare(b.full_name ?? b.name ?? ""));
}

export function getDoctorNameById(doctors = [], doctorId) {
    if (!doctorId) return "Sin doctor asignado";

    return (
        doctors.find((doctor) => doctor.id === doctorId)?.full_name ??
        "Doctor no disponible"
    );
}
