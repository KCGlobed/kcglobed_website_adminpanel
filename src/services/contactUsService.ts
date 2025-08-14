
import { apiRequest } from "./apiRequest";

export const fetchEnquery = (payload): Promise<any> => {
    return apiRequest(`course/get-contact-us-list?page=${payload.page}`, "GET");
};



export const fetchEnqueryForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`course/get-contact-us-${type}-report/`, "POST", payload);
};
