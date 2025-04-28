import API from './api';

export const login = (email: string, password: string) =>
  API.post('/auth/login', { email, password });

