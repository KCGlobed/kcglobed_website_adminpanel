import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { BrochureUsers, ExportBodyType } from "../../utils/types";
import { fetchBrochureUsers, fetchBrochureUsersForExport } from "../../services/brochureService";

export interface BrochureState {
    data: BrochureUsers[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: unknown;
}

const initialState: BrochureState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

// The list endpoint may answer with a paginated envelope, a { data: [...] }
// wrapper or a bare array, so read whichever one came back
type BrochureResponse = {
    results?: BrochureUsers[];
    data?: BrochureUsers[];
    count?: number;
    totalCount?: number;
    previous?: string | null;
    next?: string | null;
};

const readRows = (payload: unknown): BrochureUsers[] => {
    if (Array.isArray(payload)) return payload as BrochureUsers[];

    const envelope = payload as BrochureResponse | null;
    if (Array.isArray(envelope?.results)) return envelope.results;
    if (Array.isArray(envelope?.data)) return envelope.data;

    return [];
};

export const getBrochureUsers = createAsyncThunk<unknown, number | void, { rejectValue: string }>(
    "brochure/getBrochureUsers",
    async (page, { rejectWithValue }) => {
        try {
            return await fetchBrochureUsers(typeof page === "number" ? page : undefined);
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to fetch brochure users");
        }
    }
);

export const getBrochureForExport = createAsyncThunk<unknown, ExportBodyType, { rejectValue: string }>(
    "brochure/getBrochureForExport",
    async (body, { rejectWithValue }) => {
        try {
            return await fetchBrochureUsersForExport(body.payload, body.type);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to export brochure report");
        }
    }
);

const brochureSlice = createSlice({
    name: "brochure",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBrochureUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBrochureUsers.fulfilled, (state, action) => {
                state.loading = false;

                const envelope = action.payload as BrochureResponse | null;
                state.data = readRows(action.payload);
                state.count =
                    typeof envelope?.totalCount === "number"
                        ? envelope.totalCount
                        : typeof envelope?.count === "number"
                            ? envelope.count
                            : state.data.length;
                state.previous = envelope?.previous ?? null;
                state.next = envelope?.next ?? null;
            })
            .addCase(getBrochureUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getBrochureForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBrochureForExport.fulfilled, (state, action) => {
                state.loading = false;
                const envelope = action.payload as { results?: unknown; data?: unknown } | null;
                state.exportData = envelope?.results ?? action.payload;
            })
            .addCase(getBrochureForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            });
    },
});

export default brochureSlice.reducer;

