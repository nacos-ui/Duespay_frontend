import { handleFetchError } from '../utils/fetchUtils';

export async function fetchWithErrorModal(fetchPromise, setModalError) {
  try {
    const res = await fetchPromise;
    if (!res.ok) {
      // Handle HTTP errors (4xx, 5xx)
      const error = new Error(`HTTP ${res.status}: ${res.statusText}`);
      error.response = res;
      throw error;
    }
    return res;
  } catch (err) {
    // Use the enhanced error handler for better messages
    const errorInfo = handleFetchError(err);
    
    setModalError({
      open: true,
      title: getErrorTitle(errorInfo.type),
      message: errorInfo.message
    });
    
    throw err; // Re-throw for calling code that might need it
  }
}

// Helper function to get appropriate error titles
function getErrorTitle(errorType) {
  switch (errorType) {
    case 'timeout':
      return 'Request Timeout';
    case 'network':
      return 'Network Error';
    case 'auth':
      return 'Authentication Error';
    case 'permission':
      return 'Permission Denied';
    case 'notfound':
      return 'Not Found';
    case 'server':
      return 'Server Error';
    default:
      return 'Error';
  }
}