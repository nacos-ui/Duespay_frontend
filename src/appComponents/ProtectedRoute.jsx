import { Navigate, Outlet } from 'react-router-dom';

// Helper to check if JWT is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false; // If no exp, treat as not expired
    // exp is in seconds, Date.now() in ms
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true; // If token can't be decoded, treat as expired
  }
}

function ProtectedRoute() {
  const token = localStorage.getItem('access_token');
  const expired = isTokenExpired(token);
  return expired ? <Navigate to="/auth" /> : <Outlet />;
}

export default ProtectedRoute;