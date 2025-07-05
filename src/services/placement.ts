
import { apiRequest } from "./apiRequest";

export const fetchPlacementSupport = (): Promise<any> => {
    return apiRequest(`course/placement-support-list`, "GET");
};

export const fetchPlacementSupportForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`course/get-placement-support-${type}-report/`, "POST", payload);
};
