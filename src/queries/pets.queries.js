import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchPets,
    fetchPetById,
    createPet,
    updatePet,
    deletePet,
    fetchPetsAndOwner,
} from "../api/pets.api.js";

import { appointmentsKeys } from "./appointments.queries.js";

export const petsKeys = {
    all: ["pets"],
    list: (search) => ["pets", "list", search],
    detail: (id) => ["pets", "detail", id],
};

export function usePets({ search = "" } = {}) {
    return useQuery({
        queryKey: petsKeys.list({ search }),
        queryFn: () => fetchPets({ search }),
    });
}

export function usePetsAndOwner() {
    return useQuery({
        queryKey: petsKeys.all,
        queryFn: fetchPetsAndOwner,
    });
}

export function usePetById(id, options = {}) {
    return useQuery({
        queryKey: petsKeys.detail(id),
        queryFn: () => fetchPetById(id),
        enabled: !!id,
        ...options,
    });
}

export function useCreatePet() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createPet,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: petsKeys.all });
        },
    });
}

export function useUpdatePet() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (args) => updatePet(args),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: petsKeys.all });
        },
    });
}

export function useDeletePet() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deletePet,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: petsKeys.all });
            qc.invalidateQueries({ queryKey: appointmentsKeys.all });
        },
    });
}
