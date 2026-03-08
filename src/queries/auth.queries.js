import { useQuery } from "@tanstack/react-query";
import { getAuthUserOrThrow } from "../api/profiles.api.js";

export const authKeys = {
    user: ["auth", "user"],
};

export function useAuthUser(options = {}) {
    return useQuery({
        queryKey: authKeys.user,
        queryFn: getAuthUserOrThrow,
        staleTime: 1000 * 60 * 5,
        ...options,
    });
}
