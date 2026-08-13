import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

export default function MarketplacePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Load listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = search ? { search } : {};
        const res = await api.get('/listings', { params });
        const data = res.data?.data || res.data;
        setListings(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchListings, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync cart count
  useEffect(() => {
    const update = () => {
      const cartKey = `cart_user_${user?.id || 'guest'}`;
      const cartObj = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const items = Array.isArray(cartObj) ? cartObj : (cartObj.items || []);
      setCartCount(items.reduce((s, i) => s + (i.quantity || 1), 0));
    };
    update();
    window.addEventListener('storage', update);
    window.addEventListener('cartUpdated', update);
    const interval = setInterval(update, 1000);
    return () => { 
      clearInterval(interval); 
      window.removeEventListener('storage', update); 
      window.removeEventListener('cartUpdated', update);
    };
  }, [user]);

  const addToCart = (e, listing) => {
    e.preventDefault();
    e.stopPropagation();
    const cartKey = `cart_user_${user?.id || 'guest'}`;
    const cartObj = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const cart = Array.isArray(cartObj) ? cartObj : (cartObj.items || []);
    
    const idx = cart.findIndex(i => i.id === listing.id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ ...listing, price: Number(listing.price) || 0, quantity: 1 });
    
    localStorage.setItem(cartKey, JSON.stringify({ timestamp: Date.now(), items: cart }));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartCount(cart.reduce((s, i) => s + (i.quantity || 1), 0));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Marketplace</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse verified products from trusted shops</p>
          </div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-md transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="px-2 py-0.5 bg-white dark:bg-cyan-400 text-blue-600 dark:text-slate-900 text-xs font-extrabold rounded-full">{cartCount}</span>
            )}
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, shops..."
            className="w-full pl-12 pr-10 py-3.5 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] text-slate-800 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-cyan-950/50 shadow-sm transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-100 dark:bg-slate-800" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400 dark:text-slate-500">
            <svg className="w-16 h-16 text-slate-200 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">
              {search ? `No results for "${search}"` : 'No listings available yet'}
            </p>
            {search && (
              <button onClick={() => setSearch('')} className="text-sm text-blue-600 dark:text-cyan-400 hover:underline">Clear search</button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-4">{listings.length} products found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map(listing => (
                <Link
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="group border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] flex flex-col shadow-sm hover:shadow-md transition"
                >
                  {/* Image */}
                  <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={`/api/listings/${listing.id}/image`}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                      {listing.shop?.shop_name || 'Store'}
                    </div>
                    {listing.stock <= 5 && listing.stock > 0 && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Low stock
                      </div>
                    )}
                    {listing.stock === 0 && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">{listing.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{listing.description || 'No description.'}</p>

                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                      <span className="text-lg font-extrabold text-blue-600 dark:text-cyan-400">${listing.price}</span>
                      <button
                        onClick={e => addToCart(e, listing)}
                        disabled={listing.stock === 0}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                      >
                        {listing.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}