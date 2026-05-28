import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/pages/customer/LandingPage';
import { ShopPage } from '@/pages/customer/ShopPage';
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage';
import { CheckoutPage } from '@/pages/customer/CheckoutPage';
import { OrdersPage } from '@/pages/customer/OrdersPage';
import { OrderTrackingPage } from '@/pages/customer/OrderTrackingPage';
import { ReturnsPage } from '@/pages/customer/ReturnsPage';
import { ProfilePage } from '@/pages/customer/ProfilePage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { OrdersManagementPage } from '@/pages/dashboard/OrdersManagementPage';
import { InventoryPage } from '@/pages/dashboard/InventoryPage';
import { ProductsPage } from '@/pages/dashboard/ProductsPage';
import { Navbar } from '@/components/customer/Navbar';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { useAuthStore } from '@/store/authStore';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { StorekeeperDashboardPage } from '@/pages/storekeeper/StorekeeperDashboardPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';

const CustomerLayout = () => (<><Navbar /><Outlet /><CartDrawer /></>);

export default function App() {
  const { initialize } = useAuthStore();
  useEffect(() => { const unsubscribe = initialize(); return unsubscribe; }, [initialize]);

  return (
    <Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />

      <Route element={<CustomerLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="/storekeeper" element={<ProtectedRoute role="storekeeper"><StorekeeperDashboardPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboardPage /></ProtectedRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute role="storekeeper"><DashboardLayout><OverviewPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/orders" element={<ProtectedRoute role="storekeeper"><DashboardLayout><OrdersManagementPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/inventory" element={<ProtectedRoute role="storekeeper"><DashboardLayout><InventoryPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/products" element={<ProtectedRoute role="storekeeper"><DashboardLayout><ProductsPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
