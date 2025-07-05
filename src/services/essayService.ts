
import type { EssayPagination } from "../utils/types";
import { apiRequest } from "./apiRequest";

export async function fetchEssaysByCourseId(subjectId: string|number, page = 1): Promise<EssayPagination> {
  const res:any = await apiRequest(`assessment/get-essay-type-questions/3/${subjectId}?page=${page}`, "GET");
  return res; // returns { count, next, previous, results }
}

export const fetchEssayById = async (id: string): Promise<any> => {
  return await apiRequest(`assessment/get-simulation-detail/${id}`, "GET");
};
export const changeStatusEssayById = async (subjectID:string,payload:any): Promise<any> => {
  return await apiRequest(`assessment/change-sim-status/${subjectID}`, "POST",payload);
};

export const createOrUpdateEssayQuestions = async (payload:any):Promise<any> => {
  const url = payload.simulation_id ? 'assessment/update-essay-question/' : 'assessment/create-essay-question/';
  return await apiRequest(url, 'POST', payload);
}

export const deleteEssayType = async (id:string):Promise<any> =>{
  return await apiRequest(`assessment/delete-simulation-question/${id}`, 'DELETE');
}