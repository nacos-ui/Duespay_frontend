import React from 'react';

const FormInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required = false,
  themeColor
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 outline-none"
        style={{
          '--tw-ring-color': `${themeColor}30`,
          focusRingColor: themeColor,
        }}
        onFocus={(e) => {
          e.target.style.ringColor = themeColor;
          e.target.style.borderColor = themeColor;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '';
        }}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;