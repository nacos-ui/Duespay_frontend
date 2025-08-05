import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Access token expired, refreshing silently...');
        
        const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, {
          refresh: refreshToken
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        console.log('Token refreshed successfully');

        // Process queued requests
        processQueue(null, access);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Clear all auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        // Only redirect if it's a refresh token error (not network error)
        if (refreshError.response?.status === 401) {
          window.location.href = '/auth';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
      headers: {
        ...options.headers,
      }
    };

    // Handle different body types - KEEP IT SIMPLE
    if (options.body) {
      if (options.body instanceof FormData) {
        // For FormData, pass it directly and remove Content-Type
        delete config.headers['Content-Type'];
        config.data = options.body;
      } else if (typeof options.body === 'string') {
        // For JSON strings, pass directly as string
        config.data = options.body;
      } else {
        // For objects, stringify
        config.data = JSON.stringify(options.body);
      }
    }

    const response = await axiosInstance(config);
    
    // Make it behave like fetch
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      statusText: response.statusText,
      json: async () => response.data,
      text: async () => JSON.stringify(response.data),
      headers: response.headers,
      blob: async () => response.data, // For file downloads
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