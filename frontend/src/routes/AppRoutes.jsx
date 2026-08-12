import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import ShopCreatePage from '../pages/ShopCreatePage';
import ShopEditPage from '../pages/ShopEditPage';
import ListingCreatePage from '../pages/ListingCreatePage';
import ListingEditPage from '../pages/ListingEditPage';
import ListingDetailView from '../pages/ListingDetailView';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import ChatPage from '../pages/ChatPage'; // 💬 1. ChatPage ကို Import လုပ်ပါ (ဖိုင်လမ်းကြောင်း စစ်ပေးပါ)
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/shop/create" element={<ShopCreatePage />} />
        <Route path="/shop/edit" element={<ShopEditPage />} />
        <Route path="/listings/create" element={<ListingCreatePage />} />
        <Route path="/listings/:id" element={<ListingDetailView />} />
        <Route path="/listings/:id/edit" element={<ListingEditPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* 💬 2. Chat Route များကို ဒီနေရာမှာ ထည့်ပေးထားပါတယ် */}
        <Route path="/chat/:sellerId" element={<ChatPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

      <Route path="/cart" element={<CartPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}