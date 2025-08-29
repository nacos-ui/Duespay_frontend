import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Upload, ShoppingCart } from 'lucide-react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  error = null,
  description = null
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-2 mb-6">
      <label htmlFor={name} className="block text-sm font-semibold text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      <div className="relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-4 bg-[#101828] border rounded-xl text-white placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#8200db] focus:border-transparent hover:bg-[#0f111f] ${
            error 
              ? 'border-red-400 focus:ring-red-500' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;