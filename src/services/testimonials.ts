import { apiRequest } from "./apiRequest";

export const fetchAllTestimonials = (): Promise<any> => {
    return apiRequest(`landing-page/get-testimonial-list/`, "GET");
};
export const deleteTestimonial = (id: string): Promise<any> => {
    return apiRequest(`landing-page/delete-testimonial/${id}`, "DELETE");
};

export const addTestimonial = (payload: any): Promise<any> => {
    return apiRequest(`landing-page/add-testimonial/`, "POST", payload);
};

export const updateTestimonial = (payload: any): Promise<any> => {
    return apiRequest(`landing-page/update-testimonial/${payload.id}`, "POST", payload.data);
};