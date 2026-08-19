import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import OrderTable from '../../components/common/OrderTable';

export default function AdminDashboardView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [pendingWalletTx, setPendingWalletTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [ordersRes, disputesRes, walletRes] = await Promise.allSettled([
        api.get('/orders'),
        api.get('/disputes'),
        api.get('/admin/wallet-pending')
      ]);

      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data?.data || ordersRes.value.data || []);
      if (disputesRes.status === 'fulfilled') setDisputes(disputesRes.value.data?.data || disputesRes.value.data || []);
      if (walletRes.status === 'fulfilled') setPendingWalletTx(walletRes.value.data?.data || walletRes.value.data || []);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerifyWalletTx = async (txId, status) => {
    if (!window.confirm(`Are you sure you want to mark this transaction as ${status}?`)) return;
    try {
      await api.patch(`/admin/wallet-transactions/${txId}/verify`, { status });
      alert(`Transaction successfully ${status}!`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update transaction.');
    }
  };

  const handleResolveDispute = async (disputeId, resolutionType) => {
    const resolutionText = resolutionType === 'resolved_refund' ? "REFUND BUYER" : "PAY SELLER";
    const adminNotes = window.prompt(`Enter arbitration notes: ${resolutionText}`);
    if (!adminNotes) return;

    try {
      await api.patch(`/disputes/${disputeId}/resolve`, { resolution: resolutionType, admin_notes: adminNotes });
      alert('Dispute resolved.');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve dispute.');
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      
      <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Admin Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Administrator: {user?.name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Verify wallet transactions, mediate escrow funds, and resolve disputes.</p>
        </div>
        <Link to="/wallet" className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md transition shrink-0">
          Global Wallets
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Wallet Requests</h3>
          <p className="text-4xl font-extrabold text-amber-500 mt-2">{pendingWalletTx.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Disputes</h3>
          <p className="text-4xl font-extrabold text-red-600 mt-2">{disputes.filter(d => ['open', 'investigating'].includes(d.status)).length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total System Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Pending Wallet Verification Section */}
      <div className="bg-white dark:bg-[#0d1326] border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">💰 Pending Deposits & Withdrawals Verification</h2>
        {pendingWalletTx.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No pending deposit or withdrawal requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Details / Ref</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {pendingWalletTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{tx.wallet?.user?.name || `User #${tx.wallet?.user_id}`}</td>
                    <td className="p-3 uppercase font-semibold text-xs">{tx.type}</td>
                    <td className="p-3 font-extrabold text-emerald-600">${Number(tx.amount).toFixed(2)}</td>
                    <td className="p-3 text-xs opacity-90">{tx.description}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleVerifyWalletTx(tx.id, 'completed')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition">Approve</button>
                        <button onClick={() => handleVerifyWalletTx(tx.id, 'rejected')} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Disputes Section */}
      <div className="bg-white dark:bg-[#0d1326] border border-red-200 dark:border-red-900/50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">⚠️ Active Disputes</h2>
        {disputes.filter(d => ['open', 'investigating'].includes(d.status)).length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No active disputes recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {disputes.filter(d => ['open', 'investigating'].includes(d.status)).map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-3 font-bold text-blue-600 cursor-pointer" onClick={() => navigate(`/orders/${dispute.order_id}`)}>#{dispute.order_id} ↗</td>
                    <td className="p-3 text-xs opacity-90 truncate max-w-xs">{dispute.reason}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleResolveDispute(dispute.id, 'resolved_refund')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition">Refund Buyer</button>
                        <button onClick={() => handleResolveDispute(dispute.id, 'resolved_penalize')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition">Pay Seller</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Global Transactions Ledger */}
      <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-4 mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Global Transactions Ledger</h2>
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-xs font-semibold">
            {['all', 'pending', 'processing', 'dispatched', 'completed', 'cancelled', 'disputed'].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${filterStatus === status ? 'bg-slate-800 dark:bg-white/20 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'}`}>{status}</button>
            ))}
          </div>
        </div>
        {loading ? <p className="text-sm py-4 text-center text-slate-500">Loading transactions...</p> : <OrderTable orders={filteredOrders.slice(0, 15)} emptyMessage={`No orders match "${filterStatus}".`} />}
      </div>

    </div>
  );
}