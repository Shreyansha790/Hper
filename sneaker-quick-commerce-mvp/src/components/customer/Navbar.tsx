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

const TICKER_ITEMS = [
  '⚡ FREE DELIVERY on orders above ₹15,000',
  '🔥 30-MINUTE EXPRESS DELIVERY across Bangalore',
  '✦ USE CODE KICKSFLY for free delivery on your first order',
  '🏆 PREMIUM 1:1 IMPORTS — Nike · Jordan · Yeezy · New Balance',
  '✓ 7-DAY NO-QUESTIONS-ASKED RETURNS',
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalItems, openCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { selectedLocation, setLocation } = useUIStore();
  const [showSearch, setShowSearch] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const totalItems = getTotalItems();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchVal)}`);
      setShowSearch(false);
      setSearchVal('');
    }
  };

  const tickerText = TICKER_ITEMS.join('   ·   ');

  return (
    <>
      {/* ── Announcement Ticker ── */}
      <div className="relative overflow-hidden bg-[#E8FF47] h-8 flex items-center z-50">
        <div className="flex whitespace-nowrap animate-ticker">
          {/* Doubled for seamless loop */}
          {[0, 1].map((i) => (
            <span key={i} className="inline-flex items-center gap-2 pr-16 text-[11px] font-bold text-black uppercase tracking-[0.12em] font-mono-custom">
              {tickerText}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="sticky top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/[0.07]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 bg-[#E8FF47] rounded-sm flex items-center justify-center shadow-[0_0_16px_rgba(232,255,71,0.4)] group-hover:shadow-[0_0_24px_rgba(232,255,71,0.6)] transition-all">
                <Zap size={14} className="text-black fill-black" />
              </div>
              <span className="font-display text-[22px] text-white tracking-wide leading-none">
                KICKS<span className="text-[#E8FF47]">FLY</span>
              </span>
            </Link>

            {/* Location Picker */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowLocation(!showLocation)}
                className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors font-medium tracking-wide uppercase"
              >
                <MapPin size={12} className="text-[#E8FF47]" />
                <span className="max-w-[150px] truncate">{selectedLocation.split(',')[0]}</span>
                <ChevronDown size={12} className={cn('transition-transform duration-200', showLocation && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {showLocation && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-3 w-56 bg-[#111111] rounded-sm border border-white/10 overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
                  >
                    <div className="p-1">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em] font-mono-custom px-3 py-2">Deliver To</p>
                      {LOCATIONS.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => { setLocation(loc); setShowLocation(false); }}
                          className={cn(
                            'w-full text-left px-3 py-2.5 text-xs transition-all flex items-center gap-2',
                            selectedLocation === loc
                              ? 'text-[#E8FF47] font-semibold'
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          )}
                        >
                          <MapPin size={11} className={selectedLocation === loc ? 'text-[#E8FF47]' : 'text-neutral-600'} />
                          {loc}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'SHOP', to: '/shop' },
                { label: 'NEW DROPS', to: '/shop?category=new' },
                { label: 'FEATURED', to: '/shop?category=featured' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[11px] font-bold text-neutral-400 hover:text-white tracking-[0.12em] transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#E8FF47] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Search"
              >
                <Search size={17} />
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Open cart"
              >
                <ShoppingBag size={17} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E8FF47] text-black text-[9px] font-bold rounded-sm flex items-center justify-center font-mono-custom"
                    >
                      {totalItems > 9 ? '9+' : totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-white/5 transition-all"
                  >
                    <div className="w-7 h-7 rounded-sm bg-[#E8FF47] flex items-center justify-center text-black text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-3 w-52 bg-[#111111] rounded-sm border border-white/10 overflow-hidden z-50 shadow-[0_16px_48px_rgba(0,0,0,0.8)]"
                      >
                        <div className="p-3 border-b border-white/[0.06]">
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{user.email}</p>
                        </div>
                        <div className="p-1">
                          <Link to="/orders" onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                            <Package size={13} /> My Orders
                          </Link>
                          <Link to="/profile" onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
                            <User size={13} /> Profile
                          </Link>
                          {(user.role === 'admin' || user.role === 'storekeeper') && (
                            <Link to="/dashboard" onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-[#E8FF47] hover:bg-white/5 transition-all font-medium">
                              <LayoutDashboard size={13} /> Dashboard
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setShowUserMenu(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[#FF3131] hover:bg-white/5 transition-all"
                          >
                            <LogOut size={13} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-bold text-black bg-[#E8FF47] hover:bg-[#d4eb30] transition-all shadow-[0_0_20px_rgba(232,255,71,0.2)] hover:shadow-[0_0_28px_rgba(232,255,71,0.35)] tracking-wide"
                >
                  <User size={12} /> LOGIN
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X size={17} /> : <Menu size={17} />}
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
              className="border-t border-white/[0.07] bg-black/95 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto px-4 py-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search sneakers, brands, models..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E8FF47]/50 focus:ring-1 focus:ring-[#E8FF47]/30 transition-all"
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
              className="md:hidden bg-black border-t border-white/[0.07] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-0.5">
                {[
                  { label: 'Shop', to: '/shop' },
                  { label: 'New Drops', to: '/shop?category=new' },
                  { label: 'Featured', to: '/shop?category=featured' },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 rounded-sm transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-sm font-bold text-[#E8FF47] hover:bg-white/5 rounded-sm transition-all"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Dropdown Overlay */}
      {(showLocation || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setShowLocation(false); setShowUserMenu(false); }}
        />
      )}
    </>
  );
};
