import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import api from '../../services/api';
import OrderTable from '../../components/common/OrderTable';

export default function CustomerDashboardView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await api.get('/orders');
        const orderData = res.data?.data || res.data || [];
        setOrders(Array.isArray(orderData) ? orderData : []);
      } catch (err) {
        console.error('Failed to load customer orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerOrders();
  }, []);

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8 transition-colors duration-300">
      
      {/* Dashboard Welcome Banner */}
      <div className="p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1326] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Customer Account</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back, {user?.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Manage your purchases, track active deliveries, and review your order history.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link to="/marketplace" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2">
            🛍️ Go to Marketplace
          </Link>
          <Link to="/cart" className="px-5 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-white/10 transition">
            View Cart
          </Link>
        </div>
      </div>

      {/* Account Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Deliveries</h3>
          <p className="text-4xl font-extrabold text-blue-600 dark:text-cyan-400 mt-2">{activeOrders.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Purchases</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">{orders.length}</p>
        </div>
        <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm flex flex-col justify-center">
           <Link to="/profile" className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-2">
              ⚙️ Manage Profile & Addresses ↗
           </Link>
           <Link to="/wallet" className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-2 mt-3">
              💳 Manage Escrow Wallet ↗
           </Link>
        </div>
      </div>

      {/* My Orders Section */}
      <div className="flex flex-col gap-8">
        <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Orders & Tracking</h2>
          </div>
          {loading ? <p className="text-sm py-4 text-center">Loading your orders...</p> : 
            <OrderTable orders={activeOrders} emptyMessage="You have no active orders. Head to the marketplace to start shopping!" />
          }
        </div>

        <div className="bg-white dark:bg-[#0d1326] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm opacity-90">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Past Purchases</h2>
          </div>
          {loading ? <p className="text-sm py-4 text-center">Loading history...</p> : 
            <OrderTable orders={pastOrders} emptyMessage="No past purchases recorded." />
          }
        </div>
      </div>

    </div>
  );
}