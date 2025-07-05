import type { UserState } from "../utils/types";
import { apiRequest } from "./apiRequest";

export const fetchCurrentUser = (page = 1, type:number):Promise<UserState> => {
  const url = type===1 ? 
    `course/get-active-subscribed-user-list/?page=${page}` : 
    `course/get-initiate-user-list/?page=${page}`;
  return apiRequest(url, "GET");
};

export const fetchInitiatCurrentUser = (page = 1):Promise<UserState> => {
  return apiRequest(`course/get-active-subscribed-user-list/?page=${page}`, "GET");
};

export const fetchCourseSubjectsChaptersTopics = ():Promise<any> => {
  return apiRequest(`course/course-subject-chapter-topics/`, "GET");
}