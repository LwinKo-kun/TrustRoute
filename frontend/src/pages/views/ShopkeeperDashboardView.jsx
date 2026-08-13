import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function ShopkeeperDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  const [shop, setShop] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const shopRes = await api.get('/my-shop');
        setShop(shopRes.data.data);
        const listingsRes = await api.get('/my-shop/listings');
        const listData = listingsRes.data.data || listingsRes.data;
        setListings(Array.isArray(listData) ? listData : []);
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  if (loading) return <p className="p-8 text-sm text-slate-500 dark:text-slate-400">Loading control center...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">

      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Shopkeeper Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{shop ? shop.shop_name : `Welcome, ${user?.name}`}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {shop
              ? 'Manage your catalog items, track inventory stock levels, and coordinate storefront activity.'
              : 'Setup your store profile to start publishing products to the marketplace.'}
          </p>
        </div>

        {shop && (
          <div className="flex items-center gap-3">
            <Link to="/shop/edit" className="px-4 py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition">
              Manage Shop Settings
            </Link>
<<<<<<< HEAD
            <Link to="/chat" className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900 transition flex items-center gap-2">
              💬 Customer Chats
            </Link>
            <Link to="/listings/create" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-sm font-semibold rounded-xl transition shadow-md">
=======
            <Link to="/listings/create" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-md">
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
              + Add New Listing
            </Link>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Active Inventory</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{shop ? listings.length : 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Pending Orders</h3>
          <p className="text-4xl font-extrabold text-amber-500 dark:text-amber-400 mt-2">{stats.pending_orders ?? 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Store Status</h3>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {shop ? shop.status : 'No Shop Yet'}
          </p>
        </div>
      </div>

      {!shop ? (
        <div className="p-12 border border-dashed border-slate-300 dark:border-white/20 rounded-2xl bg-white dark:bg-[#0d1326] flex flex-col items-center text-center gap-4 shadow-sm transition-colors duration-300">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You haven't set up your shop yet</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Create your store profile to configure your custom web slug, display your brand name, and publish inventory items to the marketplace.
          </p>
          <Link to="/shop/create" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white text-sm font-semibold rounded-xl transition mt-2 shadow-md">
            Create Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Catalog</h2>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{listings.length} items total</span>
          </div>

          {listings.length === 0 ? (
            <div className="p-12 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl text-center flex flex-col items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">No products listed in your catalog yet.</p>
              <Link to="/listings/create" className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline">
                Publish your first product →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((item) => (
                <div key={item.id} className="border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#0d1326] flex flex-col shadow-sm hover:shadow-md transition group">
                  <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={`/api/listings/${item.id}/image`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      Stock: {item.stock}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{item.description || 'No product description provided.'}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
                      <span className="text-lg font-extrabold text-blue-600 dark:text-cyan-400">${item.price}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/listings/${item.id}/edit`}
                          className="px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="px-3 py-1.5 bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 rounded-lg text-xs font-medium hover:bg-red-500 hover:text-white transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}