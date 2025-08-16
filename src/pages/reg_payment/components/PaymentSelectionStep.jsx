import React from 'react';
import PaymentItem from './RegPaymentItem';
import PaymentSummary from './PaymentSummary';

export default function PaymentSelectionStep(props) {
  const {
    paymentItems,
    selectedItems,
    handleItemSelection,
    associationData,
    getTotalAmount,
    themeColor,
    hideBankDetails = false, // new prop
  } = props;

  // Only require bank_account when bank details will be shown
  if (!associationData || (!associationData.bank_account && !hideBankDetails)) {
    return <div className="text-center text-gray-900 dark:text-white">Loading...</div>;
  }

  const totalAmount = Number(getTotalAmount() || 0);
  const formattedTotal = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(totalAmount);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select Payment Items</h2>
        <p className="text-gray-600 dark:text-slate-300">Choose the items you want to pay for</p>
      </div>

      <div className="space-y-4">
        {paymentItems.map(item => (
          <PaymentItem
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelectionChange={() => handleItemSelection(item.id)}
            themeColor={themeColor}
          />
        ))}
      </div>

      {/* Show bank details summary only when not using gateway */}
      {!hideBankDetails && (
        <>
          <PaymentSummary
            bank_account={associationData.bank_account}
            totalAmount={getTotalAmount()}
            themeColor={themeColor}
          />
        </>
      )}

      {/* Gateway mode: show total and neutral notice */}
      {hideBankDetails && (
        <>
          <div className="mt-2 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-slate-300">Total selected</span>
              <span className="text-lg font-semibold" style={{ color: themeColor }}>
                {formattedTotal}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            You will be redirected to a secure payment gateway to complete your payment. Note: Additional processing charges may be added to the total amount at checkout.
          </p>
        </>
      )}
    </div>
  );
};