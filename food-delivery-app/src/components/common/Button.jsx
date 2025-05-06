import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left', 
  onClick = null,
  className = '',
  ...rest
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-400',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    text: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-primary-500'
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };
  
  const buttonClasses = `
    font-medium rounded-lg transition-colors duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.medium}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Cargando...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;