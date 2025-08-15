import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function PaymentSuccess() {
  const { state } = useLocation();
  const data = state || {};
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-2">Payment Successful</h1>
      <p className="mb-4 text-sm opacity-80">Thank you. Your payment has been verified.</p>
      <pre className="bg-black/70 text-white p-4 rounded-lg max-w-lg w-full overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
      <Link to="/" className="mt-6 underline text-purple-400">Go Home</Link>
    </div>
  );
}