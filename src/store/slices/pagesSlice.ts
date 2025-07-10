import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExcellenceSection } from "../../utils/types";
import { createPage, createPageName, createSectionName, fetchPagesData, getAllPagesName, getAllSections, updatePage, updatePageName, updateSectionName } from "../../services/pages";



export interface DynamicPageState {
    data: ExcellenceSection[];
    section_Data: ExcellenceSection[];
    count: number;
    loading: boolean;
    error: string | null;
    previous: string | null;
    next: string | null;
}

const initialState: DynamicPageState = {
    data: [],
    count: 0,
    loading: false,
    error: null,
    previous: null,
    next: null,
    section_Data: []
};

export const getPagesData = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "pages/",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchPagesData();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const createPageData = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "pages/create",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createPage(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);
export const updatePageData = createAsyncThunk<Enquiry, void, { rejectValue: string }>(
    "pages/update",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await updatePage(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getAllPageNames = createAsyncThunk<any, void, { rejectValue: string }>(
    "pages/names",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllPagesName();
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const getAllSection = createAsyncThunk<any, void, { rejectValue: string }>(
    "pages/section-type",
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAllSections();
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);


export const createNewPageName = createAsyncThunk<any, FormData, { rejectValue: string }>(
    "pages/page-name",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createPageName(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);


export const createNewSectionName = createAsyncThunk<any, FormData, { rejectValue: string }>(
    "pages/section-name",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await createSectionName(payload);
            return data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch blogs");
        }
    }
);

export const updatePageNameData = createAsyncThunk<any, { id: string | number, payload: any }, { rejectValue: string }>(
    "pages/update-page-name",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const data = await updatePageName(id, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update page name");
        }
    }
);

export const updateSectionNameData = createAsyncThunk<any, { id: string | number, payload: any }, { rejectValue: string }>(
    "pages/update-section-name",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            const data = await updateSectionName(id, payload);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to update section name");
        }
    }
);

const PagesSlice = createSlice({
    name: "pages",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPagesData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPagesData.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action, "action")
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(getPagesData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getAllPageNames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPageNames.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data
            })
            .addCase(getAllPageNames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(getAllSection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSection.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload, 'this is test...')
                state.section_Data = action.payload.data
            })
            .addCase(getAllSection.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(createPageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPageData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(createPageData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(updatePageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePageData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = (action.payload as any).results ?? action.payload;
            })
            .addCase(updatePageData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(createNewPageName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewPageName.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNewPageName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
            .addCase(createNewSectionName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewSectionName.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createNewSectionName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unknown error";
            })
    },
});

export default PagesSlice.reducer;