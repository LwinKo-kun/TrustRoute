import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import ShopCard from '../components/market/ShopCard';
import api from '../api/axios';

export default function ShopsPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const res = await api.get('/shops');
      const rawData = res.data;
      
      let shopList = [];
      if (Array.isArray(rawData)) {
        shopList = rawData;
      } else if (Array.isArray(rawData?.data)) {
        shopList = rawData.data;
      } else if (rawData?.data?.data && Array.isArray(rawData.data.data)) {
        shopList = rawData.data.data;
      }
      
      setShops(shopList);
    } catch (err) {
      console.error('Failed to fetch shops:', err);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b1c] transition-colors duration-300">
        
        {/* HERO SECTION */}
        <div className="relative isolate overflow-hidden bg-white dark:bg-[#0d1326] border-b border-slate-200 dark:border-white/10 py-16 sm:py-24">
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
              backgroundSize: '56px 56px',
            }}
          />
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu" aria-hidden="true">
            <div className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-blue-500 to-cyan-400 opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-cyan-400/20 bg-blue-50 dark:bg-cyan-400/[0.06] px-4 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-cyan-300">Trusted Network</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Verified <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Shops Directory</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Discover reputable sellers, browse their technology catalogs, and trade with absolute confidence using TrustNode's secure escrow system.
            </p>
          </div>
        </div>

        {/* SHOPS GRID */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-3xl border border-slate-200 dark:border-white/[0.06] bg-slate-200 dark:bg-white/[0.03] w-full" />
              ))}
            </div>
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <div key={shop.id} className="transform transition duration-300 hover:-translate-y-1.5">
                  <ShopCard shop={shop} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#0d1326] px-8 py-24 text-center shadow-sm max-w-3xl mx-auto">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 dark:bg-cyan-400/5 text-blue-600 dark:text-cyan-400 text-3xl font-bold">
                🏪
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                No shops available yet
              </h3>
              <p className="mx-auto mt-3 max-w-md text-base text-slate-500 leading-relaxed">
                Be the first seller to open a trusted shop on the TrustNode marketplace.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}