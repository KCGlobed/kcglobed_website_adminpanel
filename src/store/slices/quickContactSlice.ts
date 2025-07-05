import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExportBodyType, QuickContact } from "../../utils/types";
import { fetchQuickContactSlice, fetchQuickContactSliceForExport } from "../../services/quickContact";



export interface QuickContactState {
    data: QuickContact[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: QuickContactState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

export const getQuickContactSlice = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "enqury/getQuickContactSlice",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchQuickContactSlice();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getQuickContactSliceForExport = createAsyncThunk<Enquiry, ExportBodyType, { rejectValue: string }>(
    "enqury/getQuickContactSliceForExport",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchQuickContactSliceForExport(body.payload, body.type);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
const QuickContactSlice = createSlice({
    name: "enquery",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuickContactSlice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuickContactSlice.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getQuickContactSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            }).addCase(getQuickContactSliceForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuickContactSliceForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getQuickContactSliceForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default QuickContactSlice.reducer;