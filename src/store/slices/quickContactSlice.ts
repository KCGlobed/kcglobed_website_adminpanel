import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ExportBodyType, QuickContact } from "../../utils/types";
import { fetchQuickContactSlice, fetchQuickContactSliceForExport } from "../../services/quickContact";

export interface QuickContactState {
    data: QuickContact[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: unknown;
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

type QuickContactResponse = {
    results?: QuickContact[];
    data?: QuickContact[];
    count?: number;
    totalCount?: number;
    previous?: string | null;
    next?: string | null;
};

const readRows = (payload: unknown): QuickContact[] => {
    if (Array.isArray(payload)) return payload as QuickContact[];

    const envelope = payload as QuickContactResponse | null;
    if (Array.isArray(envelope?.results)) return envelope.results;
    if (Array.isArray(envelope?.data)) return envelope.data;

    return [];
};

export const getQuickContactSlice = createAsyncThunk<
    unknown,
    { source?: string; page?: number } | string | number | void,
    { rejectValue: string }
>(
    "enqury/getQuickContactSlice",
    async (arg, { rejectWithValue }) => {
        try {
            let source: string | undefined;
            let page: number | undefined;

            if (typeof arg === "string") {
                source = arg;
            } else if (typeof arg === "number") {
                page = arg;
            } else if (arg && typeof arg === "object") {
                source = arg.source;
                page = arg.page;
            }

            const data = await fetchQuickContactSlice(source, page);
            return data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to fetch quick contact data");
        }
    }
);

export const getQuickContactSliceForExport = createAsyncThunk<unknown, ExportBodyType, { rejectValue: string }>(
    "enqury/getQuickContactSliceForExport",
    async (body, { rejectWithValue }) => {
        try {
            const data = await fetchQuickContactSliceForExport(body.payload, body.type);
            return data;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to export quick contact data");
        }
    }
);

const QuickContactSlice = createSlice({
    name: "quickContact",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getQuickContactSlice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuickContactSlice.fulfilled, (state, action) => {
                state.loading = false;
                const envelope = action.payload as QuickContactResponse | null;
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
            .addCase(getQuickContactSlice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getQuickContactSliceForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getQuickContactSliceForExport.fulfilled, (state, action) => {
                state.loading = false;
                const envelope = action.payload as { results?: unknown; data?: unknown } | null;
                state.exportData = envelope?.results ?? action.payload;
            })
            .addCase(getQuickContactSliceForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            });
    },
});

export default QuickContactSlice.reducer;