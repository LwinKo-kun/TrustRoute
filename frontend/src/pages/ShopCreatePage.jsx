import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ShopCreatePage() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setShopName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);
      await api.post('/shops', { shop_name: shopName, slug });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto flex flex-col gap-6 bg-[var(--card-bg, transparent)] border border-[var(--border)] rounded-2xl shadow-sm mt-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Onboarding</span>
        <h1 className="text-2xl font-extrabold mt-1">Create Your Shop</h1>
        <p className="text-sm opacity-70 mt-1">Configure your custom store identity and marketplace presence.</p>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase opacity-70 mb-1">Shop Name</label>
          <input
            type="text"
            value={shopName}
            onChange={handleNameChange}
            required
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
            placeholder="e.g. CyberNode Electronics"
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
            placeholder="cyber-node-electronics"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition w-full mt-2 shadow-md"
        >
          {loading ? 'Creating Shop...' : 'Launch Shop'}
        </button>
      </form>
    </div>
  );
}