import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BookProps } from "../../utils/types";
import { addBookImage, addBookInBundle, createNewBook, deleteTheBook, deleteTheImage, fetchAllAuthors, fetchAllBooks, getBookImages, getBundleDetail, updateBook } from "../../services/book";



export interface BookState {
    data: BookProps[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    bundledata: null,
    bookImages?: [{ low?: string; medium?: string; high?: string }];
    authors?: any[];
}

const initialState: BookState = {
    data: [],
    count: 0,
    loading: false,
    bundledata: null,
    error: null,
    previous: null,
    next: null,
    bookImages: undefined,
    authors: []
};

export const getAllBooks = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/get",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await fetchAllBooks(payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const getAllAuthors = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "author/get",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAllAuthors();
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

export const updateExistingBook = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/update",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await updateBook(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const uploadBookImage = createAsyncThunk<BookProps, FormData, { rejectValue: string }>(
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
export const getBookImage = createAsyncThunk<any, void, { rejectValue: string }>(
    "Book/image/get",
    async (id, { rejectWithValue }) => {
        try {
            const data = await getBookImages(id);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const deleteBookImage = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/image/delete",
    async (id, { rejectWithValue }) => {
        try {
            const data = await deleteTheImage(id);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const deleteBook = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/delete",
    async (id, { rejectWithValue }) => {
        try {
            const data = await deleteTheBook(id);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const addBookBundle = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/bundle-add",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await addBookInBundle(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const getBundleDetails = createAsyncThunk<BookProps, void, { rejectValue: string }>(
    "Book/bundle-get",
    async (id, { rejectWithValue }) => {
        try {
            const data = await getBundleDetail(id);
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
                state.count = (action.payload as any).count ?? action.payload.length;
            })
            .addCase(getAllBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getAllAuthors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAuthors.fulfilled, (state, action) => {
                state.loading = false;
                state.authors = (action.payload as any).results ?? action.payload;
            })
            .addCase(getAllAuthors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(uploadNewBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadNewBook.fulfilled, (state) => {
                state.loading = false;
                // state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(uploadNewBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(uploadBookImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadBookImage.fulfilled, (state) => {
                state.loading = false;
                // state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(uploadBookImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(updateExistingBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingBook.fulfilled, (state) => {
                state.loading = false;
                // state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(updateExistingBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getBookImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookImage.fulfilled, (state, action) => {
                state.loading = false;
                state.bookImages = action.payload;
            })
            .addCase(getBookImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(deleteBookImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBookImage.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload as any
            })
            .addCase(deleteBookImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(deleteBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBook.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(addBookBundle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBookBundle.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload, 'this is payload')
            })
            .addCase(addBookBundle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getBundleDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBundleDetails.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload, 'kaddu')
                state.bundledata = action.payload as any
            })
            .addCase(getBundleDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default BookSlice.reducer;