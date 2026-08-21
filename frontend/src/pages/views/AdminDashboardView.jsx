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

  // "See More" visibility limits
  const [visibleTxCount, setVisibleTxCount] = useState(5);
  const [visibleDisputesCount, setVisibleDisputesCount] = useState(5);
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(10);

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

  const handleApproveCancellation = async (orderId) => {
    if (!window.confirm(`Approve cancellation and refund escrow to the buyer for Order #${orderId}?`)) return;
    try {
      await api.patch(`/orders/${orderId}/approve-cancellation`);
      alert('Cancellation approved and escrow funds refunded.');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process cancellation approval.');
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

  const activeDisputes = disputes.filter(d => ['open', 'investigating'].includes(d.status));
  const cancellationRequests = orders.filter(o => o.status === 'cancellation_requested');
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      
      {/* Top Banner */}
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Pending Wallet Requests</h3>
          <p className="text-4xl font-extrabold text-amber-500 mt-2">{pendingWalletTx.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Cancellation Requests</h3>
          <p className="text-4xl font-extrabold text-blue-500 mt-2">{cancellationRequests.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Disputes</h3>
          <p className="text-4xl font-extrabold text-red-600 mt-2">{activeDisputes.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total System Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{orders.length}</p>
        </div>
      </div>

      {/* --- PENDING CANCELLATION & REFUND REQUESTS --- */}
      <div className="bg-white dark:bg-[#0d1326] border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            🔄 Pending Cancellation & Refund Requests ({cancellationRequests.length})
          </h2>
        </div>

        {cancellationRequests.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No pending cancellation requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Store</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {cancellationRequests.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-3 font-bold text-blue-600 cursor-pointer" onClick={() => navigate(`/orders/${order.id}`)}>#{order.id} ↗</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{order.customer?.name || `User #${order.customer_id}`}</td>
                    <td className="p-3">{order.shop?.shop_name || 'Store'}</td>
                    <td className="p-3 font-extrabold text-slate-900 dark:text-white">MMK {order.total_amount}</td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => handleApproveCancellation(order.id)} 
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Approve & Refund Escrow
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Wallet Verifications Card */}
      <div className="bg-white dark:bg-[#0d1326] border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            💰 Pending Deposits & Withdrawals ({pendingWalletTx.length})
          </h2>
          {pendingWalletTx.length > 5 && (
            <button 
              onClick={() => setVisibleTxCount(prev => prev === 5 ? pendingWalletTx.length : 5)}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              {visibleTxCount === 5 ? `See More (${pendingWalletTx.length - 5} more)` : 'Show Less'}
            </button>
          )}
        </div>

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
                  <th className="p-3">Details / SS</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {pendingWalletTx.slice(0, visibleTxCount).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{tx.wallet?.user?.name || `User #${tx.wallet?.user_id}`}</td>
                    <td className="p-3 uppercase font-semibold text-xs">{tx.type}</td>
                    <td className="p-3 font-extrabold text-emerald-600">MMK {Number(tx.amount).toFixed(2)}</td>
                    <td className="p-3 text-xs opacity-90">
                      <div>{tx.description}</div>
                      {tx.screenshot_path && (
                        <a href={`/storage/${tx.screenshot_path}`} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-cyan-400 font-semibold underline mt-1 inline-block">
                          🖼️ View Proof SS
                        </a>
                      )}
                    </td>
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

      {/* Active Disputes Card */}
      <div className="bg-white dark:bg-[#0d1326] border border-red-200 dark:border-red-900/50 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            ⚠️ Active Disputes ({activeDisputes.length})
          </h2>
          {activeDisputes.length > 5 && (
            <button 
              onClick={() => setVisibleDisputesCount(prev => prev === 5 ? activeDisputes.length : 5)}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline"
            >
              {visibleDisputesCount === 5 ? `See More (${activeDisputes.length - 5} more)` : 'Show Less'}
            </button>
          )}
        </div>

        {activeDisputes.length === 0 ? (
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
                {activeDisputes.slice(0, visibleDisputesCount).map((dispute) => (
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
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Global Transactions Ledger</h2>
            <p className="text-xs text-slate-400 mt-0.5">Showing {Math.min(visibleOrdersCount, filteredOrders.length)} of {filteredOrders.length} records</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-xs font-semibold">
            {['all', 'pending', 'processing', 'dispatched', 'completed', 'cancelled', 'cancellation_requested'].map((status) => (
              <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition ${filterStatus === status ? 'bg-slate-800 dark:bg-white/20 text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'}`}>{status}</button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <p className="text-sm py-4 text-center text-slate-500">Loading transactions...</p>
        ) : (
          <>
            <OrderTable orders={filteredOrders.slice(0, visibleOrdersCount)} emptyMessage={`No orders match "${filterStatus}".`} />
            
            {filteredOrders.length > visibleOrdersCount && (
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setVisibleOrdersCount(prev => prev + 10)}
                  className="px-6 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition shadow-sm"
                >
                  See More Orders ({filteredOrders.length - visibleOrdersCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}