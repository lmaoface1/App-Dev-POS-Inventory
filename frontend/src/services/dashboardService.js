import API from './api';

export const dashboardService = {
  getSummary: async () => {
    const res = await API.get('/dashboard/summary');
    return res.data;
  },

  getSalesByDay: async () => {
    const res = await API.get('/dashboard/sales-by-day');
    return res.data;
  },

  getTopProducts: async () => {
    const res = await API.get('/dashboard/top-products');
    return res.data;
  },
};
