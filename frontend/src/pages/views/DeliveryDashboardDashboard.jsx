import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      {/* Banner */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Delivery Agent Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Operator: {user?.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Check assigned dispatches and update delivery statuses.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Dispatched Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.assigned_deliveries ?? 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm transition-colors duration-300">
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Completed Deliveries</h3>
          <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{stats.completed_deliveries ?? 0}</p>
        </div>
      </div>
    </div>
  );
}