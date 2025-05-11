import API from './api';
import { User } from '../models/User';

export interface UserIdAndRoleResponse {
  idUser: number;
  role: string;
}

export const getCurrentUser = () => API.get<User>('/users/me', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export const getCurrentUserId = () => {
  return API.get('/users/me/id', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// 📌 Nuevo método para obtener ID y rol
export const getCurrentUserIdAndRole = () => {
  return API.get<UserIdAndRoleResponse>('/users/me/id', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export const getUsers = () => {
  return API.get<User[]>('/users');
};
