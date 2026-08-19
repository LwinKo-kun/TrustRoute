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
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const params = searchQuery ? { search: searchQuery } : {};
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse verified products from trusted shops</p>
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
          <div className="text-center py-24 text-slate-400 font-medium">Loading inventory...</div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
            <p className="text-lg font-semibold">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No listings available yet'}
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-400 font-medium mb-4">{listings.length} products found</p>
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
          </>
        )}
      </div>
    </Layout>
  );
}