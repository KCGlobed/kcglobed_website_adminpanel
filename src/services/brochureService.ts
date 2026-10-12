import { apiRequest } from "./apiRequest";
import type { Payload } from "../utils/types";

export const fetchBrochureUsers = (page?: number): Promise<unknown> => {
    const queryString = page ? `?page=${page}` : "";
    return apiRequest(`authoritative/brochure-user-list/${queryString}`, "GET");
};

let lastObjectUrl: string | null = null;

const readFileName = (disposition: string | null, fallback: string): string => {
    if (!disposition) return fallback;
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    return match ? decodeURIComponent(match[1].trim()) : fallback;
};

export const fetchBrochureUsersForExport = async (payload: Payload, type: string): Promise<unknown> => {
    const reportType = type === "csv" || type === "excel" ? "excel" : type;
    const params = new URLSearchParams();
    params.append("start_date", payload.start_date);
    params.append("end_date", payload.end_date);
    if (payload.source) params.append("source", payload.source);

    const response = await apiRequest<unknown>(
        `authoritative/brochure-user-${reportType}-report/?${params.toString()}`,
        "GET"
    );

    if (response instanceof Response) {
        const blob = await response.blob();
        const fileName = readFileName(
            response.headers.get("Content-Disposition"),
            `brochure-users.${reportType === "pdf" ? "pdf" : "xlsx"}`
        );

        if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
        lastObjectUrl = URL.createObjectURL(blob);

        return {
            data: {
                [reportType === "pdf" ? "pdf_url" : "excel_url"]: lastObjectUrl,
                file_name: fileName,
            },
        };
    }

    return response;
};
