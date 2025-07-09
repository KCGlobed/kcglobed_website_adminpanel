import { apiRequest } from "./apiRequest";

export const fetchPagesData = (): Promise<any> => {
    return apiRequest(`landing-page/get-homepage-content`, "GET");
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


export const updatePage = async (payload: any): Promise<any> => {
    console.log(payload, 'thi sis payload')
    return await apiRequest(`landing-page/update-section-data/${payload.id}`, 'POST', payload.formData);
};
export const updateBlog = async (id: string | number, payload: FormData): Promise<any> => {
    return await apiRequest(`notes/edit-blog/${id}`, 'POST', payload);
}

export const viewBlog = async (id: number): Promise<any> => {
    return await apiRequest(`notes/view-blog-detail/${id}`, 'GET');
}
export const deleteBlog = async (id: number): Promise<any> => {
    return await apiRequest(`notes/delete-blog/${id}`, 'DELETE');
}