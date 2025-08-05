import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Helper to check if JWT is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false;
    // Check if token is expired (no buffer needed)
    return (decoded.exp * 1000) < Date.now();
  } catch {
    return true;
  }
}

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize state immediately based on refresh token
    const refreshToken = localStorage.getItem('refresh_token');
    return refreshToken && !isTokenExpired(refreshToken);
  });

  useEffect(() => {
    const checkAuth = () => {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken || isTokenExpired(refreshToken)) {
        // Refresh token is expired or missing
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        return;
      }

      // Valid refresh token = authenticated
      // Don't check access token here - let axios interceptor handle it
      setIsAuthenticated(true);
    };

    checkAuth();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'refresh_token' || e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // No loading screen - immediate decision based on refresh token
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;