import React, { useState } from 'react';
import { Copy } from 'lucide-react';

const PaymentSummary = ({ bank_account, totalAmount }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (bank_account?.account_number) {
      navigator.clipboard.writeText(bank_account.account_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

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
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Account Number:</span>
          <span className="font-medium text-white flex items-center gap-2">
            {bank_account.account_number}
            <button
              onClick={handleCopy}
              className="ml-1 p-1 rounded hover:bg-slate-600 transition"
              title="Copy account number"
              type="button"
            >
              <Copy size={16} className="text-purple-400" />
            </button>
            {copied && (
              <span className="text-xs text-green-400 ml-2 animate-fadeIn">Copied!</span>
            )}
          </span>
        </div>
        <hr className="my-3 border-slate-600" />
        <div className="flex justify-between text-lg font-bold text-purple-400">
          <span>Total Amount:</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s;
        }
      `}</style>
    </div>
  );
};

export default PaymentSummary;