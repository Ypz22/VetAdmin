import { useMutation } from "@tanstack/react-query";
import {
    loginWithPassword,
    changePassword,
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
