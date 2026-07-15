import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopDetail from './pages/ShopDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import SellerRegisterPage from './pages/SellerRegisterPage';
import DashboardLayout from './pages/seller/DashboardLayout';
import DashboardPage from './pages/seller/DashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerImportsPage from './pages/seller/SellerImportsPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminShopsPage from './pages/admin/AdminShopsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

import TopBar from './components/layout/TopBar';
import Header from './components/layout/Header';

function AppContent() {
  const location = useLocation();
  
  // Hide Navbar and Footer on full-screen authentication pages or seller dashboard
  const hideLayout = ['/login', '/register'].includes(location.pathname) || 
                    (location.pathname.startsWith('/seller') && location.pathname !== '/seller/register') ||
                    location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-cream text-zinc-800 transition-colors duration-200">
      {!hideLayout && (
        <>
          <TopBar />
          <Header />
          <Navbar />
        </>
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/seller/register" element={<SellerRegisterPage />} />
          <Route path="/seller" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
            <Route path="imports" element={<SellerImportsPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="shops" element={<AdminShopsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
