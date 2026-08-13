import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import MarketplacePage from '../pages/MarketplacePage';
import ShopCreatePage from '../pages/ShopCreatePage';
import ShopEditPage from '../pages/ShopEditPage';
import ListingCreatePage from '../pages/ListingCreatePage';
import ListingEditPage from '../pages/ListingEditPage';
import ListingDetailView from '../pages/views/ListingDetailView';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import ChatPage from '../pages/ChatPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/shops" element={<MarketplacePage />} />

      {/* Protected Dashboard & Marketplace Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Shop Routes */}
        <Route path="/shop/create" element={<ShopCreatePage />} />
        <Route path="/shop/edit" element={<ShopEditPage />} />

        {/* Listing Routes - Note the explicit ordering */}
        <Route path="/listings/create" element={<ListingCreatePage />} />
        <Route path="/listings/:id" element={<ListingDetailView />} />
        <Route path="/listings/:id/edit" element={<ListingEditPage />} />

        {/* Checkout & Chat Routes */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}