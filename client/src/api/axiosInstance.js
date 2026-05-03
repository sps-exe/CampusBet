import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ───────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from auth store (avoid circular import by reading localStorage)
    const token = localStorage.getItem('cb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle errors ───────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('cb_token');
      localStorage.removeItem('cb_user');
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('You don\'t have permission to do that.');
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (status >= 500) {
      toast.error('Server error. Try again in a bit.');
    } else if (status === 404) {
      // Let individual callers handle 404
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
