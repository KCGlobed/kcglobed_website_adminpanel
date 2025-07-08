import { apiRequest } from "./apiRequest";

export const fetchAllBooks = (): Promise<any> => {
    return apiRequest(`book/book-listing/`, "GET");
};
export const createNewBook = (payload: any): Promise<any> => {
    return apiRequest(`book/upload-book/`, "POST", payload);
};
export const updateBook = (payload: any): Promise<any> => {
    return apiRequest(`book/update-book/${payload.id}`, "POST", payload.data);
};
export const getBookImages = (id: any): Promise<any> => {
    return apiRequest(`book/get-book-images/${id}`, "GET");
};
export const deleteTheImage = (id: any): Promise<any> => {
    return apiRequest(`book/delete-book-image/${id}`, "DELETE");
};
export const deleteTheBook = (id: any): Promise<any> => {
    return apiRequest(`book/delete-book/${id}`, "DELETE");
};

export const addBookImage = (payload: any): Promise<any> => {
    return apiRequest(`book/add-book-image/`, "POST", payload);
};
export const addBookInBundle = (payload: any): Promise<any> => {
    return apiRequest(`book/add-bundle-book/`, "POST", payload);
};
export const getBundleDetail = (id: any): Promise<any> => {
    return apiRequest(`book/get-bundle-book/${id}`, "GET");
};

