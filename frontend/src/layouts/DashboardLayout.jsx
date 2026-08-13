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
    <div
      className="
        flex
        min-h-screen
        flex-col
        bg-slate-50
        text-gray-900
        transition-colors
        duration-300

        dark:bg-[#070b1c]
        dark:text-gray-100
      "
    >
      {/* =========================================================
          DASHBOARD HEADER
      ========================================================= */}

      <header
        className="
          flex
          flex-col
          items-start
          justify-between
          gap-4

          border-b
          border-gray-200
          bg-white
          px-4
          py-4

          transition-colors
          duration-300

          md:flex-row
          md:items-center
          md:px-8

          dark:border-white/10
          dark:bg-[#0a1024]
        "
      >
        {/* Logo + Mobile Menu */}
        <div className="flex w-full items-center justify-between md:w-auto">
          <Link
            to="/dashboard"
            className="
              text-lg
              font-bold
              tracking-tight
              text-gray-900
              transition-colors

              dark:text-white
            "
          >
            Trust
            <span className="text-blue-600 dark:text-cyan-400">
              Node
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="
              rounded-lg
              border
              border-gray-200
              bg-gray-50
              p-2
              text-sm
              font-medium
              text-gray-700
              transition

              hover:bg-gray-100

              dark:border-white/10
              dark:bg-white/5
              dark:text-gray-300
              dark:hover:bg-white/10

              md:hidden
            "
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Navigation + User Profile */}
        <div
          className={`
            w-full
            flex-col
            items-start
            gap-4

            ${mobileMenuOpen ? 'flex' : 'hidden'}

            md:flex
            md:w-auto
            md:flex-row
            md:items-center
            md:gap-8
          `}
        >
          {/* Navigation */}
          <nav
            className="
              flex
              w-full
              flex-col
              items-start
              gap-2

              text-sm
              font-medium

              md:w-auto
              md:flex-row
              md:items-center
              md:gap-4
            "
          >
            <Link
              to="/dashboard"
              className="
                rounded-lg
                px-2
                py-1
                text-gray-700
                transition

                hover:bg-gray-100
                hover:text-blue-600

                dark:text-gray-300
                dark:hover:bg-white/5
                dark:hover:text-cyan-400
              "
            >
              Dashboard
            </Link>

            {role === 'admin' && (
              <span
                className="
                  rounded
                  bg-red-500/10
                  px-2
                  py-1
                  text-xs
                  font-bold
                  uppercase
                  text-red-500
                "
              >
                Admin Portal
              </span>
            )}

            {role === 'shopkeeper' && (
              <span
                className="
                  rounded
                  bg-amber-500/10
                  px-2
                  py-1
                  text-xs
                  font-bold
                  uppercase
                  text-amber-500
                "
              >
                Shopkeeper Portal
              </span>
            )}

            {role === 'delivery' && (
              <span
                className="
                  rounded
                  bg-purple-500/10
                  px-2
                  py-1
                  text-xs
                  font-bold
                  uppercase
                  text-purple-500
                "
              >
                Delivery Hub
              </span>
            )}
          </nav>

          {/* User Profile */}
          <div
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4

              border-t
              border-gray-200
              pt-3

              md:w-auto
              md:border-t-0
              md:pt-0

              dark:border-white/10
            "
          >
            <div className="text-left md:text-right">
              <p
                className="
                  text-sm
                  font-medium
                  text-gray-900

                  dark:text-white
                "
              >
                {user?.name}
              </p>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-gray-500

                  dark:text-gray-500
                "
              >
                {role || 'user'}
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main
        className="
          flex-grow
          p-4
          text-left
          transition-colors
          duration-300

          md:p-8
        "
      >
        <Outlet />
      </main>
    </div>
  );
}