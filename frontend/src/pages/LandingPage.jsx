import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import ProductCard from '../components/common/ProductCard';
import ShopCard from '../components/market/ShopCard';
import TrustedShopsAndStats from '../components/TrustedShopsAndStats';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchShops();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/listings');
      const data = await response.json();
      setProducts(data.data || data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/shops');
      const data = await response.json();
      setShops(data.data || data);
    } catch (err) {
      console.error('Failed to fetch shops:', err);
    }
  };

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTdlNmU3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzZXNlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOWM5NmFjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeD0iMCIgZHk9Ii4zZW0iPllpbGQgdW5hdmFpbGFibGU8L3RleHQ+PC9zdmc+';

  const getListingImageUrl = (product) => {
    if (!product || !product.id) return fallbackImage;
    return `http://127.0.0.1:8000/api/listings/${product.id}/image`;
  };

  const featuredCategories = [
    { name: 'Electronics', icon: '📱', count: '1,234', color: 'from-purple-500 to-indigo-600' },
    { name: 'Fashion', icon: '👕', count: '856', color: 'from-pink-500 to-rose-500' },
    { name: 'Home & Garden', icon: '🏠', count: '678', color: 'from-emerald-500 to-teal-600' },
    { name: 'Sports', icon: '⚽', count: '432', color: 'from-orange-500 to-amber-500' },
    { name: 'Books', icon: '📚', count: '345', color: 'from-purple-500 to-pink-500' },
    { name: 'Toys', icon: '🧸', count: '234', color: 'from-red-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b1c] text-white">
      <Header />

      {/* =========================
    HERO SECTION
========================= */}
      <section className="relative isolate overflow-hidden bg-[#070b1c]">

        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
        linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)
      `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow Effects */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="pointer-events-none absolute right-[-150px] top-[-100px] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />


        {/* Hero Container */}
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">


            {/* =========================
          LEFT CONTENT
      ========================= */}
            <div className="max-w-2xl">

              {/* Status Badge */}
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 backdrop-blur-xl">

                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </span>

                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                  Trusted Technology Marketplace
                </span>

              </div>


              {/* Heading */}
              <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl md:text-6xl lg:text-7xl">

                Find Technology

                <br />

                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  You Can Trust.
                </span>

              </h1>


              {/* Description */}
              <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">

                Discover laptops, computers, accessories and more from
                trusted sellers. Buy securely with verified shops,
                protected transactions and transparent marketplace
                technology.

              </p>


              {/* =========================
            SEARCH BOX
        ========================= */}
              <div className="mt-8 max-w-xl">

                <div className="group flex items-center rounded-2xl border border-white/10 bg-white/[0.06] p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 focus-within:border-cyan-400/40 focus-within:bg-white/[0.08]">

                  {/* Search Icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-slate-400">

                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                      />
                    </svg>

                  </div>


                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search laptops, accessories, electronics..."
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-500 sm:text-base"
                  />


                  {/* Search Button */}
                  <Link
                    to="/marketplace"
                    className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-400 hover:to-cyan-400 hover:shadow-cyan-500/30 sm:px-5"
                  >

                    <span className="hidden sm:inline">
                      Search
                    </span>

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14m-6-6 6 6-6 6"
                      />
                    </svg>

                  </Link>

                </div>

              </div>


              {/* =========================
            CTA BUTTONS
        ========================= */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/marketplace"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-400 hover:to-cyan-400 hover:shadow-cyan-500/30"
                >

                  Browse Products

                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14m-6-6 6 6-6 6"
                    />
                  </svg>

                </Link>


                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/[0.08]"
                >

                  Start Selling

                </Link>

              </div>


              {/* =========================
            TRUST INDICATORS
        ========================= */}
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">

                <div className="flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10">
                    <svg
                      className="h-3.5 w-3.5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  </span>

                  Verified sellers

                </div>


                <div className="flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10">
                    <svg
                      className="h-3.5 w-3.5 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-8V9a4 4 0 0 0-8 0v2h8Z"
                      />
                    </svg>
                  </span>

                  Secure transactions

                </div>


                <div className="flex items-center gap-2">

                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-400/10">
                    <svg
                      className="h-3.5 w-3.5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"
                      />
                    </svg>
                  </span>

                  Escrow protected

                </div>

              </div>

            </div>


            {/* =========================
          RIGHT PRODUCT SHOWCASE
      ========================= */}
            <div className="relative hidden lg:block">

              {/* Outer Glow */}
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-500/10 via-cyan-400/10 to-blue-500/10 blur-2xl" />


              {/* Main Glass Card */}
              <div className="relative rounded-[2rem] border border-white/10 bg-[#0d1326]/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">


                {/* Header */}
                <div className="mb-5 flex items-center justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />

                      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                        Live Marketplace
                      </span>

                    </div>

                    <h2 className="mt-1 text-lg font-semibold text-white">
                      Featured Technology
                    </h2>

                  </div>


                  <Link
                    to="/marketplace"
                    className="text-xs font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    View all →
                  </Link>

                </div>


                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-3">

                  {(
                    products.slice(0, 6).length > 0
                      ? products.slice(0, 6)
                      : Array.from(
                        { length: 6 },
                        (_, i) => ({
                          id: i + 1,
                          title: `Featured item ${i + 1}`,
                        })
                      )
                  ).map((product, index) => (

                    <div
                      key={product.id ?? index}
                      className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.035] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[0.06]"
                    >

                      {/* Product Image */}
                      <div className="relative aspect-[1.15/1] overflow-hidden bg-[#11192e]">

                        <img
                          src={getListingImageUrl(product)}
                          alt={product.title || `Featured item ${index + 1}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage;
                          }}
                        />


                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


                        {/* Shop */}
                        <div className="absolute left-2.5 top-2.5">

                          <span className="rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                            {product.shop?.shop_name || 'Store'}
                          </span>

                        </div>


                        {/* Stock */}
                        <div className="absolute right-2.5 top-2.5">

                          <span
                            className={`rounded-lg border px-2 py-1 text-[9px] font-semibold backdrop-blur-md ${product.stock > 0
                              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                              : 'border-red-400/20 bg-red-400/10 text-red-300'
                              }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} available`
                              : 'Sold out'}
                          </span>

                        </div>

                      </div>


                      {/* Product Info */}
                      <div className="p-3">

                        <h3 className="line-clamp-1 text-sm font-semibold text-white">
                          {product.title || `Featured item ${index + 1}`}
                        </h3>


                        <div className="mt-2 flex items-center justify-between">

                          <span className="text-xs text-slate-500">
                            Verified listing
                          </span>

                          <span className="flex items-center gap-1 text-[10px] text-cyan-400">

                            <svg
                              className="h-3 w-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.939 5.955 6.561.955-4.755 4.635 1.123 6.545z"
                              />
                            </svg>

                            Trusted

                          </span>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>


                {/* Bottom Status */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3">

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                    <span className="text-xs text-slate-400">
                      Marketplace active
                    </span>

                  </div>

                  <span className="text-xs font-medium text-slate-300">
                    Secure & verified
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070b1c] to-transparent" />

      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden bg-[#070b1c] py-24 sm:py-28">

        {/* Technical grid background */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
        linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)
      `,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Background glow */}
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="mx-auto mb-16 max-w-3xl text-center">

            {/* Small label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-2 backdrop-blur-xl">

              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Built for Trust
              </span>

            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">

              Everything You Need

              <br />

              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                To Trade With Confidence
              </span>

            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              TrustRoute combines secure transactions, verified sellers, and
              decentralized technology to create a safer marketplace experience.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                title: 'Secure Escrow',
                desc: 'Funds remain protected until the buyer confirms successful delivery.',
                label: 'SECURITY',
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.5 12l1.7 1.7 3.5-3.5"
                    />
                  </svg>
                ),
              },

              {
                title: 'Verified Shops',
                desc: 'Shop with confidence through verified and trusted marketplace sellers.',
                label: 'VERIFIED',
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l2.2 2.1 3-.1.8 2.9 2.4 1.8-1.5 2.6.5 3-2.9.8-1.8 2.4-2.7-1.4-2.8 1.4-1.8-2.4-2.9-.8.5-3-1.5-2.6 2.4-1.8.8-2.9 3 .1L12 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.5 12l1.7 1.7 3.5-3.5"
                    />
                  </svg>
                ),
              },

              {
                title: 'Direct P2P',
                desc: 'Connect buyers and sellers directly without unnecessary intermediaries.',
                label: 'PEER TO PEER',
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h8"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 8h3v8H5a3 3 0 010-8z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 8h3a3 3 0 010 8h-3V8z"
                    />
                  </svg>
                ),
              },

              {
                title: 'Dispute Resolution',
                desc: 'A transparent resolution process helps protect both buyers and sellers.',
                label: 'PROTECTION',
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 7h14"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 7l-3 6h6L7 7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 7l-3 6h6l-3-6z"
                    />
                  </svg>
                ),
              },

              {
                title: 'Global Access',
                desc: 'Discover technology products and sellers from anywhere in the marketplace.',
                label: 'CONNECTED',
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <circle cx="12" cy="12" r="8.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.8 12h16.4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3.5c2.2 2.3 3.4 5.1 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.1-3.4-8.5S9.8 5.8 12 3.5z"
                    />
                  </svg>
                ),
              },

              {
                title: 'Fast Shipping',
                desc: 'Track your orders and receive your technology products with confidence.',
                label: 'DELIVERY',
                icon: (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h11v10H3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 10h4l3 3v3h-7z"
                    />
                    <circle cx="7" cy="18" r="1.5" />
                    <circle cx="18" cy="18" r="1.5" />
                  </svg>
                ),
              },
            ].map((feature, i) => (

              <div
                key={i}
                className="
            group relative overflow-hidden rounded-2xl
            border border-white/[0.08]
            bg-white/[0.035]
            p-7
            backdrop-blur-xl
            transition-all duration-500
            hover:-translate-y-1
            hover:border-cyan-400/30
            hover:bg-white/[0.055]
            hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          "
              >

                {/* Card glow */}
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-400/0 blur-3xl transition-all duration-500 group-hover:bg-cyan-400/10" />

                {/* Top technical line */}
                <div className="absolute left-0 top-0 h-px w-0 bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-500 group-hover:w-full" />

                {/* Icon */}
                <div className="relative mb-7 flex items-center justify-between">

                  <div className="
              flex h-12 w-12 items-center justify-center
              rounded-xl
              border border-cyan-400/20
              bg-cyan-400/[0.08]
              text-cyan-300
              transition-all duration-300
              group-hover:border-cyan-400/40
              group-hover:bg-cyan-400/[0.14]
              group-hover:text-cyan-200
              group-hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]
            ">
                    {feature.icon}
                  </div>

                  <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-slate-600 transition group-hover:text-cyan-500/70">
                    0{i + 1}
                  </span>

                </div>


                {/* Feature label */}
                <div className="mb-3">

                  <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-cyan-400/70">
                    {feature.label}
                  </span>

                </div>


                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-white">
                  {feature.title}
                </h3>


                {/* Description */}
                <p className="text-sm leading-6 text-slate-400">
                  {feature.desc}
                </p>


                {/* Bottom arrow */}
                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-600 transition-all duration-300 group-hover:gap-3 group-hover:text-cyan-400">

                  <span>LEARN MORE</span>

                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M13 6l6 6-6 6"
                    />
                  </svg>

                </div>

              </div>

            ))}

          </div>


          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/[0.06] pt-8">

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Verified sellers
            </div>

            <div className="hidden h-4 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Secure transactions
            </div>

            <div className="hidden h-4 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Decentralized marketplace
            </div>

          </div>

        </div>
      </section>

      {/* Categories Section */}
<section className="relative overflow-hidden bg-[#070b1c] py-24 sm:py-28">

  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

      <div>

        <div className="mb-4 flex items-center gap-2">
          <span className="h-px w-8 bg-cyan-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Explore Marketplace
          </span>
        </div>

        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Shop by{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Category
          </span>
        </h2>

        <p className="mt-3 text-slate-400">
          Find the technology you need.
        </p>

      </div>

      <Link
        to="/marketplace"
        className="
          group inline-flex items-center gap-2
          text-sm font-semibold text-cyan-300
          transition hover:text-white
        "
      >
        View all categories

        <svg
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>

      </Link>

    </div>

    {/* Categories */}
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

      {featuredCategories.map((cat, i) => (

        <Link
          key={i}
          to={`/marketplace?category=${cat.name}`}
          className="
            group relative overflow-hidden
            rounded-2xl
            border border-white/[0.07]
            bg-[#0d1429]
            p-6
            transition-all duration-300
            hover:-translate-y-1
            hover:border-cyan-400/30
            hover:bg-[#111a35]
            hover:shadow-xl hover:shadow-blue-950/30
          "
        >

          {/* Number */}
          <div className="
            absolute right-4 top-4
            text-[10px] font-mono
            text-slate-600
            group-hover:text-cyan-400/50
          ">
            0{i + 1}
          </div>

          {/* Icon */}
          <div className="
            mb-6 flex h-14 w-14
            items-center justify-center
            rounded-xl
            border border-white/[0.08]
            bg-white/[0.03]
            text-3xl
            transition
            group-hover:border-cyan-400/30
            group-hover:bg-cyan-400/10
            group-hover:scale-105
          ">
            {cat.icon}
          </div>

          <h3 className="font-semibold text-white">
            {cat.name}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {cat.count} products
          </p>

          <div className="
            mt-5 h-px w-0
            bg-gradient-to-r from-blue-500 to-cyan-400
            transition-all duration-500
            group-hover:w-full
          " />

        </Link>

      ))}

    </div>

  </div>
</section>

      {/* Trusted Shops */}
<section className="relative overflow-hidden bg-[#080d20] py-24 sm:py-28">

  {/* Background grid */}
  <div
    className="absolute inset-0 opacity-[0.02]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    }}
  />

  {/* Background glow */}
  <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
  <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/10 blur-[130px]" />

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section Header */}
    <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

      <div>

        {/* Small label */}
        <div className="mb-4 flex items-center gap-2">

          <span className="h-px w-8 bg-cyan-400" />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Trusted Network
          </span>

        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

          Trusted{' '}

          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            Shops
          </span>

        </h2>

        {/* Description */}
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
          Discover verified sellers and trusted technology stores on the
          TrustRoute marketplace.
        </p>

      </div>

      {/* View all */}
      <Link
        to="/marketplace"
        className="
          group inline-flex items-center gap-2
          text-sm font-semibold
          text-cyan-300
          transition-colors
          hover:text-white
        "
      >
        View All Shops

        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>

      </Link>

    </div>

    {/* Loading */}
    {loading ? (

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {[1, 2, 3].map((i) => (

          <div
            key={i}
            className="
              h-80
              animate-pulse
              rounded-2xl
              border border-white/[0.06]
              bg-white/[0.03]
            "
          />

        ))}

      </div>

    ) : shops.length > 0 ? (

      /* Shop Cards */
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {shops.slice(0, 3).map((shop) => (

          <ShopCard
            key={shop.id}
            shop={shop}
          />

        ))}

      </div>

    ) : (

      /* Empty State */
      <div
        className="
          rounded-2xl
          border border-white/[0.07]
          bg-white/[0.025]
          px-6 py-20
          text-center
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto mb-6
            flex h-16 w-16
            items-center justify-center
            rounded-2xl
            border border-cyan-400/20
            bg-cyan-400/5
          "
        >

          <svg
            className="h-7 w-7 text-cyan-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
            />
          </svg>

        </div>

        <h3 className="text-xl font-semibold text-white">
          No shops yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Be the first seller to open a trusted shop on TrustRoute.
        </p>

        <Link
          to="/signup"
          className="
            mt-6 inline-flex items-center
            rounded-xl
            border border-cyan-400/20
            bg-cyan-400/10
            px-5 py-2.5
            text-sm font-semibold
            text-cyan-300
            transition
            hover:border-cyan-400/40
            hover:bg-cyan-400/15
          "
        >
          Start Selling
        </Link>

      </div>

    )}

  </div>

</section>
{/* Stats Section */}
<section className="relative overflow-hidden bg-[#050816] py-24 text-white sm:py-28">

  {/* Background Grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.025]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(148,163,184,.8) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148,163,184,.8) 1px, transparent 1px)
      `,
      backgroundSize: '64px 64px',
    }}
  />

  {/* Ambient Glows */}
  <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[140px]" />
  <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />

  {/* Main Container */}
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* Section Header */}
    <div className="mb-16 flex flex-col items-center text-center">

      {/* Status Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2 shadow-lg shadow-black/20 backdrop-blur-xl">

        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
          <span className="relative h-2 w-2 rounded-full bg-cyan-400" />
        </span>

        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
          Live Platform Data
        </span>

      </div>

      {/* Heading */}
      <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        The Numbers Behind{' '}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
          TrustRoute
        </span>
      </h2>

      {/* Description */}
      <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
        A growing technology marketplace connecting trusted sellers
        with buyers through secure and transparent transactions.
      </p>

    </div>

    {/* Statistics Panel */}
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-900/50 shadow-2xl shadow-black/30 backdrop-blur-xl">

      {/* Top Accent */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4">

        {[
          {
            number: '500+',
            label: 'Verified Shops',
            description: 'Trusted technology sellers',
            type: 'shops',
          },
          {
            number: '10K+',
            label: 'Technology Products',
            description: 'Laptops & accessories',
            type: 'products',
          },
          {
            number: '99.9%',
            label: 'Secure Transactions',
            description: 'Protected by escrow',
            type: 'security',
          },
          {
            number: '24/7',
            label: 'Customer Support',
            description: 'Always available',
            type: 'support',
          },
        ].map((stat, index) => (

          <div
            key={index}
            className={`
              group relative p-6 sm:p-8 lg:p-10
              transition-all duration-500
              hover:bg-white/[0.025]

              ${index < 2 ? 'border-b border-slate-800/70 lg:border-b-0' : ''}
              ${index % 2 === 0 ? 'border-r border-slate-800/70 lg:border-r' : ''}
              ${index === 1 ? 'lg:border-r' : ''}
              ${index === 2 ? 'lg:border-r' : ''}
            `}
          >

            {/* Hover Glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-indigo-500/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Icon */}
            <div className="relative mb-7">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/70 text-cyan-400 shadow-lg shadow-black/20 transition-all duration-500 group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10 group-hover:shadow-cyan-500/10">

                {/* Shop Icon */}
                {stat.type === 'shops' && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M5 10v10h14V10M4 10l1.5-6h13L20 10M9 20v-5h6v5"
                    />
                  </svg>
                )}

                {/* Products Icon */}
                {stat.type === 'products' && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="13"
                      rx="2"
                    />
                    <path
                      strokeLinecap="round"
                      d="M8 21h8M12 17v4"
                    />
                  </svg>
                )}

                {/* Security Icon */}
                {stat.type === 'security' && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4"
                    />
                  </svg>
                )}

                {/* Support Icon */}
                {stat.type === 'support' && (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.7}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 13a8 8 0 0116 0v4a2 2 0 01-2 2h-2v-6h4M4 13v4a2 2 0 002 2h2v-6H4"
                    />
                    <path
                      strokeLinecap="round"
                      d="M9 19h2"
                    />
                  </svg>
                )}

              </div>

              {/* Connection Dot */}
              <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            </div>

            {/* Number */}
            <div className="relative">

              <div className="bg-gradient-to-r from-white via-cyan-100 to-blue-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                {stat.number}
              </div>

              {/* Label */}
              <h3 className="mt-3 text-sm font-semibold text-white sm:text-base">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="mt-2 max-w-[190px] text-xs leading-relaxed text-slate-500 sm:text-sm">
                {stat.description}
              </p>

            </div>

            {/* Bottom Status */}
            <div className="mt-7 flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
                Active
              </span>

            </div>

            {/* Hover Line */}
            <div className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-500 group-hover:w-2/3" />

          </div>
        ))}

      </div>

      {/* Bottom Platform Status */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800/70 bg-slate-950/30 px-6 py-5 sm:flex-row sm:px-8">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10">
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-300">
              Platform Status
            </p>

            <p className="text-[11px] text-slate-600">
              All systems operational
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

          <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">
            Operational
          </span>

        </div>

      </div>

    </div>

  </div>
</section>
      {/* Featured Products */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Products</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Popular products from verified shops</p>
            </div>
            <Link to="/marketplace" className="hidden sm:flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition">
              View All Products
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-3xl h-96 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No products available yet</h3>
              <p className="text-gray-600 dark:text-gray-400">Check back later for new listings!</p>
            </div>
          )}
        </div>
      </div>
      

      <TrustedShopsAndStats loading={loading} shops={shops} ShopCard={ShopCard} />
    </div>
  );
}