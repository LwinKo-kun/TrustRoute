import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ShopkeeperDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Shopkeeper Dashboard</span>
        <h1 className="text-2xl font-bold mt-1">Shop: {user?.name}'s Store</h1>
        <p className="text-sm mt-2">Manage your listings, update stocks, and fulfill incoming orders.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Active Listings</h3>
          <p className="text-3xl font-bold mt-2">{stats.active_listings ?? 0}</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Pending Orders</h3>
          <p className="text-3xl font-bold mt-2 text-amber-500">{stats.pending_orders ?? 0}</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">${Number(stats.pending_transactions || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}