import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getCart } from '../../utils/cartStorage';
import ThemeToggle from '../common/ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasShop, setHasShop] = useState(false);
  
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCartBadge = () => {
    if (user?.role === 'customer') {
      const cart = getCart(user);
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    }
  };

  const fetchUnreadCount = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/messages/unread-count?t=${Date.now()}`);
      setUnreadCount(res.data?.count || 0);
    } catch (err) {
      // Silent catch
    }
  };

  const checkUserShop = async () => {
    if (user?.role === 'shopkeeper' || user?.role === 'admin') {
      try {
        const res = await api.get('/my-shop');
        if (res.data?.data || res.data) {
          setHasShop(true);
        }
      } catch (err) {
        setHasShop(false);
      }
    }
  };

  useEffect(() => {
    updateCartBadge();
    checkUserShop();
    window.addEventListener('cartUpdated', updateCartBadge);
    window.addEventListener('storage', updateCartBadge);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartBadge);
      window.removeEventListener('storage', updateCartBadge);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000);
      window.addEventListener('messagesRead', fetchUnreadCount);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('messagesRead', fetchUnreadCount);
      };
    }
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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-70 dark:via-cyan-400" />

      <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-5 lg:px-7">
        <div className="flex h-[72px] min-w-0 items-center justify-between gap-2 lg:gap-3">

          {/* Logo - Updated to TrustNode Marketplace */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-blue-500/30 blur-lg opacity-60 transition group-hover:opacity-100 dark:bg-cyan-500/30" />
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-105 dark:border-cyan-400/30">
                <span className="text-sm font-black tracking-tight text-white">TN</span>
              </div>
            </div>
            <div className="hidden xl:block leading-none">
              <div className="text-[17px] font-extrabold tracking-tight text-gray-900 dark:text-white">
                Trust<span className="text-blue-600 dark:text-cyan-400">Node</span>
              </div>
              <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-slate-400">
                Marketplace
              </div>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden shrink-0 items-center gap-1 lg:flex">
            <Link to="/marketplace" className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              Marketplace
            </Link>
            <Link to="/marketplace" className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
              Trusted Shops
            </Link>
            {user && (
              <Link to="/dashboard" className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Global Search Bar */}
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
              <button type="submit" className="mr-1 flex h-9 px-3.5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95">
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons & Controls */}
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

            {/* Chat/Messages Icon */}
            {user && (
              <Link to="/chat" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" title="Messages">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-[5px] text-[9px] font-extrabold text-white shadow-sm border-[1.5px] border-white dark:border-[#070b1c]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Shopping Cart Icon (Customer Only) */}
            {user?.role === 'customer' && (
              <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white" title="Shopping Cart">
                <svg className="h-[19px] w-[19px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6" />
                  <circle cx="10" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-extrabold text-white dark:bg-cyan-400 dark:text-gray-900">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons or Clean Account Dropdown */}
            {!user ? (
              <div className="flex items-center gap-1.5 ml-1">
                <Link to="/login" className="hidden px-3 py-2 text-[13px] font-semibold text-gray-700 transition hover:text-blue-600 dark:text-slate-300 dark:hover:text-white sm:block">Login</Link>
                <Link to="/signup" className="hidden h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-4 text-[13px] font-bold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5 active:scale-95 sm:flex">Sign Up</Link>
              </div>
            ) : (
              /* User Account Dropdown Menu */
              <div className="relative ml-1" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 h-10 px-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition"
                >
                  <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                    {user.role}
                  </span>
                  <span className="text-xs font-bold text-gray-800 dark:text-white max-w-[100px] truncate">{user.name}</span>
                  <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Content */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-xl p-1.5 z-50 flex flex-col gap-1">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-white/5 mb-1">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>

                    <Link 
                      to="/wallet" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition"
                    >
                      💳 Escrow Wallet
                    </Link>

                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition"
                    >
                      ⚙️ Profile Settings
                    </Link>

                    {user?.role === 'shopkeeper' && hasShop && (
                      <Link 
                        to="/shop/edit" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition"
                      >
                        🏪 Shop Settings
                      </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-white/5 my-1" />

                    <button 
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition text-left"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-700 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 lg:hidden">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? "M6 6l12 12M18 6 6 18" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}