import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_ENDPOINTS } from '../../apiConfig';
import SubmitButton from '../../components/SubmitButton';
import { usePageTitle } from '../../hooks/usePageTitle';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';
import { useNavigate } from 'react-router-dom';
import AnimatedInput from './animatedInput'; // Import the new component

const signupURL = API_ENDPOINTS.SIGNUP;

const SignupForm = ({ onToggle }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  usePageTitle("Sign Up - DuesPay");
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithTimeout(signupURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone_number: formData.phone_number,
          password: formData.password
        })
      }, 20000);

      const data = await response.json();

      if (response.ok) {
        if (data.access) localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

        setSuccess(true);
        setTimeout(() => {
          if (data.is_first_login) {
            navigate('/create-association');
          } else {
            navigate('/dashboard/overview');
          }
        }, 1500);
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        } else {
          setError(data.message || data.detail || 'Signup failed. Please try again.');
        }
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    try {
      const response = await fetchWithTimeout(API_ENDPOINTS.GOOGLE_AUTH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token })
      }, 15000);
      const data = await response.json();
      if (response.ok) {
        if (data.access) localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

        setSuccess(true);
        setTimeout(() => {
          if (data.is_first_login) {
            navigate('/create-association');
          } else {
            navigate('/dashboard/overview');
          }
        }, 1500);
      } else {
        setError(data.message || data.detail || 'Google signup failed.');
      }
    } catch (err) {
      const errorInfo = handleFetchError(err);
      setError(errorInfo.message);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-green-600 p-2 rounded-lg">
            <Check className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
        <p className="text-gray-400">Your account has been successfully created. You can now sign in.</p>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join us today! Please fill in your details.</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <AnimatedInput
          id="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          disabled={loading}
          required
          error={fieldErrors.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <AnimatedInput
            id="first_name"
            label="First Name"
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            disabled={loading}
            required
            error={fieldErrors.first_name}
          />
          <AnimatedInput
            id="last_name"
            label="Last Name"
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            disabled={loading}
            required
            error={fieldErrors.last_name}
          />
        </div>

        <AnimatedInput
          id="phone_number"
          label="Phone Number (e.g., +2349034049655)"
          type="text"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          disabled={loading}
          required
          error={fieldErrors.phone_number}
        />

        <AnimatedInput
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          disabled={loading}
          required
          error={fieldErrors.password}
        >
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </AnimatedInput>

        <AnimatedInput
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          disabled={loading}
          required
          error={fieldErrors.confirmPassword}
        >
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </AnimatedInput>

        <SubmitButton
          loading={loading}
          loadingText="Creating Account..."
          type="submit"
        >
          Create Account
        </SubmitButton>
      </div>
    
      {/* Google Signup Button */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-full flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSignup}
              onError={() => setError("Google signup failed.")}
              theme="filled_black"
              text="signup_with"
              shape="pill"
            />
        </div>
      </div>

      <div className="text-center">
        <span className="text-gray-400">Already have an account? </span>
        <button
          type="button"
          onClick={onToggle}
          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default SignupForm;