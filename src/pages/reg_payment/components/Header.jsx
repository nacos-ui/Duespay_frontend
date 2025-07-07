import React from 'react';
import { isColorDark } from '../utils/colorUtils'; 

const Header = ({ associationData, steps, currentStep, themeColor }) => {
  const isDark = isColorDark(themeColor);
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? '#e5e7eb' : '#374151';
  
  return (
    <div 
      className="text-white p-6"
      style={{
        background: `linear-gradient(to right, ${themeColor}, ${themeColor})`,
        color: textColor
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl">
          <img
              src={associationData.logo_url}
              alt={associationData.association_name + " logo"}
              className="w-16 h-16 min-w-16 min-h-16 flex-shrink-0 rounded-full object-cover border-2 shadow"
              style={{ borderColor: textColor }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: textColor }}>
            {associationData.association_name}
          </h1>
          <p style={{ color: secondaryTextColor }}>
            {associationData.association_type}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between overflow-x-scroll items-center hide-scrollbar">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep >= step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex items-center">
              <div 
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
                style={{
                  backgroundColor: isActive 
                    ? `${textColor}20` 
                    : `${textColor}10`,
                  color: isActive ? textColor : secondaryTextColor
                }}
              >
                <Icon size={20} />
                <span className="font-medium hidden sm:inline">{step.title}</span>
                <span className="font-medium sm:hidden">{step.number}</span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className="w-8 h-0.5 mx-2"
                  style={{
                    backgroundColor: isActive 
                      ? `${textColor}40` 
                      : `${textColor}20`
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;