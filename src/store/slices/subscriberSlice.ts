import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ExportBodyType, SubscriberUser } from "../../utils/types";
import { fetchSubscribers, fetchSubscribersForExport } from "../../services/subscribersRequest";

export interface SubscriberState {
    data: SubscriberUser[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: unknown;
}

const initialState: SubscriberState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};

type SubscriberResponse = {
    results?: SubscriberUser[];
    data?: SubscriberUser[];
    count?: number;
    totalCount?: number;
    previous?: string | null;
    next?: string | null;
};

const readRows = (payload: unknown): SubscriberUser[] => {
    if (Array.isArray(payload)) return payload as SubscriberUser[];

    const envelope = payload as SubscriberResponse | null;
    if (Array.isArray(envelope?.results)) return envelope.results;
    if (Array.isArray(envelope?.data)) return envelope.data;

    return [];
};

export const getSubscriberUsers = createAsyncThunk<unknown, number | void, { rejectValue: string }>(
    "subscriber/getSubscriberUsers",
    async (page, { rejectWithValue }) => {
        try {
            return await fetchSubscribers(typeof page === "number" ? page : 1);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to fetch subscribers");
        }
    }
);

export const getSubscribersForExport = createAsyncThunk<unknown, ExportBodyType, { rejectValue: string }>(
    "subscriber/getSubscribersForExport",
    async (body, { rejectWithValue }) => {
        try {
            return await fetchSubscribersForExport(body.payload, body.type);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to export subscribers");
        }
    }
);

const subscriberSlice = createSlice({
    name: "subscriber",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubscriberUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubscriberUsers.fulfilled, (state, action) => {
                state.loading = false;
                const envelope = action.payload as SubscriberResponse | null;
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
            .addCase(getSubscriberUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getSubscribersForExport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSubscribersForExport.fulfilled, (state, action) => {
                state.loading = false;
                const envelope = action.payload as { results?: unknown; data?: unknown } | null;
                state.exportData = envelope?.results ?? action.payload;
            })
            .addCase(getSubscribersForExport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            });
    },
});

export default subscriberSlice.reducer;

