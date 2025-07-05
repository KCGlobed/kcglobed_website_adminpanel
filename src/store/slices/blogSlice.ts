import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { approveBlogComment, createBlogs, deleteBlogcomment, fetchBlogComments, fetchBlogs, fetchCategry } from "../../services/blogService";
import type { Comment } from "../../utils/types";

export interface BlogCategory {
  id: number;
  title: string;
  created_at: string;
  user: number;
}

export interface Blog {
  id: number;
  slug: string;
  category: BlogCategory;
  title: string;
  description: string;
  image?: string;
  created_by: string;
  created_at: string;
  tags: string[];
  feature_status: number;
  user: number;
  canonical_url: string;
  actions?: any;

}

export interface BlogForm {
  id: number;
  success: boolean;
  message: string
  data: Blog;
}

export interface CourseCategory {
  id: number,
  title: string,
  created_at: string,
  user: number;
}

export interface BlogState {
  data: Blog[];
  comments: Comment[]
  category: CourseCategory[];
  count: number;
  loading: boolean;
  error: string | null;
  previous: string | null;
  next: string | null;
  commentLoading: boolean
}

const initialState: BlogState = {
  data: [],
  category: [],
  count: 0,
  loading: false,
  error: null,
  previous: null,
  next: null,
  comments: [],
  commentLoading: false
};

export const getBlogs = createAsyncThunk<BlogState, void, { rejectValue: string }>(
  "blog/getBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBlogs();
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);
export const getBlogsCourseCategory = createAsyncThunk<BlogState, void, { rejectValue: string }>(
  "blog/getBlogsCourseCategory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCategry();
      console.log(data, "Check")
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);

export const addBlogs = createAsyncThunk<BlogForm, any, { rejectValue: string }>(
  "blog/addBlogs",
  async (blogData, { rejectWithValue }) => {
    try {
      const data = await createBlogs(blogData);
      console.log(data, "Check")
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);
export const getBlogComments = createAsyncThunk<BlogState, void, { rejectValue: string }>(
  "blog/comments",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBlogComments();
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);
export const approveRejectBlogComment = createAsyncThunk<BlogState, void, { rejectValue: string }>(
  "blog/comments/approve-reject",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await approveBlogComment(payload);
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);
export const deleteBlogComment = createAsyncThunk<BlogState, void, { rejectValue: string }>(
  "blog/comments/delete",
  async (id: any, { rejectWithValue }) => {
    try {
      const data = await deleteBlogcomment(id);
      return data;

    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch blogs");
    }
  }
);
const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    removeBlog: (state, action: PayloadAction<Number>) => {
      state.data = state.data.filter((blog) => blog.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action, "action")
        state.data = action.payload.data
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(addBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlogs.fulfilled, (state) => {
        state.loading = false;
        // state.data.unshift(action.payload.data)
      })
      .addCase(addBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(getBlogsCourseCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogsCourseCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload.data;
      })
      .addCase(getBlogsCourseCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(getBlogComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.results
      })
      .addCase(getBlogComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(approveRejectBlogComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(approveRejectBlogComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        console.log(action.payload, 'this kfjls')
      })
      .addCase(approveRejectBlogComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload || "Unknown error";
      }).addCase(deleteBlogComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(deleteBlogComment.fulfilled, (state, action) => {
        state.commentLoading = false;
      })
      .addCase(deleteBlogComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload || "Unknown error";
      })
  },
});
export const { removeBlog } = blogSlice.actions;
export default blogSlice.reducer;