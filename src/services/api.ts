import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get('/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export default api;
