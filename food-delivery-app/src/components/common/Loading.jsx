import React from 'react';

const Loading = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    default: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.default;

  return (
    <div className={`flex justify-center items-center p-4 ${className}`}>
      <div
        className={`${spinnerSize} rounded-full border-gray-300 border-t-primary-600 animate-spin`}
        role="status"
        aria-label="Cargando"
      ></div>
    </div>
  );
};

export default Loading;