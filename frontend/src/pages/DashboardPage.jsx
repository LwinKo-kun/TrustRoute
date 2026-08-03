import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error('Failed to load dashboard protected data', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-medium text-[var(--text-h)]">Node Coordinator Status</h1>
        <p className="text-sm">Manage consensus variables, health checks, and active token metrics.</p>
      </div>

      {loading ? (
        <p className="text-sm">Synchronizing node state...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-60">Active Validator Nodes</span>
            <p className="text-2xl font-bold mt-2 text-[var(--text-h)]">{data?.stats?.active_nodes || 12}</p>
          </div>
          <div className="p-5 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-60">Network Health</span>
            <p className="text-2xl font-bold mt-2 text-[var(--text-h)]">{data?.stats?.network_health || '99.98%'}</p>
          </div>
          <div className="p-5 border border-[var(--border)] rounded-xl bg-[var(--code-bg)]">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-60">Pending Escrows</span>
            <p className="text-2xl font-bold mt-2 text-[var(--text-h)]">{data?.stats?.pending_transactions || 4}</p>
          </div>
        </div>
      )}

      <div className="mt-4 p-6 border border-[var(--border)] rounded-xl bg-[var(--bg)]">
        <h2 className="text-lg font-medium mb-2">Operator Session Info</h2>
        <p className="text-sm mb-4">Authenticated profile information retrieved securely via Laravel Sanctum token headers.</p>
        <div className="flex flex-col gap-2 text-sm">
          <div><span className="font-semibold">ID:</span> <code>{user?.id}</code></div>
          <div><span className="font-semibold">Name:</span> <code>{user?.name}</code></div>
          <div><span className="font-semibold">Email:</span> <code>{user?.email}</code></div>
          <div><span className="font-semibold">Registered:</span> <code>{user?.created_at}</code></div>
        </div>
      </div>
    </div>
  );
}