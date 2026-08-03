// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboardView from '../views/AdminDashboardView';
import NodeOperatorDashboardView from '../views/NodeOperatorDashboardView';
import DashboardView from '../views/DashboardView';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboardView />;
  }

  if (user?.role === 'node-operator') {
    return <NodeOperatorDashboardView />;
  }

  return <DashboardView />;
}