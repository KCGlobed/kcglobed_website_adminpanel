import { apiRequest } from "./apiRequest";
import type { Payload } from "../utils/types";

export const fetchSubscribers = (page: number = 1): Promise<unknown> => {
    return apiRequest(`notes/subscribe-now/?page=${page}`, "GET");
};

let lastObjectUrl: string | null = null;

const readFileName = (disposition: string | null, fallback: string): string => {
    if (!disposition) return fallback;
    const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
    return match ? decodeURIComponent(match[1].trim()) : fallback;
};

export const fetchSubscribersForExport = async (payload: Payload, type: string): Promise<unknown> => {
    const reportType = type === "csv" || type === "excel" ? "excel" : type;
    const params = new URLSearchParams();
    params.append("start_date", payload.start_date);
    params.append("end_date", payload.end_date);

    const response = await apiRequest<unknown>(
        `notes/subscriber-${reportType}-report/?${params.toString()}`,
        "GET"
    );

    if (response instanceof Response) {
        const blob = await response.blob();
        const fileName = readFileName(
            response.headers.get("Content-Disposition"),
            `subscribers.${reportType === "pdf" ? "pdf" : "xlsx"}`
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
