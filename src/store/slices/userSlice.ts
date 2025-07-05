import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser } from "../../services/userService";
import type { UserState } from "../../utils/types";

const initialState: UserState = {
  results: [],
  count: 0,
  loading: false,
  error: null,
  previous: null,
  next: null,
  page: 1,
  type: 1,
};

export const getUser = createAsyncThunk<UserState, {page:number, type: number}, { rejectValue: string }>(
  "user/getUser",
  async ({page, type}, { rejectWithValue }) => {
    try {
      const user = await fetchCurrentUser(page, type);
      console.log("Fetched user:", user);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    changeMode(state,action){
      state.type =action.payload
    }
  },
  extraReducers: (builder) => {
     builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});
export const {setPage,changeMode} = userSlice.actions;
export default userSlice.reducer;