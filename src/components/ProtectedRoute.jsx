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
    // Initialize state immediately based on access token
    const accessToken = localStorage.getItem('access_token');
    return accessToken && !isTokenExpired(accessToken);
  });

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken || isTokenExpired(accessToken)) {
        // Access token is expired or missing
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        return;
      }

      // Valid access token = authenticated
      setIsAuthenticated(true);
    };

    checkAuth();

    // Listen for storage changes (logout from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // No loading screen - immediate decision based on access token
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;