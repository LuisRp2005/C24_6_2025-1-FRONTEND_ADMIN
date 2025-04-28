import API from './api';
import { Course } from '../models/Course';

export const getCourses = () => API.get<Course[]>('/courses', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getCourseById = (id: number) => API.get<Course>(`/courses/${id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const createCourse = (data: any) => API.post('/courses', data, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const updateCourse = (id: number, data: any) => API.put(`/courses/${id}`, data, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const deleteCourse = (id: number) => API.delete(`/courses/${id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
