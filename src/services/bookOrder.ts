// Completed Orders(Default): {{url}}/api/book/get-purchased-books/ (GET)
// Pending Orders : {{url}}/api/book/get-purchased-books/pending (GET)
// Failed Orders: {{url}}/api/book/get-purchased-books/failed (GET)



import { apiRequest } from "./apiRequest";

export const fetchSuccessBook = (): Promise<any> => {
    return apiRequest(`book/get-purchased-books/`, "GET");
};

export const fetchFailedBook = (): Promise<any> => {
    return apiRequest(`book/get-purchased-books/failed`, "GET");
};
export const fetchPendingBook = (): Promise<any> => {
    return apiRequest(`book/get-purchased-books/pending`, "GET");
};
// completed , pending, failed
// {{url}}/api/book/get-book-order-${type}-report/completed

export const fetchSuccessBookForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`book/get-book-order-${type}-report/completed`, "POST", payload);
};

export const fetchPendingBookForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`book/get-book-order-${type}-report/pending`, "POST", payload);
};


export const fetchFailedBookForExport = (payload: {
    start_date: string,
    end_date: string,
}, type: string): Promise<any> => {
    return apiRequest(`book/get-book-order-${type}-report/failed`, "POST", payload);
};