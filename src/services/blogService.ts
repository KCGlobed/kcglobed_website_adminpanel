// import type { UserState } from "../utils/types";
import { apiRequest } from "./apiRequest";

export const fetchBlogs = (): Promise<any> => {
  return apiRequest(`notes/blog-list/`, "GET");
};

export const fetchCategry = (): Promise<any> => {
  return apiRequest(`notes/blog-category-list/`, "GET");
};
export const createBlogs = async (payload: any): Promise<any> => {
  return await apiRequest(`notes/create-blog/`, 'POST', payload);
};
export const updateBlog = async (id: string | number, payload: FormData): Promise<any> => {
  return await apiRequest(`notes/edit-blog/${id}`, 'POST', payload);
}

export const viewBlog = async (id: number): Promise<any> => {
  return await apiRequest(`notes/view-blog-detail/${id}`, 'GET');
}
export const deleteBlog = async (id: number): Promise<any> => {
  return await apiRequest(`notes/delete-blog/${id}`, 'DELETE');
}


export const fetchBlogComments = (): Promise<any> => {
  return apiRequest(`notes/blog-comment-list/`, "GET");
};

export const approveBlogComment = (payload: any): Promise<any> => {
  return apiRequest(`notes/change-comment-status/`, "POST", payload);
};

export const deleteBlogcomment = async (id: number): Promise<any> => {
  return await apiRequest(`notes/delete-blog-comment/${id}`, 'DELETE');
}
