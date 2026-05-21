import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, X, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTotal } = useCartStore();
  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-full max-w-md bg-white flex flex-col h-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-violet-600" />
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                {items.length > 0 && (
                  <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                    {items.reduce((t, i) => t + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Delivery Promise Banner */}
            {items.length > 0 && (
              <div className="mx-4 mt-4 px-4 py-3 bg-violet-50 rounded-xl flex items-center gap-2">
                <Zap size={14} className="text-violet-600 fill-violet-600" />
                <span className="text-sm font-semibold text-violet-700">Delivery in 30 mins</span>
                <span className="text-xs text-violet-500 ml-auto">Indiranagar</span>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center py-16"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs">
                    Add some heat to your cart and get them delivered in minutes.
                  </p>
                  <Button onClick={closeCart} variant="primary" size="sm">
                    Browse Sneakers
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide">{item.product.brand}</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">{item.product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">UK {item.size}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(item.product.price)}</p>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-violet-300 transition-all"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-all"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="self-start p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 pb-6 pt-4 border-t border-gray-100 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                      {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-violet-500">
                      Add {formatCurrency(15000 - subtotal)} more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between font-bold text-gray-900 border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                <Link to="/checkout" onClick={closeCart}>
                  <Button variant="primary" fullWidth size="lg">
                    Checkout · {formatCurrency(total)}
                  </Button>
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
