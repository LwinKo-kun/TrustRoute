import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  Laptop,
  Headphones,
  Keyboard,
  Mouse,
  Tag,
  HelpCircle,
  LayoutDashboard,
  Store,
  Package,
  LogOut,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /*
   * ----------------------------------------------------
   * CART COUNT
   * ----------------------------------------------------
   */

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      const totalItems = cart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
      );

      setCartCount(totalItems);
    } catch (error) {
      console.error('Failed to read cart:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /*
   * ----------------------------------------------------
   * CLOSE MENUS WHEN ROUTE CHANGES
   * ----------------------------------------------------
   */

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  /*
   * ----------------------------------------------------
   * SEARCH
   * ----------------------------------------------------
   */

  const handleSearch = (e) => {
    if (e) {
      e.preventDefault();
    }

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(
      `/marketplace?search=${encodeURIComponent(query)}`
    );

    setSearchQuery('');
  };

  /*
   * ----------------------------------------------------
   * LOGOUT
   * ----------------------------------------------------
   */

  const handleLogout = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /*
   * ----------------------------------------------------
   * LOGO
   * ----------------------------------------------------
   */

  const handleLogoClick = () => {
    navigate(user ? '/dashboard' : '/');
  };

  /*
   * ----------------------------------------------------
   * ROLE
   * ----------------------------------------------------
   */

  const role = user?.role || 'customer';

  const roleConfig = {
    customer: {
      label: 'CUSTOMER',
      icon: User,
      className:
        'bg-white/15 text-white border-white/20',
    },

    shopkeeper: {
      label: 'SHOPKEEPER',
      icon: Store,
      className:
        'bg-amber-400/20 text-amber-100 border-amber-300/30',
    },

    delivery: {
      label: 'DELIVERY',
      icon: Truck,
      className:
        'bg-cyan-400/20 text-cyan-100 border-cyan-300/30',
    },

    admin: {
      label: 'ADMIN',
      icon: ShieldCheck,
      className:
        'bg-red-400/20 text-red-100 border-red-300/30',
    },
  };

  const currentRole =
    roleConfig[role] || roleConfig.customer;

  const RoleIcon = currentRole.icon;

  /*
   * ----------------------------------------------------
   * NAVIGATION
   * ----------------------------------------------------
   */

  const navigation = [
    {
      name: 'Home',
      path: user ? '/dashboard' : '/',
    },
    {
      name: 'Laptops',
      path: '/marketplace?category=laptops',
      icon: Laptop,
    },
    {
      name: 'Accessories',
      path: '/marketplace?category=accessories',
      icon: Keyboard,
    },
    {
      name: 'Deals',
      path: '/marketplace?sort=deals',
      icon: Tag,
    },
    {
      name: 'Brands',
      path: '/brands',
    },
  ];

  /*
   * ----------------------------------------------------
   * RENDER
   * ----------------------------------------------------
   */

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* ==================================================
          TOP TRUST BAR
      ================================================== */}

      <div className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-9 flex items-center justify-between text-xs">
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Sellers</span>
              </div>

              <div className="hidden md:flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reliable Delivery</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Trusted Marketplace</span>
              </div>
            </div>

            <Link
              to="/help"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need Help?</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ==================================================
          MAIN HEADER
      ================================================== */}

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center gap-6">

            {/* ---------------- LOGO ---------------- */}

            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 shrink-0 group"
              aria-label="Trust Node Home"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg transition-all">
                <span className="text-white font-extrabold text-lg tracking-tight">
                  TN
                </span>
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-xl font-extrabold tracking-tight text-slate-900">
                  Trust<span className="text-blue-600"> Node</span>
                </div>

                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold">
                  Trusted Tech Marketplace
                </div>
              </div>
            </button>

            {/* ---------------- SEARCH ---------------- */}

            <form
              onSubmit={handleSearch}
              className="hidden md:block flex-1 max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search laptops, accessories, brands..."
                  className="
                    w-full
                    h-11
                    pl-12
                    pr-24
                    rounded-xl
                    bg-slate-100
                    border
                    border-slate-200
                    text-sm
                    text-slate-900
                    placeholder:text-slate-400
                    outline-none
                    focus:bg-white
                    focus:border-blue-500
                    focus:ring-4
                    focus:ring-blue-500/10
                    transition-all
                  "
                />

                <button
                  type="submit"
                  className="
                    absolute
                    right-1.5
                    top-1.5
                    h-8
                    px-4
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-xs
                    font-semibold
                    transition-colors
                  "
                >
                  Search
                </button>
              </div>
            </form>

            {/* ---------------- RIGHT ACTIONS ---------------- */}

            <div className="ml-auto flex items-center gap-2 sm:gap-3">

              {/* Help */}

              <Link
                to="/help"
                className="
                  hidden lg:flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  text-slate-600
                  hover:text-blue-600
                  hover:bg-slate-50
                  transition-colors
                "
              >
                <HelpCircle className="w-5 h-5" />

                <span className="text-sm font-medium">
                  Help
                </span>
              </Link>

              {/* Cart */}

              <Link
                to="/cart"
                className="
                  relative
                  p-2.5
                  rounded-xl
                  text-slate-600
                  hover:text-blue-600
                  hover:bg-blue-50
                  transition-all
                "
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-5.5 h-5.5" />

                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      min-w-5
                      h-5
                      px-1
                      rounded-full
                      bg-blue-600
                      text-white
                      text-[10px]
                      font-bold
                      flex
                      items-center
                      justify-center
                      border-2
                      border-white
                    "
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}

              {user ? (
                <div className="relative">

                  <button
                    onClick={() =>
                      setProfileMenuOpen(
                        !profileMenuOpen
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      p-1.5
                      rounded-xl
                      hover:bg-slate-50
                      transition-colors
                    "
                    aria-expanded={profileMenuOpen}
                  >
                    <div
                      className="
                        w-9
                        h-9
                        rounded-full
                        bg-gradient-to-br
                        from-blue-600
                        to-cyan-500
                        flex
                        items-center
                        justify-center
                        text-white
                        font-bold
                        text-sm
                      "
                    >
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || 'U'}
                    </div>

                    <div className="hidden xl:block text-left">
                      <p className="text-xs text-slate-400">
                        Welcome
                      </p>

                      <p className="text-sm font-semibold text-slate-800 max-w-28 truncate">
                        {user.name}
                      </p>
                    </div>

                    <ChevronDown
                      className={`
                        hidden sm:block
                        w-4 h-4
                        text-slate-400
                        transition-transform
                        ${
                          profileMenuOpen
                            ? 'rotate-180'
                            : ''
                        }
                      `}
                    />
                  </button>

                  {/* Profile Dropdown */}

                  {profileMenuOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-full
                        mt-2
                        w-64
                        bg-white
                        border
                        border-slate-200
                        rounded-2xl
                        shadow-xl
                        shadow-slate-900/10
                        overflow-hidden
                      "
                    >

                      {/* User Info */}

                      <div className="p-4 bg-slate-50 border-b border-slate-200">
                        <div className="flex items-center gap-3">

                          <div
                            className="
                              w-10
                              h-10
                              rounded-full
                              bg-gradient-to-br
                              from-blue-600
                              to-cyan-500
                              flex
                              items-center
                              justify-center
                              text-white
                              font-bold
                            "
                          >
                            {user.name
                              ?.charAt(0)
                              ?.toUpperCase() || 'U'}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {user.name}
                            </p>

                            <div
                              className={`
                                inline-flex
                                items-center
                                gap-1
                                mt-1
                                px-2
                                py-0.5
                                rounded-full
                                text-[9px]
                                font-bold
                                tracking-wide
                                border
                                ${currentRole.className}
                              `}
                            >
                              <RoleIcon className="w-3 h-3" />
                              {currentRole.label}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}

                      <div className="p-2">

                        <Link
                          to="/dashboard"
                          className="
                            flex
                            items-center
                            gap-3
                            px-3
                            py-2.5
                            rounded-lg
                            text-sm
                            text-slate-700
                            hover:bg-blue-50
                            hover:text-blue-600
                            transition-colors
                          "
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>

                        {role === 'shopkeeper' && (
                          <>
                            <Link
                              to="/my-shop"
                              className="
                                flex
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                rounded-lg
                                text-sm
                                text-slate-700
                                hover:bg-blue-50
                                hover:text-blue-600
                                transition-colors
                              "
                            >
                              <Store className="w-4 h-4" />
                              My Shop
                            </Link>

                            <Link
                              to="/my-products"
                              className="
                                flex
                                items-center
                                gap-3
                                px-3
                                py-2.5
                                rounded-lg
                                text-sm
                                text-slate-700
                                hover:bg-blue-50
                                hover:text-blue-600
                                transition-colors
                              "
                            >
                              <Package className="w-4 h-4" />
                              My Products
                            </Link>
                          </>
                        )}

                        {role === 'customer' && (
                          <Link
                            to="/orders"
                            className="
                              flex
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              rounded-lg
                              text-sm
                              text-slate-700
                              hover:bg-blue-50
                              hover:text-blue-600
                              transition-colors
                            "
                          >
                            <Package className="w-4 h-4" />
                            My Orders
                          </Link>
                        )}

                        <div className="my-2 border-t border-slate-100" />

                        <button
                          onClick={handleLogout}
                          className="
                            flex
                            items-center
                            gap-3
                            w-full
                            px-3
                            py-2.5
                            rounded-lg
                            text-sm
                            text-red-600
                            hover:bg-red-50
                            transition-colors
                          "
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">

                  <Link
                    to="/login"
                    className="
                      px-4
                      py-2.5
                      rounded-lg
                      text-sm
                      font-semibold
                      text-slate-700
                      hover:text-blue-600
                      transition-colors
                    "
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="
                      px-4
                      py-2.5
                      rounded-lg
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                      shadow-blue-600/20
                      transition-all
                    "
                  >
                    Create Account
                  </Link>
                </div>
              )}

              {/* Mobile Button */}

              <button
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className="
                  md:hidden
                  p-2.5
                  rounded-xl
                  text-slate-600
                  hover:bg-slate-100
                  transition-colors
                "
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* ==================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav className="hidden md:flex items-center gap-1 h-12 border-t border-slate-100">

            {navigation.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname ===
                item.path.split('?')[0];

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    relative
                    flex
                    items-center
                    gap-2
                    px-4
                    h-full
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-600 hover:text-blue-600'
                    }
                  `}
                >
                  {Icon && (
                    <Icon className="w-4 h-4" />
                  )}

                  {item.name}

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-3
                        right-3
                        h-0.5
                        bg-blue-600
                        rounded-full
                      "
                    />
                  )}
                </Link>
              );
            })}

            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure & Trusted Shopping
            </div>
          </nav>

          {/* ==================================================
              MOBILE SEARCH
          ================================================== */}

          <form
            onSubmit={handleSearch}
            className="md:hidden pb-3"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search laptops & accessories..."
                className="
                  w-full
                  h-11
                  pl-12
                  pr-12
                  rounded-xl
                  bg-slate-100
                  border
                  border-slate-200
                  text-sm
                  outline-none
                  focus:bg-white
                  focus:border-blue-500
                  focus:ring-4
                  focus:ring-blue-500/10
                  transition-all
                "
              />

              <button
                type="submit"
                className="
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  p-2
                  rounded-lg
                  bg-blue-600
                  text-white
                "
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* ==================================================
              MOBILE MENU
          ================================================== */}

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4">

              <nav className="space-y-1">

                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        text-slate-700
                        hover:bg-blue-50
                        hover:text-blue-600
                        transition-colors
                      "
                    >
                      {Icon && (
                        <Icon className="w-5 h-5" />
                      )}

                      {item.name}
                    </Link>
                  );
                })}

                <Link
                  to="/categories"
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  <Laptop className="w-5 h-5" />
                  All Categories
                </Link>

                <Link
                  to="/help"
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-blue-50
                    hover:text-blue-600
                  "
                >
                  <HelpCircle className="w-5 h-5" />
                  Help & Support
                </Link>

                {!user && (
                  <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-slate-100">

                    <Link
                      to="/login"
                      className="
                        flex
                        items-center
                        justify-center
                        py-2.5
                        rounded-lg
                        border
                        border-slate-200
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      className="
                        flex
                        items-center
                        justify-center
                        py-2.5
                        rounded-lg
                        bg-blue-600
                        text-white
                        text-sm
                        font-semibold
                      "
                    >
                      Sign Up
                    </Link>

                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}