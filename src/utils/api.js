import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Fixed: match your login storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token'); // Fixed: match your login storage
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_ENDPOINTS.BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access); // Fixed: match your login storage

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token'); // Fixed: match your login storage
        localStorage.removeItem('refresh_token'); // Fixed: match your login storage
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Create a fetch-like wrapper that works exactly like your existing fetch calls
const api = async (url, options = {}) => {
  try {
    const config = {
      url: url.startsWith('http') ? url : url,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: {
        ...options.headers,
      }
    };

    const response = await axiosInstance(config);
    
    // Make it behave like fetch
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
      headers: response.headers,
    };
  } catch (error) {
    // Make it behave like fetch for errors
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        statusText: error.response.statusText,
        json: async () => error.response.data,
        text: async () => JSON.stringify(error.response.data),
        headers: error.response.headers,
      };
    }
    throw error;
  }
};

export default api;