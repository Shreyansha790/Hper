import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  MapPin,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Package,
  LogOut,
  LayoutDashboard,
  Zap,
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';

const LOCATIONS = [
  'Indiranagar, Bangalore',
  'Koramangala, Bangalore',
  'HSR Layout, Bangalore',
  'Whitefield, Bangalore',
  'Jayanagar, Bangalore',
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalItems, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedLocation, setLocation } = useUIStore();
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const totalItems = getTotalItems();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchVal)}`);
      setShowSearch(false);
      setSearchVal('');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-lg">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">
                Kicks<span className="text-gradient">Fly</span>
              </span>
            </Link>

            {/* Location Picker */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowLocation(!showLocation)}
                className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-violet-600 transition-colors font-medium"
              >
                <MapPin size={14} className="text-violet-500" />
                <span className="max-w-[160px] truncate">{selectedLocation}</span>
                <ChevronDown size={14} className={cn('transition-transform', showLocation && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {showLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-2 mb-2">Select Location</p>
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => { setLocation(loc); setShowLocation(false); }}
                          className={cn(
                            'w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all',
                            selectedLocation === loc
                              ? 'bg-violet-50 text-violet-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-violet-400" />
                            {loc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/shop" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
                Shop
              </Link>
              <Link to="/shop?category=new" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
                New Drops
              </Link>
              <Link to="/shop?category=featured" className="text-sm font-medium text-gray-700 hover:text-violet-600 transition-colors">
                Featured
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              >
                <Search size={18} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems > 9 ? '9+' : totalItems}
                  </motion.span>
                )}
              </button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/orders"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all"
                          >
                            <Package size={14} /> My Orders
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-all"
                          >
                            <User size={14} /> Profile
                          </Link>
                          {(user.role === 'admin' || user.role === 'storekeeper') && (
                            <Link
                              to="/dashboard"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-violet-600 font-medium hover:bg-violet-50 transition-all"
                            >
                              <LayoutDashboard size={14} /> Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
                          >
                            <LogOut size={14} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white gradient-primary hover:opacity-90 transition-all shadow-md shadow-violet-200"
                >
                  <User size={14} /> Login
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4 py-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search sneakers, brands, models..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                <Link to="/shop" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Shop</Link>
                <Link to="/shop?category=new" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">New Drops</Link>
                <Link to="/shop?category=featured" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Featured</Link>
                {!isAuthenticated && (
                  <Link to="/auth" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-violet-600 hover:bg-violet-50">Login / Sign Up</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for dropdowns */}
      {(showLocation || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowLocation(false); setShowUserMenu(false); }}
        />
      )}
    </>
  );
};
