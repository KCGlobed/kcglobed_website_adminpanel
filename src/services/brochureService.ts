
import { apiRequest } from "./apiRequest";

export const fetchBrochureUsers = (): Promise<unknown> => {
    return apiRequest(`authoritative/brochure-user-list/`, "GET");
};
