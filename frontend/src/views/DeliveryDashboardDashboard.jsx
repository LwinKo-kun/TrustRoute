import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DeliveryDashboardView({ data }) {
  const { user } = useAuth();
  const stats = data?.stats || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Delivery Agent Hub</span>
        <h1 className="text-2xl font-bold mt-1">Operator: {user?.name}</h1>
        <p className="text-sm mt-2">Check assigned dispatches and update delivery statuses.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Dispatched Orders</h3>
          <p className="text-3xl font-bold mt-2">{stats.assigned_deliveries ?? 0}</p>
        </div>
        <div className="p-5 border border-[var(--border)] rounded-xl">
          <h3 className="text-sm font-semibold opacity-60">Completed Deliveries</h3>
          <p className="text-3xl font-bold mt-2 text-green-500">{stats.completed_deliveries ?? 0}</p>
        </div>
      </div>
    </div>
  );
}