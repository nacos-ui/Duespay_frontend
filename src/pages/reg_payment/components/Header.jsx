import React from 'react';

const Header = ({ associationData, steps, currentStep }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="text-4xl">
            <img
                src={associationData.logo}
                alt={associationData.associaton_name + " logo"}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
            />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{associationData.association_name}</h1>
          <p className="text-purple-100">{associationData.association_type}</p>
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
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-purple-200'
              }`}>
                <Icon size={20} />
                <span className="font-medium hidden sm:inline">{step.title}</span>
                <span className="font-medium sm:hidden">{step.number}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${isActive ? 'bg-white/40' : 'bg-white/20'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;