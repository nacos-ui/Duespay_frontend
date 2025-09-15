import React from 'react';
import { CreditCard, Mail, Phone, MessageCircle } from 'lucide-react';

const SidebarSummary = ({
  paymentItems,
  selectedItems,
  themeColor,
  getTotalAmount,
  formatTotal
}) => (
  <div className="space-y-6">
    {/* Payment Summary */}
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 overflow-hidden">
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${themeColor}, ${themeColor}60)` }}></div>
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: themeColor }} />
          Payment Summary
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {selectedItems.map(itemId => {
            const item = paymentItems.find(p => p.id === itemId);
            if (!item) return null;
            return (
              <div key={itemId} className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-slate-700 dark:to-slate-600 border border-gray-100 dark:border-slate-600">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <p className="text-xs px-2 py-1 rounded-full text-white capitalize text-center mt-1 inline-block" 
                     style={{ backgroundColor: item.status === 'compulsory' ? '#ef4444' : themeColor }}>
                    {item.status}
                  </p>
                </div>
                <p className="text-lg sm:text-xl font-bold ml-2" style={{ color: themeColor }}>
                  ₦{item.amount.toLocaleString()}
                </p>
              </div>
            );
          })}
          {selectedItems.length === 0 && (
            <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-slate-400">
              <CreditCard className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-30" />
              <p className="text-base sm:text-lg">No items selected</p>
              <p className="text-xs sm:text-sm">Please select payment items to continue</p>
            </div>
          )}
        </div>
        {selectedItems.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-dashed border-gray-200 dark:border-slate-600">
            <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl" 
                 style={{ backgroundColor: `${themeColor}10` }}>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Total Amount
              </p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: themeColor }}>
                {formatTotal(getTotalAmount())}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 sm:mt-3 text-center">
              * Gateway processing fees may be added at checkout
            </p>
          </div>
        )}
      </div>
    </div>
    
    {/* Support Links - Only show on desktop in sidebar */}
    <div className="hidden lg:block bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 dark:border-slate-700/50 p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: themeColor }} />
        Need Help?
      </h3>
      <div className="space-y-3">
        <a
          href="mailto:support@duespay.com"
          className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 hover:shadow-md transition-all"
        >
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: themeColor }} />
          <div className="min-w-0">
            <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Email Support</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">support@duespay.com</p>
          </div>
        </a>
        <a
          href="tel:+2349034049655"
          className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 hover:shadow-md transition-all"
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: themeColor }} />
          <div className="min-w-0">
            <p className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Phone Support</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 truncate">+234 903 404 9655</p>
          </div>
        </a>
      </div>
    </div>
  </div>
);

export default SidebarSummary;