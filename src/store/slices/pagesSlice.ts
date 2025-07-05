import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExcellenceSection } from "../../utils/types";
import { createPage, fetchPagesData, updatePage } from "../../services/pages";



export interface DynamicPageState {
    data: ExcellenceSection[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
}

const initialState: DynamicPageState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
};

export const getPagesData = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "pages/",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchPagesData();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const createPageData = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "pages/create",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createPage(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const updatePageData = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "pages/update",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await updatePage(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

const PagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPagesData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPagesData.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPagesData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            }).addCase(createPageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPageData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(createPageData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            }).addCase(updatePageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePageData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(updatePageData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default PagesSlice.reducer;