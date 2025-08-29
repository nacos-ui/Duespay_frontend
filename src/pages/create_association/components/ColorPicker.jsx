import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const ColorPicker = ({ label, name, value, onChange, description }) => {
  const [showCustom, setShowCustom] = useState(false);
  
  const presetColors = [
    '#8200db', '#ef4444', '#f97316', '#eab308', 
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6',
    '#ec4899', '#f43f5e', '#84cc16', '#10b981'
  ];

  const handleColorChange = (color) => {
    onChange(color); // Fixed: Pass color directly, not as event object
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>
      {description && (
        <p className="text-sm text-gray-400">{description}</p>
      )}
      
      {/* Color Preview */}
      <div className="flex items-center gap-4 p-4 bg-[#23263a] rounded-xl border border-gray-700">
        <div 
          className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
          style={{ backgroundColor: value }}
        />
        <div>
          <p className="text-white font-medium">Current Color</p>
          <p className="text-gray-400 font-mono text-sm">{value}</p>
        </div>
      </div>

      {/* Preset Colors */}
      <div>
        <p className="text-sm font-medium text-white mb-3">Choose from presets:</p>
        <div className="grid grid-cols-6 gap-3">
          {presetColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                value === color 
                  ? 'border-white ring-4 ring-white/30' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <div>
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-2 text-[#8200db] hover:text-purple-400 transition-colors"
        >
          <Palette className="w-4 h-4" />
          {showCustom ? 'Hide' : 'Choose'} custom color
        </button>
        
        {showCustom && (
          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-600 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleColorChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 bg-[#23263a] border border-gray-700 rounded-lg text-white placeholder-gray-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#8200db]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;