import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeamMember, fetchTeamMembers } from "../api/team.api.js";

export const teamKeys = {
    all: ["team"],
    members: ["team", "members"],
};

export function useTeamMembers() {
    return useQuery({
        queryKey: teamKeys.members,
        queryFn: fetchTeamMembers,
        retry: false,
    });
}

export function useCreateTeamMember() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createTeamMember,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: teamKeys.all });
        },
    });
}
