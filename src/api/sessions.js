import axiosInstance from './axios';

export const sessionService = {
  getAll: async (commissionId) => {
    const response = await axiosInstance.get(`/commissions/${commissionId}/sessions`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  create: async ({ commissionId, ...payload }) => {
    const response = await axiosInstance.post(`/commissions/${commissionId}/sessions`, payload);
    return response.data;
  },

  close: async (id) => {
    const response = await axiosInstance.patch(`/sessions/${id}/close`);
    return response.data;
  },
};
