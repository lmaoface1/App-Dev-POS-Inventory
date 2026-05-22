import API from './api';

export const salesService = {
  // Cashier: process a sale
  processSale: async (saleData) => {
    // saleData = { items: [{ product_id, quantity, unit_price }] }
    const res = await API.post('/sales', saleData);
    return res.data;
  },

  // Admin: get all sales
  getAll: async () => {
    const res = await API.get('/sales');
    return res.data;
  },

  // Admin: get single sale with items
  getById: async (id) => {
    const res = await API.get(`/sales/${id}`);
    return res.data;
  },
};
