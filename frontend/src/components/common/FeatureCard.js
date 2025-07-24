import React from 'react';

const FeatureCard = ({ feature, isActive, onMouseEnter }) => {
  return (
    <div 
      className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
        isActive 
          ? 'border-purple-500 bg-purple-900/20' 
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
      onMouseEnter={onMouseEnter}
    >
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-gray-400">{feature.description}</p>
    </div>
  );
};

export default FeatureCard;
