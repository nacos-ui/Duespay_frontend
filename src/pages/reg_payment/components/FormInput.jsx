import React from 'react';

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
        className={`w-full px-4 py-3 bg-white dark:bg-slate-700 border rounded-xl focus:ring-2 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 outline-none ${
          error 
            ? 'border-red-500 dark:border-red-400 focus:ring-red-500/50' 
            : 'border-gray-300 dark:border-slate-600'
        }`}
        style={{
          '--tw-ring-color': error ? '#ef4444' : `${themeColor}50`,
          focusRingColor: error ? '#ef4444' : themeColor,
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = themeColor;
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = '';
          }
        }}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;