import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExportBodyType, PartnerWithUs } from "../../utils/types";
import { fetchPartnerWithUs, fetchPartnerWithUsForExport } from "../../services/partnerWithus";



export interface PartnerWithusState {
    data: PartnerWithUs[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: PartnerWithusState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

export const getPartnerWithUs = createAsyncThunk<PartnerWithUs, void, { rejectValue: string }>(
    "partnerwithus",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchPartnerWithUs();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getPartnerWithUsForExport = createAsyncThunk<PartnerWithUs, ExportBodyType, { rejectValue: string }>(
    "partnerwithus/export",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchPartnerWithUsForExport(body.payload, body.type);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
const PartnerWithUsslice = createSlice({
    name: "partnerwithus",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPartnerWithUs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPartnerWithUs.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPartnerWithUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            }).addCase(getPartnerWithUsForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPartnerWithUsForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPartnerWithUsForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default PartnerWithUsslice.reducer;