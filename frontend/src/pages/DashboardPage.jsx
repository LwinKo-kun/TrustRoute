import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AdminDashboardView from "./views/AdminDashboardView";
import CustomerDashboardView from "./views/CustomerDashboardView";
import ShopkeeperDashboardView from "./views/ShopkeeperDashboardView";
import DeliveryDashboardView from "./views/DeliveryDashboardDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = String(user?.role || data?.user?.role || '').toLowerCase();

  useEffect(() => {
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load dashboard data', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh] text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping" />
        <p className="text-sm font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  const renderDashboardView = () => {
    switch (role) {
      case 'admin':
        return <AdminDashboardView data={data} />;
      case 'shopkeeper':
        return <ShopkeeperDashboardView data={data} />;
      case 'delivery':
        return <DeliveryDashboardView data={data} />;
      case 'customer':
      default:
        return <CustomerDashboardView data={data} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#070b1c] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {renderDashboardView()}
    </div>
  );
}