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
  
  // --- FADE ANIMATION STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  // Auto-Fade exactly one item every 4 seconds
  useEffect(() => {
    if (products.length <= 1 || isSliderHovered) return;
    
    const sliderInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }, 4000); 

    return () => clearInterval(sliderInterval);
  }, [products.length, isSliderHovered]);

  // Manual Controls
  const nextSlide = () => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

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

    const particleInterval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => ({
          ...p,
          opacity: Math.random() > 0.25 ? Math.random() * 0.95 + 0.15 : 0.05,
        }))
      );
    }, 220);

    return () => clearInterval(particleInterval);
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
      const rawData = res.data;
      
      let productList = [];
      if (Array.isArray(rawData)) {
        productList = rawData;
      } else if (Array.isArray(rawData?.data)) {
        productList = rawData.data;
      } else if (rawData?.data?.data && Array.isArray(rawData.data.data)) {
        productList = rawData.data.data;
      }
      
      // Limit to 6 items for the featured fade slider
      setProducts(productList.slice(0, 6));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await api.get('/shops');
      const rawData = res.data;
      
      let shopList = [];
      if (Array.isArray(rawData)) {
        shopList = rawData;
      } else if (Array.isArray(rawData?.data)) {
        shopList = rawData.data;
      } else if (rawData?.data?.data && Array.isArray(rawData.data.data)) {
        shopList = rawData.data.data;
      }
      
      setShops(shopList);
    } catch (err) {
      console.error('Failed to fetch shops:', err);
      setShops([]);
    }
  };

  const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMmY0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmaWxsPSIjOTNhM2I4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeD0iMCIgZHk9Ii4zZW0iPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';

  const getListingImageUrl = (product) => {
    if (!product || !product.id) return fallbackImage;
    return `/api/listings/${product.id}/image`;
  };

  const featuredCategories = [
    { name: 'Laptops & PCs', icon: '💻', count: '1,234' },
    { name: 'Smartphones', icon: '📱', count: '856' },
    { name: 'PC Components', icon: '⚙️', count: '678' },
    { name: 'Networking', icon: '📡', count: '432' },
    { name: 'Accessories', icon: '🎧', count: '345' },
    { name: 'Storage', icon: '💾', count: '234' },
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
            
            <div className="w-full relative z-10">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-200/80 bg-blue-50/90 dark:border-cyan-400/20 dark:bg-cyan-400/[0.06] px-4 py-2 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 dark:bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-cyan-400" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700 dark:text-cyan-200">
                  TrustNode Technology Marketplace
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
                Discover laptops, networking hardware, pc components and more from
                trusted sellers. Buy securely with verified shops,
                protected transactions and transparent escrow technology.
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

            {/* --- SINGLE FADE ANIMATION CARD --- */}
            <div 
              className="relative hidden lg:block w-full h-[450px] xl:h-[520px] rounded-[2.5rem] shadow-2xl shadow-blue-500/10 dark:shadow-cyan-500/10"
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
            >
              {loading ? (
                <div className="w-full h-full animate-pulse bg-slate-200 dark:bg-white/5 rounded-[2.5rem]" />
              ) : products.length > 0 ? (
                <>
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className={`absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={getListingImageUrl(product)}
                        alt={product.title}
                        className="w-full h-full object-cover transform transition-transform duration-[10000ms] ease-out scale-100 hover:scale-110"
                        onError={(e) => { e.currentTarget.src = fallbackImage; }}
                      />
                      
                      {/* Gradient Overlay for Text Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070b1c]/90 via-[#070b1c]/40 to-transparent pointer-events-none" />

                      {/* Floating Badges */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                         <span className="bg-white/90 dark:bg-[#070b1c]/80 backdrop-blur-md text-slate-800 dark:text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                           {product.shop?.shop_name || 'Verified Store'}
                         </span>
                      </div>
                      
                      <div className="absolute top-6 right-6">
                        <span className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg shadow-md uppercase tracking-wider backdrop-blur-md ${product.stock > 0 ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                          {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                        </span>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
                        <span className="inline-block px-2.5 py-1 bg-blue-600/90 text-white text-[10px] font-black rounded uppercase tracking-widest mb-3 backdrop-blur-md">
                          Featured
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 line-clamp-2 leading-tight">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-black text-cyan-400 drop-shadow-lg">
                            ${Number(product.price).toFixed(2)}
                          </span>
                          <Link 
                            to={`/listings/${product.id}`} 
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Elegant Floating Navigation Controls */}
                  {products.length > 1 && (
                    <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 pointer-events-none">
                      <button 
                        onClick={prevSlide}
                        className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all transform hover:-translate-x-1"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button 
                        onClick={nextSlide}
                        className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all transform hover:translate-x-1"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  )}

                  {/* Dot Indicators */}
                  {products.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20 pointer-events-none">
                      {products.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-500 shadow-lg ${currentIndex === idx ? 'w-6 bg-cyan-400' : 'w-2 bg-white/40'}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-[2.5rem] bg-slate-100 dark:bg-white/5">
                   <p className="text-slate-500 font-semibold">No active listings found.</p>
                </div>
              )}
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
              TrustNode combines secure transactions, verified sellers, and transparent technology to create a safer experience.
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
                Be the first seller to open a trusted shop on TrustNode.
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
              The Numbers Behind <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">TrustNode</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-400">A secure technology marketplace connecting trusted buyers and sellers globally.</p>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 w-full">
            {[
              { number: '500+', label: 'Verified Shops', desc: 'Trusted tech sellers' },
              { number: '10K+', label: 'Products', desc: 'Hardware & components' },
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