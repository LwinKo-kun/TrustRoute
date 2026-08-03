import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold tracking-tight text-[var(--text-h)]">Trust<span className="text-[var(--accent)]">Route</span></span>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/dashboard" className="text-[var(--text-h)] hover:text-[var(--accent)] transition">Dashboard</Link>
            <span className="text-[var(--text)] opacity-40">|</span>
            <span className="text-xs">Node Cluster Active</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[var(--text-h)]">Hello, {user?.name || 'Operator'}</span>
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-grow p-8 text-left">
        <Outlet />
      </main>
    </div>
  );
}