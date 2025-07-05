// src/redux/slices/essaySlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { fetchEssaysByCourseId, fetchEssayById, changeStatusEssayById } from "../../services/essayService";
import type { Essay, EssayPagination, EssayState } from "../../utils/types";

const initialState: EssayState = {
  data: [],
  count: 0,
  next: null,
  previous: null,
  page:1,
  loading: false,
  error: null,
  selectedEssay: null,
  selectedEssayLoading: false,
};

export const getEssays = createAsyncThunk<EssayPagination, { subjectId: string|number; page?: number }>
("essays/getEssays", async ({ subjectId, page = 1 }, { rejectWithValue }) => {
  try {
    return await fetchEssaysByCourseId(subjectId, page);
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch essays");
  }
});

export const getEssayById = createAsyncThunk<Essay, string>(
  "essays/getEssayById",
  async (id, { rejectWithValue }) => {
    try {
      const essay = await fetchEssayById(id);
      return essay.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch essay");
    }
  }
);

export const changeStatusById = createAsyncThunk<any, {id:string ,payload:any}>(
  "essays/changeStatusById",
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const essay = await changeStatusEssayById(id,payload);
      console.log(essay)
      return essay.data;
    } catch (err: any) {
      return rejectWithValue(err?.message || "Failed to fetch essay");
    }
  }
);

const essaySlice = createSlice({
  name: "essays",
  initialState,
  reducers: {
    clearSelectedEssay(state) {
      state.selectedEssay = null;
    },
    removeEssay: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((essay) => essay.id !== action.payload);
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    changeStatus: (state, action: PayloadAction<string>) => {
      
      console.log(action.payload)
      let data =state.data.map((essay) => essay.id !== action.payload ? {...essay,visible:!essay.visible}:{...essay})
      console.log(JSON.stringify(data))
       
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEssays.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEssays.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(getEssays.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getEssayById.pending, (state) => {
        state.selectedEssayLoading = true;
        state.selectedEssay = null;
      })
      .addCase(getEssayById.fulfilled, (state, action) => {
        state.selectedEssay = action.payload;
        state.selectedEssayLoading = false;
      })
      .addCase(getEssayById.rejected, (state, action) => {
        state.selectedEssay = null;
        state.selectedEssayLoading = false;
        state.error = action.payload as string;
      })
      .addCase(changeStatusById.fulfilled, (state, action) => {
        const updatedId = action.meta.arg.id;
        state.data = state.data.map((essay) =>
        essay.id === updatedId ? { ...essay, visible: essay.visible ? 0 :1} : essay
        );
})
  },
});

export const { clearSelectedEssay, removeEssay, setPage,changeStatus } = essaySlice.actions;

export default essaySlice.reducer;
