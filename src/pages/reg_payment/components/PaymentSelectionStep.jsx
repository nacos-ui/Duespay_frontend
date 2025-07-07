import React from 'react';
import PaymentItem from './RegPaymentItem';
import PaymentSummary from './PaymentSummary';

const PaymentSelectionStep = ({ 
  paymentItems, 
  selectedItems, 
  handleItemSelection, 
  associationData, 
  getTotalAmount,
  themeColor
}) => {
  if (!associationData || !associationData.bank_account) {
    return <div className="text-center text-gray-900 dark:text-white">Loading...</div>;
  }
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

      <PaymentSummary
        bank_account={associationData.bank_account}
        totalAmount={getTotalAmount()}
        themeColor={themeColor}
      />
    </div>
  );
};

export default PaymentSelectionStep;