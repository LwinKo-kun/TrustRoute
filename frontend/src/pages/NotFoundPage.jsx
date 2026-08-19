import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600 to-cyan-400 text-white text-4xl font-black shadow-lg">
            404
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
          The page you are looking for doesn't exist, has been moved, or the link is broken.
        </p>

        <div className="flex items-center gap-4">
          <Link 
            to="/marketplace" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition"
          >
            Back to Marketplace
          </Link>
          <Link 
            to="/dashboard" 
            className="px-6 py-3 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
}