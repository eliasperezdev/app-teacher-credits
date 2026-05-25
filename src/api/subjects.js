import axiosInstance from './axios';

export const subjectService = {
  getAll: async () => {
    const response = await axiosInstance.get('/subjects');
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/subjects/${id}`);
    return response.data;
  },

  create: async (payload) => {
    const response = await axiosInstance.post('/subjects', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await axiosInstance.patch(`/subjects/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosInstance.delete(`/subjects/${id}`);
    return response.data;
  },
};
