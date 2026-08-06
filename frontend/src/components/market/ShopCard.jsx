import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../common/RatingStars';

export default function ShopCard({ shop }) {
  if (!shop) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-xl shadow-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {shop.shop_name ? shop.shop_name.charAt(0).toUpperCase() : 'S'}
            </span>
          </div>
        </div>
      </div>
      <div className="pt-14 px-5 pb-4 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">{shop.shop_name}</h3>
          {shop.verified && (
            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium rounded-full">Verified</span>
          )}
        </div>
        <div className="mb-3">
          <RatingStars rating={shop.rating || 4.5} count={shop.rating_count || 42} size="sm" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {shop.description || 'No description provided.'}
        </p>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <span className="block font-bold text-gray-900 dark:text-white">{shop.listing_count || 0}</span>
            <span className="text-xs">Listings</span>
          </div>
          <div>
            <span className="block font-bold text-gray-900 dark:text-white">{shop.joined_since || '3m'}</span>
            <span className="text-xs">Joined</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <Link to={`/shops/${shop.id}`} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition text-center">
          View Shop
        </Link>
      </div>
    </div>
  );
}