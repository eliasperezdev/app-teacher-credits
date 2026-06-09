import axiosInstance from './axios';

export const raffleService = {
  create: async ({ sessionId, ...payload }) => {
    const response = await axiosInstance.post(`/sessions/${sessionId}/raffles`, payload);
    return response.data;
  },

  getAll: async (sessionId) => {
    const response = await axiosInstance.get(`/sessions/${sessionId}/raffles`);
    return response.data;
  },

  resolveResult: async ({ resultId, ...payload }) => {
    const response = await axiosInstance.patch(`/raffle-results/${resultId}/status`, payload);
    return response.data;
  },

  rerun: async ({ sessionId, raffleId, resultIds }) => {
    const response = await axiosInstance.post(`/sessions/${sessionId}/raffles/${raffleId}/rerun`, { resultIds });
    return response.data;
  },
};
