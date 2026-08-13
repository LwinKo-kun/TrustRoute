import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

export default function DashboardLayout() {
  return (
<<<<<<< HEAD
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-900 dark:bg-[#070b1c] dark:text-gray-100 transition-colors duration-300">
      {/* Shared Unified Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-grow p-4 text-left transition-colors duration-300 md:p-8">
=======
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 🟢 Reusable Role-Aware Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-grow">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0a1024] border-t border-slate-200 dark:border-white/10 py-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} TrustRoute. Secure Decentralized Marketplace.
          </p>
        </div>
      </footer>
    </div>
  );
}