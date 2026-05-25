import axiosInstance from './axios';

export const studentService = {
  importStudents: async (commissionId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post(
      `/commissions/${commissionId}/students/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getAll: async (commissionId) => {
    const response = await axiosInstance.get(`/commissions/${commissionId}/students`);
    return response.data;
  },

  enroll: async ({ commissionId, ...payload }) => {
    const response = await axiosInstance.post(
      `/commissions/${commissionId}/students`,
      payload
    );
    return response.data;
  },

  unenroll: async ({ commissionId, studentId }) => {
    const response = await axiosInstance.delete(
      `/commissions/${commissionId}/students/${studentId}`
    );
    return response.data;
  },
};
