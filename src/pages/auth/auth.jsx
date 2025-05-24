import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import LoginForm from './login';
import SignupForm from './signup';

export const API_BASE_URL = 'http://localhost:8000';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Side Image - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
          {/* Topographic pattern overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="topo" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M10,2 C15,8 18,12 10,18 C2,12 5,8 10,2 Z"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
                <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.05)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo)" />
          </svg>
          
          {/* Floating elements for visual interest */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-400/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center text-white space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-white" />
                <h1 className="text-3xl font-bold mb-2">DuesPay</h1>
                <p className="text-lg text-white/80">Streamline your university payment collections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggle={toggleForm} />
          ) : (
            <SignupForm onToggle={toggleForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;