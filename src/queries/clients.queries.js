import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
    fetchClientsCount,
} from "../api/clients.api.js";

export const clientsKeys = {
    all: ["clients"],
    list: (search) => ["clients", "list", search],
    detail: (id) => ["clients", "detail", id],
};

export function useClients({ search = "" } = {}) {
    return useQuery({
        queryKey: clientsKeys.list({ search }),
        queryFn: () => fetchClients({ search }),
    });
}

export function useClientById(id, options = {}) {
    return useQuery({
        queryKey: clientsKeys.detail(id),
        queryFn: () => fetchClientById(id),
        enabled: !!id,
        ...options,
    });
}

export function useClientsCount() {
    return useQuery({
        queryKey: ["clients", "count"],
        queryFn: () => fetchClientsCount(),
    });
}

export function useCreateClient() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createClient,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: clientsKeys.all });
        },
    });
}

export function useUpdateClient() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (args) => updateClient(args),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: clientsKeys.all });
        },
    });
}

export function useDeleteClient() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteClient,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: clientsKeys.all });
        },
    });
}