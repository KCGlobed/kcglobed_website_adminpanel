
import { apiRequest } from "./apiRequest";

export const fetchPartnerWithUs = (): Promise<any> => {
    return apiRequest(`notes/get-become-partner-request`, "GET");
};



export const fetchPartnerWithUsForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`notes/get-partner-us-${type}-report/`, "POST", payload);
};
