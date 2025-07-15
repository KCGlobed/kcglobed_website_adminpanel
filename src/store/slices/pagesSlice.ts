import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Enquiry, ExcellenceSection } from "../../utils/types";
import { createPage, deletePage, createPageName, createSectionName, fetchPagesData, getAllPagesName, getAllSections, updatePage, updatePageName, updateSectionName } from "../../services/pages";



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

export const deletePageData = createAsyncThunk<number, number, { rejectValue: string }>(
    "pages/delete",
    async (id:number, { rejectWithValue }) => {
        try {
            await deletePage(id);
            return id;

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
            .addCase(deletePageData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePageData.fulfilled, (state, action) => {
                state.loading = false;
                console.log("action", action.payload)
                state.data = state.data.filter((val)=>val.id!=action.payload);
            })
            .addCase(deletePageData.rejected, (state, action) => {
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