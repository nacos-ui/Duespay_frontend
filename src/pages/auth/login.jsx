import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { API_ENDPOINTS } from '../../apiConfig';
import StatusMessage from '../../appComponents/StatusMessage';
import SubmitButton from '../../appComponents/SubmitButton';
import { usePageTitle } from '../../hooks/usePageTitle';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils'; // Add this import

const loginURL = API_ENDPOINTS.LOGIN;

const LoginForm = ({ onToggle, onForgotPassword }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  usePageTitle("Login - DuesPay");
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Use fetchWithTimeout instead of direct api call
      const response = await fetchWithTimeout(loginURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      }, 15000); // 15 second timeout for login

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        setSuccess('Login successful!');
        
        setTimeout(() => {
          if (data.is_first_login) {
            navigate('/create-association');
          } else {
            navigate('/dashboard/overview');
          }
        }, 1500);
      } else {
        setError(data.message || data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Use the error handler for consistent timeout/network error messages
      const errorInfo = handleFetchError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // const onForgotPassword = () => {
  //   // Handle forgot password logic here
  //   console.log("Forgot password clicked");
  // };

  return (
    <div className="space-y-6 transition-colors duration-300">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-none rounded-lg">
            <img
              src="/Duespay_logo.png"
              alt="DuesPay Logo"
              className="h-16 w-16 mx-auto mb-4 rounded-xl bg-transparent object-cover"
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400">Welcome back! Please enter your details.</p>
      </div>

      <div className="space-y-4">
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Enter your username"
            className="w-full px-4 py-3 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors
              bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors
                bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <SubmitButton
          loading={loading}
          loadingText="Signing In..."
          onClick={handleSubmit}
          type="submit"
        >
          Sign In
        </SubmitButton>
      </div>

      <div className="text-center">
        <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
        <button
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;