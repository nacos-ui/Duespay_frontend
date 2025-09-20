import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Receipt, Loader2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchWithTimeout, handleFetchError } from '../../../utils/fetchUtils';
import { API_ENDPOINTS } from '../../../apiConfig';

const PaymentStatusStep = ({ 
  referenceId, 
  paymentStatus, 
  statusData: initialStatusData, 
  loading: initialLoading, 
  themeColor
}) => {
  const [statusData, setStatusData] = useState(initialStatusData);
  const [loading, setLoading] = useState(initialLoading);
  const [pollCount, setPollCount] = useState(0);
  const [lastChecked, setLastChecked] = useState(new Date());

  const viewReceipt = () => {
    if (referenceId) {
      window.open(`/transactions/receipt/${statusData?.receipt_id}`, '_blank');
    }
  };

  // Auto-poll for payment status when referenceId exists and not verified
  useEffect(() => {
    if (!referenceId) return;

    // If already verified, no need to poll
    if (statusData?.is_verified && statusData?.exists) return;

    let stopped = false;
    const maxPolls = 30; // ~2.5 minutes at 5s intervals

    const pollStatus = async () => {
      if (stopped || pollCount >= maxPolls) return;

      setLoading(true);
      setPollCount(prev => prev + 1);

      try {
        const res = await fetchWithTimeout(
          API_ENDPOINTS.PAYMENT_STATUS(referenceId),
          {},
          20000
        );

        const responseData = await res.json();
        if (res.ok) {
          const data = responseData.data;
          setStatusData(data);
          setLastChecked(new Date());
          
          // Stop polling if verified or doesn't exist
          if (data?.is_verified || data?.exists === false) {
            stopped = true;
          }
        }
      } catch (err) {
        console.error('Status polling error:', err);
        // Continue polling on errors (might be temporary)
      } finally {
        setLoading(false);
      }
    };

    // Poll immediately, then every 5 seconds
    pollStatus();
    
    const interval = setInterval(pollStatus, 5000);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [referenceId, pollCount, statusData?.is_verified, statusData?.exists]);

  const getStatusInfo = () => {
    if (loading) {
      return {
        icon: Loader2,
        title: 'Checking Payment Status...',
        message: `Please wait while we verify your payment${pollCount > 0 ? ` (${pollCount}/30)` : ''}`,
        color: themeColor,
        bgColor: `${themeColor}10`,
        animate: 'animate-spin'
      };
    }

    // Check if we have statusData from the API
    if (statusData) {
      const { is_verified, exists, amount_paid } = statusData;
      
      if (exists && is_verified) {
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          message: 'Your payment has been verified and processed successfully',
          color: '#10b981',
          bgColor: '#10b98110',
        };
      } else if (exists && !is_verified) {
        return {
          icon: Clock,
          title: 'Payment Under Verification',
          message: 'Your payment was initiated but is still being verified. This usually takes ',
          color: '#f59e0b',
          bgColor: '#f59e0b10',
        };
      } else if (!exists) {
        return {
          icon: XCircle,
          title: 'Payment Not Found',
          message: 'No payment record was found for this reference. Please check your reference ID or contact support.',
          color: '#ef4444',
          bgColor: '#ef444410',
        };
      }
    }

    // Fallback to URL status parameter if no statusData
    const status = paymentStatus;
    
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return {
          icon: CheckCircle,
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully',
          color: '#10b981',
          bgColor: '#10b98110',
        };
      case 'failed':
      case 'cancelled':
      case 'declined':
        return {
          icon: XCircle,
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          color: '#ef4444',
          bgColor: '#ef444410',
        };
      case 'pending':
      case 'processing':
        return {
          icon: Clock,
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait...',
          color: '#f59e0b',
          bgColor: '#f59e0b10',
        };
      default:
        return {
          icon: RefreshCw,
          title: 'Checking Payment Status',
          message: 'Please wait while we verify your payment status.',
          color: themeColor,
          bgColor: `${themeColor}10`,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;
  const isSuccess = statusData?.is_verified && statusData?.exists;
  const hasReceiptId = statusData?.receipt_id;

  const manualRefresh = async () => {
    if (!referenceId) return;
    
    setLoading(true);
    try {
      const res = await fetchWithTimeout(
        API_ENDPOINTS.PAYMENT_STATUS(referenceId),
        {},
        20000
      );

      const responseData = await res.json();
      if (res.ok) {
        const data = responseData.data;
        setStatusData(data);
        setLastChecked(new Date());
        setPollCount(0); // Reset poll count
      }
    } catch (err) {
      console.error('Manual refresh error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" 
             style={{ backgroundColor: statusInfo.bgColor }}>
          <Icon className={`w-10 h-10 ${statusInfo.animate || ''}`} style={{ color: statusInfo.color }} />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
          {statusInfo.title}
        </h2>
        <p className="text-gray-600 dark:text-slate-400 text-lg">
          {statusInfo.message}
        </p>
      </div>

      {/* Payment Details */}
      {statusData && (
        <div className="bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-slate-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" style={{ color: themeColor }} />
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Reference ID</p>
              <p className="text-lg font-mono text-gray-900 dark:text-white break-all">{referenceId}</p>
            </div>
            
            {statusData.amount_paid && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Amount Paid</p>
                <p className="text-lg font-semibold" style={{ color: themeColor }}>
                  ₦{parseFloat(statusData.amount_paid).toLocaleString()}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Payment Status</p>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: statusInfo.color }}
                ></div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {statusData.is_verified ? 'Verified' : 'Under Verification'}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Receipt</p>
              <p className="text-lg font-mono text-gray-900 dark:text-white">
                {statusData.receipt_id ? "Available" : "Unavailable"}
              </p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Last Checked</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {lastChecked.toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isSuccess && hasReceiptId && (
          <button
            onClick={viewReceipt}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
              boxShadow: `0 10px 30px ${themeColor}40`,
            }}
          >
            <Receipt className="w-5 h-5" />
            View Receipt
            <ExternalLink className="w-4 h-4" />
          </button>
        )}
        
        {/* Manual refresh button */}
        <button
          onClick={manualRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, #6b7280, #6b728099)`,
          }}
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Checking...' : 'Check Again'}
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600 transition-all duration-300"
        >
          Back to Home
        </button>
      </div>

      {/* Status-specific additional info */}
      {statusData && statusData.exists && !statusData.is_verified && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-700 dark:text-yellow-300 text-sm">
              <p className="font-semibold mb-2">Payment Under Verification</p>
              <p>
                Your payment of ₦{parseFloat(statusData.amount_paid || 0).toLocaleString()} is still being verified by our system. This process usually takes some time.
              </p>
              <p className="mt-2">
                You can also click "Check Again" to refresh manually. If your payment remains unverified after 30 minutes, please contact your <a href="tel:+2349034049657">your association</a> for assistance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatusStep;