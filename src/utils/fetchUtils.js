export const fetchWithTimeout = (url, options = {}, timeout = 30000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => {
    clearTimeout(timeoutId);
  });
};

export const handleFetchError = (error) => {
  if (error.name === 'AbortError') {
    return {
      isTimeout: true,
      message: "Request timed out. Please check your connection and try again."
    };
  }
  
  if (error.message && error.message.includes('fetch')) {
    return {
      isTimeout: false,
      message: "Network error. Please check your connection and try again."
    };
  }
  
  return {
    isTimeout: false,
    message: error.message || "An unexpected error occurred."
  };
};