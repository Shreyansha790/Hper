import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  BarChart3,
  Users,
  Store,
  RotateCcw,
  Zap,
  LogOut,
  Menu,
  ChevronRight,
  Bell,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Orders', path: '/dashboard/orders', icon: <ShoppingCart size={18} />, badge: 3 },
  { label: 'Inventory', path: '/dashboard/inventory', icon: <Package size={18} />, badge: 5 },
  { label: 'Products', path: '/dashboard/products', icon: <BarChart3 size={18} />, adminOnly: true },
  { label: 'Returns', path: '/dashboard/returns', icon: <RotateCcw size={18} />, adminOnly: false },
  { label: 'Users', path: '/dashboard/users', icon: <Users size={18} />, adminOnly: true },
  { label: 'Stores', path: '/dashboard/stores', icon: <Store size={18} />, adminOnly: true },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
            <Zap size={15} className="text-white fill-white" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="text-base font-black text-gray-900">Kicks<span className="text-gradient">Fly</span></span>
              <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Operations Dashboard</p>
            </div>
          )}
        </Link>
      </div>

      {/* Role Badge */}
      {sidebarOpen && user && (
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-violet-50 border border-violet-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-black">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wide">{user.role}</p>
            </div>
          </div>
          {user.role === 'storekeeper' && user.assignedStoreId && (
            <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
              <Store size={8} /> Indiranagar Store
            </p>
          )}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <span className={cn('flex-shrink-0', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="text-sm font-semibold flex-1">{item.label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-black', isActive ? 'bg-white/20 text-white' : 'bg-violet-100 text-violet-700')}>
                  {item.badge}
                </span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-3">
        <Link to="/" className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all text-sm font-semibold')}>
          <ChevronRight size={18} className="text-gray-400 rotate-180" />
          {sidebarOpen && 'Back to Store'}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-semibold"
        >
          <LogOut size={18} />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col bg-white border-r border-gray-100 shadow-sm flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 shadow-xl z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => { setSidebarOpen(!sidebarOpen); setMobileSidebarOpen(!mobileSidebarOpen); }}
            className="p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-500"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-black text-gray-900 hidden sm:block">
              {visibleItems.find((i) => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600" />
            </button>
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all text-gray-500">
              <Settings size={18} />
            </button>
            {user && (
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-sm font-black">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
