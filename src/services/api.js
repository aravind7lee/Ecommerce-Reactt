import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-api-kt5a.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getByUserId: (userId) => api.get(`/orders?userId=${userId}`),
  create: (order) => api.post('/orders', order),
  update: (id, order) => api.put(`/orders/${id}`, order),
};

// Addresses API
export const addressesAPI = {
  getByUserId: (userId) => api.get(`/addresses?userId=${userId}`),
  create: (address) => api.post('/addresses', address),
  update: (id, address) => api.put(`/addresses/${id}`, address),
  delete: (id) => api.delete(`/addresses/${id}`),
};

export default api;