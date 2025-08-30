import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_ENDPOINTS } from '../../apiConfig';
import StatusMessage from '../../components/StatusMessage';
import SubmitButton from '../../components/SubmitButton';
import { usePageTitle } from '../../hooks/usePageTitle';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { useSession } from '../../contexts/SessionContext';
import AnimatedInput from './animatedInput';

const loginURL = API_ENDPOINTS.LOGIN;

const LoginForm = ({ onToggle, onForgotPassword }) => {
  const navigate = useNavigate();
  const { refreshData } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  usePageTitle("Login - DuesPay");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Google login handler
  const handleGoogleLogin = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithTimeout(API_ENDPOINTS.GOOGLE_AUTH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token })
      }, 15000);
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        const data = responseData.data;
        // Store tokens, refresh session, and redirect
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        await refreshData();
        setSuccess('Login successful!');
        setTimeout(() => {
          if (data.is_first_login) {
            navigate('/create-association');
          } else {
            navigate('/dashboard/overview');
          }
        }, 1500);
      } else {
        setError(responseData?.message || data?.message || data?.detail || 'Google login failed.');
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetchWithTimeout(loginURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      }, 15000);

      const responseData = await response.json();

      if (response.ok) {
        const data = responseData.data;
        const accessToken = data.access;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', data.refresh);
        await refreshData();
        setSuccess('Login successful!');
        setTimeout(() => {
          if (data.is_first_login) {
            navigate('/create-association');
          } else {
            navigate('/dashboard/overview');
          }
        }, 1500);
      } else {
        setError(responseData?.message || responseData?.data?.errors[0] || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        {/* <div className="flex items-center justify-center mb-2">
          <div className="bg-none rounded-lg">
            <img
              src="/Duespay_logo.png"
              alt="DuesPay Logo"
              className="h-16 w-16 mx-auto mb-4 rounded-xl bg-transparent object-cover"
            />
          </div>
        </div> */}
        <h2 className="text-2xl font-bold mb-2 text-white">Welcome Back</h2>
        <p className="text-gray-400">Welcome back! Please enter your details.</p>
      </div>

      <div className="space-y-4">
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}

        <AnimatedInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          required
        />

        <AnimatedInput
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={loading}
          required
        >
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </AnimatedInput>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700 rounded"
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
          type="submit"
        >
          Sign In
        </SubmitButton>
      </div>

        {/* Google Login Button */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-full flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google login failed.")}
              theme="filled_black"
              text="signin_with"
              shape="pill"
            />
        </div>
      </div>
      
      <div className="text-center">
        <span className="text-gray-400">Don't have an account? </span>
        <button
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default LoginForm;