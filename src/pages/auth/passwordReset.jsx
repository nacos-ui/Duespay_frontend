import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../apiConfig';
import SubmitButton from '../../components/SubmitButton';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { usePageTitle } from '../../hooks/usePageTitle';
import AnimatedInput from './animatedInput';

const PasswordReset = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  usePageTitle("Reset Password - DuesPay");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const response = await fetchWithTimeout(API_ENDPOINTS.PASSWORD_RESET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      }, 20000);

      const responseData = await response.json();
      const data = responseData.data;

      if (response.ok) {
        setSuccess(true);
      } else {
        if (data.errors && typeof data.errors === 'object') {
          setFieldErrors(data.errors);
        }
        
        if (data.message || data.detail) {
          setError(data.message || data.detail);
        } else if (!data.errors) {
          setError('Failed to send reset email. Please try again.');
        }
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      setError(errorInfo.message);
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-600 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
        <p className="text-gray-400 mb-6">
          We've sent a password reset link to <span className="text-white font-medium">{email}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Click the link in the email to reset your password. If you don't see the email, check your spam folder.
        </p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-purple-600 p-3 rounded-full">
            <Mail className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <AnimatedInput
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          error={fieldErrors.email}
        />

        <SubmitButton
          loading={loading}
          loadingText="Sending Reset Link..."
          type="submit"
        >
          Send Reset Link
        </SubmitButton>
      </form>

      <div className="text-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;