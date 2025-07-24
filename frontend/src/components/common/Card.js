import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  onClick,
  ...props 
}) => {
  const baseClasses = "rounded-2xl transition-all duration-300";
  
  const variants = {
    default: "bg-gray-800/50 border border-gray-700",
    featured: "bg-purple-900/20 border border-purple-500",
    dark: "bg-gray-900 shadow-2xl"
  };
  
  const hoverClasses = hover ? "hover:border-gray-600 cursor-pointer" : "";
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
