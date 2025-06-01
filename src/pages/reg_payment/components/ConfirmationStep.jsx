import React from 'react';
import { CheckCircle } from 'lucide-react';

const ConfirmationStep = ({ isVerified, getTotalAmount }) => {
  return (
    <div className="text-center space-y-6">
      <div className="mb-8">
        {isVerified ? (
          <div className="space-y-4">
            <CheckCircle size={64} className="mx-auto text-green-500" />
            <h2 className="text-3xl font-bold text-green-400">Payment Verified!</h2>
            <p className="text-slate-300">Your payment has been successfully verified</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin mx-auto w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">Verifying Payment...</h2>
            <p className="text-slate-300">Please wait while we verify your payment</p>
          </div>
        )}
      </div>

      {isVerified && (
        <div className="bg-slate-700 rounded-xl p-6 text-left max-w-md mx-auto border border-slate-600">
          <h3 className="font-semibold text-white mb-4">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Reference ID:</span>
              <span className="font-medium text-white">TXN-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Amount:</span>
              <span className="font-medium text-white">₦{getTotalAmount().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Status:</span>
              <span className="font-medium text-green-400">Verified</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Date:</span>
              <span className="font-medium text-white">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationStep;