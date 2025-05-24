import API from './api';
import { Course } from '../models/Course';
import { CourseEditDTO } from '../models/CourseEditDTO'

export const getCourses = (page = 0, size = 5) =>
  API.get(`/courses?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });

export const getCourseById = (id: number) => API.get<CourseEditDTO>(`/courses/admin/${id}`, {
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




