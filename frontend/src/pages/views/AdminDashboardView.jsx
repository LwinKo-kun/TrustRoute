import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminDashboardView({ data }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disputeError, setDisputeError] = useState(null); // <-- Added error tracking
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      
      // 1. Fetch Orders Independently
      try {
        const ordersRes = await api.get('/orders');
        setOrders(ordersRes.data?.data || ordersRes.data || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }

      // 2. Fetch Disputes Independently (Won't crash orders if it fails)
      try {
        const disputesRes = await api.get('/disputes');
        setDisputes(disputesRes.data?.data || disputesRes.data || []);
      } catch (err) {
        console.error('Failed to fetch disputes', err);
        setDisputeError(err.response?.data?.message || err.message || "Failed to load disputes API.");
      }

      setLoading(false);
    };
    
    fetchAdminData();
  }, []);

  const handleResolveDispute = async (disputeId, resolutionType) => {
    const resolutionText = resolutionType === 'resolved_refund' ? "REFUND BUYER" : "PAY SELLER (Penalize Buyer)";
    const adminNotes = window.prompt(`Enter arbitration notes for resolution: ${resolutionText}`);
    
    if (!adminNotes) return;

    try {
      await api.patch(`/disputes/${disputeId}/resolve`, { 
        resolution: resolutionType,
        admin_notes: adminNotes
      });
      alert(`Dispute resolved. Action: ${resolutionText}`);
      
      // Refresh Data safely
      const [ordersRes, disputesRes] = await Promise.allSettled([api.get('/orders'), api.get('/disputes')]);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data?.data || []);
      if (disputesRes.status === 'fulfilled') setDisputes(disputesRes.value.data?.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve dispute.');
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      
      {/* Banner */}
      <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Admin Arbitration Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Administrator: {user?.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Handle global transactions, resolve disputes, and mediate escrow funds.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{orders.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Disputes</h3>
          <p className="text-4xl font-extrabold text-red-500 mt-2">{disputes.filter(d => d.status === 'open' || d.status === 'investigating').length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Resolved Disputes</h3>
          <p className="text-4xl font-extrabold text-emerald-500 mt-2">{disputes.filter(d => d.status === 'resolved_refund' || d.status === 'resolved_penalize').length}</p>
        </div>
      </div>

      {/* --- DISPUTES ARBITRATION SECTION --- */}
      <div className="bg-white dark:bg-[#0d1326] border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            ⚠️ Active Disputes Requires Attention
        </h2>
        
        {loading ? (
            <p className="text-sm py-4 text-center">Loading disputes...</p>
        ) : disputeError ? (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm font-bold border border-red-200">
                Backend Error: {disputeError} <br/><span className="font-normal mt-1 block">Check your routes/api.php and DisputeController.</span>
            </div>
        ) : disputes.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No disputes recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Raised By</th>
                  <th className="p-3 w-1/3">Reason</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Arbitration Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {disputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-3 font-bold text-blue-600 dark:text-cyan-400 cursor-pointer" onClick={() => navigate(`/orders/${dispute.order_id}`)}>
                      #{dispute.order_id} ↗
                    </td>
                    <td className="p-3 font-medium">{dispute.initiator?.name || `User #${dispute.raised_by}`}</td>
                    <td className="p-3 text-xs opacity-90 truncate max-w-xs">{dispute.reason}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        dispute.status === 'open' ? 'bg-amber-100 text-amber-700' :
                        dispute.status === 'resolved_refund' ? 'bg-rose-100 text-rose-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {/* Safe replace to prevent React crash */}
                        {(dispute.status || 'open').replace('_', ' ')} 
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {(dispute.status === 'open' || dispute.status === 'investigating') ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleResolveDispute(dispute.id, 'resolved_refund')} className="px-3 py-1.5 bg-rose-600 text-white rounded text-xs font-bold shadow-sm hover:bg-rose-700 transition">
                            Refund Buyer
                          </button>
                          <button onClick={() => handleResolveDispute(dispute.id, 'resolved_penalize')} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold shadow-sm hover:bg-emerald-700 transition">
                            Pay Seller
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs italic opacity-70">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- GLOBAL ORDERS SECTION --- */}
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Global Transactions Ledger</h2>
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-xs font-semibold">
            {['all', 'pending', 'processing', 'dispatched', 'completed', 'cancelled', 'disputed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${
                  filterStatus === status ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? <p className="text-sm py-4 text-center">Loading transactions...</p> : filteredOrders.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No orders match "{filterStatus}".</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredOrders.slice(0, 15).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-3 font-bold">#{order.id}</td>
                    <td className="p-3 font-semibold text-blue-600 dark:text-cyan-400">${order.total_amount}</td>
                    <td className="p-3 uppercase text-[10px] font-bold">{order.status}</td>
                    <td className="p-3 text-xs opacity-70">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => navigate(`/orders/${order.id}`)} className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 transition">
                        Inspect
                      </button>
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