import React from 'react';
import { User, Mail, Phone, IdCard, Building, GraduationCap } from 'lucide-react';

const getIcon = (label) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('name')) return User;
  if (lowerLabel.includes('email')) return Mail;
  if (lowerLabel.includes('phone')) return Phone;
  if (lowerLabel.includes('matric')) return IdCard;
  if (lowerLabel.includes('faculty')) return Building;
  if (lowerLabel.includes('department')) return GraduationCap;
  return User;
};

const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  themeColor,
  error
}) => {
  const Icon = getIcon(label);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: themeColor }} />
          {label}
          {required && <span className="text-red-500 dark:text-red-400">*</span>}
        </div>
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-5 py-4 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:border-transparent transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 outline-none ${
            error 
              ? 'border-red-500 dark:border-red-400 focus:ring-red-500/20 shadow-lg shadow-red-500/20' 
              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
          }`}
          style={{
            '--tw-ring-color': error ? '#ef444420' : `${themeColor}30`,
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = themeColor;
              e.target.style.boxShadow = `0 0 0 4px ${themeColor}20`;
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = '';
              e.target.style.boxShadow = '';
            }
          }}
          placeholder={placeholder}
          required={required}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-30">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <span className="w-1 h-1 rounded-full bg-red-500"></span>
          {error}
        </div>
      )}
    </div>
  );
};

export default FormInput;