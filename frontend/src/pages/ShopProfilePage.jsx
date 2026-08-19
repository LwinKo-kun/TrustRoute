import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/common/ProductCard';
import { useAuth } from '../context/AuthContext';
import { addToCartSecure } from '../utils/cartStorage';

export default function ShopProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopProfile = async () => {
      try {
        setLoading(true);
        // Ensure your API returns the shop object including the description field
        const res = await api.get(`/shops/${id}`);
        setShop(res.data?.data || res.data);
      } catch (err) {
        setError('Shop not found or has been suspended.');
      } finally {
        setLoading(false);
      }
    };
    fetchShopProfile();
  }, [id]);

  const handleAddToCart = (e, listing) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartSecure(user, listing, 1);
    alert(`Added "${listing.title}" to cart!`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !shop) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Store Unavailable</h1>
          <p className="text-sm text-slate-500 mb-6">{error || 'This shop does not exist.'}</p>
          <Link to="/marketplace" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow">
            Return to Marketplace
          </Link>
        </div>
      </Layout>
    );
  }

  const listings = shop.listings || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
        
        {/* Shop Header Banner */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-widest">
                Verified Store • {shop.status}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">{shop.shop_name}</h1>
            
            {/* Varied Description: whitespace-pre-line preserves newlines from textareas */}
            <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed whitespace-pre-line">
              {shop.description && shop.description.trim() !== "" 
                ? shop.description 
                : 'Welcome to our verified technology store. Explore our catalog backed by TrustRoute secure escrow protection.'}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 shrink-0 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10">
            <span className="text-xs uppercase tracking-wider text-slate-300 font-bold">Store Catalog</span>
            <span className="text-3xl font-black text-cyan-400">{listings.length} Items</span>
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Store Inventory</h2>

          {listings.length === 0 ? (
            <div className="p-16 border border-dashed border-slate-300 dark:border-white/20 rounded-2xl text-center">
              <p className="text-sm text-slate-500 font-medium">This store has not published any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{ ...product, shop: { shop_name: shop.shop_name, id: shop.id } }} 
                  actionButton={
                    <button 
                      onClick={(e) => handleAddToCart(e, product)} 
                      disabled={product.stock === 0}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                      Add to Cart
                    </button>
                  } 
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}