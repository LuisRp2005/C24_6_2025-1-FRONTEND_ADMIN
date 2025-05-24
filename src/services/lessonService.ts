import API from './api';
import { Lesson } from '../models/Lesson';
import { LessonRequest } from '../models/LessonRequest';

export const getLessons = (page = 0, size = 5) =>
  API.get(`/lessons?page=${page}&size=${size}`);

export const createLesson = (data: LessonRequest) => API.post('/lessons', data);

export const updateLesson = (id: number, data: LessonRequest) => API.put(`/lessons/${id}`, data);

export const deleteLesson = (id: number) => API.delete(`/lessons/${id}`);

export const getPdfUrls = (courseName: string) => 
  API.get<string[]>(`/lessons/pdf_urls?course=${courseName}`);

export const getLessonById = (id: number) => API.get<LessonRequest>(`/lessons/find/${id}`);

export const getVideoDuration = (videoFile: File) => {
  const formData = new FormData();
  formData.append('file', videoFile);
  return API.post<string>('/lessons/duration', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
