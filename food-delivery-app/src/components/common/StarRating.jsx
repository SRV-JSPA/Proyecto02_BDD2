import React, { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({
  value = 0,
  max = 5,
  size = 'medium',
  color = 'gold',
  onChange = null,
  readOnly = true,
  className = '',
  showValue = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeMap = {
    small: 'text-sm',
    medium: 'text-xl',
    large: 'text-2xl',
  };
  
  const colorMap = {
    gold: 'text-yellow-400',
    orange: 'text-orange-400',
    red: 'text-red-500',
    primary: 'text-primary-500',
  };
  
  const sizeClass = sizeMap[size] || sizeMap.medium;
  const colorClass = colorMap[color] || colorMap.gold;
  
  const handleMouseOver = (rating) => {
    if (!readOnly) {
      setHoverRating(rating);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };
  
  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };
  
  const renderStars = () => {
    const stars = [];
    const activeRating = hoverRating || value;
    
    for (let i = 1; i <= max; i++) {
      if (i <= activeRating) {
        stars.push(
          <FaStar
            key={i}
            className={`${colorClass} ${!readOnly && 'cursor-pointer'}`}
            onMouseOver={() => handleMouseOver(i)}
            onClick={() => handleClick(i)}
          />
        );
      } else if (i - 0.5 <= activeRating) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className={`${colorClass} ${!readOnly && 'cursor-pointer'}`}
            onMouseOver={() => handleMouseOver(i)}
            onClick={() => handleClick(i)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className={`${colorClass} ${!readOnly && 'cursor-pointer'}`}
            onMouseOver={() => handleMouseOver(i)}
            onClick={() => handleClick(i)}
          />
        );
      }
    }
    
    return stars;
  };
  
  return (
    <div
      className={`flex items-center ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flex ${sizeClass}`}>
        {renderStars()}
      </div>
      
      {showValue && (
        <span className="ml-2 text-gray-600">{value.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;