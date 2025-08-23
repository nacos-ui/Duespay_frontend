import React from 'react';
import PaymentItem from './RegPaymentItem';
import { CreditCard, ShoppingCart } from 'lucide-react';

export default function PaymentSelectionStep(props) {
  const {
    paymentItems,
    selectedItems,
    handleItemSelection,
    associationData,
    getTotalAmount,
    themeColor,
    hideBankDetails = true,
  } = props;

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
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
             style={{ backgroundColor: `${themeColor}20` }}>
          <ShoppingCart className="w-8 h-8" style={{ color: themeColor }} />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
          Select Payment Items
        </h2>
        <p className="text-gray-600 dark:text-slate-400">
          Choose the items you want to pay for
        </p>
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

      {/* Total and gateway notice */}
      {hideBankDetails && selectedItems.length > 0 && (
        <div className="space-y-4">
          <div className="p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-600" 
               style={{ backgroundColor: `${themeColor}05` }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6" style={{ color: themeColor }} />
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Selected
                </span>
              </div>
              <span className="text-2xl font-bold" style={{ color: themeColor }}>
                {formattedTotal}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              You will be redirected to a secure payment gateway to complete your payment. 
              <strong> Additional processing charges may be added to the total amount at checkout.</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};