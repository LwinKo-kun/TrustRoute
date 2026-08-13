import React from 'react';
import Header from '../common/Header';

export default function Layout({ children }) {
  return (
    <div
      className="
        min-h-screen
        flex flex-col
        bg-slate-50
        text-gray-900
        transition-colors duration-300

        dark:bg-[#070b1c]
        dark:text-white
      "
    >
      <Header />

      <main className="flex-grow">
        {children}
      </main>

      <footer
        className="
          border-t
          border-gray-200
          bg-white
          py-8
          transition-colors duration-300

          dark:border-white/10
          dark:bg-[#070b1c]
        "
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p
            className="
              text-gray-600
              dark:text-gray-400
            "
          >
            &copy; {new Date().getFullYear()} TrustNode.
            Secure Decentralized Marketplace.
          </p>
        </div>
      </footer>
    </div>
  );
}