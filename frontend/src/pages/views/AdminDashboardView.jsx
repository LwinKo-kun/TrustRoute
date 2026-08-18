// src/pages/views/AdminDashboardView.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await api.get('/orders');
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

  // Admin Arbitration Override (Force Resolve / Force Refund via 2PC status endpoint)
  const handleAdminOverrideStatus = async (orderId, newStatus) => {
    if (!window.confirm(`ADMIN ACTION: Force update order #${orderId} to status "${newStatus}"? This will execute 2PC commitment/rollback rules immediately.`)) return;

    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders list
      const response = await api.get('/orders');
      const orderData = response.data.data || response.data.items || response.data;
      setOrders(Array.isArray(orderData) ? orderData : []);
      alert(`Order #${orderId} successfully overridden to ${newStatus}.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to execute admin override.');
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      
      {/* Banner */}
      <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Admin Arbitration Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Administrator: {user?.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Handle global transactions, execute 2PC financial overrides, resolve disputes, and maintain platform stability.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Network Nodes</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.active_nodes ?? '--'}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Active Disputes</h3>
          <p className="text-4xl font-extrabold text-red-500 dark:text-red-400 mt-2">{stats.system_alerts ?? 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Total Platform Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Global Orders & Transactions Management Section */}
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Global Transactions & Arbitration Ledger</h2>
          
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-xs font-semibold">
            {['all', 'pending', 'processing', 'dispatched', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${
                  filterStatus === status 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <p className="text-sm text-slate-500 py-6 text-center">Loading global transactions...</p>
        ) : error ? (
          <p className="text-sm text-red-500 py-6">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No platform orders found matching filter "{filterStatus}".</p>
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
                  <th className="p-3 text-right">Arbitration Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 dark:text-cyan-400 hover:underline">
                        #{order.id} ↗
                      </Link>
                    </td>
                    <td className="p-3">User #{order.customer_id}</td>
                    <td className="p-3">Shop #{order.shop_id}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">${order.total_amount}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                        order.status === 'paid' || order.status === 'dispatched' ? 'bg-purple-500/20 text-purple-500' :
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
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/20 transition shadow-sm"
                        >
                          Inspect
                        </Link>
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleAdminOverrideStatus(order.id, 'cancelled')}
                            className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900 transition shadow-sm"
                            title="Force cancel and trigger escrow refund"
                          >
                            Force Refund
                          </button>
                        )}
                      </div>
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