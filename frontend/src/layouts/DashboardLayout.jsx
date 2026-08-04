// frontend/src/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = String(user?.role || '').toLowerCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      <header className="flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold tracking-tight text-[var(--text-h)]">
            Trust<span className="text-[var(--accent)]">Route</span>
          </span>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/dashboard" className="text-[var(--text-h)] hover:text-[var(--accent)] transition">Dashboard</Link>
            {role === 'admin' && (
              <span className="text-xs px-2 py-1 bg-red-500/10 text-red-500 rounded font-bold uppercase">Admin Portal</span>
            )}
            {role === 'shopkeeper' && (
              <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold uppercase">Shopkeeper Portal</span>
            )}
            {role === 'delivery' && (
              <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 rounded font-bold uppercase">Delivery Hub</span>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-[var(--text-h)]">{user?.name}</p>
            <p className="text-xs uppercase tracking-wider opacity-60">{role || 'user'}</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="flex-grow p-8 text-left">
        <Outlet />
      </main>
    </div>
  );
}