// frontend/src/pages/MarketplacePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [listings, setListings] = useState([]);
  const [matchedShops, setMatchedShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setLoading(true);
        const params = searchQuery ? { search: searchQuery } : {};
        
        // Fetch listings and shops concurrently
        const [listingsRes, shopsRes] = await Promise.all([
          api.get('/listings', { params }),
          api.get('/shops', { params })
        ]);

        const listingData = listingsRes.data?.data || listingsRes.data;
        setListings(Array.isArray(listingData) ? listingData : listingData?.data || []);

        const shopData = shopsRes.data?.data || shopsRes.data;
        const allShops = Array.isArray(shopData) ? shopData : shopData?.data || [];
        
        // Filter shops client-side if a search query is present to match shop names
        if (searchQuery) {
          const filteredShops = allShops.filter(s => 
            s.shop_name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMatchedShops(filteredShops);
        } else {
          setMatchedShops([]);
        }

      } catch (err) {
        console.error('Failed to load marketplace data', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchSearchData, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300 flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse verified products and trusted shops</p>
          </div>
          <Link to="/cart" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
            {cartCount > 0 && <span className="px-2 py-0.5 bg-white text-blue-600 text-xs font-extrabold rounded-full">{cartCount}</span>}
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400 font-medium">Searching marketplace...</div>
        ) : (
          <div className="flex flex-col gap-10">
            
            {/* Matched Shops Section (Shows up if query matches any store) */}
            {matchedShops.length > 0 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🏪 Matching Stores ({matchedShops.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedShops.map(shop => (
                    <Link 
                      key={shop.id} 
                      to={`/shops/${shop.id}`}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 hover:border-blue-500 shadow-sm flex flex-col gap-2 transition group"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">{shop.shop_name}</h3>
                        <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">{shop.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{shop.description || 'Verified merchant store.'}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Products ({listings.length})
              </h2>

              {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400 bg-white dark:bg-[#0d1326] rounded-2xl border border-slate-200 dark:border-white/10">
                  <p className="text-base font-semibold">
                    {searchQuery ? `No product results found for "${searchQuery}"` : 'No listings available yet'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map(listing => (
                    <ProductCard 
                      key={listing.id} 
                      product={listing} 
                      actionButton={
                        <button
                          onClick={e => addToCart(e, listing)}
                          disabled={listing.stock === 0}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                        >
                          {listing.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                      }
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}