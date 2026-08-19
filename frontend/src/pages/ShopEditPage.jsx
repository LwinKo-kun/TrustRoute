import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ShopEditPage() {
  const navigate = useNavigate();
  const [shopId, setShopId] = useState(null);
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await api.get('/my-shop');
        const shop = res.data?.data || res.data;
        setShopId(shop.id);
        setShopName(shop.shop_name || '');
        setDescription(shop.description || '');
      } catch (err) {
        setError('Failed to load your store details.');
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await api.put(`/shops/${shopId}`, {
        shop_name: shopName,
        description: description,
      });
      alert('Store settings updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update store.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-24 text-slate-400">Loading store settings...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Manage Store Profile</h1>
        <p className="text-sm text-slate-500 mb-6">Update your store name and custom description.</p>

        {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-xl text-sm font-semibold">{error}</div>}

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Store Name</label>
            <input 
              type="text" 
              value={shopName} 
              onChange={(e) => setShopName(e.target.value)} 
              className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Store Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4"
              className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
            />
          </div>

          <button 
            type="submit" 
            disabled={saving} 
            className="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}