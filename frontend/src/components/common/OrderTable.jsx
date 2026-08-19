import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderTable({ orders, emptyMessage }) {
  const navigate = useNavigate();

  if (!orders || orders.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-white/5 uppercase text-[10px] tracking-wider text-slate-400 border-b border-slate-200 dark:border-white/10">
          <tr>
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <td className="p-3 font-bold text-slate-900 dark:text-white">#{order.id}</td>
              <td className="p-3">{order.customer?.name || `User #${order.customer_id}`}</td>
              <td className="p-3 font-semibold text-slate-900 dark:text-white">${order.total_amount}</td>
              <td className="p-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' :
                  order.status === 'disputed' || order.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                  order.status === 'processing' ? 'bg-amber-500/20 text-amber-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="p-3 text-xs opacity-70">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="p-3 text-right">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition shadow-sm inline-block"
                >
                  Inspect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}