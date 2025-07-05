// store/slices/courseDataSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCourseSubjectsChaptersTopics } from "../../services/userService";

export const getCourseStructure = createAsyncThunk(
  "courseData/getCourseStructure",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCourseSubjectsChaptersTopics();
    } catch (err: any) {
      return rejectWithValue(err?.message || "Error fetching course data");
    }
  }
);

interface CourseDataState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: CourseDataState = {
  data: null,
  loading: false,
  error: null,
};

const courseDataSlice = createSlice({
  name: "courseData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCourseStructure.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getCourseStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

const courseReducer =  courseDataSlice.reducer;

export default courseReducer;
