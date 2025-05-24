import API from './api';
import { Category } from '../models/Category';

export const getCategories = () =>
  API.get<Category[]>('/categories');

export const getCategoriesPagination = (page: number, size: number) =>
  API.get(`/categories/all?page=${page}&size=${size}`);

export const getCategoryById = (id: number) => API.get<Category>(`/categories/${id}`);

// Aquí removemos idCategory antes de enviarlo
export const createCategory = (data: Category) => {
  const { idCategory, ...payload } = data;
  return API.post('/categories', payload);
};

export const updateCategory = (id: number, data: Category) => API.put(`/categories/${id}`, data);
export const deleteCategory = (id: number) => API.delete(`/categories/${id}`);
