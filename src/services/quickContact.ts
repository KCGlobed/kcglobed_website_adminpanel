import { apiRequest } from "./apiRequest";
import type { Payload } from "../utils/types";

export const fetchQuickContactSlice = (source?: string, page?: number): Promise<unknown> => {
    const params = new URLSearchParams();
    if (source) params.append("source", source);
    if (page) params.append("page", String(page));
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return apiRequest(`course/get-quick-contact${queryString}`, "GET");
};

export const fetchQuickContactSliceForExport = (payload: Payload, type: string): Promise<unknown> => {
    return apiRequest(`course/get-quick-contact-us-${type}-report/`, "POST", payload);
};

