import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function ShopkeeperDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form states (removed description)
  const [shopName, setShopName] = useState('');
  const [slug, setSlug] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch current user's shop using your backend endpoint
  const fetchMyShop = async () => {
    try {
      const res = await api.get('/my-shop');
      setShop(res.data.data);
      setShopName(res.data.data.shop_name);
      setSlug(res.data.data.slug);
    } catch (err) {
      if (err.response?.status === 404) {
        setShop(null); // No shop created yet
      } else {
        console.error('Failed to load shop details', err);
      }
    } finally {
      setLoadingShop(false);
    }
  };

  useEffect(() => {
    fetchMyShop();
  }, []);

  // Auto-generate slug from shop name if creating
  const handleNameChange = (e) => {
    const val = e.target.value;
    setShopName(val);
    if (!shop) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSaveShop = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      if (shop) {
        // Update existing shop
        const res = await api.put(`/shops/${shop.id}`, {
          shop_name: shopName,
          slug,
        });
        setShop(res.data.data);
        setIsEditing(false);
        setMessage('Shop updated successfully!');
      } else {
        // Create new shop
        const res = await api.post('/shops', {
          shop_name: shopName,
          slug,
        });
        setShop(res.data.data);
        setMessage('Shop created successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save shop details.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Shopkeeper Control Center</span>
        <h1 className="text-2xl font-bold mt-1">Welcome, {user?.name}</h1>
        <p className="text-sm mt-2">Manage your marketplace presence, inventory listings, and fulfillment workflow.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Active Listings</h3>
          <p className="text-3xl font-bold mt-2">{stats.active_listings ?? 0}</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2 text-amber-500">{stats.pending_orders ?? 0}</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Shop Status</h3>
          <p className="text-xl font-bold mt-2 uppercase tracking-wide text-emerald-500">
            {shop ? shop.status : 'No Shop Yet'}
          </p>
        </div>
      </div>

      {/* Shop Management Section */}
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--card-bg, transparent)]">
        <h2 className="text-lg font-bold mb-4">My Shop Configuration</h2>

        {loadingShop ? (
          <p className="text-sm opacity-60">Loading shop profile...</p>
        ) : (
          <div>
            {message && <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-lg text-sm">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">{error}</div>}

            {shop && !isEditing ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs opacity-60 uppercase font-semibold">Shop Name</span>
                    <p className="text-base font-medium">{shop.shop_name}</p>
                  </div>
                  <div>
                    <span className="text-xs opacity-60 uppercase font-semibold">URL Slug</span>
                    <p className="text-base font-medium font-mono">/shops/{shop.slug}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                  >
                    Edit Shop Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveShop} className="flex flex-col gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Shop Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={handleNameChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="e.g. CyberNode Electronics"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-transparent text-sm font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    placeholder="cyber-node-electronics"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                  >
                    {shop ? 'Update Shop' : 'Create Shop'}
                  </button>
                  {shop && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-[var(--border)] text-sm font-medium rounded-lg hover:opacity-80 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}