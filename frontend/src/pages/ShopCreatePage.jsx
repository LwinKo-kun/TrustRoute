import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';

export default function ShopCreatePage() {
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/shops', {
        shop_name: shopName,
        description: description,
      });
      alert('Shop created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create shop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Create Your Store</h1>
          <p className="text-sm text-slate-500 mb-6">Set up your store identity and unique description for the marketplace.</p>

          {error && <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-xl text-sm font-semibold">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Store Name</label>
              <input 
                type="text" 
                value={shopName} 
                onChange={(e) => setShopName(e.target.value)} 
                placeholder="e.g., CyberTech Solutions" 
                className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Store Description (Varies per store)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe what your store specializes in, your shipping policies, or your tech stack..." 
                rows="4"
                className="w-full p-3.5 border border-slate-200 dark:border-white/10 rounded-xl bg-transparent text-slate-900 dark:text-white text-sm"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
            >
              {loading ? 'Creating Store...' : 'Publish Store'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}