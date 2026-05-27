import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Eye,
  Package,
  X,
} from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus | null> = {
  placed: 'confirmed',
  confirmed: 'packed',
  packed: 'rider_assigned',
  rider_assigned: 'out_for_delivery',
  out_for_delivery: 'delivered',
  delivered: null,
  cancelled: null,
  return_requested: 'returned',
  returned: null,
};


const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'Pending', value: 'placed' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Packed', value: 'packed' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
];

export const OrdersManagementPage: React.FC = () => {
  const { orders, isLoadingOrders, fetchOrders, updateOrderStatus, openOrderDrawer, closeOrderDrawer, selectedOrder, isOrderDrawerOpen } = useDashboardStore();
  const { user } = useAuthStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesStore = isAdmin || order.storeId === user?.assignedStoreId;
    const matchesSearch = !search || order.id.toLowerCase().includes(search.toLowerCase()) || order.user?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesStore && matchesSearch;
  });

  const getNextStatusLabel = (status: OrderStatus): string => {
    const next = STATUS_TRANSITIONS[status];
    if (!next) return '';
    return getOrderStatusLabel(next);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm">{filteredOrders.length} orders {isAdmin ? 'across all stores' : 'in your store'}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filterStatus === tab.value ? 'gradient-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
          >
            {tab.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-black ${filterStatus === tab.value ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
              {tab.value === 'all' ? orders.length : orders.filter((o) => o.status === tab.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID or customer name..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Order</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Items</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Total</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-black text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order.store?.area}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                          {order.user?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order.user?.name || 'Customer'}</p>
                          <p className="text-xs text-gray-500">{order.paymentMethod.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex gap-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 border border-gray-100">
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            +{order.items.length - 2}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm font-black text-gray-900">{formatCurrency(order.total)}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {STATUS_TRANSITIONS[order.status] && (
                          <button
                            onClick={async () => { await updateOrderStatus(order.id, STATUS_TRANSITIONS[order.status]!); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold gradient-primary text-white hover:opacity-90 transition-all"
                          >
                            → {getNextStatusLabel(order.status)}
                          </button>
                        )}
                        <button
                          onClick={() => openOrderDrawer(order)}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                        >
                          <Eye size={14} className="text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>



          {isLoadingOrders && (
            <div className="text-center py-6 text-sm text-gray-500">Loading live orders...</div>
          )}

          {filteredOrders.length === 0 && !isLoadingOrders && (
            <div className="text-center py-16">
              <Package size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="font-bold text-gray-900">No orders found</p>
              <p className="text-sm text-gray-500">Try changing your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Drawer */}
      <AnimatePresence>
        {isOrderDrawerOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/40 backdrop-blur-sm"
              onClick={closeOrderDrawer}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div>
                  <h2 className="font-black text-gray-900">Order Details</h2>
                  <p className="text-xs text-gray-500">{selectedOrder.id}</p>
                </div>
                <button onClick={closeOrderDrawer} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Status */}
                <div className="p-4 bg-violet-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-900">Current Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getOrderStatusColor(selectedOrder.status)}`}>
                      {getOrderStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  {STATUS_TRANSITIONS[selectedOrder.status] && (
                    <button
                      onClick={async () => {
                        await updateOrderStatus(selectedOrder.id, STATUS_TRANSITIONS[selectedOrder.status]!);
                      }}
                      className="w-full py-2.5 rounded-xl gradient-primary text-white text-sm font-bold hover:opacity-90 transition-all"
                    >
                      Mark as {getOrderStatusLabel(STATUS_TRANSITIONS[selectedOrder.status]!)} →
                    </button>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Customer</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-black">
                      {selectedOrder.user?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{selectedOrder.user?.name}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.user?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Items ({selectedOrder.items.length})</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0">
                          <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-violet-500">{item.product.brand}</p>
                          <p className="text-sm font-bold text-gray-900">{item.product.name}</p>
                          <p className="text-xs text-gray-500">UK {item.size} · SKU: {item.product.sizes.find(s => s.size === item.size)?.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-gray-900">{formatCurrency(item.price)}</p>
                          <p className="text-xs text-gray-500">×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Delivery Address</p>
                  <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                    <p className="font-semibold">{selectedOrder.address.label}</p>
                    <p>{selectedOrder.address.line1}</p>
                    <p>{selectedOrder.address.area}, {selectedOrder.address.city} — {selectedOrder.address.pincode}</p>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Payment</p>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900 capitalize">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod.toUpperCase()}</p>
                      <p className={`text-xs ${selectedOrder.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'} font-semibold`}>
                        {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                    <p className="font-black text-gray-900">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Timeline</p>
                  <div className="space-y-2">
                    {selectedOrder.timeline.map((entry) => (
                      <div key={entry.status} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                        <span className="font-semibold text-gray-900">{getOrderStatusLabel(entry.status)}</span>
                        <span className="text-xs text-gray-400 ml-auto">{formatDate(entry.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
