import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BookProps } from "../../utils/types";
import { addBookImage, createNewBook, fetchAllBooks } from "../../services/book";



export interface BookState {
    data: BookProps[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
}

const initialState: BookState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
};

export const getAllBooks = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/get",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAllBooks();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const uploadNewBook = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/create",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createNewBook(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const uploadBookImage = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/image",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await addBookImage(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
const BookSlice = createSlice({
    name: "BookSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getAllBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(uploadNewBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadNewBook.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(uploadNewBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(uploadBookImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadBookImage.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(uploadBookImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default BookSlice.reducer;