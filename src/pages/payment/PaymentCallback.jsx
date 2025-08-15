import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../apiConfig';
import { fetchWithTimeout, handleFetchError } from '../../utils/fetchUtils';

export default function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState('Verifying payment...');
  const [error, setError] = useState('');

  const params = new URLSearchParams(location.search);
  const refFromQuery = params.get('reference_id') || params.get('reference') || params.get('ref');

  useEffect(() => {
    if (!refFromQuery) {
      setError('Missing payment reference.');
      return;
    }

    let stopped = false;
    let attempts = 0;
    const maxAttempts = 60; // ~2.5 minutes at 2.5s
    const interval = setInterval(async () => {
      if (stopped) return;
      attempts += 1;
      try {
        const res = await fetchWithTimeout(API_ENDPOINTS.PAYMENT_STATUS(refFromQuery), {}, 15000);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Failed to fetch payment status.');
        }

        // Support both { success, data: {...} } and flat {...}
        const payload = data?.data ?? data;
        const isVerified =
          payload?.is_verified === true ||
          payload?.verified === true ||
          payload?.status === 'verified';

        if (isVerified) {
          clearInterval(interval);
          setStatusText('Payment verified successfully.');
          // Prefer redirecting to receipt if we have it
          if (payload?.receipt_id) {
            setTimeout(() => navigate(`/transactions/receipt/${payload.receipt_id}`), 500);
          } else {
            setTimeout(() => navigate('/payment/success', { state: payload }), 500);
          }
        } else {
          setStatusText('Awaiting verification...');
        }
      } catch (err) {
        const { message } = handleFetchError(err);
        setError(message);
        // keep polling despite transient errors
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setError('Timed out waiting for verification. Please check later or contact support.');
      }
    }, 2500);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [refFromQuery, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      {!error ? (
        <>
          <svg className="animate-spin h-12 w-12 mb-4 text-purple-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <div>{statusText}</div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-red-500 font-semibold mb-2">Verification Issue</div>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      )}
    </div>
  );
}