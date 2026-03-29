import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_URL = `${BASE_URL}/api`;
const TOKEN_KEY = 'token';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

// Request interceptor — attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and 403 errors, auto-unwrap { success, data }
axiosInstance.interceptors.response.use(
  (response) => {
    // Auto-unwrap { success: true, data: ... } format
    if (response.data && response.data.success === true && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token missing, expired, or invalid — clear and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    } else if (status === 403) {
      // Let the component handle 403 errors
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
