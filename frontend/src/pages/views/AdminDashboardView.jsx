import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      {/* Banner */}
      <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Admin Arbitration Center</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Administrator: {user?.name}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Handle platform user suspensions, open disputes, and global moderation.</p>
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
          <h3 className="text-xs font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Pending Transactions</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{stats.pending_transactions ?? '--'}</p>
        </div>
      </div>
    </div>
  );
}