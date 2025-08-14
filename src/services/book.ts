import { apiRequest } from "./apiRequest";

export const fetchAllBooks = (payload): Promise<any> => {
    return apiRequest(`book/book-listing/?page=${payload.page}`, "GET");
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

export const getBookAuthorsApi = (book_id: any): Promise<any> => {
    return apiRequest(`book/get-book-authors/${book_id}`, "GET");
};

export const getRelatedBooks = (book_id: any): Promise<any> => {
    return apiRequest(`book/get-related-book/${book_id}`, "GET");
};

export const addRelatedBooks = (payload: { book_id: any; related_book_id: number[] }): Promise<any> => {
    return apiRequest(`book/add-related-book/`, "POST", payload);
};

export const deleteRelatedBook = (body: any): Promise<any> => {
    return apiRequest(`book/delete-related-book/`, "POST", body);
};
