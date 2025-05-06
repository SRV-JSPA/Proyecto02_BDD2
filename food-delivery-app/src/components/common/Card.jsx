import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'default', 
  shadow = 'default', 
  rounded = 'default', 
  border = false,
  onClick = null
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2',
    default: 'p-4',
    large: 'p-6'
  };
  
  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    default: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  };
  
  const paddingClass = paddingClasses[padding] || paddingClasses.default;
  const shadowClass = shadowClasses[shadow] || shadowClasses.default;
  const roundedClass = roundedClasses[rounded] || roundedClasses.default;
  
  const borderClass = border ? 'border border-gray-200' : '';
  
  const cursorClass = onClick ? 'cursor-pointer hover:bg-gray-50' : '';
  
  const combinedClasses = `bg-white ${paddingClass} ${shadowClass} ${roundedClass} ${borderClass} ${cursorClass} ${className}`;
  
  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;