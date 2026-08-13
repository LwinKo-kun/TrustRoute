import React from 'react';
import { Link } from 'react-router-dom';

// Modern SVG Icons
const ShieldCheckIcon = () => (
  <svg className="w-4 h-4 text-indigo-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Skeleton Loader for Cards
const ShopCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
    <div className="animate-pulse space-y-4">
      <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl w-full" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
    </div>
  </div>
);

export default function TrustedShopsAndStats({ loading, shops = [], ShopCard }) {
  const stats = [
    { number: '500+', label: 'Verified Shops', desc: 'Top Tier Quality' },
    { number: '10K+', label: 'Products Listed', desc: 'Updated Daily' },
    { number: '99.9%', label: 'Satisfaction Rate', desc: 'Based on Reviews' },
    { number: '24/7', label: 'Dedicated Support', desc: 'Instant Response' },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Lighting Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* 1. Trusted Shops Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50 mb-3">
              <ShieldCheckIcon />
              Verified Marketplace
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Shops</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
              Discover top-rated sellers verified for authenticity, customer satisfaction, and fast fulfillment.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow"
          >
            <span>View All Shops</span>
            <ArrowRightIcon />
          </Link>
        </div>

        {/* Shops Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <ShopCardSkeleton key={i} />
            ))}
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {shops.slice(0, 3).map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        ) : (
          /* Empty State Design */
          <div className="relative rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100 dark:border-indigo-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No shops available yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
              Be the first to establish your store and reach thousands of customers.
            </p>
            <Link
              to="/marketplace"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-500/20"
            >
              Open a Shop
            </Link>
          </div>
        )}
      </div>

      {/* 2. Sleek Modern Stats Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl bg-slate-900 dark:bg-slate-900/90 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
          {/* Subtle Glow inside Card */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col items-center text-center ${i !== 0 ? 'pt-6 md:pt-0' : ''}`}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400">
                  {stat.number}
                </div>
                <div className="mt-2 text-sm font-semibold text-indigo-400">
                  {stat.label}
                </div>
                <div className="mt-0.5 text-xs text-slate-400">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}