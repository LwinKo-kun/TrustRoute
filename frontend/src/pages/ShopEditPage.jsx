// src/pages/ShopEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ShopEditPage() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [kpayNumber, setKpayNumber] = useState('');
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/my-shop')
      .then((res) => {
        const data = res.data.data;
        setShop(data);
        setShopName(data.shop_name || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setKpayNumber(data.kpay_number || '');
      })
      .catch(() => setError('Failed to load shop details.'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSubmitting(true);
      await api.put(`/shops/${shop.id}`, { 
        shop_name: shopName, 
        slug, 
        description, 
        kpay_number: kpayNumber 
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shop.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your shop? This action is irreversible.')) return;
    try {
      await api.delete(`/shops/${shop.id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete shop.');
    }
  };

  if (loading) return <p className="p-6 text-sm opacity-60">Loading store management...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto flex flex-col gap-6 bg-[var(--card-bg, transparent)] border border-[var(--border)] rounded-2xl shadow-sm mt-6 mb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Configuration</span>
        <h1 className="text-2xl font-extrabold mt-1">Manage Store Profile</h1>
        <p className="text-sm opacity-70 mt-1">Update your public brand identity, payment methods, or remove store data.</p>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">{error}</div>}
      
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Slug URL Identifier</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">KBZ Pay (KPay) Number</label>
          <input
            type="text"
            value={kpayNumber}
            onChange={(e) => setKpayNumber(e.target.value)}
            placeholder="e.g., 09123456789"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
          />
          <p className="text-[11px] opacity-60 mt-1">Customers will be instructed to send payments to this phone number when orders are accepted.</p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Store Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Tell customers about your store..."
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition w-full mt-2 shadow-md"
        >
          {submitting ? 'Saving Changes...' : 'Update Shop Profile'}
        </button>
      </form>

      {shop && (
        <div className="mt-4 pt-6 border-t border-[var(--border)] flex flex-col gap-3">
          <h3 className="text-red-500 text-xs font-bold uppercase tracking-wider">Danger Zone</h3>
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium rounded-xl hover:bg-red-500 hover:text-white transition w-full text-center"
          >
            Permanently Delete Shop
          </button>
        </div>
      )}
    </div>
  );
}