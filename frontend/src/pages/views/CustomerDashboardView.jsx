// src/pages/views/CustomerDashboardView.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api, { getListingImageUrl } from '../../services/api';
import { addToCartSecure } from '../../utils/cartStorage';

export default function CustomerDashboardView({ data }) {
  const { user } = useAuth();
  const listings = data?.listings || [];

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        const orderData = res.data?.data || res.data;
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        console.error("Failed to load customer orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAddToCart = (e, listing) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartSecure(user, listing, 1);
    alert(`Added "${listing.title}" to cart!`);
  };

  // Only show first 3 if not expanded
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-12">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-extrabold">Hello, {user?.name}</h1>
                <p className="text-blue-100 mt-1">Track your active orders or continue shopping the latest tech.</p>
            </div>
            <div className="flex gap-3">
                <Link to="/wallet" className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 text-sm font-semibold rounded-2xl transition">
                    Wallet Balance
                </Link>
                <Link to="/cart" className="px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 text-sm font-semibold rounded-2xl shadow-md transition">
                    View Cart
                </Link>
            </div>
        </div>
      </div>

      {/* Visual Order History */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            {orders.length > 3 && (
                <button 
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                    {showAllOrders ? 'Show Less' : 'See More'}
                </button>
            )}
        </div>
        
        {loadingOrders ? (
            <p className="text-sm text-slate-400">Loading your history...</p>
        ) : orders.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-center text-slate-500">
                You haven't placed any orders yet.
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedOrders.map(order => (
                    <Link 
                        key={order.id} 
                        to={`/orders/${order.id}`} 
                        className="p-5 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ORDER #{order.id}</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                            {order.shop?.shop_name || 'Store'}
                        </h4>
                        <div className="flex justify-between items-end mt-auto pt-2">
                            <span className="text-xs opacity-60">{new Date(order.created_at).toLocaleDateString()}</span>
                            <span className="font-black text-blue-600 dark:text-cyan-400">${order.total_amount}</span>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </section>

      {/* Marketplace Listings */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Marketplace</h2>
            <Link to="/marketplace" className="text-sm font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
                View All Listings →
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
            <div key={listing.id} className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] flex flex-col shadow-sm hover:shadow-lg transition">
                <Link to={`/listings/${listing.id}`} className="flex flex-col flex-grow">
                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <img src={getListingImageUrl(listing.id)} alt={listing.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm">
                      {listing.stock > 0 ? `${listing.stock} IN STOCK` : 'OUT OF STOCK'}
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-grow gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{listing.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{listing.description}</p>
                </div>
                </Link>
                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                    <span className="font-black text-blue-600 dark:text-cyan-400">${listing.price}</span>
                    <button onClick={(e) => handleAddToCart(e, listing)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition">
                        Add to Cart
                    </button>
                </div>
            </div>
            ))}
        </div>
      </section>
    </div>
  );
}