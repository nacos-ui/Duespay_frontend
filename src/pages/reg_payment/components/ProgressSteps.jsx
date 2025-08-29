import React from 'react';

const ProgressSteps = ({ steps, currentStep, themeColor }) => (
  <div className="flex items-center justify-between">
    {steps.map((step, index) => {
      const Icon = step.icon;
      const isActive = currentStep >= step.number;
      const isCurrent = currentStep === step.number;
      const isCompleted = currentStep > step.number;
      return (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div 
              className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 sm:border-3 transition-all duration-500 ${
                isActive 
                  ? 'border-current text-white shadow-md' 
                  : 'border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500'
              }`}
              style={isActive ? { 
                backgroundColor: themeColor, 
                borderColor: themeColor,
                boxShadow: `0 8px 25px ${themeColor}40`
              } : {}}
            >
              {isCompleted ? (
                <step.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              ) : (
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
              )}
              {isCurrent && (
                <div className="absolute -inset-2 rounded-full opacity-30 animate-pulse" 
                     style={{ backgroundColor: themeColor }}></div>
              )}
            </div>
            <div className="mt-2 sm:mt-3 text-center">
              <p className={`text-xs sm:text-sm font-semibold ${
                isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'
              }`}>
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.title.split(' ')[0]}</span>
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 sm:h-1 mx-2 sm:mx-4 lg:mx-6 mt-5 sm:mt-6 lg:mt-7 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-600">
              <div 
                className={`h-full transition-all duration-700 ${
                  currentStep > step.number 
                    ? 'w-full' 
                    : 'w-0'
                }`}
                style={currentStep > step.number ? { backgroundColor: themeColor } : {}}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

export default ProgressSteps;