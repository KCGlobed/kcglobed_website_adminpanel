import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BookOrder, Enquiry, ExportBodyType } from "../../utils/types";
import { fetchFailedBook, fetchFailedBookForExport, fetchPendingBook, fetchPendingBookForExport, fetchSuccessBook, fetchSuccessBookForExport } from "../../services/bookOrder";



export interface BookOrderState {
    data: BookOrder[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: BookOrderState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

export const getSuccessBook = createAsyncThunk<BookOrder, void, { rejectValue: string }>(
    "Book/success",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchSuccessBook();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getPendingBook = createAsyncThunk<BookOrder, void, { rejectValue: string }>(
    "Book/pending",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchPendingBook();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getFailedBook = createAsyncThunk<BookOrder, void, { rejectValue: string }>(
    "Book/failed",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchFailedBook();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const getSuccessBookForExport = createAsyncThunk<BookOrder, ExportBodyType, { rejectValue: string }>(
    "book/getSuccessBookForExport",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchSuccessBookForExport(body.payload, body.type);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getPendingBookForExport = createAsyncThunk<BookOrder, ExportBodyType, { rejectValue: string }>(
    "book/getPendingBookForExport",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchPendingBookForExport(body.payload, body.type);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getFailedBookForExport = createAsyncThunk<BookOrder, ExportBodyType, { rejectValue: string }>(
    "book/getFailedBookForExport",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchFailedBookForExport(body.payload, body.type);
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
            .addCase(getSuccessBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSuccessBook.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getSuccessBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getPendingBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPendingBook.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPendingBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getFailedBook.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFailedBook.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getFailedBook.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getSuccessBookForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSuccessBookForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getSuccessBookForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getPendingBookForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPendingBookForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPendingBookForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getFailedBookForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFailedBookForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getFailedBookForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default BookSlice.reducer;