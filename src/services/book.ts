import { apiRequest } from "./apiRequest";

export const fetchAllBooks = (): Promise<any> => {
    return apiRequest(`book/book-listing/`, "GET");
};

export const fetchAllAuthors = (): Promise<any> => {
    return apiRequest(`book/get-authors/`, "GET");
};
export const createNewBook = (payload: any): Promise<any> => {
    return apiRequest(`book/upload-book/`, "POST", payload);
};

export const assignAuthorToBook = (payload: { book_id: any; author_id: any }): Promise<any> => {
    return apiRequest(`book/add-book-authors/`, "POST", payload);
};
export const createNewAuthor = (payload: any): Promise<any> => {
    return apiRequest(`book/create-author/`, "POST", payload);
};

export const getBookAuthors = (book_id: any): Promise<any> => {
    return apiRequest(`book/get-book-authors/${book_id}`, "GET");
};

export const deleteBookAuthor = (book_author_id: any): Promise<any> => {
    return apiRequest(`book/delete-book-author/${book_author_id}`, "DELETE");
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

