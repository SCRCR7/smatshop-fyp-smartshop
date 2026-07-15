import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SearchPage from "./pages/SearchPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AboutPage from "./pages/AboutPage";
import ShippingPage from "./pages/ShippingPage";
import ReturnsPage from "./pages/ReturnsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import SellerLandingPage from "./pages/SellerLandingPage";
import MobileAppPage from "./pages/MobileAppPage";

import OrderSuccessPage from "./pages/OrderSuccessPage";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import OrderListPage from "./pages/admin/OrderListPage";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import UserListPage from "./pages/admin/UserListPage";
import UserEditPage from "./pages/admin/UserEditPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import BannerAdminPage from "./pages/admin/BannerAdminPage";
import AdminSellerApplicationsPage from "./pages/admin/AdminSellerApplicationsPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import SellerRoute from "./components/SellerRoute";

import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import AddProductPage from "./pages/seller/AddProductPage";
import SellerTermsPage from "./pages/seller/SellerTermsPage";
import SellerApplicationStatusPage from "./pages/seller/SellerApplicationStatusPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

import AuthCallback from "./pages/AuthCallback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application with Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="search/:keyword" element={<SearchPage />} />
          <Route path="search/voice-results" element={<SearchPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />

          {/* Customer Routes (Checkout is public, Profile is protected) */}
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancel" element={<PaymentCancel />} />
          <Route element={<PrivateRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Protected Admin Portal */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/:id/edit" element={<ProductEditPage />} />
            <Route path="orders" element={<OrderListPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="users/:id/edit" element={<UserEditPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="banners" element={<BannerAdminPage />} />
            <Route
              path="seller-applications"
              element={<AdminSellerApplicationsPage />}
            />
          </Route>
        </Route>

        {/* Protected Seller Portal */}
        <Route element={<SellerRoute />}>
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/seller/add-product" element={<AddProductPage />} />
        </Route>

        {/* Seller Onboarding Routes (Protected by PrivateRoute) */}
        <Route element={<PrivateRoute />}>
          <Route path="/seller/terms" element={<SellerTermsPage />} />
          <Route
            path="/seller/application-status"
            element={<SellerApplicationStatusPage />}
          />
        </Route>

        {/* Standalone Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Static Content */}
        <Route path="/mobile-app" element={<MobileAppPage />} />
        <Route path="/sell-on-smartshop" element={<SellerLandingPage />} />
        <Route path="/seller" element={<SellerLandingPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
