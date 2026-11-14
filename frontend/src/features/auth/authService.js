import apiClient from '../../api/axios';

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post('/users/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.put('/users/change-password', data);
    return response.data;
  },

  getUsers: async (search = '') => {
    const params = search ? { search } : {};
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

export default authService;
