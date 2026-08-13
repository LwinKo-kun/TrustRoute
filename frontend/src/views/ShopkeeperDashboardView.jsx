import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

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

  if (loading) return <p className="p-8 text-sm opacity-60">Loading control center...</p>;

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-8 border border-[var(--border)] rounded-2xl bg-gradient-to-r from-[var(--code-bg)] to-transparent flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Shopkeeper Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold mt-2">{shop ? shop.shop_name : `Welcome, ${user?.name}`}</h1>
          <p className="text-sm opacity-70 mt-1 max-w-xl">
            {shop ? 'Manage your catalog items, track inventory stock levels, and coordinate storefront activity.' : 'Setup your store profile to start publishing products to the marketplace.'}
          </p>
        </div>

        {shop && (
          <div className="flex items-center gap-3">
            <Link
              to="/shop/edit"
              className="px-4 py-2.5 border border-[var(--border)] text-sm font-medium rounded-xl hover:bg-[var(--border)]/20 transition"
            >
              Manage Shop Settings
            </Link>

            {/* 💬 Customer Chats Button အသစ် */}
            <Link
              to="/chat"
              className="px-4 py-2.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-sm font-medium rounded-xl hover:bg-purple-200 transition flex items-center gap-2"
            >
              💬 Customer Chats
            </Link>

            <Link
              to="/listings/create"
              className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-md"
            >
              + Add New Listing
            </Link>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)] shadow-sm">
          <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider">Active Inventory</h3>
          <p className="text-4xl font-extrabold mt-2">{shop ? listings.length : 0}</p>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)] shadow-sm">
          <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider">Pending Orders</h3>
          <p className="text-4xl font-extrabold mt-2 text-amber-500">{stats.pending_orders ?? 0}</p>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)] shadow-sm">
          <h3 className="text-xs font-bold uppercase opacity-60 tracking-wider">Store Status</h3>
          <p className="text-2xl font-extrabold mt-2 uppercase tracking-wide text-emerald-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {shop ? shop.status : 'No Shop Yet'}
          </p>
        </div>
      </div>

      {!shop ? (
        <div className="p-12 border border-[var(--border)] rounded-2xl bg-[var(--card-bg, transparent)] flex flex-col items-center text-center gap-4 shadow-sm">
          <h2 className="text-2xl font-bold">You haven't set up your shop yet</h2>
          <p className="text-sm opacity-70 max-w-md">
            Create your store profile to configure your custom web slug, display your brand name, and publish inventory items to the marketplace.
          </p>
          <Link
            to="/shop/create"
            className="px-6 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition mt-2 shadow-md"
          >
            Create Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Product Catalog Cards</h2>
            <span className="text-xs opacity-60 font-medium">{listings.length} items total</span>
          </div>

          {listings.length === 0 ? (
            <div className="p-12 border border-dashed border-[var(--border)] rounded-2xl text-center flex flex-col items-center gap-3">
              <p className="text-sm opacity-60">No products listed in your catalog yet.</p>
              <Link to="/listings/create" className="text-xs font-semibold text-[var(--accent)] hover:underline">
                Publish your first product &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((item) => (
                <div key={item.id} className="border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--card-bg, transparent)] flex flex-col shadow-sm hover:shadow-md transition group">
                  {/* Product Image Thumbnail */}
                  <div className="w-full h-48 bg-[var(--border)]/10 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={`http://127.0.0.1:8000/api/listings/${item.id}/image`}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      Stock: {item.stock}
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex flex-col flex-grow gap-2">
                    <h3 className="font-bold text-base line-clamp-1">{item.title}</h3>
                    <p className="text-xs opacity-70 line-clamp-2">{item.description || 'No product description provided.'}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <span className="text-lg font-extrabold text-[var(--accent)]">${item.price}</span>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/listings/${item.id}/edit`}
                          className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs font-medium hover:bg-[var(--border)]/20 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs font-medium hover:bg-red-500 hover:text-white transition"
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