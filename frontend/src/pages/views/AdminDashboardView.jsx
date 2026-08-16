// src/pages/views/AdminDashboardView.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all orders globally for admin oversight
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await api.get('/orders');
        // Handle pagination or direct array structures
        const orderData = response.data.data || response.data.items || response.data;
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        console.error('Failed to fetch platform orders', err);
        setError('Failed to load global transactions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      {/* Banner */}
      <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Admin Arbitration Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Administrator: {user?.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Handle platform user suspensions, global transactions, open disputes, and moderation.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Network Nodes</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.active_nodes ?? '--'}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Open Disputes</h3>
          <p className="text-4xl font-extrabold text-red-500 dark:text-red-400 mt-2">{stats.system_alerts ?? 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Total Platform Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Global Orders & Transactions Management Section */}
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Global Transactions & Orders Ledger</h2>
        
        {loading ? (
          <p className="text-sm text-slate-500 py-4 text-center">Loading global transactions...</p>
        ) : error ? (
          <p className="text-sm text-red-500 py-4">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No platform orders recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3">Shop ID</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">#{order.id}</td>
                    <td className="p-3">User #{order.customer_id}</td>
                    <td className="p-3">Shop #{order.shop_id}</td>
                    <td className="p-3 font-semibold text-blue-600 dark:text-cyan-400">${order.total_amount}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'processing' ? 'bg-yellow-500/20 text-yellow-500' :
                        order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs opacity-70">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}