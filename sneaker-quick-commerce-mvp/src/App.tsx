import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LandingPage } from '@/pages/customer/LandingPage';
import { ShopPage } from '@/pages/customer/ShopPage';
import { ProductDetailPage } from '@/pages/customer/ProductDetailPage';
import { CheckoutPage } from '@/pages/customer/CheckoutPage';
import { OrdersPage } from '@/pages/customer/OrdersPage';
import { OrderTrackingPage } from '@/pages/customer/OrderTrackingPage';
import { ReturnsPage } from '@/pages/customer/ReturnsPage';
import { AuthPage } from '@/pages/customer/AuthPage';
import { ProfilePage } from '@/pages/customer/ProfilePage';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { OverviewPage } from '@/pages/dashboard/OverviewPage';
import { OrdersManagementPage } from '@/pages/dashboard/OrdersManagementPage';
import { InventoryPage } from '@/pages/dashboard/InventoryPage';
import { ProductsPage } from '@/pages/dashboard/ProductsPage';
import { Navbar } from '@/components/customer/Navbar';
import { CartDrawer } from '@/components/customer/CartDrawer';
import { useAuthStore } from '@/store/authStore';

const CustomerLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <CartDrawer />
  </>
);

export default function App() {
  const { initialize } = useAuthStore();

  // Initialize real Supabase auth listener on mount.
  // This keeps the user session in sync across page loads and OAuth redirects.
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <OverviewPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/orders"
        element={
          <DashboardLayout>
            <OrdersManagementPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/inventory"
        element={
          <DashboardLayout>
            <InventoryPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/products"
        element={
          <DashboardLayout>
            <ProductsPage />
          </DashboardLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
