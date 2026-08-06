import React from 'react';
import Header from '../components/common/Header';

export default function PageLayout({ children, showFooter = false }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      {showFooter && (
        <footer className="bg-gray-100 dark:bg-gray-800 py-4 text-center text-sm text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} TrustRoute. All rights reserved.
        </footer>
      )}
    </div>
  );
}
