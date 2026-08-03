import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardView() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border border-red-500/30 rounded-xl bg-red-500/5">
        <span className="text-xs font-bold uppercase tracking-wider text-red-500">Admin Arbitration Center</span>
        <h1 className="text-2xl font-bold mt-1">Administrator: {user?.name}</h1>
        <p className="text-sm mt-2">Handle platform user suspensions, open disputes, and global moderation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Total Users</h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Open Disputes</h3>
          <p className="text-3xl font-bold mt-2 text-red-500">0</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Platform Shops</h3>
          <p className="text-3xl font-bold mt-2">--</p>
        </div>
      </div>
    </div>
  );
}