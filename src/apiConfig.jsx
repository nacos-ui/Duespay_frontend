export const API_BASE_URL = "http://localhost:8000"; 
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  SIGNUP: `${API_BASE_URL}/auth/register/`,
  PAYMENT_ITEMS: `${API_BASE_URL}/payment-items/`,
  PAYMENT_ITEM_DETAILS: (id) => `${API_BASE_URL}/payment-items/${id}/`,
  USER_PROFILE: `${API_BASE_URL}/user/profile/`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/update/`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications/`,
  MARK_NOTIFICATION_READ: (id) => `${API_BASE_URL}/notifications/${id}/read/`,
};