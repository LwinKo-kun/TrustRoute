import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [listings, setListings] = useState([]);
  const [matchedShops, setMatchedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- MULTI-PAGE STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);

  // Reset to page 1 whenever the search query changes
  useEffect(() => {
    setCurrentPage(1);
    setListings([]);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        if (currentPage === 1) setLoading(true);
        else setLoadingPage(true);

        const params = { 
            ...(searchQuery ? { search: searchQuery } : {}),
            page: currentPage 
        };
        
        const [listingsRes, shopsRes] = await Promise.all([
          api.get('/listings', { params }),
          api.get('/shops', { params: searchQuery ? { search: searchQuery } : {} })
        ]);

        // Safely extract Laravel pagination data
        const rawListings = listingsRes.data;
        let newItems = [];
        let totalPages = 1;

        if (Array.isArray(rawListings)) {
          newItems = rawListings;
        } else if (Array.isArray(rawListings?.data)) {
          newItems = rawListings.data;
          totalPages = rawListings.last_page || 1;
        } else if (rawListings?.data?.data && Array.isArray(rawListings.data.data)) {
          newItems = rawListings.data.data;
          totalPages = rawListings.data.last_page || 1;
        }

        // REPLACE items instead of appending them for a multi-page feel
        setListings(newItems);
        setLastPage(totalPages);

        // Fetch shops only on the first page load
        if (currentPage === 1) {
            const shopData = shopsRes.data?.data || shopsRes.data;
            const allShops = Array.isArray(shopData) ? shopData : shopData?.data || [];
            
            if (searchQuery) {
              // Bulletproof search filter to prevent crashing on missing shop names
              const filteredShops = allShops.filter(s => {
                const name = s.shop_name || s.name || '';
                const desc = s.description || '';
                const searchLower = searchQuery.toLowerCase();
                
                return name.toLowerCase().includes(searchLower) || 
                       desc.toLowerCase().includes(searchLower);
              });
              setMatchedShops(filteredShops);
            } else {
              setMatchedShops([]);
            }
        }

        // Scroll to the top of the product list smoothly when changing pages
        if (currentPage > 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

      } catch (err) {
        console.error('Failed to load marketplace data', err);
      } finally {
        setLoading(false);
        setLoadingPage(false);
      }
    };

    const timer = setTimeout(fetchSearchData, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300 flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Browse verified products and trusted shops</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-slate-400 font-medium">Searching marketplace...</div>
        ) : (
          <div className="flex flex-col gap-10">
            
            {matchedShops.length > 0 && currentPage === 1 && (
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  🏪 Matching Stores ({matchedShops.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedShops.map(shop => (
                    <Link 
                      key={shop.id} 
                      to={`/shops/${shop.id}`}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 hover:border-blue-500 shadow-sm flex flex-col gap-2 transition group"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition">{shop.shop_name || shop.name || 'Store'}</h3>
                        <span className="text-[10px] uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">{shop.status || 'Active'}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{shop.description || 'Verified merchant store.'}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Products
                  </h2>
                  {lastPage > 1 && (
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Page {currentPage} of {lastPage}
                      </span>
                  )}
              </div>

              {listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400 bg-white dark:bg-[#0d1326] rounded-2xl border border-slate-200 dark:border-white/10">
                  <p className="text-base font-semibold">
                    {searchQuery ? `No product results found for "${searchQuery}"` : 'No listings available yet'}
                  </p>
                </div>
              ) : (
                <>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${loadingPage ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {listings.map(listing => (
                      <ProductCard 
                        key={listing.id} 
                        product={listing} 
                        actionButton={
                          <Link
                            to={`/listings/${listing.id}`}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
                          >
                            View Details
                          </Link>
                        }
                      />
                    ))}
                  </div>
                  
                  {/* --- MULTI-PAGE PAGINATION CONTROLS --- */}
                  {lastPage > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || loadingPage}
                        className="px-5 py-2.5 bg-slate-100 dark:bg-[#0d1326] hover:bg-slate-200 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold rounded-xl shadow-sm transition disabled:opacity-30 flex items-center gap-2"
                      >
                        ← Previous
                      </button>

                      <div className="flex items-center gap-1.5">
                          {[...Array(lastPage)].map((_, idx) => {
                              const pageNum = idx + 1;
                              // Only show a few pages around the current page to avoid clutter
                              if (pageNum === 1 || pageNum === lastPage || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                  return (
                                      <button
                                          key={pageNum}
                                          onClick={() => setCurrentPage(pageNum)}
                                          disabled={loadingPage}
                                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition ${currentPage === pageNum ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
                                      >
                                          {pageNum}
                                      </button>
                                  );
                              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                  return <span key={pageNum} className="text-slate-400">...</span>;
                              }
                              return null;
                          })}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(prev => Math.min(lastPage, prev + 1))}
                        disabled={currentPage === lastPage || loadingPage}
                        className="px-5 py-2.5 bg-slate-100 dark:bg-[#0d1326] hover:bg-slate-200 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm font-bold rounded-xl shadow-sm transition disabled:opacity-30 flex items-center gap-2"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}