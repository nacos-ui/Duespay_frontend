import React from 'react';
import { Check, Lock } from 'lucide-react';

const RegPaymentItem = ({ item, isSelected, onSelectionChange, themeColor }) => {
  const isCompulsory = item.status === 'compulsory';
  
  return (
    <div 
      className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
        isSelected 
          ? 'border-current shadow-lg' 
          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
      } ${isCompulsory ? 'opacity-100' : ''}`}
      style={isSelected ? { 
        borderColor: themeColor,
        backgroundColor: `${themeColor}05`,
        boxShadow: `0 8px 25px ${themeColor}20`
      } : {}}
      onClick={!isCompulsory ? onSelectionChange : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {item.title}
            </h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${
              isCompulsory ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              {item.status}
            </span>
            {isCompulsory && <Lock className="w-4 h-4 text-gray-400" />}
          </div>
          {item.description && (
            <p className="text-gray-600 dark:text-slate-400 text-sm mb-3">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold" style={{ color: themeColor }}>
              ₦{item.amount.toLocaleString()}
            </div>
            {item.due_date && (
              <div className="text-sm text-gray-500 dark:text-slate-400">
                Due: {new Date(item.due_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center ml-4">
          <div 
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              isSelected 
                ? 'border-current text-white' 
                : 'border-gray-300 dark:border-slate-600'
            } ${!isCompulsory ? 'hover:scale-110' : ''}`}
            style={isSelected ? { 
              backgroundColor: themeColor, 
              borderColor: themeColor 
            } : {}}
          >
            {isSelected && <Check className="w-5 h-5" />}
            {isCompulsory && !isSelected && <Lock className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegPaymentItem;