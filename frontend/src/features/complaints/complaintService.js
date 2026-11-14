import apiClient from '../../api/axios';

export const complaintService = {
  getComplaints: async ({ search = '', status = '', page = 1 } = {}) => {
    const params = {};
    if (search && search.trim()) params.search = search.trim();
    if (status && status !== 'All Status') params.status = status;
    if (page) params.page = page;

    const response = await apiClient.get('/complaints', { params });
    return response.data;
  },

  getComplaintById: async (id) => {
    const response = await apiClient.get(`/complaints/${id}`);
    return response.data;
  },

  createComplaint: async (data) => {
    const response = await apiClient.post('/complaints', data);
    return response.data;
  },

  updateComplaint: async (id, data) => {
    const response = await apiClient.put(`/complaints/${id}`, data);
    return response.data;
  },

  updateComplaintStatus: async (id, status) => {
    const response = await apiClient.put(`/complaints/${id}/status`, { status });
    return response.data;
  },

  deleteComplaint: async (id) => {
    const response = await apiClient.delete(`/complaints/${id}`);
    return response.data;
  },

  addComment: async (id, text) => {
    const response = await apiClient.post(`/complaints/${id}/comments`, { text });
    return response.data;
  },
};

export default complaintService;
