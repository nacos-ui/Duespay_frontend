import React, { useState } from 'react';
import { Eye, EyeOff, Check, ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';

// Animated Input Component with floating labels
const AnimatedInput = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  label, 
  required = false, 
  disabled = false, 
  error = null,
  icon: Icon = null,
  showPasswordToggle = false,
  onTogglePassword = null,
  showPassword = false
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full h-14 px-4 ${Icon ? 'pl-12' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'}
            bg-gray-800/30 backdrop-blur-sm border-2 rounded-xl text-white
            transition-all duration-300 ease-out
            focus:outline-none focus:bg-gray-800/50
            ${focused || hasValue 
              ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
              : error 
                ? 'border-red-500/60' 
                : 'border-gray-700/60 hover:border-gray-600/80'
            }
          `}
          required={required}
          disabled={disabled}
        />
        
        {/* Floating Label */}
        <label className={`
          absolute left-4 ${Icon ? 'left-12' : 'left-4'} transition-all duration-300 ease-out pointer-events-none
          ${focused || hasValue
            ? '-top-2.5 text-xs bg-gray-900 px-2 text-purple-400 font-medium'
            : 'top-1/2 transform -translate-y-1/2 text-gray-400'
          }
        `}>
          {label}
        </label>

        {/* Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors z-10"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-400 animate-fadeIn">
          {error}
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;