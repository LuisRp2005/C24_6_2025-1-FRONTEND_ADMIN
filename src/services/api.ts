import axios from 'axios';
import { removeAuthToken } from '../auth';

const API = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si recibimos un 401, eliminamos el token y redirigimos al login
      removeAuthToken();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default API;
