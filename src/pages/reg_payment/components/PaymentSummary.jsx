import React from 'react';

const PaymentSummary = ({ bank_account, totalAmount }) => {
  if (!bank_account) {
    return <div className="text-center text-white">Loading...</div>;
  }
  return (
    <div className="bg-slate-700 rounded-xl p-6 mt-8 border border-slate-600">
      <h3 className="font-semibold text-white mb-4">Payment Details</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-300">Bank Name:</span>
          <span className="font-medium text-white">{bank_account.bank_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Account Name:</span>
          <span className="font-medium text-white">{bank_account.account_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Account Number:</span>
          <span className="font-medium text-white">{bank_account.account_number}</span>
        </div>
        <hr className="my-3 border-slate-600" />
        <div className="flex justify-between text-lg font-bold text-purple-400">
          <span>Total Amount:</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;