import axiosInstance from './axios';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const publicService = {
  getPublicGroups: async (slug) => {
    const response = await axios.get(`${API_URL}/public/${slug}/groups`);
    return response.data;
  },

  generatePublicLink: async (commissionId) => {
    const response = await axiosInstance.post(`/commissions/${commissionId}/public-link`);
    return response.data;
  },

  revokePublicLink: async (commissionId) => {
    const response = await axiosInstance.delete(`/commissions/${commissionId}/public-link`);
    return response.data;
  },
};
