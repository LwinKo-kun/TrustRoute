import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    window.location.href =
      `/marketplace?search=${encodeURIComponent(search.trim())}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070b1c]/95 backdrop-blur-xl">

      {/* subtle top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent" />

      <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-5 lg:px-7">

        {/* =========================================================
            MAIN HEADER
        ========================================================= */}
        <div className="flex h-[72px] min-w-0 items-center gap-2 lg:gap-3">

          {/* =======================================================
              LOGO
          ======================================================= */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="relative">

              {/* glow */}
              <div className="absolute inset-0 rounded-xl bg-blue-500/40 blur-lg opacity-60 transition group-hover:opacity-100" />

              {/* logo */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 shadow-lg shadow-blue-600/20">
                <span className="text-sm font-black tracking-tight text-white">
                  TN
                </span>
              </div>

            </div>

            <div className="hidden xl:block leading-none">
              <div className="text-[17px] font-extrabold tracking-tight text-white">
                Trust<span className="text-blue-400">Node</span>
              </div>

              <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Technology Marketplace
              </div>
            </div>
          </Link>

          {/* =======================================================
              DESKTOP NAVIGATION
          ======================================================= */}
          <nav className="hidden shrink-0 items-center gap-0.5 lg:flex">

            <Link
              to="/marketplace"
              className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white xl:px-3.5"
            >
              Marketplace

              <span className="absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 rounded-full bg-blue-500 transition group-hover:scale-x-100" />
            </Link>

            <Link
              to="/shops"
              className="group relative rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white xl:px-3.5"
            >
              Shops

              <span className="absolute bottom-0 left-3 right-3 h-[2px] scale-x-0 rounded-full bg-cyan-400 transition group-hover:scale-x-100" />
            </Link>

            <button
              type="button"
              className="group flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white xl:px-3.5"
            >
              Categories

              <svg
                className="h-3.5 w-3.5 text-slate-500 transition group-hover:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>

            <a
              href="#about"
              className="rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white xl:px-3.5"
            >
              About
            </a>

          </nav>

          {/* =======================================================
              MODERN SEARCH
          ======================================================= */}
          <form
            onSubmit={handleSearch}
            className="group relative min-w-0 flex-1"
          >

            {/* glow */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-cyan-400/0 opacity-0 blur-md transition duration-300 group-focus-within:opacity-100" />

            <div className="relative flex h-11 min-w-0 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] transition-all duration-300 group-hover:border-white/20 group-focus-within:border-blue-400/40 group-focus-within:bg-white/[0.07]">

              {/* Search icon */}
              <div className="flex h-full w-10 shrink-0 items-center justify-center">
                <svg
                  className="h-[18px] w-[18px] text-slate-500 transition group-focus-within:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="m21 21-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>

              

              {/* Category */}
              <button
                type="button"
                className="hidden shrink-0 items-center gap-1.5 border-l border-white/10 px-3 text-[11px] font-semibold text-slate-400 transition hover:text-white xl:flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />

                <span>All Categories</span>

                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              {/* Search button */}
              <button
                type="submit"
                aria-label="Search"
                className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20 transition hover:scale-105 hover:shadow-blue-500/40"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m21 21-4.35-4.35m2.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>

            </div>
          </form>

          {/* =======================================================
              ACTIONS
          ======================================================= */}
          <div className="flex shrink-0 items-center gap-1">

            {/* Cart */}
            <button
              type="button"
              aria-label="Shopping cart"
              className="relative hidden h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white sm:flex"
            >
              <svg
                className="h-[19px] w-[19px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 7H6"
                />
                <circle cx="10" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>

              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-bold text-white">
                0
              </span>
            </button>

            

            {/* Notification */}
            <button
              type="button"
              aria-label="Notifications"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white xl:flex"
            >
              <svg
                className="h-[19px] w-[19px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                />
              </svg>

              <span className="absolute" />
            </button>

            

            {/* Login */}
            <Link
              to="/login"
              className="hidden px-2 text-[12px] font-semibold text-slate-300 transition hover:text-white xl:block"
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              to="/signup"
              className="hidden h-10 items-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 text-[12px] font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 md:flex"
            >
              Sign Up
            </Link>

            {/* Mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

          </div>

        </div>

        {/* =========================================================
            MOBILE MENU
        ========================================================= */}
        {mobileOpen && (
          <div className="border-t border-white/10 py-4 lg:hidden">

            <nav className="grid gap-1">

              <Link
                to="/marketplace"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Marketplace
              </Link>

              <Link
                to="/shops"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Shops
              </Link>

              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
              >
                About
              </a>

            </nav>

            <div className="mt-3 grid grid-cols-2 gap-1">

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-slate-300"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 py-2.5 text-sm font-bold text-white"
              >
                Sign Up
              </Link>

            </div>

          </div>
        )}

      </div>
    </header>
  );
}