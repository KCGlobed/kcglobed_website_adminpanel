import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry } from "../../utils/types";
import { fetchBrochureUsers } from "../../services/brochureService";

export interface BrochureState {
    data: Enquiry[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
}

const initialState: BrochureState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
};

// The list endpoint may answer with a paginated envelope, a { data: [...] }
// wrapper or a bare array, so read whichever one came back
type BrochureResponse = {
    results?: Enquiry[];
    data?: Enquiry[];
    count?: number;
    previous?: string | null;
    next?: string | null;
};

const readRows = (payload: unknown): Enquiry[] => {
    if (Array.isArray(payload)) return payload as Enquiry[];

    const envelope = payload as BrochureResponse | null;
    if (Array.isArray(envelope?.results)) return envelope.results;
    if (Array.isArray(envelope?.data)) return envelope.data;

    return [];
};

export const getBrochureUsers = createAsyncThunk<unknown, void, { rejectValue: string }>(
    "brochure/getBrochureUsers",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchBrochureUsers();
        } catch (error) {
            const message = error instanceof Error ? error.message : "";
            return rejectWithValue(message || "Failed to fetch brochure users");
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
                    typeof envelope?.count === "number" ? envelope.count : state.data.length;
                state.previous = envelope?.previous ?? null;
                state.next = envelope?.next ?? null;
            })
            .addCase(getBrochureUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            });
    },
});

export default brochureSlice.reducer;
