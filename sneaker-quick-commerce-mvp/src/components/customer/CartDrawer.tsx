import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="flex-1 bg-black/30 backdrop-blur-sm"
            aria-label="Close cart"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="w-full max-w-md h-full bg-white border-l border-violet-100 shadow-[0_18px_60px_rgba(76,29,149,0.15)] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-violet-100">
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Clear Cart
                  </button>
                )}
                <button onClick={closeCart} className="p-2 rounded-xl hover:bg-violet-50 text-gray-500">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="text-violet-300 mb-3" size={34} />
                  <p className="font-semibold text-gray-800">Your cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white border border-violet-100 shadow-sm p-3 flex gap-3">
                    <img src={item.imageUrl} alt={item.sneakerName} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 truncate">{item.sneakerName}</p>
                      <p className="text-xs text-violet-600 mt-0.5">Size UK {item.selectedSize}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(item.price)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-violet-200 flex items-center justify-center">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-violet-100 bg-violet-50/40">
                <div className="flex justify-between font-semibold text-gray-800 mb-3">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <Link to="/checkout" onClick={closeCart}>
                  <Button fullWidth size="lg">Proceed to Checkout</Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
