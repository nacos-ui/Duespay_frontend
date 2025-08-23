import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Settings from "../../settings";

export default function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const domain = Settings.BASE_DOMAIN;

  const params = new URLSearchParams(location.search);
  const reference = params.get('reference_id') || params.get('reference') || params.get('ref');
  const associationShortName = params.get('assoc') || params.get('association');
  const paymentStatus = params.get('status'); // from gateway: success, failed, cancelled

  useEffect(() => {
    if (!reference) {
      setError('Missing payment reference.');
      setTimeout(() => navigate('/'), 3000);
      return;
    }

    // Determine where to redirect back to the same payment flow page
    let redirectPath;
    let redirectStatus = paymentStatus || 'pending';

    if (associationShortName) {
      if (domain.includes('localhost')) {
      // Local dev: http://domain:5173/shortname?reference=...&status=...
      window.location.href = `http://${domain}:5173/${associationShortName}?reference=${reference}&status=${redirectStatus}`;
      } else {
      // Try subdomain: https://shortname.domain?reference=...&status=...
      window.location.href = `https://${associationShortName}.${domain}?reference=${reference}&status=${redirectStatus}`;
      }
    } else {
      if (domain.includes('localhost')) {
      window.location.href = `http://${domain}:5173/?reference=${reference}&status=${redirectStatus}`;
      } else {
      // Fallback: https://domain/shortname?reference=...&status=...
      window.location.href = `https://${domain}/${associationShortName || ''}?reference=${reference}&status=${redirectStatus}`;
      }
    }

    // Small delay for better UX, then redirect
    setTimeout(() => {
      navigate(redirectPath);
    }, 1500);

  }, [reference, associationShortName, paymentStatus, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-slate-700/50 max-w-md mx-4">
        {!error ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-6">
              <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-4">
              Payment completed. Redirecting you back...
            </p>
            {reference && (
              <p className="text-xs text-gray-500 dark:text-slate-500 font-mono">
                Ref: {reference}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Callback Error</h2>
            <p className="text-gray-600 dark:text-slate-400">{error}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to home page...</p>
          </div>
        )}
      </div>
    </div>
  );
}