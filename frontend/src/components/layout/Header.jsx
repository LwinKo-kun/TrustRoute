import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCart } from '../../utils/cartStorage';
import ThemeToggle from '../common/ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Sync cart badge count for customers
  const updateCartBadge = () => {
    if (user?.role === 'customer') {
      const cart = getCart(user);
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    }
  };

  useEffect(() => {
    updateCartBadge();
    window.addEventListener('cartUpdated', updateCartBadge);
    window.addEventListener('storage', updateCartBadge);
    return () => {
      window.removeEventListener('cartUpdated', updateCartBadge);
      window.removeEventListener('storage', updateCartBadge);
    };
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/marketplace?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to logout', err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#070b1c]/95">
      {/* Top Accent Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70 dark:via-cyan-400" />

      <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-5 lg:px-7">
        <div className="flex h-[72px] min-w-0 items-center justify-between gap-2 lg:gap-3">

          {/* 1. BRAND LOGO */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-lg opacity-60 transition group-hover:opacity-100 dark:bg-cyan-500/30" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105 dark:border-cyan-400/30">
                <span className="text-sm font-black tracking-tight text-white">TR</span>
              </div>
            </div>

            <div className="hidden xl:block leading-none">
              <div className="text-[17px] font-extrabold tracking-tight text-gray-900 dark:text-white">
                Trust<span className="text-blue-600 dark:text-cyan-400">Route</span>
              </div>
              <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">
                Technology Marketplace
              </div>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="hidden shrink-0 items-center gap-0.5 lg:flex">
            <Link
              to="/marketplace"
              className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white xl:px-3.5"
            >
              Marketplace
              <span className="absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 rounded-full bg-blue-500 transition group-hover:scale-x-100 dark:bg-cyan-400" />
            </Link>

            <Link
              to="/shops"
              className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white xl:px-3.5"
            >
              Shops
              <span className="absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 rounded-full bg-blue-500 transition group-hover:scale-x-100 dark:bg-cyan-400" />
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white xl:px-3.5"
              >
                Dashboard
                <span className="absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 rounded-full bg-blue-500 transition group-hover:scale-x-100 dark:bg-cyan-400" />
              </Link>
            )}
          </nav>

          {/* 3. SEARCH BAR */}
          <form onSubmit={handleSearch} className="group relative min-w-0 flex-1 max-w-md mx-2 hidden sm:block">
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-cyan-400/0 opacity-0 blur-md transition duration-300 group-focus-within:opacity-100" />
            <div className="relative flex h-11 min-w-0 items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50/80 transition-all duration-300 group-hover:border-gray-300 group-focus-within:border-blue-500/50 group-focus-within:bg-white dark:border-white/10 dark:bg-white/[0.045] dark:group-hover:border-white/20 dark:group-focus-within:border-cyan-400/40 dark:group-focus-within:bg-white/[0.07]">
              <div className="flex h-full w-10 shrink-0 items-center justify-center">
                <svg className="h-[18px] w-[18px] text-gray-400 transition group-focus-within:text-blue-500 dark:text-slate-400 dark:group-focus-within:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m21 21-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, shops..."
                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-slate-500"
              />

              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-9 px-3.5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95"
              >
                Search
              </button>
            </div>
          </form>

          {/* 4. ACTIONS & CONTROLS */}
          <div className="flex shrink-0 items-center gap-2">
            
            {/* Theme Switcher Button */}
            <ThemeToggle />

            {/* Chat Icon Button */}
            {user && (
              <Link
                to="/chat"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                title="Messages & Chat"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </Link>
            )}

            {/* Cart Icon Button (Customers Only) */}
            {user?.role === 'customer' && (
              <Link
                to="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                title="Shopping Cart"
              >
                <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-extrabold text-white dark:bg-cyan-400 dark:text-gray-900">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons / Logout */}
            {!user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="hidden px-3 py-2 text-[13px] font-semibold text-gray-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-white sm:block"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="hidden h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-[13px] font-bold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5 active:scale-95 sm:flex"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30">
                  {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="h-9 px-3 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition dark:border-white/10 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400 dark:hover:border-red-500/30"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12M18 6 6 18" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* 5. MOBILE MENU */}
        {mobileOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-white/10 lg:hidden">
            <nav className="grid gap-1">
              <Link
                to="/marketplace"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Marketplace
              </Link>
              <Link
                to="/shops"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              >
                Shops
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            {!user ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-white/10 px-2">
                <span className="text-xs font-semibold text-gray-600 dark:text-slate-400">
                  Logged in as <strong className="text-gray-900 dark:text-white">{user.name}</strong> ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
}