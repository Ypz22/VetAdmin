import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchProfile,
    fetchProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    fetchProfileClientsCount,
} from "../api/profiles.api.js";

export const profilesKeys = {
    all: ["profiles"],
    list: (params) => ["profiles", "list", params],
    detail: (id) => ["profiles", "detail", id],
    me: ["profiles", "me"],
};

export function useProfiles({ search = "" } = {}) {
    return useQuery({
        queryKey: profilesKeys.list({ search }),
        queryFn: () => fetchProfile({ search }),
    });
}

export function useProfileClientCount() {
    return useQuery({
        queryKey: ["profiles", "count"],
        queryFn: fetchProfileClientsCount,
    });
}

export function useProfileById(id, options = {}) {
    return useQuery({
        queryKey: profilesKeys.detail(id),
        queryFn: () => fetchProfileById(id),
        enabled: !!id,
        ...options,
    });
}

export function useCreateProfile() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: cretateProfile,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: profilesKeys.all });
        },
    });
}

export function useUpdateProfile() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: profilesKeys.all });
        },
    });
}

export function useDeleteProfile() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteProfile,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: profilesKeys.all });
        },
    });
}
