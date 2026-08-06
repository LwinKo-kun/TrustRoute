import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = String(user?.role || '').toLowerCase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-4 border-b border-[var(--border)] bg-gradient-to-r from-purple-600 to-indigo-600 gap-4">
        
        {/* Top row for mobile (Logo + Hamburger toggle) */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <span className="text-lg font-bold tracking-tight text-[var(--text-h)]">
            Trust<span className="text-[var(--accent)]">Route</span>
          </span>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-sm font-medium p-2 border border-[var(--border)] rounded text-[var(--text-h)]"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Navigation & User Profile Section */}
        <div className={`w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          <nav className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-sm font-medium w-full md:w-auto">
            <Link to="/dashboard" className="text-[var(--text-h)] hover:text-[var(--accent)] transition py-1">Dashboard</Link>
            {role === 'admin' && (
              <span className="text-xs px-2 py-1 bg-red-500/10 text-red-500 rounded font-bold uppercase">Admin Portal</span>
            )}
            {role === 'shopkeeper' && (
              <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-500 rounded font-bold uppercase">Shopkeeper Portal</span>
            )}
            {role === 'delivery' && (
              <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-500 rounded font-bold uppercase">Delivery Hub</span>
            )}
          </nav>

          <div className="flex items-center justify-between w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[var(--border)] gap-4">
            <div className="text-left md:text-right">
              <p className="text-sm font-medium text-[var(--text-h)]">{user?.name}</p>
              <p className="text-xs uppercase tracking-wider opacity-60">{role || 'user'}</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      {/* Main Content with responsive padding */}
      <main className="flex-grow p-4 md:p-8 text-left">
        <Outlet />
      </main>
    </div>
  );
}