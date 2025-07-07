import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExportBodyType, PlacementSupport } from "../../utils/types";
import { fetchPlacementSupport, fetchPlacementSupportForExport } from "../../services/placement";



export interface PlacementState {
    data: PlacementSupport[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: PlacementState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

export const getPlacementSupport = createAsyncThunk<PlacementSupport, void, { rejectValue: string }>(
    "placement",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchPlacementSupport();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getPlacementSupportForExport = createAsyncThunk<Enquiry, ExportBodyType, { rejectValue: string }>(
    "placement/export",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchPlacementSupportForExport(body.payload, body.type);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

const PlacementSupportSlice = createSlice({
    name: "placement",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPlacementSupport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlacementSupport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPlacementSupport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            }).addCase(getPlacementSupportForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlacementSupportForExport.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.exportData = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPlacementSupportForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default PlacementSupportSlice.reducer;