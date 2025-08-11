
import { apiRequest } from "./apiRequest";

export const fetchActiveSales = (payload: { page: any }): Promise<any> => {
    return apiRequest(`course/get-active-subscribed-user-list/?page=${payload.page}`, "GET");
};
export const fetchNotCompletedSales = (payload: { page: any }): Promise<any> => {
    return apiRequest(`course/get-initiate-user-list/?page=${payload.page}`, "GET");
};



export const fetchActiveSalesExcel = (payload: any): Promise<any> => {
    return apiRequest(`course/export-active-subscribed-user-list/`, "POST", payload);
};
