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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900 text-white py-24 px-4 sm:py-32">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-purple-200">Decentralized Marketplace</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
                Buy & Sell Securely<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">With TrustRoute</span>
              </h1>
              <p className="text-lg sm:text-xl text-purple-100 mb-8 leading-relaxed">
                The decentralized marketplace for buying and selling. Secure transactions with escrow protection, verified sellers, and direct peer-to-peer connections.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/marketplace" className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 transition transform hover:-translate-y-1">
                  Browse Products
                </Link>
                <Link to="/signup" className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 hover:bg-white/10 rounded-xl transition backdrop-blur-sm">
                  Start Selling
                </Link>
              </div>
              
              <div className="mt-8 flex items-center gap-6 text-sm text-purple-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified sellers
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Escrow protection
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl transform rotate-2 scale-105 opacity-30" />
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-3 gap-4">
                    {(products.slice(0, 6).length > 0 ? products.slice(0, 6) : Array.from({ length: 6 }, (_, i) => ({ id: i + 1, title: `Featured item ${i + 1}` }))).map((product, index) => (
                      <div key={product.id ?? index} className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-700/50 flex flex-col shadow-sm hover:shadow-md transition group">
                        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={getListingImageUrl(product)}
                            alt={product.title || `Featured item ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              e.target.src = fallbackImage;
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                            {product.shop?.shop_name || 'Store'}
                          </div>
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-semibold">
                            {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of stock'}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                            {product.title || `Featured item ${index + 1}`}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">TrustRoute</span>?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform provides secure, transparent, and decentralized e-commerce experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Secure Escrow', desc: 'Funds held in escrow until delivery confirmation', icon: '🔒' },
              { title: 'Verified Shops', desc: 'All sellers are verified and background-checked', icon: '✅' },
              { title: 'Direct P2P', desc: 'Buyers and sellers connect directly without intermediaries', icon: '🤝' },
              { title: 'Dispute Resolution', desc: 'Fair arbitration system for resolution', icon: '⚖️' },
              { title: 'Global Access', desc: 'Shop from anywhere in the world', icon: '🌍' },
              { title: 'Fast Shipping', desc: 'Quick delivery with trackable shipments', icon: '🚀' },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl hover:shadow-xl transition border border-gray-100 dark:border-gray-700 group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:shadow-md transition">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Category</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Browse products by category</p>
            </div>
            <Link to="/marketplace" className="hidden sm:flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 transition">
              View All Categories
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((cat, i) => (
              <Link
                key={i}
                to={`/marketplace?category=${cat.name}`}
                className="group relative overflow-hidden rounded-3xl p-6 text-center hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-100 transition`} />
                <div className="relative text-white">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-xl mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-sm">{cat.count} products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

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