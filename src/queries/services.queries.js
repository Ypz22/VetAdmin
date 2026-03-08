import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchServices,
    fetchServiceById,
    createService,
    updateService,
    deleteService,
} from "../api/services.api.js";

export const servicesKeys = {
    all: ["services"],
    list: (search) => ["services", "list", search],
    detail: (id) => ["services", "detail", id],
};

export function useServices({ search = "" } = {}) {
    return useQuery({
        queryKey: servicesKeys.list({ search }),
        queryFn: () => fetchServices({ search }),
    });
}

export function useServiceById(id, options = {}) {
    return useQuery({
        queryKey: servicesKeys.detail(id),
        queryFn: () => fetchServiceById(id),
        enabled: !!id,
        ...options,
    });
}

export function useCreateService() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createService,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: servicesKeys.all });
        },
    });
}

export function useUpdateService() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => updateService(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: servicesKeys.all });
        },
    });
}

export function useDeleteService() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteService,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: servicesKeys.all });
        },
    });
}
