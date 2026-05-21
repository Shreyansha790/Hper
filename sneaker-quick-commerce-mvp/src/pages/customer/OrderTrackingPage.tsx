import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  MapPin,
  Phone,
  Clock,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { mockOrders } from '@/lib/mock';
import { formatCurrency, formatDate, getOrderStatusLabel } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', icon: <CheckCircle2 size={18} />, desc: 'Your order has been received' },
  { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 size={18} />, desc: 'Store confirmed your order' },
  { status: 'packed', label: 'Packed', icon: <Package size={18} />, desc: 'Your sneakers are packed and ready' },
  { status: 'rider_assigned', label: 'Rider Assigned', icon: <Truck size={18} />, desc: 'A rider is on the way to pick up' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={18} />, desc: 'Your rider is on the way' },
  { status: 'delivered', label: 'Delivered', icon: <Home size={18} />, desc: 'Successfully delivered!' },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.status);

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === '1';

  // Try to find order from mock data, otherwise create a demo state
  const order = mockOrders.find((o) => o.id === orderId);

  const demoOrder = {
    id: orderId || 'ORD-DEMO',
    status: 'confirmed' as OrderStatus,
    timeline: [
      { status: 'placed' as OrderStatus, timestamp: new Date(Date.now() - 120000).toISOString() },
      { status: 'confirmed' as OrderStatus, timestamp: new Date(Date.now() - 60000).toISOString() },
    ],
    items: [],
    subtotal: 16999,
    deliveryFee: 0,
    total: 16999,
    estimatedDelivery: new Date(Date.now() + 25 * 60000).toISOString(),
    riderName: 'Anil Kumar',
  };

  const activeOrder = order || demoOrder;
  const currentStatusIndex = STATUS_ORDER.indexOf(activeOrder.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Orders
        </Link>

        {/* Success Banner (for new orders) */}
        {isNew && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="font-black text-emerald-900 text-lg">Order Placed! 🎉</h2>
                <p className="text-sm text-emerald-700">We've received your order and it's being processed.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order ID + ETA */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Order ID</p>
              <p className="font-black text-gray-900 text-lg">{activeOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium">Estimated Delivery</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap size={12} className="text-violet-600 fill-violet-600" />
                <p className="font-black text-violet-700">
                  {activeOrder.estimatedDelivery
                    ? new Date(activeOrder.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    : '~30 mins'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Status Badge */}
          <div className="mt-4 p-3 rounded-xl bg-violet-50 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <p className="text-sm font-bold text-violet-700">{getOrderStatusLabel(activeOrder.status)}</p>
            <span className="ml-auto text-xs text-violet-500">Live Update</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
          <h3 className="font-bold text-gray-900 mb-5">Order Timeline</h3>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const isCompleted = i <= currentStatusIndex;
              const isCurrent = i === currentStatusIndex;
              const isLast = i === STATUS_STEPS.length - 1;
              const timelineEntry = activeOrder.timeline.find((t) => t.status === step.status);

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Icon Column */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={isCurrent ? { scale: 0.8 } : {}}
                      animate={isCurrent ? { scale: [0.8, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200'
                            : 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}
                    >
                      {step.icon}
                    </motion.div>
                    {!isLast && (
                      <div className={`w-0.5 h-10 mt-1 rounded-full ${i < currentStatusIndex ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm ${isCompleted ? (isCurrent ? 'text-violet-700' : 'text-gray-900') : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="px-2 py-0.5 bg-violet-100 text-violet-600 text-[10px] font-bold rounded-full animate-pulse">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                    {timelineEntry && (
                      <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        <Clock size={8} />
                        {formatDate(timelineEntry.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rider Info */}
        {(activeOrder.status === 'out_for_delivery' || activeOrder.status === 'rider_assigned') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4"
          >
            <h3 className="font-bold text-gray-900 mb-4">Your Rider</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white font-black text-lg">
                {(activeOrder.riderName || 'R').charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{activeOrder.riderName || 'Rider'}</p>
                <p className="text-sm text-gray-500">KicksFly Express Rider</p>
              </div>
              <a
                href="tel:+919999999999"
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Phone size={14} /> Call
              </a>
            </div>
          </motion.div>
        )}

        {/* Delivery Address */}
        {order?.address && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Delivery Address</h3>
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-violet-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{order.address.label}</p>
                <p className="text-sm text-gray-600">{order.address.line1}</p>
                <p className="text-sm text-gray-600">{order.address.area}, {order.address.city} — {order.address.pincode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items */}
        {order?.items && order.items.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-violet-500">{item.product.brand}</p>
                    <p className="text-sm font-bold text-gray-900">{item.product.name}</p>
                    <p className="text-xs text-gray-500">UK {item.size} · Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm text-gray-900">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between font-black text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link to="/shop" className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 text-center hover:bg-gray-50 transition-all">
            Continue Shopping
          </Link>
          {order?.status === 'delivered' && (
            <Link to="/returns" className="flex-1 py-3 rounded-xl border border-red-200 text-sm font-bold text-red-500 text-center hover:bg-red-50 transition-all">
              Request Return
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
