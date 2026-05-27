import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="flex-1 bg-black/70 backdrop-blur-sm"
            aria-label="Close cart"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="w-full max-w-md h-full bg-[#0D0D0D] border-l border-white/[0.07] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-[#E8FF47] rounded-sm flex items-center justify-center">
                  <ShoppingBag size={12} className="text-black" />
                </div>
                <h2 className="font-display text-xl text-white tracking-wide">YOUR CART</h2>
                {items.length > 0 && (
                  <span className="text-xs font-mono-custom text-neutral-500">({items.length})</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="px-2.5 py-1.5 rounded-sm text-[10px] font-bold text-[#FF3131] hover:bg-[#FF3131]/10 tracking-wider transition-all uppercase"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 rounded-sm hover:bg-white/5 text-neutral-500 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 rounded-sm bg-white/5 flex items-center justify-center">
                    <ShoppingBag className="text-neutral-600" size={28} />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-neutral-600 tracking-wide">CART IS EMPTY</p>
                    <p className="text-xs text-neutral-600 mt-1 font-mono-custom">Add some heat to get started</p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-6 py-2.5 text-xs font-bold text-black bg-[#E8FF47] rounded-sm hover:bg-[#d4eb30] transition-all tracking-wider"
                  >
                    SHOP NOW
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 p-3 bg-[#111111] border border-white/[0.07] rounded-sm hover:border-white/15 transition-colors"
                  >
                    <div className="relative w-16 h-16 bg-[#1A1A1A] rounded-sm overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.sneakerName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.sneakerName}</p>
                      <p className="text-[10px] text-[#E8FF47] mt-0.5 font-mono-custom">UK {item.selectedSize}</p>
                      <p className="text-sm font-bold text-white mt-1 font-mono-custom">
                        {formatCurrency(item.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-sm border border-white/15 flex items-center justify-center text-neutral-400 hover:border-white/40 hover:text-white transition-all"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white font-mono-custom">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-sm bg-[#E8FF47] text-black flex items-center justify-center hover:bg-[#d4eb30] transition-all"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-600 hover:text-[#FF3131] p-1 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-white/[0.07] bg-[#0D0D0D]">
                {/* Delivery note */}
                <div className="flex items-center gap-2 mb-3 px-3 py-2.5 bg-[#E8FF47]/8 border border-[#E8FF47]/20 rounded-sm">
                  <Zap size={11} className="text-[#E8FF47] fill-[#E8FF47] flex-shrink-0" />
                  <span className="text-[10px] font-semibold text-[#E8FF47] tracking-wide">
                    ~25 MIN EXPRESS DELIVERY · {subtotal >= 15000 ? 'FREE DELIVERY UNLOCKED 🎉' : `₹${(15000 - subtotal).toLocaleString('en-IN')} away from free delivery`}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Subtotal</span>
                  <span className="text-lg font-bold text-white font-mono-custom">{formatCurrency(subtotal)}</span>
                </div>
                <Link to="/checkout" onClick={closeCart}>
                  <button className="w-full py-3.5 text-sm font-bold text-black bg-[#E8FF47] rounded-sm hover:bg-[#d4eb30] transition-all shadow-[0_0_24px_rgba(232,255,71,0.25)] hover:shadow-[0_0_36px_rgba(232,255,71,0.4)] tracking-widest uppercase">
                    Checkout → {formatCurrency(subtotal)}
                  </button>
                </Link>
                <p className="text-center text-[10px] text-neutral-600 mt-2 font-mono-custom">
                  Pay on delivery available · No hidden charges
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
