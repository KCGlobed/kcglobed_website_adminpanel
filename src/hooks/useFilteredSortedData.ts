// hooks/useFilteredSortedData.ts
import { useMemo, useState } from "react";

export type FilterType =
    | { type: "text"; value: string }
    | { type: "alpha-range"; value: { from: string; to: string } };

export type Filters = Record<string, FilterType>;

export type SortConfig = {
    key: string;
    direction: "asc" | "desc";
} | null;

export function useFilteredSortedData<T>(data: T[]) {
    const [filters, setFilters] = useState<Filters>({});
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    // separate alpha range state if you want direct control
    const [alphaRange, setAlphaRange] = useState<{ from: string; to: string }>({
        from: "",
        to: "",
    });

    const filteredSortedData = useMemo(() => {
        let result = [...data];

        // Step 1: Apply filters
        Object.entries(filters).forEach(([key, filter]) => {
            if (filter.type === "text") {
                result = result.filter((item) =>
                    String(item[key as keyof T] || "")
                        .toLowerCase()
                        .includes(filter.value.toLowerCase())
                );
            } else if (filter.type === "alpha-range") {
                const { from, to } = filter.value;
                result = result.filter((item) => {
                    const val = String(item[key as keyof T] || "").toUpperCase();
                    return (!from || val >= from) && (!to || val <= to);
                });
            }
        });

        // Step 2: Apply sorting
        if (sortConfig) {
            result.sort((a, b) => {
                const aVal = String(a[sortConfig.key as keyof T] || "").toUpperCase();
                const bVal = String(b[sortConfig.key as keyof T] || "").toUpperCase();

                if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, filters, sortConfig]);

    return {
        data: filteredSortedData,
        filters,
        setFilters,
        sortConfig,
        setSortConfig,
        alphaRange,
        setAlphaRange, // <-- now available directly
    };
}
