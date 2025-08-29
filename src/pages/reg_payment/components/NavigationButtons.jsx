import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, ExternalLink } from 'lucide-react';

const NavigationButtons = ({
  currentStep,
  canProceed,
  regLoading,
  payLoading,
  prevStep,
  nextStep,
  themeColor
}) => (
  <div className="flex items-center justify-between gap-4">
    {currentStep > 1 ? (
      <button
        onClick={prevStep}
        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-all hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        Previous
      </button>
    ) : (
      <div />
    )}

    <button
      onClick={nextStep}
      disabled={!canProceed() || regLoading || payLoading}
      className={`flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${
        canProceed() && !regLoading && !payLoading
          ? 'text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
          : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-500 cursor-not-allowed'
      }`}
      style={
        canProceed() && !regLoading && !payLoading
          ? {
              background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
              boxShadow: `0 10px 30px ${themeColor}40`,
            }
          : {}
      }
    >
      {payLoading && <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />}
      {currentStep === 1 ? (
        <>
          {regLoading ? 'Checking...' : (
            <>
              <span className="hidden sm:inline">Continue to Payment</span>
              <span className="sm:hidden">Continue</span>
            </>
          )}
          {!regLoading && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
        </>
      ) : (
        <>
          {payLoading ? 'Redirecting...' : (
            <>
              <span className="hidden sm:inline">Proceed to Payment</span>
              <span className="sm:hidden">Pay Now</span>
            </>
          )}
          {!payLoading && <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />}
        </>
      )}
    </button>
  </div>
);

export default NavigationButtons;