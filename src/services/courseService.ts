import { apiRequest } from "./apiRequest";

export const fetchAllCourses = (): Promise<any> => {
    return apiRequest(`course/course-listing/`, "GET");
};
export const fetchAllCategories = (): Promise<any> => {
    return apiRequest(`course/course-category/`, "GET");
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

export const updateCourse = (payload: any): Promise<any> => {
    return apiRequest(`course/edit-course/${payload.id}`, "POST", payload.data);
};
export const deleteCourse = (id: any): Promise<any> => {
    return apiRequest(`course/delete-course/${id}`, "DELETE");
};

export const createNewCourse = (payload: any): Promise<any> => {
    return apiRequest(`course/create-course/`, "POST", payload);
};

