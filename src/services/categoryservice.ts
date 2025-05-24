import API from './api';
import { Category } from '../models/Category';

export const getCategories = (page = 0, size = 5) =>
  API.get(`/categories?page=${page}&size=${size}`);

export const getCategoryById = (id: number) => API.get<Category>(`/categories/${id}`);

// Aquí removemos idCategory antes de enviarlo
export const createCategory = (data: Category) => {
  const { idCategory, ...payload } = data;
  return API.post('/categories', payload);
};

export const updateCategory = (id: number, data: Category) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id: number) => API.delete(`/categories/${id}`);
