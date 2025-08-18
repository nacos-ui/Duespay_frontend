import React from 'react';

const AnimatedInput = ({ id, label, type = "text", value, onChange, disabled, required, error, children }) => {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder=" " 
        className={`block px-4 py-4 w-full text-sm text-white bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-purple-500'}`}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-purple-500 ${error ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-400'} peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4`}
      >
        {label}
      </label>
      {children && <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300">{children}</div>}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default AnimatedInput;
