import axiosInstance from './axios';

export const creditService = {
  getAll: async (groupId) => {
    const response = await axiosInstance.get(`/groups/${groupId}/credits`);
    return response.data;
  },

  create: async ({ groupId, ...payload }) => {
    const response = await axiosInstance.post(`/groups/${groupId}/credits`, payload);
    return response.data;
  },

  quickCredit: async ({ groupId, ...payload }) => {
    const response = await axiosInstance.post(`/groups/${groupId}/credits/quick`, payload);
    return response.data;
  },

  reverse: async (id) => {
    const response = await axiosInstance.post(`/credits/${id}/reverse`, {});
    return response.data;
  },

  getSummary: async (commissionId) => {
    const response = await axiosInstance.get(`/commissions/${commissionId}/credits/summary`);
    return response.data;
  },
};
