import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { CourseProps } from "../../utils/types";
import { fetchAllCourses, updateCourse, deleteCourse, createNewCourse } from "../../services/courseService";



export interface CourseState {
    data: CourseProps[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
    bundledata: null,
    bookImages?: [{ low?: string; medium?: string; high?: string }];
}

const initialState: CourseState = {
    data: [],
    count: 0,
    loading: false,
    bundledata: null,
    error: null,
    previous: null,
    next: null,
    bookImages: undefined,
};

export const getAllCourse = createAsyncThunk<CourseProps, void, { rejectValue: string }>(
    "course/get",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchAllCourses();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const updateExistingCourse = createAsyncThunk<any, { data: any, id: number }, { rejectValue: string }>(
    "course/update",
    async ({ data, id }, { rejectWithValue }) => {
        try {
            const res = await updateCourse({ data, id });
            return res;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update course");
        }
    }
);

export const deleteCourseById = createAsyncThunk<any, number, { rejectValue: string }>(
    "course/delete",
    async (id, { rejectWithValue }) => {
        try {
            const res = await deleteCourse(id);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to delete course");
        }
    }
);

export const uploadNewCourse = createAsyncThunk<any, any, { rejectValue: string }>(
    "course/create",
    async (data, { rejectWithValue }) => {
        try {
            const res = await createNewCourse(data);
            return res;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to create course");
        }
    }
);


const CourseSlice = createSlice({
    name: "CourseSlice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getAllCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(updateExistingCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingCourse.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateExistingCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(deleteCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourseById.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(uploadNewCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadNewCourse.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(uploadNewCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default CourseSlice.reducer;