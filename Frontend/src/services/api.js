import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '';
const API = axios.create({ baseURL: `${BASE}/api` });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('qf-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && localStorage.getItem('qf-token')) {
      localStorage.removeItem('qf-token');
      localStorage.removeItem('qf-user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const fetchProducts = () => API.get('/products').then((r) => r.data);

export const submitOrder = (data) => API.post('/orders', data).then((r) => r.data);

export const subscribeNewsletter = (data) => API.post('/newsletter', data).then((r) => r.data);

export const registerUser = (data) => API.post('/users/register', data).then((r) => r.data);

export const loginUser = (data) => API.post('/users/login', data).then((r) => r.data);

export const forgotPassword = (data) => API.post('/users/forgot-password', data).then((r) => r.data);

export const resetPassword = (data) => API.post('/users/reset-password', data).then((r) => r.data);

export const getProfile = () => API.get('/users/profile').then((r) => r.data);

export const updateProfile = (data) => API.put('/users/profile', data).then((r) => r.data);

export const getMyOrders = () => API.get('/orders/myorders').then((r) => r.data);

export const getOrderCount = () => API.get('/orders/count').then((r) => r.data);

export default API;
