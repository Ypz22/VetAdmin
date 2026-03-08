import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAppointments,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    fetchAppointmentsCount,
    fetchAppointmentsCountToday,
    fetchAllDataAppointments
} from "../api/appointments.api.js";

export const appointmentsKeys = {
    all: ["appointments"],
    list: (search) => ["appointments", "list", search],
    detail: (id) => ["appointments", "detail", id],
};

export function useAppointments({ search = "" } = {}) {
    return useQuery({
        queryKey: appointmentsKeys.list({ search }),
        queryFn: () => fetchAppointments({ search }),
    });
}

export function useAllDataAppointments() {
    return useQuery({
        queryKey: appointmentsKeys.list(),
        queryFn: fetchAllDataAppointments,
    });
}

export function useAppointmentsCount() {
    return useQuery({
        queryKey: ["appointments", "count"],
        queryFn: fetchAppointmentsCount,
    });
}
export function useAppointmentsCountConfirmed() {
    return useQuery({
        queryKey: ["appointments", "count", "confirmed"],
        queryFn: fetchAppointmentsCountToday,
    });
}


export function useAppointmentById(id, options = {}) {
    return useQuery({
        queryKey: appointmentsKeys.detail(id),
        queryFn: () => fetchAppointmentById(id),
        enabled: !!id,
        ...options,
    });
}

export function useCreateAppointment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: appointmentsKeys.all });
        },
    });
}

export function useUpdateAppointment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => updateAppointment(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: appointmentsKeys.all });
        },
    });
}

export function useDeleteAppointment() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: deleteAppointment,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: appointmentsKeys.all });
        },
    });
}
