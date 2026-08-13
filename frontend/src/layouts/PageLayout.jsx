import React from 'react';
import Header from '../components/common/Header';

export default function PageLayout({ children, showFooter = false }) {
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

      <main
        className="
          flex-grow
          w-full
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
        "
      >
        {children}
      </main>

      {showFooter && (
        <footer
          className="
            border-t
            border-gray-200
            bg-white
            py-4
            text-center
            text-sm
            text-gray-600
            transition-colors duration-300

            dark:border-white/10
            dark:bg-[#070b1c]
            dark:text-gray-300
          "
        >
          © {new Date().getFullYear()} TrustNode. All rights reserved.
        </footer>
      )}
    </div>
  );
}