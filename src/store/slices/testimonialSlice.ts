import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, Testimonials, Testimonial } from "../../utils/types";
import { addTestimonial, deleteTestimonial, fetchAllTestimonials, updateTestimonial } from "../../services/testimonials";



export interface TestimonialState {
    data: Testimonials;
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    exportData?: Enquiry[];
}

const initialState: TestimonialState = {
    data: {
        student: [],
        placement: [],
        corporate: [],
        institutions: [],
    },
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    exportData: [],
};


export const getAllTestimonials = createAsyncThunk<Testimonial, void, { rejectValue: string }>(
    "testimonial/get",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAllTestimonials();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const removeTestimonial = createAsyncThunk<Testimonial, string, { rejectValue: string }>(
    "testimonial/delete",
    async (id, { rejectWithValue }) => {
        try {
            const data = await deleteTestimonial(id);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const createTestimonial = createAsyncThunk<Testimonial, FormData, { rejectValue: string }>(
    "testimonial/create",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await addTestimonial(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);


export const updateExistingTestimonial = createAsyncThunk<Testimonial, FormData, { rejectValue: string }>(
    "testimonial/update",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await updateTestimonial(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

const TestimonialSlice = createSlice({
    name: "testimonial",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllTestimonials.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getAllTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(removeTestimonial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeTestimonial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(removeTestimonial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(updateExistingTestimonial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingTestimonial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateExistingTestimonial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(createTestimonial.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTestimonial.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createTestimonial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })


    },
});

export default TestimonialSlice.reducer;