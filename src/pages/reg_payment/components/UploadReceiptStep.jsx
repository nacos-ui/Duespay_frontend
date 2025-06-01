import React from 'react';
import FileUpload from './FileUpload';

const UploadReceiptStep = ({ payerData, proofFile, handleFileUpload, getTotalAmount }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Upload Proof of Payment</h2>
        <p className="text-slate-300">Please upload your payment receipt</p>
      </div>

      <div className="bg-slate-700 rounded-xl p-6 mb-6 border border-slate-600">
        <h3 className="font-semibold text-white mb-4">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">Payer:</span>
            <span className="font-medium text-white">{payerData.firstName} {payerData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Matric Number:</span>
            <span className="font-medium text-white">{payerData.matricNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Amount Paid:</span>
            <span className="font-medium text-purple-400">₦{getTotalAmount().toLocaleString()}</span>
          </div>
        </div>
      </div>

      <FileUpload
        file={proofFile}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default UploadReceiptStep;