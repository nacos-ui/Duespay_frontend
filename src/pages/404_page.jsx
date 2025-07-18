import React from 'react';

const NotFoundPage = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
    <div className="w-full max-w-md mx-auto text-center p-8 rounded-2xl shadow-lg bg-gray-50 dark:bg-gray-800">
      <img
        src="/Duespay_logo.png"
        alt="DuesPay Logo"
        className="h-16 w-16 mx-auto mb-6 rounded-xl bg-transparent object-cover"
      />
      <h1 className="text-6xl font-extrabold text-purple-600 dark:text-purple-400 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        {message || "The requested URL was not found on this server."}
      </p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default NotFoundPage;