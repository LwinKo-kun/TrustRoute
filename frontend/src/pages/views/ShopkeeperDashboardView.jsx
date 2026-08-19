import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import OrderTable from '../../components/common/OrderTable';
import ProductCard from '../../components/common/ProductCard';

export default function ShopkeeperDashboardView() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopkeeperData = async () => {
      try {
        const shopRes = await api.get('/my-shop');
        setShop(shopRes.data.data || shopRes.data);

        const listingsRes = await api.get('/my-shop/listings');
        const listData = listingsRes.data?.data?.data || listingsRes.data?.data || listingsRes.data;
        setListings(Array.isArray(listData) ? listData : []);

        const ordersRes = await api.get('/orders');
        const orderData = ordersRes.data?.data || ordersRes.data?.items || ordersRes.data;
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShopkeeperData();
  }, []);

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div></div>;

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">

      <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Shopkeeper Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{shop ? shop.shop_name : `Welcome, ${user?.name}`}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {shop ? 'Manage your catalog items, track inventory stock levels, and monitor customer transactions.' : 'Setup your store profile to start publishing products to the marketplace.'}
          </p>
        </div>

        {shop && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/chat" className="px-4 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition flex items-center gap-2">
              💬 Inbox
            </Link>
            <Link to="/shop/edit" className="px-4 py-2.5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition">
              Settings
            </Link>
            <Link to="/listings/create" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md transition">
              + New Listing
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Inventory</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{shop ? listings.length : 0}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Store Orders</h3>
          <p className="text-4xl font-extrabold text-amber-500 mt-2">{orders.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Store Status</h3>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2 uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {shop ? shop.status : 'No Shop'}
          </p>
        </div>
      </div>

      {!shop ? (
        <div className="p-12 border border-dashed border-slate-300 dark:border-white/20 rounded-2xl bg-white dark:bg-[#0d1326] flex flex-col items-center text-center gap-4 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">You haven't set up your shop yet</h2>
          <Link to="/shop/create" className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-xl transition mt-2 shadow-md">
            Create Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          
          <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Fulfillment</h2>
              <span className="text-xs text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full font-bold">{activeOrders.length} Pending</span>
            </div>
            <OrderTable orders={activeOrders} emptyMessage="No active orders currently." />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Inventory Management</h2>
            </div>

            {listings.length === 0 ? (
              <div className="p-12 border border-dashed border-slate-300 dark:border-white/20 rounded-2xl text-center">
                <p className="text-sm text-slate-500">No products listed yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((item) => (
                  <ProductCard 
                    key={item.id} 
                    product={item} 
                    actionButton={
                      <div className="flex items-center gap-2">
                        <Link to={`/listings/${item.id}/edit`} className="px-3 py-1.5 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition">Edit</Link>
                        <button onClick={(e) => { e.preventDefault(); handleDeleteListing(item.id); }} className="px-3 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition">Delete</button>
                      </div>
                    } 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}