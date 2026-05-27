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
    <div className="flex flex-col h-full bg-[#0D0D0D]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[#E8FF47] rounded-sm flex items-center justify-center shadow-[0_0_16px_rgba(232,255,71,0.4)]">
            <Zap size={14} className="text-black fill-black" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-display text-lg tracking-wider text-white">
                KICKS<span className="text-[#E8FF47]">FLY</span>
              </span>
              <p className="text-[9px] text-neutral-500 font-mono-custom uppercase tracking-wider -mt-0.5">Ops Dashboard</p>
            </div>
          )}
        </Link>
      </div>

      {/* Role Badge */}
      {sidebarOpen && user && (
        <div className="px-4 py-3.5 mx-3 mt-4 rounded-sm bg-[#E8FF47]/5 border border-[#E8FF47]/20 shadow-glow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#E8FF47] flex items-center justify-center text-black text-sm font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate uppercase tracking-wider">{user.name}</p>
              <p className="text-[9px] font-mono-custom font-bold text-[#E8FF47] uppercase tracking-wide mt-0.5">{user.role}</p>
            </div>
          </div>
          {user.role === 'storekeeper' && user.assignedStoreId && (
            <p className="text-[9px] text-neutral-400 font-mono-custom uppercase tracking-wide mt-3 flex items-center gap-1.5 pt-2.5 border-t border-white/5">
              <Store size={10} className="text-[#E8FF47]" /> Indiranagar Store
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
                'flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all group relative',
                isActive
                  ? 'bg-[#E8FF47] text-black shadow-glow-sm hover:bg-[#d4eb30]'
                  : 'text-neutral-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <span className={cn('flex-shrink-0', isActive ? 'text-black' : 'text-neutral-400 group-hover:text-white')}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="text-xs font-bold uppercase tracking-wider font-mono-custom flex-1">{item.label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span className={cn('px-1.5 py-0.5 rounded-sm text-[9px] font-bold font-mono-custom', isActive ? 'bg-black/10 text-black' : 'bg-[#E8FF47]/10 text-[#E8FF47]')}>
                  {item.badge}
                </span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/10 text-white text-[10px] font-mono-custom uppercase tracking-wider rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-white/[0.07] pt-3">
        <Link to="/" className={cn('flex items-center gap-3 px-3 py-2.5 rounded-sm text-neutral-400 hover:bg-white/5 hover:text-white transition-all text-xs font-bold uppercase tracking-wider font-mono-custom')}>
          <ChevronRight size={14} className="text-neutral-500 rotate-180" />
          {sidebarOpen && 'Back to Store'}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-red-400 hover:bg-red-950/10 hover:text-red-500 transition-all text-xs font-bold uppercase tracking-wider font-mono-custom"
        >
          <LogOut size={14} />
          {sidebarOpen && 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col bg-[#0D0D0D] border-r border-white/[0.07] flex-shrink-0 overflow-hidden"
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-[#0D0D0D] border-r border-white/[0.07] z-50 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#0D0D0D] border-b border-white/[0.07] px-4 md:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => { setSidebarOpen(!sidebarOpen); setMobileSidebarOpen(!mobileSidebarOpen); }}
            className="p-2 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all"
          >
            <Menu size={18} />
          </button>

          <div className="flex-1">
            <h1 className="text-xs font-bold uppercase tracking-wider font-mono-custom text-[#E8FF47] hidden sm:block">
              {visibleItems.find((i) => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E8FF47]" />
            </button>
            <button className="p-2 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all">
              <Settings size={17} />
            </button>
            {user && (
              <div className="w-8 h-8 rounded-sm bg-[#E8FF47] flex items-center justify-center text-black text-xs font-bold shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
};
