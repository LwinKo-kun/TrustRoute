// frontend/src/pages/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AdminDashboardView from '../views/AdminDashboardView';
import CustomerDashboardView from '../views/CustomerDashboardView';
import ShopkeeperDashboardView from '../views/ShopkeeperDashboardView';
import DeliveryDashboardView from '../views/DeliveryDashboardDashboard'; // Fix filename import if corrected

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

  if (loading) return <p className="text-sm">Loading dashboard...</p>;

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
}