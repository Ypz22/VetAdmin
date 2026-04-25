import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    loginWithPassword,
    changePassword,
    changePasswordWithCurrent,
    logout,
} from "../api/credentials.api";

export function useLogin() {
    return useMutation({
        mutationFn: loginWithPassword,
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: changePassword,
    });
}

export function useChangePasswordWithCurrent() {
    return useMutation({
        mutationFn: changePasswordWithCurrent,
    });
}

export function useLogout(options = {}) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        ...options,
        onSuccess: (...args) => {
            queryClient.clear();
            options.onSuccess?.(...args);
        },
    });
}
