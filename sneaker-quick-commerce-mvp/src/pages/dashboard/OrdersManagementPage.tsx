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
    // Admin sees all; storekeeper sees their store OR all if no assignedStoreId
    const matchesStore = isAdmin || !user?.assignedStoreId || order.storeId === user.assignedStoreId;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search
      || order.id.toLowerCase().includes(searchLower)
      || order.user?.name?.toLowerCase().includes(searchLower)
      || order.address?.city?.toLowerCase().includes(searchLower);
    return matchesStatus && matchesStore && matchesSearch;
  });

  const getNextStatusLabel = (status: OrderStatus): string => {
    const next = STATUS_TRANSITIONS[status];
    if (!next) return '';
    return getOrderStatusLabel(next);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#0A0A0A] text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-white uppercase">Orders</h1>
          <p className="text-neutral-500 text-xs mt-1 font-mono-custom uppercase tracking-wider">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} {isAdmin ? 'across all stores' : 'in your store'}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTER_TABS.map((tab) => {
          const isActive = filterStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-sm text-[10px] font-mono-custom font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-[#E8FF47] text-black shadow-glow-sm border border-[#E8FF47]'
                  : 'bg-white/5 border border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-1.5 py-0.5 rounded-sm text-[9px] font-bold font-mono-custom ${isActive ? 'bg-black/10 text-black' : 'bg-white/5 text-neutral-500'}`}>
                {tab.value === 'all' ? orders.length : orders.filter((o) => o.status === tab.value).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH BY ORDER ID OR CUSTOMER NAME..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-white/[0.07] text-white rounded-sm text-xs focus:outline-none focus:border-[#E8FF47] focus:ring-1 focus:ring-[#E8FF47] font-mono-custom placeholder-neutral-500 uppercase tracking-wider"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-[#111111] border border-white/[0.07] rounded-sm shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">Customer</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Items</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Total</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-right text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider">Actions</th>
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
                    className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-white font-mono-custom">{order.id}</p>
                      <p className="text-[10px] text-neutral-500 font-mono-custom mt-0.5 uppercase tracking-wider">{order.store?.area}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-sm bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center text-[#E8FF47] text-xs font-bold flex-shrink-0">
                          {order.user?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">{order.user?.name || 'Customer'}</p>
                          <p className="text-[9px] text-neutral-500 font-mono-custom mt-0.5 tracking-wider">{order.paymentMethod.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex gap-1">
                        {order.items.slice(0, 2).map((item) => (
                          <div key={item.id} className="w-9 h-9 rounded-sm overflow-hidden bg-white/[0.02] border border-white/[0.07] flex-shrink-0">
                            {item.product?.images?.[0] ? (
                              <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] font-mono-custom text-neutral-600">IMG</div>
                            )}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="w-9 h-9 rounded-sm bg-white/5 flex items-center justify-center text-[9px] font-mono-custom font-bold text-neutral-400">
                            +{order.items.length - 2}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider font-mono-custom ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm font-bold text-white font-mono-custom">{formatCurrency(order.total)}</p>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-xs font-mono-custom text-neutral-400">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {STATUS_TRANSITIONS[order.status] && (
                          <button
                            onClick={async () => { await updateOrderStatus(order.id, STATUS_TRANSITIONS[order.status]!); }}
                            className="px-2.5 py-1.5 rounded-sm text-[9px] font-bold font-mono-custom uppercase tracking-wider bg-[#E8FF47] text-black hover:bg-[#d4eb30] transition-all"
                          >
                            → {getNextStatusLabel(order.status)}
                          </button>
                        )}
                        <button
                          onClick={() => openOrderDrawer(order)}
                          className="p-1.5 rounded-sm border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {isLoadingOrders && (
            <div className="text-center py-6 text-xs font-mono-custom text-neutral-500 uppercase tracking-wider">Loading live orders...</div>
          )}

          {filteredOrders.length === 0 && !isLoadingOrders && (
            <div className="text-center py-16">
              <Package size={40} className="text-neutral-700 mx-auto mb-3" />
              <p className="font-bold text-white font-mono-custom uppercase tracking-wider text-sm">No orders found</p>
              <p className="text-xs text-neutral-500 font-mono-custom uppercase tracking-wide mt-1">Try changing your filters</p>
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
              className="flex-1 bg-black/80 backdrop-blur-sm"
              onClick={closeOrderDrawer}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full max-w-lg bg-[#0D0D0D] border-l border-white/[0.07] h-full flex flex-col shadow-2xl overflow-y-auto text-white"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/[0.07] sticky top-0 bg-[#0D0D0D] z-10">
                <div>
                  <h2 className="font-display text-xl tracking-wider text-white uppercase">Order Details</h2>
                  <p className="text-[10px] text-neutral-500 font-mono-custom uppercase tracking-wider mt-0.5">{selectedOrder.id}</p>
                </div>
                <button onClick={closeOrderDrawer} className="p-2 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Status */}
                <div className="p-4 bg-[#E8FF47]/5 border border-[#E8FF47]/20 rounded-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono-custom font-bold text-white uppercase tracking-wider">Current Status</p>
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider font-mono-custom ${getOrderStatusColor(selectedOrder.status)}`}>
                      {getOrderStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                  {STATUS_TRANSITIONS[selectedOrder.status] && (
                    <button
                      onClick={async () => {
                        await updateOrderStatus(selectedOrder.id, STATUS_TRANSITIONS[selectedOrder.status]!);
                      }}
                      className="w-full py-2.5 rounded-sm bg-[#E8FF47] text-black text-xs font-mono-custom font-bold uppercase tracking-wider hover:bg-[#d4eb30] transition-all"
                    >
                      Mark as {getOrderStatusLabel(STATUS_TRANSITIONS[selectedOrder.status]!)} →
                    </button>
                  )}
                </div>

                {/* Customer */}
                <div>
                  <p className="text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider mb-2">Customer</p>
                  <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.07] rounded-sm">
                    <div className="w-10 h-10 rounded-sm bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center text-[#E8FF47] font-bold font-mono-custom text-sm flex-shrink-0">
                      {selectedOrder.user?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider">{selectedOrder.user?.name}</p>
                      <p className="text-[10px] text-neutral-500 font-mono-custom mt-0.5">{selectedOrder.user?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider mb-2">Items ({selectedOrder.items.length})</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-white/[0.02] border border-white/[0.07] rounded-sm">
                        <div className="w-14 h-14 rounded-sm overflow-hidden bg-white/[0.02] border border-white/[0.07] flex-shrink-0">
                          {item.product?.images?.[0] ? (
                            <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] font-mono-custom text-neutral-600 uppercase">No Img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold text-[#E8FF47] uppercase tracking-wider">{item.product?.brand ?? '—'}</p>
                          <p className="text-xs font-bold text-white uppercase leading-tight mt-0.5">{item.product?.name ?? 'Unknown Product'}</p>
                          <p className="text-[9px] text-neutral-500 font-mono-custom mt-1 uppercase">UK {item.size} · QTY: {item.quantity}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-white font-mono-custom">{formatCurrency(item.price)}</p>
                          <p className="text-[10px] text-neutral-500 font-mono-custom mt-0.5">×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider mb-2">Delivery Address</p>
                  <div className="p-3 bg-white/[0.02] border border-white/[0.07] rounded-sm text-xs text-neutral-300 space-y-1">
                    <p className="font-bold text-white uppercase tracking-wider">{selectedOrder.address.label}</p>
                    <p className="text-neutral-400">{selectedOrder.address.line1}</p>
                    <p className="text-neutral-400">{selectedOrder.address.area}, {selectedOrder.address.city} — {selectedOrder.address.pincode}</p>
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider mb-2">Payment</p>
                  <div className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.07] rounded-sm">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider capitalize">{selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : selectedOrder.paymentMethod.toUpperCase()}</p>
                      <p className={`text-[10px] font-mono-custom font-bold mt-0.5 uppercase ${selectedOrder.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </p>
                    </div>
                    <p className="font-bold text-white font-mono-custom text-sm">{formatCurrency(selectedOrder.total)}</p>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider mb-2">Timeline</p>
                  <div className="space-y-3 bg-white/[0.02] border border-white/[0.07] rounded-sm p-3">
                    {selectedOrder.timeline.map((entry) => (
                      <div key={entry.status} className="flex items-center gap-3 text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E8FF47] flex-shrink-0 shadow-[0_0_8px_rgba(232,255,71,0.5)]" />
                        <span className="font-bold text-white uppercase tracking-wider">{getOrderStatusLabel(entry.status)}</span>
                        <span className="text-[9px] text-neutral-500 font-mono-custom ml-auto">{formatDate(entry.timestamp)}</span>
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
