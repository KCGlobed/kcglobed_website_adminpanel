
import { apiRequest } from "./apiRequest";

export const fetchQuickContactSlice = (): Promise<any> => {
    return apiRequest(`course/get-quick-contact`, "GET");
};



export const fetchQuickContactSliceForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`course/get-quick-contact-us-${type}-report/`, "POST", payload);
};
