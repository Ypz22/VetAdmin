import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "../api/globalSearch.api.js";

export function useGlobalSearch(term = "") {
    const t = (term ?? "").trim();

    return useQuery({
        queryKey: ["global-search", t],
        queryFn: () => globalSearch(t),
        enabled: t.length >= 2,
        staleTime: 60_000,
        keepPreviousData: true,
    });
}

