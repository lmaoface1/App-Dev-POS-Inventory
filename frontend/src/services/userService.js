import API from './api';

export const userService = {
  getAll: async () => {
    const res = await API.get('/users');
    return res.data;
  },

  create: async (userData) => {
    // Reuses /auth/register — only admin can call this
    const res = await API.post('/auth/register', userData);
    return res.data;
  },

  update: async (id, userData) => {
    const res = await API.put(`/users/${id}`, userData);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/users/${id}`);
    return res.data;
  },
};
