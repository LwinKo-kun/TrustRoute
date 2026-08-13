import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

export default function CustomerDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};
  const listings = data?.listings || [];

  const addToCart = (e, listing) => {
    e.stopPropagation();
    const cartKey = `cart_user_${user?.id || 'guest'}`;
    const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const existingIndex = cart.findIndex(item => item.id === listing.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...listing, price: Number(listing.price) || 0, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify({ timestamp: Date.now(), items: cart }));
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`Added "${listing.title}" to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">

      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">Customer Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome, {user?.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Browse marketplace listings from all active shops, add items to your cart, and track your active deliveries.
          </p>
        </div>

        <Link
          to="/cart"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          View Cart
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Active Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.active_orders ?? 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Completed Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.completed_orders ?? 0}</p>
        </div>
      </div>

      {/* Marketplace Listings */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Marketplace Listings</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{listings.length} items available</span>
        </div>

        {listings.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-center bg-white dark:bg-[#0d1326]">
            <p className="text-sm text-slate-500 dark:text-slate-400">No products available in the marketplace yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] flex flex-col shadow-sm hover:shadow-md transition group"
              >
                <Link to={`/listings/${listing.id}`} className="flex flex-col flex-grow">
                  <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={`/api/listings/${listing.id}/image`}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                      {listing.shop?.shop_name || 'Store'}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      Stock: {listing.stock}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">{listing.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{listing.description || 'No product description provided.'}</p>
                  </div>
                </Link>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between mt-auto border-t border-slate-100 dark:border-white/5">
                  <span className="text-lg font-extrabold text-blue-600 dark:text-cyan-400">${listing.price}</span>
                  <button
                    onClick={(e) => addToCart(e, listing)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}