import React from 'react';
import { isColorDark } from '../utils/colorUtils';

const RegPaymentItem = ({ item, isSelected, onSelectionChange, themeColor }) => {
  const isCompulsory = item.status === 'compulsory';
  const isDark = isColorDark(themeColor);
  
  // Create lighter/darker versions of theme color for backgrounds
  const selectedBgLight = `${themeColor}30`; // 30% opacity
  const selectedBgDark = `${themeColor}20`; // 20% opacity for dark mode
  const hoverBorder = `${themeColor}80`; // 80% opacity for hover
  
  return (
    <div 
      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
        isCompulsory 
          ? 'bg-amber-100/20 dark:bg-amber-900/20 border-amber-500 dark:border-amber-600' 
          : 'bg-gray-50 dark:bg-slate-700/50'
      }`}
      style={
        !isCompulsory
          ? {
              borderColor: isSelected ? themeColor : '',
              backgroundColor: isSelected 
                ? (document.documentElement.classList.contains('dark') 
                    ? selectedBgDark 
                    : selectedBgLight)
                : '',
            }
          : {}
      }
      onMouseEnter={(e) => {
        if (!isCompulsory && !isSelected) {
          e.target.style.borderColor = hoverBorder;
        }
      }}
      onMouseLeave={(e) => {
        if (!isCompulsory && !isSelected) {
          e.target.style.borderColor = '';
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelectionChange}
            disabled={isCompulsory}
            className="w-5 h-5 rounded focus:ring-2 bg-gray-100 dark:bg-slate-700 border-gray-300 dark:border-slate-600"
            style={{
              accentColor: themeColor,
              '--tw-ring-color': `${themeColor}50`,
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isCompulsory 
                ? 'bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200' 
                : 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
        <div className="text-lg font-bold text-gray-900 dark:text-white">
          ₦{item.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RegPaymentItem;