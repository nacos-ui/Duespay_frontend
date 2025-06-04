import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingCart, Loader2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../apiConfig';
import StatusMessage from '../../appComponents/StatusMessage';
import SubmitButton from '../../appComponents/SubmitButton';

const loginURL = API_ENDPOINTS.LOGIN;

const LoginForm = ({ onToggle }) => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(loginURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        setSuccess('Login successful!');
        setTimeout(() => {
          if (data.is_first_login) {
            navigate('/create-association');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setError(data.message || data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-600 p-2 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Welcome back! Please enter your details.</p>
      </div>

      <div className="space-y-4">
        {error && <StatusMessage type="error">{error}</StatusMessage>}
        {success && <StatusMessage type="success">{success}</StatusMessage>}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Enter your username"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            required
            disabled={loading}
            // disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Password"
              className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
              disabled={loading}
            //   disabled={loading}
            //   disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            Forgot Password?
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
        <span className="text-gray-400">Don't have an account? </span>
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