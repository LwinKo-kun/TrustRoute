import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboardView() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Customer Portal</span>
        <h1 className="text-2xl font-bold mt-1">Welcome, {user?.name}</h1>
        <p className="text-sm mt-2">Browse listings, place orders, and track your active deliveries.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Active Orders</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Completed Orders</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}