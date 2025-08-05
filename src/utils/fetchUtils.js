import api from './api';

// Enhanced fetchWithTimeout that uses the api wrapper with automatic token refresh
export const fetchWithTimeout = async (url, options = {}, timeout = 30000) => {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeout}ms`));
    }, timeout);

    try {
      const response = await api(url, options);
      clearTimeout(timeoutId);
      resolve(response);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
};

// Enhanced error handler
export const handleFetchError = (error) => {
  console.error('Fetch error:', error);
  
  if (error.message?.includes('timeout')) {
    return {
      message: "Request timed out. Please check your connection and try again.",
      type: "timeout"
    };
  }
  
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return {
      message: "Network error. Please check your internet connection.",
      type: "network"
    };
  }
  
  if (error.response?.status === 401) {
    return {
      message: "Authentication failed. Please log in again.",
      type: "auth"
    };
  }
  
  if (error.response?.status === 403) {
    return {
      message: "You don't have permission to perform this action.",
      type: "permission"
    };
  }
  
  if (error.response?.status === 404) {
    return {
      message: "The requested resource was not found.",
      type: "notfound"
    };
  }
  
  if (error.response?.status >= 500) {
    return {
      message: "Server error. Please try again later.",
      type: "server"
    };
  }
  
  return {
    message: error.message || "An unexpected error occurred. Please try again.",
    type: "unknown"
  };
};