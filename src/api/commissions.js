import axiosInstance from './axios';

export const commissionService = {
  getAll: async (subjectId) => {
    const response = await axiosInstance.get(`/subjects/${subjectId}/commissions`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/commissions/${id}`);
    return response.data;
  },

  create: async ({ subjectId, ...payload }) => {
    const response = await axiosInstance.post(`/subjects/${subjectId}/commissions`, payload);
    return response.data;
  },

  update: async ({ id, ...payload }) => {
    const response = await axiosInstance.patch(`/commissions/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosInstance.delete(`/commissions/${id}`);
    return response.data;
  },
};
