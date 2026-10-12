import { apiRequest } from "./apiRequest";

export const fetchSubscribers = (page: number = 1): Promise<unknown> => {
    return apiRequest(`notes/subscribe-now/?page=${page}`, "GET");
};

export const fetchSubscribersForExport = (
    payload: { start_date: string; end_date: string },
    type: string
): Promise<unknown> => {
    return apiRequest(`notes/get-subscribe-now-${type}-report/`, "POST", payload);
};
