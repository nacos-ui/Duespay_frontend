import { Eye, EyeOff, Upload, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react'

const ColorPicker = ({
  label,
  value,
  onChange,
  name
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="color"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full h-12 bg-gray-800 border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-12 h-12 rounded-lg border border-gray-600 shadow-lg"
            style={{ backgroundColor: value }}
          ></div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange({ target: { name, value: e.target.value } })}
            className="w-24 px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;