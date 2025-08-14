import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExportBodyType } from "../../utils/types";
import { fetchEnquery, fetchEnqueryForExport } from "../../services/contactUsService";



export interface EnquiryState {
    data: Enquiry[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: EnquiryState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

export const getEnquery = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "enqury/getEnquery",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await fetchEnquery(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getEnqueryForExport = createAsyncThunk<Enquiry, ExportBodyType, { rejectValue: string }>(
    "enqury/getEnqueryForExport",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchEnqueryForExport(body.payload, body.type);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
const ContactUsSlice = createSlice({
    name: "enquery",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getEnquery.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEnquery.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
                state.count = (action.payload as any).count ?? 0;
            })
            .addCase(getEnquery.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            }).addCase(getEnqueryForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEnqueryForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getEnqueryForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default ContactUsSlice.reducer;