import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import ShopCard from '../components/market/ShopCard';
import Layout from '../components/layout/Layout';
import api from '../api/axios';

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchShops();

    const generated = [];
    for (let i = 0; i < 95; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 7 + 2,
        opacity: Math.random() * 0.9 + 0.1,
        color: i % 4 === 0 ? '#3b82f6' : i % 4 === 1 ? '#06b6d4' : i % 4 === 2 ? '#60a5fa' : '#818cf8',
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2 - 0.12,
      });
    }

    setParticles(generated);

    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          opacity: Math.random() > 0.25 ? Math.random() * 0.95 + 0.15 : 0.05,
        }))
      );
    }, 220);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/listings');
      const data = res.data;
      setProducts(data.data || data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await api.get('/shops');
      const data = res.data;
      setShops(data.data || data);
    } catch (err) {
      console.error('Failed to fetch shops:', err);
    }
  };

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMmY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTNhM2I4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeD0iMCIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

  const getListingImageUrl = (product) => {
    if (!product || !product.id) return fallbackImage;
    return `/api/listings/${product.id}/image`;
  };

  const featuredCategories = [
    { name: 'Electronics', icon: '📱', count: '1,234' },
    { name: 'Fashion', icon: '👕', count: '856' },
    { name: 'Home & Garden', icon: '🏠', count: '678' },
    { name: 'Sports', icon: '⚽', count: '432' },
    { name: 'Books', icon: '📚', count: '345' },
    { name: 'Toys', icon: '🧸', count: '234' },
  ];

  return (
    <Layout>
      {/* =========================
          HERO SECTION
      ========================= */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
        className="relative isolate overflow-hidden bg-white dark:bg-[#070b1c] border-b border-slate-200/80 dark:border-white/10 w-full shadow-sm transition-colors duration-300"
      >
        <div
          className="absolute inset-0 opacity-[0.2] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #cbd5e1 1px, transparent 1px),
              linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />

        {particles.map((p) => {
          const clientWidth = heroRef.current?.clientWidth || 1200;
          const clientHeight = heroRef.current?.clientHeight || 700;
          const pxX = (p.x / 100) * clientWidth;
          const pxY = (p.y / 100) * clientHeight;

          const distance = Math.hypot(mousePos.x - pxX, mousePos.y - pxY);
          const maxDistance = 180;
          let pushX = 0;
          let pushY = 0;

          if (distance < maxDistance && mousePos.x !== -1000) {
            const angle = Math.atan2(pxY - mousePos.y, pxX - mousePos.x);
            const force = (1 - distance / maxDistance) * 45;
            pushX = Math.cos(angle) * force;
            pushY = Math.sin(angle) * force;
          }

          return (
            <div
              key={p.id}
              className="absolute rounded-full pointer-events-none transition-all duration-200 ease-out"
              style={{
                top: `${p.y}%`,
                left: `${p.x}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}, 0 0 ${p.size * 12}px rgba(59, 130, 246, 0.6)`,
                transform: `translate(${pushX}px, ${pushY}px) scale(${p.opacity > 0.2 ? 1.2 : 0.4})`,
              }}
            />
          );
        })}

        <div className="pointer-events-none absolute -left-20 top-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[160px]" />

        <div className="relative w-full px-6 pb-24 pt-16 sm:px-12 sm:pb-28 sm:pt-24 lg:px-24 lg:pb-36 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 w-full">
            <div className="w-full">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-blue-50/90 dark:border-cyan-400/20 dark:bg-cyan-400/[0.06] px-4 py-2 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 dark:bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-cyan-200">
                  Trusted Technology Marketplace
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Find Technology
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500 bg-clip-text text-transparent">
                  You Can Trust.
                </span>
              </h1>

              <p className="mt-7 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8 max-w-2xl">
                Discover laptops, computers, accessories and more from
                trusted sellers. Buy securely with verified shops,
                protected transactions and transparent marketplace
                technology.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/marketplace"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 dark:bg-gradient-to-r dark:from-blue-500 dark:to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
                >
                  Browse Products
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-8 py-4 text-sm font-bold text-slate-700 dark:text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/[0.08]"
                >
                  Start Selling
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs">✓</span>
                  Verified sellers
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-400 text-xs">🔒</span>
                  Secure transactions
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400 text-xs">🛡️</span>
                  Escrow protected
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block w-full">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-blue-500/15 via-cyan-400/15 to-indigo-500/15 blur-2xl" />

              <div className="relative rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0d1326]/80 p-8 shadow-2xl shadow-slate-300/70 dark:shadow-black/40 backdrop-blur-2xl w-full">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Live Marketplace</span>
                    </div>
                    <h2 className="mt-1.5 text-xl font-extrabold text-slate-900 dark:text-white">Featured Technology</h2>
                  </div>
                  <Link to="/marketplace" className="text-xs font-bold text-blue-600 dark:text-cyan-400 transition hover:underline">
                    View all →
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {(
                    products.slice(0, 6).length > 0
                      ? products.slice(0, 6)
                      : Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Featured item ${i + 1}` }))
                  ).map((product, index) => (
                    <div
                      key={product.id ?? index}
                      className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-white/[0.035] transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 dark:hover:border-cyan-400/20 w-full"
                    >
                      <div className="relative aspect-[1.15/1] overflow-hidden bg-slate-100 dark:bg-[#11192e] w-full">
                        <img
                          src={getListingImageUrl(product)}
                          alt={product.title || `Featured item ${index + 1}`}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        />
                        <div className="absolute left-2.5 top-2.5">
                          <span className="rounded-lg border border-slate-200/60 dark:border-white/10 bg-white/95 dark:bg-black/50 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-white shadow-md">
                            {product.shop?.shop_name || 'Store'}
                          </span>
                        </div>
                        <div className="absolute right-2.5 top-2.5">
                          <span className={`rounded-lg border px-2 py-1 text-[9px] font-extrabold shadow-md ${product.stock > 0 ? 'border-emerald-200 dark:border-emerald-400/20 bg-emerald-50/90 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300' : 'border-rose-200 dark:border-rose-400/20 bg-rose-50/90 dark:bg-rose-400/10 text-rose-700 dark:text-rose-300'}`}>
                            {product.stock > 0 ? `${product.stock} available` : 'Sold out'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 w-full bg-white dark:bg-transparent">
                        <h3 className="line-clamp-1 text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition">
                          {product.title || `Featured item ${index + 1}`}
                        </h3>
                        <div className="mt-2.5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400 font-medium">Verified listing</span>
                          <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded-md">★ Trusted</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.025] px-4 py-3.5 w-full">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-400">Marketplace active & operational</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-100/60 dark:bg-cyan-950/60 px-2.5 py-1 rounded-lg">Escrow Secured</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES SECTION
      ========================= */}
      <section className="relative overflow-hidden bg-slate-50/70 dark:bg-[#070b1c] py-28 sm:py-36 border-b border-slate-200 dark:border-white/10 w-full transition-colors duration-300">
        <div className="w-full px-6 sm:px-12 lg:px-24">
          <div className="mx-auto mb-20 text-center max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-cyan-400/20 bg-blue-50 dark:bg-cyan-400/[0.06] px-4 py-1.5 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-cyan-300">Built for Trust</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl w-full">
              Everything You Need <br />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-500 bg-clip-text text-transparent">
                To Trade With Confidence
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              TrustRoute combines secure transactions, verified sellers, and transparent technology to create a safer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {[
              { title: 'Secure Escrow', desc: 'Funds remain protected until the buyer confirms successful delivery.', label: 'SECURITY', icon: '🔒' },
              { title: 'Verified Shops', desc: 'Shop with confidence through verified and trusted marketplace sellers.', label: 'VERIFIED', icon: '🛡️' },
              { title: 'Direct P2P', desc: 'Connect buyers and sellers directly without unnecessary intermediaries.', label: 'PEER TO PEER', icon: '🤝' },
              { title: 'Dispute Resolution', desc: 'A transparent resolution process helps protect both buyers and sellers.', label: 'PROTECTION', icon: '⚖️' },
              { title: 'Global Access', desc: 'Discover technology products and sellers from anywhere in the marketplace.', label: 'CONNECTED', icon: '🌐' },
              { title: 'Fast Shipping', desc: 'Track your orders and receive your technology products with confidence.', label: 'DELIVERY', icon: '📦' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-white/[0.035] p-9 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-400 dark:hover:border-cyan-400/30 w-full"
              >
                <div className="absolute top-0 left-0 h-1.5 w-0 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500 group-hover:w-full" />
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-cyan-400/[0.08] text-2xl text-blue-600 dark:text-cyan-300 transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <span className="font-mono text-sm font-extrabold text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">0{i + 1}</span>
                </div>
                <span className="font-mono text-[11px] font-bold tracking-widest text-blue-600 dark:text-cyan-400 uppercase">{feature.label}</span>
                <h3 className="mt-2 mb-3 text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          CATEGORIES SECTION
      ========================= */}
      <section className="relative overflow-hidden bg-white dark:bg-[#070b1c] py-28 sm:py-36 border-b border-slate-200 dark:border-white/10 w-full transition-colors duration-300">
        <div className="w-full px-6 sm:px-12 lg:px-24">
          <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between w-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">Explore Marketplace</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl lg:text-5xl mt-1.5">
                Shop by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Category</span>
              </h2>
            </div>
            <Link to="/marketplace" className="group inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-cyan-300 hover:underline transition">
              View all categories <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6 w-full">
            {featuredCategories.map((cat, i) => (
              <Link
                key={i}
                to={`/marketplace?category=${cat.name}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#0d1429] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-400 dark:hover:border-cyan-400/30 text-center w-full"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] text-3xl shadow-sm transition-all duration-300 group-hover:scale-110">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{cat.name}</h3>
                <p className="mt-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">{cat.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================
          TRUSTED SHOPS SECTION
      ========================= */}
      <section className="relative overflow-hidden bg-slate-50/70 dark:bg-[#080d20] py-28 sm:py-36 border-b border-slate-200 dark:border-white/10 w-full transition-colors duration-300">
        <div className="w-full px-6 sm:px-12 lg:px-24">
          <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between w-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-cyan-300">Trusted Network</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl mt-1.5">
                Trusted <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">Shops</span>
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400 text-base">Discover verified sellers and trusted technology stores.</p>
            </div>
            <Link to="/marketplace" className="group inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-cyan-300 transition">
              View All Shops <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-3xl border border-slate-200 dark:border-white/[0.06] bg-slate-200 dark:bg-white/[0.03] w-full" />
              ))}
            </div>
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {shops.slice(0, 3).map((shop) => (
                <div key={shop.id} className="transform transition duration-300 hover:-translate-y-1">
                  <ShopCard shop={shop} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.025] px-8 py-24 text-center shadow-md w-full">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-cyan-400/5 text-blue-600 dark:text-cyan-400 text-2xl font-bold">🏪</div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">No shops yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                Be the first seller to open a trusted shop on TrustRoute.
              </p>
              <Link to="/signup" className="mt-8 inline-flex items-center rounded-xl bg-blue-600 dark:bg-cyan-400/10 px-7 py-3.5 text-sm font-bold text-white dark:text-cyan-300 shadow-lg transition">
                Start Selling Now
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          STATS SECTION
      ========================= */}
      <section className="relative overflow-hidden bg-white dark:bg-[#050816] py-28 sm:py-36 text-slate-900 dark:text-white w-full transition-colors duration-300">
        <div className="w-full px-6 sm:px-12 lg:px-24">
          <div className="mx-auto mb-20 text-center max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-400">Live Platform Data</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 dark:text-white w-full">
              The Numbers Behind <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">TrustRoute</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">A secure technology marketplace connecting trusted buyers and sellers globally.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 w-full">
            {[
              { number: '500+', label: 'Verified Shops', desc: 'Trusted tech sellers' },
              { number: '10K+', label: 'Products', desc: 'Laptops & components' },
              { number: '99.9%', label: 'Secure', desc: 'Protected by escrow' },
              { number: '24/7', label: 'Support', desc: 'Always available' },
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group rounded-3xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50 p-9 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-400 dark:hover:border-cyan-400/40 w-full relative overflow-hidden"
              >
                <div className="text-4xl font-black text-blue-600 dark:text-cyan-400 sm:text-6xl tracking-tight mb-2">{stat.number}</div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">{stat.label}</h3>
                <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}