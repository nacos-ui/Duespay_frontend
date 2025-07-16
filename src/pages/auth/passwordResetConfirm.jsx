import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../apiConfig';
import SubmitButton from '../../appComponents/SubmitButton';
import { usePageTitle } from '../../hooks/usePageTitle';

const PasswordResetConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [invalidToken, setInvalidToken] = useState(false);

  usePageTitle("Reset Password - DuesPay");

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  useEffect(() => {
    if (!token || !uid) {
      setInvalidToken(true);
    }
  }, [token, uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({confirmPassword: 'Passwords do not match'});
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.PASSWORD_RESET_CONFIRM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          uid,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } else {
        // Handle field-specific errors
        if (data.errors && typeof data.errors === 'object') {
          setFieldErrors(data.errors);
        }
        
        // Handle general error message
        if (data.message || data.detail) {
          setError(data.message || data.detail);
        } else if (!data.errors) {
          setError('Failed to reset password. Please try again.');
        }
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      console.error('Password reset confirm error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (invalidToken) {
    return (
      <div className="min-h-screen bg-[#0F111F] flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-600 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h2>
            <p className="text-gray-400 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0F111F] flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
            <p className="text-gray-400 mb-6">
              Your password has been successfully reset. You can now login with your new password.
            </p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
              <span className="ml-2 text-gray-400">Redirecting to login...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F111F] flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="space-y-6">
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
            <h2 className="text-2xl font-bold text-white mb-2">Set New Password</h2>
            <p className="text-gray-400">Enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <SubmitButton
              loading={loading}
              loadingText="Resetting Password..."
              type="submit"
            >
              Reset Password
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;