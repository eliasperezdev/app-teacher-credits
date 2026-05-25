import axiosInstance from './axios';

export const groupService = {
  getAll: async (commissionId) => {
    const response = await axiosInstance.get(`/commissions/${commissionId}/groups`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/groups/${id}`);
    return response.data;
  },

  create: async ({ commissionId, ...payload }) => {
    const response = await axiosInstance.post(`/commissions/${commissionId}/groups`, payload);
    return response.data;
  },

  update: async ({ id, ...payload }) => {
    const response = await axiosInstance.patch(`/groups/${id}`, payload);
    return response.data;
  },

  remove: async (id) => {
    const response = await axiosInstance.delete(`/groups/${id}`);
    return response.data;
  },

  addMember: async ({ groupId, studentId }) => {
    const response = await axiosInstance.post(`/groups/${groupId}/members`, { studentId });
    return response.data;
  },

  removeMember: async ({ groupId, studentId }) => {
    const response = await axiosInstance.delete(`/groups/${groupId}/members/${studentId}`);
    return response.data;
  },
};
