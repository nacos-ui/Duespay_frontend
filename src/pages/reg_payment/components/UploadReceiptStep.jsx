import React from 'react';
import FileUpload from './FileUpload';
import { isColorDark } from '../utils/colorUtils';

const UploadReceiptStep = ({ payerData, proofFile, handleFileUpload, getTotalAmount, themeColor }) => {
  const isDark = isColorDark(themeColor);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Upload Proof of Payment</h2>
        <p className="text-gray-600 dark:text-slate-300">Please upload your payment receipt</p>
      </div>

      <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-6 mb-6 border border-gray-200 dark:border-slate-600">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-300">Payer:</span>
            <span className="font-medium text-gray-900 dark:text-white">{payerData.firstName} {payerData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-300">Matric Number:</span>
            <span className="font-medium text-gray-900 dark:text-white">{payerData.matricNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-300">Amount Paid:</span>
            <span 
              className="font-medium"
              style={{ color: themeColor }}
            >
              ₦{getTotalAmount().toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <FileUpload
        file={proofFile}
        onFileUpload={handleFileUpload}
        themeColor={themeColor}
      />
    </div>
  );
};

export default UploadReceiptStep;