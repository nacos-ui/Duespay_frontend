import React from 'react';

const StatusMessage = ({ type = 'success', children }) => {
  const color =
    type === 'error'
      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
      : 'bg-green-500/10 border border-green-500/20 text-green-400';

  return (
    <div className={`${color} px-4 py-3 rounded-lg text-sm mb-2`}>
      {children}
    </div>
  );
};

export default StatusMessage;