import { apiRequest } from "./apiRequest";

export const fetchPagesData = (currentPage: any): Promise<any> => {
    console.log("Fetching pages data for current page:", currentPage);
    return apiRequest(`landing-page/get-homepage-content?page=${currentPage.page}`, "GET");
};
export const getAllPagesName = (): Promise<any> => {
    return apiRequest(`landing-page/get-page-list/`, "GET");
};
export const getAllSections = (): Promise<any> => {
    return apiRequest(`landing-page/get-section-type-list/`, "GET");
};

export const fetchCategry = (): Promise<any> => {
    return apiRequest(`notes/blog-category-list/`, "GET");
};
export const createPage = async (payload: any): Promise<any> => {
    return await apiRequest(`landing-page/add-section-data/`, 'POST', payload);
};

export const createPageName = async (payload: any): Promise<any> => {
    return await apiRequest(`landing-page/add-page/`, 'POST', payload);
};

export const createSectionName = async (payload: any): Promise<any> => {
    return await apiRequest(`landing-page/add-section-type/`, 'POST', payload);
};


export const updatePage = async (payload: any): Promise<any> => {
    return await apiRequest(`landing-page/update-section-data/${payload.id}`, 'POST', payload.formData);
};

export const removeSubSec = async (id: any): Promise<any> => {
    return await apiRequest(`landing-page/remove-sub-section-data/${id}`, 'DELETE');
};

export const updateSubSec = async (payload: any): Promise<any> => {
    return await apiRequest(`landing-page/update-sub-section-data/`, 'POST', payload.formData);
};

export const updatePageName = async (id: string | number, payload: any): Promise<any> => {
    return await apiRequest(`landing-page/update-page/${id}`, 'POST', payload);
};

export const updateSectionName = async (id: string | number, payload: any): Promise<any> => {
    return await apiRequest(`landing-page/update-section-type/${id}`, 'POST', payload);
};

export const updateBlog = async (id: string | number, payload: FormData): Promise<any> => {
    return await apiRequest(`notes/edit-blog/${id}`, 'POST', payload);
}

export const deleteSection = async (id: number): Promise<any> => {
    return await apiRequest(`landing-page/delete-section/${id}`, 'DELETE');
}
