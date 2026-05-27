import API from './api';

export const dashboardService = {
  // Returns the summary object directly (not wrapped in .data again)
  getSummary: () => API.get('/dashboard/summary'),

  // Returns array of { day, total }
  getSalesByDay: () => API.get('/dashboard/sales-by-day'),

  // Returns array of { product_id, name, total_quantity, total_revenue }
  getTopProducts: () => API.get('/dashboard/top-products'),
};