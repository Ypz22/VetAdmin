import { useQuery } from "@tanstack/react-query";
import {
    fetchVeterinaries,
    fetchVeterinaryById,
    fetchVeterinaryByUser,
} from "../api/veterinaries.api.js";

export const veterinariesKeys = {
    all: ["veterinaries"],
    list: (search) => ["veterinaries", "list", search],
    detail: (id) => ["veterinaries", "detail", id],
};

export function useVeterinaries({ search = "" } = {}) {
    return useQuery({
        queryKey: veterinariesKeys.list({ search }),
        queryFn: () => fetchVeterinaries({ search }),
    });
}

export function useVeterinaryById(id, options = {}) {
    return useQuery({
        queryKey: veterinariesKeys.detail(id),
        queryFn: () => fetchVeterinaryById(id),
        enabled: !!id,
        ...options,
    });
}

export function useVeterinaryByUser() {
    return useQuery({
        queryKey: veterinariesKeys.detail(),
        queryFn: () => fetchVeterinaryByUser(),
    });
}
