import React from 'react';
import { isColorDark } from '../utils/colorUtils'; 

const Header = ({ associationData, themeColor }) => {
  if (!associationData) return null;

  const isDark = isColorDark(themeColor);
  const textColor = isDark ? '#ffffff' : '#000000';
  const secondaryTextColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.6)';
  
  return (
    <div 
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd, ${themeColor}aa)`,
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 1px, transparent 1px),
                           radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 80px 80px, 120px 120px'
        }}
      />
      
      {/* Content - REDUCED PADDING HERE */}
      <div className="relative z-10 px-4 py-4 md:px-6 md:py-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-3 md:gap-4 lg:gap-6">
            {/* Logo - SMALLER ON MOBILE */}
            <div className="relative flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-30"
                style={{ backgroundColor: textColor }}
              />
              <img
                src={associationData.logo_url}
                alt={associationData.association_name + " logo"}
                className="relative w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full object-cover border-2 md:border-4 shadow-2xl transform hover:scale-105 transition-transform duration-300"
                style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
              />
            </div>
            
            {/* Association Info - RESPONSIVE LAYOUT */}
            <div className="flex-1 min-w-0">
              <h1 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 md:mb-2 break-words leading-tight"
                style={{ 
                  color: textColor,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {associationData.association_name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="inline-flex items-center px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm border"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: textColor
                  }}
                >
                  {associationData.association_short_name}
                </span>
                <span 
                  className="text-xs md:text-sm lg:text-base"
                  style={{ color: secondaryTextColor }}
                >
                  Payment Page
                </span>
              </div>
            </div>
            
            {/* DuesPay Branding - SMALLER ON TABLET */}
            <div className="hidden sm:flex flex-col items-end flex-shrink-0">
              <span 
                className="text-xs md:text-sm font-medium opacity-80"
                style={{ color: textColor }}
              >
                Contact Us
              </span>
              <span 
                className="text-lg md:text-xl font-bold"
                style={{ 
                  color: textColor,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                Here
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Line */}
      <div 
        className="h-1"
        style={{
          background: `linear-gradient(90deg, transparent, ${textColor}40, transparent)`
        }}
      />
      
      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default Header;