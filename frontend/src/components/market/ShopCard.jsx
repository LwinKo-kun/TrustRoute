import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopCard({ shop }) {
  // Get first letter of shop name for the logo
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'S');

  // Calculate how long ago the shop joined
  const calculateJoined = (dateString) => {
    if (!dateString) return 'New';
    const joinedDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - joinedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays}d`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}m`;
    return `${Math.floor(diffMonths / 12)}y`;
  };

  // Safely extract real stats by checking multiple possible Laravel payload structures
  const listingsCount = shop?.listings_count ?? shop?.products_count ?? shop?.listings?.length ?? 0;
  
  const ratingRaw = shop?.rating ?? shop?.average_rating ?? shop?.reviews_avg_rating ?? null;
  const rating = ratingRaw ? Number(ratingRaw).toFixed(1) : 'New';
  
  const reviewsCount = shop?.reviews_count ?? shop?.reviews?.length ?? 0;

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden bg-slate-800 dark:bg-[#1e293b] text-white shadow-lg border border-slate-700/50 h-full">
      {/* Banner */}
      <div className="h-24 w-full bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-purple-500 dark:to-indigo-500"></div>

      <div className="px-5 pb-5 relative flex-1 flex flex-col">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-xl font-bold text-blue-400 dark:text-purple-400 absolute -top-6 shadow-md border border-gray-700">
          {getInitial(shop?.shop_name)}
        </div>

        <div className="mt-8 mb-2">
          <h3 className="font-bold text-lg text-white line-clamp-1">{shop?.shop_name || 'Store'}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-yellow-400">
            <span>{'★'.repeat(Math.round(Number(ratingRaw) || 5))}</span>
            <span className="text-gray-400">
              {rating !== 'New' ? `${rating} (${reviewsCount})` : '(No reviews yet)'}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
          {shop?.description || 'Verified trusted seller on TrustNode marketplace.'}
        </p>

        <div className="flex items-center gap-6 mb-4 border-t border-gray-700/50 pt-4">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{listingsCount}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Listings</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">{calculateJoined(shop?.created_at)}</span>
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Joined</span>
          </div>
        </div>

        <Link 
          to={`/shops/${shop?.id}`}
          className="inline-flex w-fit items-center justify-center rounded-lg bg-blue-600/90 dark:bg-indigo-600/90 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500 dark:hover:bg-indigo-500"
        >
          View Shop
        </Link>
      </div>
    </div>
  );
}