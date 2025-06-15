import React from "react";
import { CheckCircle } from "lucide-react";

const ConfirmationStep = ({ isVerified, transaction }) => {
  if (!isVerified || !transaction) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="mx-auto text-green-400" size={48} />
        <h2 className="text-2xl font-bold text-green-400 mt-4">Awaiting Confirmation...</h2>
        <p className="text-slate-300 mt-2">Your payment is being processed.</p>
      </div>
    );
  }

  // Calculate total amount
  const totalAmount = (transaction.items_paid || []).reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <CheckCircle className="mx-auto text-green-400 animate-bounce" size={64} />
      <h2 className="text-2xl font-bold text-green-400 mt-4 mb-2">Payment Successful!</h2>
      <div className="bg-slate-800 rounded-2xl shadow-xl p-2 sm:p-8 mt-4 w-full max-w-lg">
        <div className="mb-4 flex flex-col gap-2">
          <div>
            <span className="font-semibold text-white">Reference ID:</span>
            <span className="ml-2 text-slate-300">{transaction.reference_id}</span>
          </div>
          <div>
            <span className="font-semibold text-white">Payer:</span>
            <span className="ml-2 text-slate-300">{transaction.payer_name}</span>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-white">Items Paid For:</span>
          <div className="mt-2">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <tbody>
                {(transaction.items_paid || []).map(item => (
                  <tr key={item.id} className="bg-slate-700/60 rounded">
                    <td className="py-1 px-2 text-white">{item.title}</td>
                    <td className="py-1 px-2 text-purple-300 font-semibold">₦{parseFloat(item.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-slate-700 pt-4 mt-4">
          <span className="font-semibold text-white text-lg">Total Amount:</span>
          <span className="text-purple-400 text-xl font-bold">₦{totalAmount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;