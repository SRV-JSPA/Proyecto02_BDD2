import React from 'react';
import { FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const ErrorMessage = ({ 
  message, 
  type = 'regular',  
  onRetry = null,
  className = ''
}) => {
  if (!message) return null;
  
  let icon = <FaExclamationTriangle className="text-red-500 text-xl" />;
  let title = 'Error';
  
  if (type === 'connection') {
    title = 'Error de conexión';
    icon = <FaTimesCircle className="text-red-500 text-xl" />;
  } else if (type === 'notFound') {
    title = 'No encontrado';
    icon = <FaTimesCircle className="text-red-500 text-xl" />;
  }
  
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-1 text-sm text-red-700">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;