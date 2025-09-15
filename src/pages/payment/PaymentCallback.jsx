import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Settings from "../../settings";

export default function PaymentCallback() {
  const location = useLocation();
  const [status, setStatus] = useState('processing'); // processing, error, redirecting
  const [debugInfo, setDebugInfo] = useState('');
  const domain = Settings.BASE_DOMAIN;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Debug logging
    console.log("🔄 PaymentCallback Debug:");
    console.log("📍 Full URL:", window.location.href);
    console.log("📋 All params:", Object.fromEntries(params.entries()));
    
    const reference = params.get('reference_id') || params.get('reference') || params.get('ref');
    const associationShortName = params.get('assoc') || params.get('association');
    const paymentStatus = params.get('status');
    
    console.log("🎯 Extracted:", { reference, associationShortName, paymentStatus });
    
    // Validation
    if (!reference) {
      console.error("❌ No payment reference found");
      setDebugInfo(`Missing reference. Available: ${Array.from(params.keys()).join(', ')}`);
      setStatus('error');
      
      // Redirect to home after showing error
      setTimeout(() => {
        window.location.href = domain.includes('localhost') 
          ? `http://${domain}:5173/` 
          : `https://${domain}/`;
      }, 3000);
      return;
    }

    // Success - prepare redirect
    setStatus('redirecting');
    const redirectStatus = paymentStatus || 'pending';
    
    let redirectUrl;
    if (associationShortName) {
      // Redirect to association page
      redirectUrl = domain.includes('localhost')
        ? `http://${domain}:5173/${associationShortName}?reference=${reference}&status=${redirectStatus}`
        : `https://${associationShortName}.${domain}?reference=${reference}&status=${redirectStatus}`;
    } else {
      // Fallback to home with params
      redirectUrl = domain.includes('localhost')
        ? `http://${domain}:5173/?reference=${reference}&status=${redirectStatus}`
        : `https://${domain}/?reference=${reference}&status=${redirectStatus}`;
    }
    
    console.log("🚀 Redirecting to:", redirectUrl);
    
    // Single redirect with small delay for UX
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1500);
    
  }, []); // Empty dependency array - run once only

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200 max-w-md mx-4">
        
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h2>
            <p className="text-gray-600">
              Validating payment details...
            </p>
          </div>
        )}

        {status === 'redirecting' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Complete</h2> */}
            <p className="text-gray-600 mb-4">
              Redirecting you back to view your payment status...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Callback Error</h2>
            <p className="text-gray-600 mb-2">Payment reference not found.</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
            {debugInfo && (
              <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
                Debug: {debugInfo}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}