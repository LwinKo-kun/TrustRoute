import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};
  const listings = data?.listings || [];
  const [cartCount, setCartCount] = useState(0);

  // Update cart item count dynamically from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    const interval = setInterval(updateCartCount, 1000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const addToCart = (e, listing) => {
    e.stopPropagation(); // Prevents navigating to the detail page when clicking the button
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === listing.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...listing,
        price: Number(listing.price) || 0,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItems);

    alert(`Added "${listing.title}" to cart!`);
  };

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 border border-[var(--border)] rounded-2xl bg-gradient-to-r from-[var(--code-bg)] to-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Customer Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold mt-2">Welcome, {user?.name}</h1>
          <p className="text-sm opacity-70 mt-1 max-w-xl">
            Browse marketplace listings from all active shops, add items to your cart, and track your active deliveries.
          </p>
        </div>

        <Link
          to="/cart"
          className="px-5 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl shadow-md hover:opacity-90 transition flex items-center gap-2 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          View Cart
          {cartCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white text-[var(--accent)] text-xs font-extrabold rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)] shadow-sm">
          <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider">Active Orders</h3>
          <p className="text-4xl font-extrabold mt-2">{stats.active_orders ?? 0}</p>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)] shadow-sm">
          <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider">Completed Orders</h3>
          <p className="text-4xl font-extrabold mt-2">{stats.completed_orders ?? 0}</p>
        </div>
      </div>

      {/* Marketplace Listings Section */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Marketplace Listings</h2>
          <span className="text-xs opacity-60 font-medium">{listings.length} items available</span>
        </div>

        {listings.length === 0 ? (
          <div className="p-12 border border-dashed border-[var(--border)] rounded-2xl text-center flex flex-col items-center gap-3">
            <p className="text-sm opacity-60">No products available in the marketplace yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--card-bg, transparent)] flex flex-col shadow-sm hover:shadow-md transition group"
              >
                {/* Clickable Card Link */}
                <Link to={`/listings/${listing.id}`} className="flex flex-col flex-grow">
                  {/* Product Image Thumbnail */}
                  <div className="w-full h-48 bg-[var(--border)]/10 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={`http://127.0.0.1:8000/api/listings/${listing.id}/image`}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                      {listing.shop?.shop_name || 'Store'}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      Stock: {listing.stock}
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex flex-col flex-grow gap-2">
                    <h3 className="font-bold text-base line-clamp-1 group-hover:text-[var(--accent)] transition">{listing.title}</h3>
                    <p className="text-xs opacity-70 line-clamp-2">{listing.description || 'No product description provided.'}</p>
                  </div>
                </Link>

                {/* Bottom Action Row (outside inner link to isolate button click) */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between mt-auto">
                  <span className="text-lg font-extrabold text-[var(--accent)]">${listing.price}</span>
                  <button
                    onClick={(e) => addToCart(e, listing)}
                    className="px-4 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-xl shadow-sm hover:opacity-90 transition z-10"
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