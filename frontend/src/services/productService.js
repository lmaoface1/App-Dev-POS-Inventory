import API from './api';

export const productService = {
  getAll: async () => {
    const res = await API.get('/products');
    return res.data;
  },

  getById: async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
  },

  create: async (productData) => {
    const res = await API.post('/products', productData);
    return res.data;
  },

  update: async (id, productData) => {
    const res = await API.put(`/products/${id}`, productData);
    return res.data;
  },

  delete: async (id) => {
    const res = await API.delete(`/products/${id}`);
    return res.data;
  },
};

export const inventoryService = {
  getAll: async () => {
    const res = await API.get('/inventory');
    return res.data;
  },

  getLowStock: async () => {
    const res = await API.get('/inventory/low-stock');
    return res.data;
  },

  adjustStock: async (id, quantity) => {
    const res = await API.put(`/inventory/${id}`, { quantity });
    return res.data;
  },
};
