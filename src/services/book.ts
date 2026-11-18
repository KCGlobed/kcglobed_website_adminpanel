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

// Image upload for the book landing page. The API saves the file and returns its public link.
const LANDING_IMAGE_UPLOAD_URL = "book/upload-image/";

export const uploadLandingImage = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("image", file);
    type UploadResponse =
        | { url?: string; image?: string; image_url?: string; public_url?: string; link?: string; data?: { url?: string; image?: string; image_url?: string; public_url?: string } }
        | string;
    const res = await apiRequest<UploadResponse>(LANDING_IMAGE_UPLOAD_URL, "POST", body);
    // Accept the common response shapes until the final one is agreed
    const url = typeof res === "string"
        ? res
        : res?.url ?? res?.image_url ?? res?.public_url ?? res?.image ?? res?.link
          ?? res?.data?.url ?? res?.data?.image_url ?? res?.data?.public_url ?? res?.data?.image ?? "";
    if (!url) throw new Error("Upload succeeded but no image link was returned");
    return url;
};
