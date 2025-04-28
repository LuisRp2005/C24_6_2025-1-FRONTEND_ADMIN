import API from './api';
import { Lesson } from '../models/Lesson';


export const getLessons = () => API.get<Lesson[]>('/lessons');

export const createLesson = (data: Lesson) => API.post('/api/v1/lessons', data);

export const getLessonsByCourseId = (courseId: number) => API.get<Lesson[]>(`/api/v1/lessons/${courseId}/lessons`);

export const getPdfUrls = () => API.get<string[]>('/api/v1/lessons/api/lessons/pdf_urls');
