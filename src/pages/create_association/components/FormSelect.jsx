import React from 'react';
import { ChevronDown } from 'lucide-react';

const FormSelect = ({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  required = false,
  description = null
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-4 bg-[#101828] border border-gray-700 rounded-xl text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#8200db] focus:border-transparent hover:bg-[#0f111f] hover:border-gray-600 appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#23263a] text-gray-300">
            Choose an option...
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-[#23263a] text-white py-2"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      
      {/* Show option descriptions */}
      {value && (
        <div className="mt-2 p-3 bg-[#101828] rounded-lg border border-gray-700">
          {(() => {
            const selectedOption = options.find(opt => opt.value === value);
            const Icon = selectedOption?.icon;
            return (
              <div className="flex items-center gap-2 text-gray-300">
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm">{selectedOption?.description}</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default FormSelect;