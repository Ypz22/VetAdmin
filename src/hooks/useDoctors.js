import React from "react";
import { useTeamMembers } from "../queries/team.queries.js";
import { getDoctorsFromTeamMembers } from "../utils/doctors.js";

export function useDoctors() {
    const { data: teamMembers = [], ...query } = useTeamMembers();

    const doctors = React.useMemo(
        () => getDoctorsFromTeamMembers(teamMembers),
        [teamMembers]
    );

    return {
        doctors,
        teamMembers,
        ...query,
    };
}
