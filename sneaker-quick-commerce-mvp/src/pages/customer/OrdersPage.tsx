import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Zap } from 'lucide-react';
import { mockOrders } from '@/lib/mock';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

export const OrdersPage: React.FC = () => {
  const { user } = useAuthStore();

  const orders = user
    ? mockOrders.filter((o) => o.userId === user.id || user.role === 'admin')
    : mockOrders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">Your order history will appear here</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-bold text-sm">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/order-tracking/${order.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-card p-5 hover:border-violet-200 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-black text-gray-900 text-sm">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-500 transition-colors" />
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">{formatDate(order.createdAt)}</p>
                      <p className="font-black text-gray-900 mt-0.5">{formatCurrency(order.total)}</p>
                    </div>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <div className="flex items-center gap-1 text-xs text-violet-600 font-semibold">
                        <Zap size={10} className="fill-violet-600" />
                        Track Order
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
