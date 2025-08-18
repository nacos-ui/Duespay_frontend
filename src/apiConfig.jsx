// export const API_BASE_URL = "http://localhost:8000";
// export const API_BASE_URL = "https://duespay-backend.fly.dev";
export const API_BASE_URL = "https://duespay.onrender.com";
// export const API_BASE_URL = "https://duespay.pythonanywhere.com";

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login/`,
  SIGNUP: `${API_BASE_URL}/auth/register/`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/token/refresh/`,
  PASSWORD_RESET: `${API_BASE_URL}/auth/password-reset/`,
  PASSWORD_RESET_CONFIRM: `${API_BASE_URL}/auth/password-reset-confirm/`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google/`,

  // Payment items endpoints
  PAYMENT_ITEM_DETAILS: (id) => `${API_BASE_URL}/payment-items/${id}/`,
  PAYMENT_ITEMS: `${API_BASE_URL}/payment-items/`,

  // Transactions endpoints
  GET_PAYMENT_ASSOCIATION: (shortName) => `${API_BASE_URL}/get-association/${shortName?.toLowerCase()}/`,
  VERIFY_AND_CREATE_TRANSACTION: `${API_BASE_URL}/verify-and-create/`,
  GET_TRANSACTIONS: `${API_BASE_URL}/transactions/`,
  DETAIL_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/`,
  DELETE_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/`,
  VERIFY_EDIT_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/`,

  // Association Endpoints
  CREATE_ASSOCIATION: `${API_BASE_URL}/association/`,
  UPDATE_ASSOCIATION: (id) => `${API_BASE_URL}/association/${id}/`,
  GET_ASSOCIATION: `${API_BASE_URL}/association/`,

  // Payers endpoints
  GET_PAYERS: `${API_BASE_URL}/payers/`,
  GET_PAYER: (id) => `${API_BASE_URL}/payers/${id}/`,
  PAYER_CHECK: `${API_BASE_URL}/payer-check/`,

  // Bank account endpoints
  GET_CREATE_BANK_ACCOUNT: `${API_BASE_URL}/bank-account/`,
  UPDATE_DETAIL_BANK_ACCOUNT: (id) => `${API_BASE_URL}/bank-account/${id}/`,
  GET_BANKS: `${API_BASE_URL}/bank-account/all-banks/`,
  VERIFY_BANK: `${API_BASE_URL}/bank-account/verify/`,

  // Adminuser endpoints
  GET_ADMIN_USER: `${API_BASE_URL}/adminuser/`,
  UPDATE_ADMIN_USER: (id) => `${API_BASE_URL}/adminuser/${id}/`,

  // Session endpoints
  GET_SESSIONS: `${API_BASE_URL}/sessions/`,
  CREATE_SESSION: `${API_BASE_URL}/sessions/`,
  UPDATE_SESSION: (id) => `${API_BASE_URL}/sessions/${id}/`,
  SET_CURRENT_SESSION: (id) => `${API_BASE_URL}/sessions/${id}/set_current/`,
  GET_CURRENT_SESSION: `${API_BASE_URL}/sessions/current/`,
  GET_PROFILE: `${API_BASE_URL}/association/profile/`,

  // Notifications endpoints
  NOTIFICATIONS: `${API_BASE_URL}/notifications/`,
  UNREAD_NOTIFICATIONS_COUNT: `${API_BASE_URL}/notifications/unread-count/`,
  MARK_ALL_NOTIFICATIONS_READ: `${API_BASE_URL}/notifications/mark-all-read/`,
  GET_RECEIPT: (receipt_id) => `${API_BASE_URL}/receipts/${receipt_id}/`,

  // initiate payment
  PAYMENT_INITIATE: `${API_BASE_URL}/payment/initiate/`,
  PAYMENT_STATUS: (transaction_id) => `${API_BASE_URL}/payment/status/${transaction_id}/`
};