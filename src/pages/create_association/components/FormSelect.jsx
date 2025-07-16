import { Eye, EyeOff, Upload, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react'

const FormSelect = ({
  label,
  options,
  value,
  onChange,
  required = false,
  name
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
      >
        <option value="">Select association type</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;