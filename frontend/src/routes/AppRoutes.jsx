import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import MarketplacePage from '../pages/MarketplacePage';
import ShopsPage from '../pages/ShopsPage'; // <-- ADDED: Import the ShopsPage
import ShopCreatePage from '../pages/ShopCreatePage';
import ShopEditPage from '../pages/ShopEditPage';
import ListingCreatePage from '../pages/ListingCreatePage';
import ListingEditPage from '../pages/ListingEditPage';
import ListingDetailView from '../pages/views/ListingDetailView';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import ChatPage from '../pages/ChatPage';
import WalletPage from '../pages/WalletPage';
import OrderDetailsPage from '../pages/OrderDetailsPage';
import ProfileSettingsPage from '../pages/ProfileSettingsPage';
import AddressBookPage from '../pages/AddressBookPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import ShopProfilePage from '../pages/ShopProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/cart" element={<CartPage />} />
      
      {/* Consolidated Marketplace Route */}
      <Route path="/marketplace" element={<MarketplacePage />} />
      
      {/* ADDED: Trusted Shops Directory Route */}
      <Route path="/shops" element={<ShopsPage />} />
      
      {/* Public Shop Profile Route */}
      <Route path="/shops/:id" element={<ShopProfilePage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Wallet Route */}
        <Route path="/wallet" element={<WalletPage />} />

        {/* Profile & Address Book Routes */}
        <Route path="/profile" element={<ProfileSettingsPage />} />
        <Route path="/addresses" element={<AddressBookPage />} />
        
        {/* Shop Routes */}
        <Route path="/shop/create" element={<ShopCreatePage />} />
        <Route path="/shop/edit" element={<ShopEditPage />} />

        {/* Listing Routes */}
        <Route path="/listings/create" element={<ListingCreatePage />} />
        <Route path="/listings/:id" element={<ListingDetailView />} />
        <Route path="/listings/:id/edit" element={<ListingEditPage />} />

        {/* Checkout, Orders & Chat Routes */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="/chat/:userId" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

      {/* Catch-all 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}