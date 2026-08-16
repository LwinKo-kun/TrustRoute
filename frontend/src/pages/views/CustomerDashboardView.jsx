// src/pages/views/CustomerDashboardView.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { addToCartSecure } from '../../utils/cartStorage';

export default function CustomerDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};
  const listings = data?.listings || [];

  const handleAddToCart = (e, listing) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartSecure(user, listing, 1);
    alert(`Added "${listing.title}" to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome, {user?.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Browse marketplace listings, add items to your cart, and track active deliveries.
          </p>
        </div>
        <Link to="/cart" className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2 shrink-0">
          View Cart
        </Link>
      </div>

      {/* Marketplace Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] flex flex-col shadow-sm hover:shadow-md transition group">
            <Link to={`/listings/${listing.id}`} className="flex flex-col flex-grow">
              <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                <img src={`/api/listings/${listing.id}/image`} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition" onError={(e) => { e.target.style.display = 'none'; }} />
                
                {/* NEW: Shop Name Floating Badge (Top Left) */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider shadow-sm">
                  {listing.shop?.shop_name || listing.shop?.name || 'Store'}
                </div>

                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm">
                  Stock: {listing.stock}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-grow gap-1">
                {/* NEW: Shop Name Text Above Title */}
                <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                  {listing.shop?.shop_name || listing.shop?.name || 'Store'}
                </span>
                
                <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{listing.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{listing.description}</p>
              </div>
            </Link>

            <div className="px-5 pb-5 pt-2 flex items-center justify-between mt-auto border-t border-slate-100 dark:border-white/5">
              <span className="text-lg font-extrabold text-blue-600 dark:text-cyan-400">${listing.price}</span>
              <button onClick={(e) => handleAddToCart(e, listing)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}