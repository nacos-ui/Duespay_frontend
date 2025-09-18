import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle, Clock, CreditCard, AlertCircle } from 'lucide-react';

const VirtualAccountPayment = ({ 
  accountData, 
  onPaymentVerified, 
  onCheckPayment,
  themeColor,
  referenceId 
}) => {
  const [copied, setCopied] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Calculate initial time left using accountDurationSeconds
  useEffect(() => {
    console.log('Account Data:', accountData); // Debug log
    
    if (!accountData) {
      console.log('No account data yet');
      return;
    }

    if (accountData?.accountDurationSeconds) {
      console.log('Setting time from accountDurationSeconds:', accountData.accountDurationSeconds);
      setTimeLeft(accountData.accountDurationSeconds);
      setIsExpired(false);
      setIsInitialized(true);
    } else if (accountData?.expiresOn) {
      console.log('Setting time from expiresOn:', accountData.expiresOn);
      const expiryTime = new Date(accountData.expiresOn).getTime();
      const now = new Date().getTime();
      const difference = expiryTime - now;
      
      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
      setIsInitialized(true);
    }
  }, [accountData]);

  // Countdown timer
  useEffect(() => {
    if (!isInitialized || timeLeft <= 0) {
      if (isInitialized && timeLeft <= 0) {
        setIsExpired(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isInitialized]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ ...copied, [field]: true });
      setTimeout(() => {
        setCopied({ ...copied, [field]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaymentCheck = async () => {
    await onCheckPayment();
  };

  const CopyButton = ({ text, field, label }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
          {text}
        </p>
      </div>
      <button
        onClick={() => copyToClipboard(text, field)}
        className="ml-4 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
      >
        {copied[field] ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );

  // Show loading state if data isn't initialized yet
  if (!isInitialized || !accountData) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
               style={{ backgroundColor: `${themeColor}20` }}>
            <CreditCard className="w-8 h-8" style={{ color: themeColor }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Setting up your payment account...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your account details
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
             style={{ backgroundColor: `${themeColor}20` }}>
          <CreditCard className="w-8 h-8" style={{ color: themeColor }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Complete Your Payment
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Transfer the exact amount to the account details below
        </p>
      </div>

      {/* Countdown Timer */}
      <div className={`p-4 rounded-lg border-2 ${isExpired ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}>
        <div className="flex items-center justify-center space-x-2">
          <Clock className={`w-5 h-5 ${isExpired ? 'text-red-600' : 'text-orange-600'}`} />
          <span className="font-semibold text-sm text-gray-700">
            {isExpired ? 'Account Expired' : 'Time Remaining'}
          </span>
        </div>
        <div className={`text-center text-2xl font-bold mt-2 ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
          {isExpired ? 'EXPIRED' : formatTime(timeLeft)}
        </div>
        {isExpired && (
          <p className="text-center text-sm text-red-600 mt-2">
            This payment account has expired. Please restart the payment process.
          </p>
        )}
        {!isExpired && accountData?.accountDurationSeconds && (
          <p className="text-center text-sm text-orange-600 mt-1">
            Account valid for {Math.floor(accountData.accountDurationSeconds / 60)} minutes
          </p>
        )}
      </div>

      {!isExpired && (
        <>
          {/* Payment Amount */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-center">
              <p className="text-sm text-green-700 dark:text-green-400 mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-green-800 dark:text-green-300">
                ₦{Number(accountData.total_payable_with_fee || accountData.totalPayable).toLocaleString()}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                (Including processing fee)
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bank Account Details
            </h3>
            
            <CopyButton 
              text={accountData.accountNumber}
              field="accountNumber"
              label="Account Number"
            />
            
            <CopyButton 
              text={accountData.accountName}
              field="accountName"
              label="Account Name"
            />
            
            <CopyButton 
              text={accountData.bankName}
              field="bankName"
              label="Bank Name"
            />
          </div>

          {/* Important Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold">Important Instructions:</p>
                <ul className="space-y-1 list-disc list-inside ml-4">
                  <li>Transfer the <strong>exact amount</strong> shown above</li>
                  <li>Use your name as the transfer description/narration</li>
                  <li>Payment will be verified automatically within 2-5 minutes</li>
                  <li>This account expires in {formatTime(timeLeft)}</li>
                  <li>Do not share these account details with anyone</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePaymentCheck}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              I Have Made the Payment
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              style={{ backgroundColor: themeColor }}
            >
              Refresh Status
            </button>
          </div>

          {/* Reference Information */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Reference</h4>
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400 break-all">
              {referenceId}
            </p>
          </div>

          {/* Powered by Monnify */}
          <div className="flex items-center justify-center mt-4">
            <span className="text-xs text-gray-500 mr-2">Secured by</span>
            <img
              src="/monnifyLogo.png"
              alt="Monnify"
              style={{ height: 24 }}
              className="inline-block"
            />
          </div>
        </>
      )}

      {isExpired && (
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            style={{ backgroundColor: themeColor }}
          >
            Start New Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default VirtualAccountPayment;