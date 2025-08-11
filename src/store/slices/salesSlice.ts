import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExportBodyType, PartnerWithUs, Subscription } from "../../utils/types";
import { fetchActiveSales, fetchActiveSalesExcel, fetchNotCompletedSales } from "../../services/sales";



export interface SalesState {
    data: Subscription[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: SalesState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

export const getActiveSales = createAsyncThunk<any, { page: any }, { rejectValue: string }>(
    "activeSales",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await fetchActiveSales(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const getInitiateSales = createAsyncThunk<PartnerWithUs, { page: any }, { rejectValue: string }>(
    "activeSales/initiate",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await fetchNotCompletedSales(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const getActiveSalesExcel = createAsyncThunk<PartnerWithUs, ExportBodyType, { rejectValue: string }>(
    "activeSales/export",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await fetchActiveSalesExcel(payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
const SalesSlice = createSlice({
    name: "activeSales",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getActiveSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getActiveSales.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
                state.count = (action.payload as any).count ?? 0;
            })
            .addCase(getActiveSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getInitiateSales.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getInitiateSales.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
                state.count = (action.payload as any).count ?? 0;
            })
            .addCase(getInitiateSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getActiveSalesExcel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getActiveSalesExcel.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getActiveSalesExcel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default SalesSlice.reducer;