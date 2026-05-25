import axiosInstance from './axios';

const extractToken = (data) => {
  if (data.token) return data.token;
  if (data.access_token) return data.access_token;
  if (data.data?.token) return data.data.token;
  if (data.data?.access_token) return data.data.access_token;
  return null;
};

export const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    const token = extractToken(response.data);
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    console.log('getCurrentUser - token en localStorage:', token);
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
