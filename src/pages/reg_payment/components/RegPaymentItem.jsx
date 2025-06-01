import React from 'react';

const RegPaymentItem = ({ item, isSelected, onSelectionChange }) => {
  const isCompulsory = item.status === 'compulsory';
  
  return (
    <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
      isSelected 
        ? 'border-purple-500 bg-purple-900/30' 
        : 'border-slate-600 hover:border-purple-400 bg-slate-700/50'
    } ${isCompulsory ? 'bg-amber-900/20 border-amber-600' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelectionChange}
            disabled={isCompulsory}
            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 bg-slate-700 border-slate-600"
          />
          <div>
            <h3 className="font-semibold text-white">{item.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isCompulsory 
                ? 'bg-amber-800 text-amber-200' 
                : 'bg-green-800 text-green-200'
            }`}>
              {item.status}
            </span>
          </div>
        </div>
        <div className="text-lg font-bold text-white">
          ₦{item.amount.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default RegPaymentItem;