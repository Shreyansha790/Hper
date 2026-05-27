import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Zap } from 'lucide-react';
import { mockOrders } from '@/lib/mock';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();

  // Filter orders for active user (or all if admin)
  const orders = user
    ? mockOrders.filter((o) => o.userId === user.id || user.role === 'admin')
    : mockOrders.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="mb-8">
          <p className="text-[10px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.2em] mb-1">Purchase history</p>
          <h1 className="font-display text-[44px] leading-none tracking-wide text-white uppercase">MY ORDERS</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center card-dark py-20 px-4">
            <Package size={48} className="text-neutral-700 mx-auto mb-4" />
            <h3 className="font-display text-2xl tracking-wide uppercase text-white">NO ORDERS YET</h3>
            <p className="text-neutral-500 text-xs mt-2 mb-8 font-mono-custom">Your premium sneaker order history will appear here.</p>
            <Link to="/shop" className="inline-block px-8 py-3.5 bg-[#E8FF47] text-black font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#d4eb30] transition-colors shadow-glow-sm">
              SHOP HEAT
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/track-order/${order.id}`}
                  className="block bg-[#111111] border border-white/[0.07] rounded-sm p-5 hover:border-[#E8FF47]/40 hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4 pb-3 border-b border-white/[0.06]">
                    <div>
                      <p className="text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider">Order ID</p>
                      <p className="font-bold text-white text-sm font-mono-custom">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider font-mono-custom ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <ChevronRight size={16} className="text-neutral-600 group-hover:text-[#E8FF47] transition-colors" />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="w-14 h-14 rounded-sm overflow-hidden bg-[#161616] border border-white/10 flex-shrink-0">
                        <img src={item.product?.images?.[0] || item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-14 h-14 rounded-sm bg-neutral-900 border border-white/10 flex items-center justify-center text-xs font-bold text-neutral-400 font-mono-custom">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-neutral-500 font-mono-custom">{formatDate(order.createdAt)}</p>
                      <p className="font-bold text-[#E8FF47] text-sm mt-0.5 font-mono-custom">{formatCurrency(order.total)}</p>
                    </div>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="flex items-center gap-1.5 text-xs text-[#E8FF47] font-bold uppercase tracking-wider font-mono-custom">
                        <Zap size={11} className="fill-[#E8FF47] text-[#E8FF47] animate-pulse" />
                        Track Live Order
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
