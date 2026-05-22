import API from './api';

export const authService = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data; // { success, message, data: { token, user } }
  },

  register: async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res.data;
  },
};
