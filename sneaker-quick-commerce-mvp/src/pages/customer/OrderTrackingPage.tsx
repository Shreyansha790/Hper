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
  { status: 'placed', label: 'Order Placed', icon: <CheckCircle2 size={16} />, desc: 'We have received your order' },
  { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle2 size={16} />, desc: 'Store has accepted your order' },
  { status: 'packed', label: 'Packed & Boxed', icon: <Package size={16} />, desc: 'Your sneakers are packed and ready' },
  { status: 'rider_assigned', label: 'Rider Assigned', icon: <Truck size={16} />, desc: 'Rider is picking up your package' },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={16} />, desc: 'Your rider is speeding to your location' },
  { status: 'delivered', label: 'Delivered', icon: <Home size={16} />, desc: 'Enjoy your fresh sneakers!' },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.status);

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('new') === '1';

  // Find order from mock data (which handles dynamic orders in localStorage)
  const order = mockOrders.find((o) => o.id === orderId);

  // If not found, use a fallback demo state
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
    <div className="min-h-screen-safe bg-[#0A0A0A] text-white pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        
        <Link to="/orders" className="inline-flex items-center gap-2 text-xs font-mono-custom text-neutral-500 hover:text-white transition-colors mb-8 uppercase tracking-wider">
          <ArrowLeft size={12} /> Back to Orders
        </Link>

        {/* Success Banner (for new orders) */}
        {isNew && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-sm text-emerald-400"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="font-display text-lg tracking-wider uppercase text-white">ORDER PLACED SUCCESSFULLY! 🎉</h2>
                <p className="text-xs font-mono-custom text-neutral-400 mt-0.5">We've received your request and it's being prepped.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Details Header */}
        <div className="card-dark p-5 mb-4">
          <div className="flex items-start justify-between pb-3 border-b border-white/[0.06] mb-4">
            <div>
              <p className="text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider">Tracking Order ID</p>
              <p className="font-bold text-white text-base font-mono-custom">{activeOrder.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider">Estimated Delivery</p>
              <div className="flex items-center gap-1.5 justify-end mt-0.5">
                <Zap size={11} className="text-[#E8FF47] fill-[#E8FF47]" />
                <p className="font-bold text-[#E8FF47] font-mono-custom">
                  {activeOrder.estimatedDelivery
                    ? new Date(activeOrder.estimatedDelivery).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
                    : '~25 MINS'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Status Banner */}
          <div className="p-3 bg-[#E8FF47]/10 border border-[#E8FF47]/20 rounded-sm flex items-center gap-2 text-xs font-mono-custom">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF47] animate-pulse" />
            <span className="font-bold text-[#E8FF47] uppercase tracking-wider">
              Status: {getOrderStatusLabel(activeOrder.status)}
            </span>
            <span className="ml-auto text-[9px] text-neutral-500 uppercase tracking-widest">Live Updates</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="card-dark p-6 mb-4">
          <h3 className="font-display text-lg tracking-wider uppercase text-white mb-6">Order Timeline</h3>
          
          <div className="space-y-0 pl-1">
            {STATUS_STEPS.map((step, i) => {
              const isCompleted = i <= currentStatusIndex;
              const isCurrent = i === currentStatusIndex;
              const isLast = i === STATUS_STEPS.length - 1;
              const timelineEntry = activeOrder.timeline?.find((t) => t.status === step.status);

              return (
                <div key={step.status} className="flex gap-4">
                  {/* Icon column */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isCurrent ? { scale: [0.95, 1.05, 0.95] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 border transition-all ${
                        isCompleted
                          ? isCurrent
                            ? 'bg-[#E8FF47] border-[#E8FF47] text-black shadow-glow-sm'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-transparent border-white/10 text-neutral-700'
                      }`}
                    >
                      {step.icon}
                    </motion.div>
                    {!isLast && (
                      <div className={`w-px h-10 my-1 ${i < currentStatusIndex ? 'bg-emerald-500/30' : 'bg-white/5'}`} />
                    )}
                  </div>

                  {/* Content column */}
                  <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold uppercase tracking-wider font-mono-custom ${isCompleted ? (isCurrent ? 'text-[#E8FF47]' : 'text-white') : 'text-neutral-600'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 bg-[#E8FF47]/10 text-[#E8FF47] text-[8px] font-bold font-mono-custom rounded-sm tracking-wider uppercase">
                          Live
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isCompleted ? 'text-neutral-400' : 'text-neutral-700'}`}>{step.desc}</p>
                    {timelineEntry && (
                      <p className="text-[9px] text-neutral-600 mt-1 flex items-center gap-1 font-mono-custom">
                        <Clock size={10} />
                        {formatDate(timelineEntry.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rider Info Card */}
        {(activeOrder.status === 'out_for_delivery' || activeOrder.status === 'rider_assigned') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-dark p-5 mb-4"
          >
            <h3 className="font-display text-lg tracking-wider uppercase text-white mb-4">Your Rider</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-sm bg-[#E8FF47]/10 border border-[#E8FF47]/30 flex items-center justify-center text-[#E8FF47] font-display text-xl">
                {(activeOrder.riderName || 'R').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{activeOrder.riderName || 'Rider'}</p>
                <p className="text-[10px] text-neutral-500 font-mono-custom uppercase mt-0.5">KicksFly Express Delivery Partner</p>
              </div>
              <a
                href="tel:+919999999999"
                className="ml-auto px-4 py-2 rounded-sm border border-white/10 text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono-custom hover:border-white/20 hover:text-white transition-all flex items-center gap-2"
              >
                <Phone size={12} /> Call Rider
              </a>
            </div>
          </motion.div>
        )}

        {/* Delivery Address Card */}
        {order?.address && (
          <div className="card-dark p-5 mb-4">
            <h3 className="font-display text-lg tracking-wider uppercase text-white mb-3">Delivery Address</h3>
            <div className="flex items-start gap-3">
              <MapPin size={15} className="text-[#E8FF47] mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white uppercase tracking-wide">{order.address.label}</p>
                <p className="text-neutral-400 mt-1">{order.address.line1}</p>
                <p className="text-neutral-400">{order.address.area}, {order.address.city} — {order.address.pincode}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Items Card */}
        {order?.items && order.items.length > 0 && (
          <div className="card-dark p-5 mb-4">
            <h3 className="font-display text-lg tracking-wider uppercase text-white mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-14 h-14 rounded-sm overflow-hidden bg-[#161616] border border-white/10 flex-shrink-0">
                    <img src={item.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-mono-custom text-[#E8FF47] uppercase tracking-wider">{item.product?.brand}</p>
                    <p className="text-sm font-bold text-white truncate">{item.product?.name}</p>
                    <p className="text-xs text-neutral-500 font-mono-custom mt-0.5">UK {item.size} · Qty {item.quantity}</p>
                  </div>
                  <p className="font-bold text-xs text-white font-mono-custom">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/[0.07] pt-4 mt-4 flex justify-between items-center text-sm font-mono-custom">
              <span className="text-neutral-500 font-bold uppercase tracking-wider text-xs">Total Amount</span>
              <span className="text-[#E8FF47] font-bold text-lg">{formatCurrency(order.total)}</span>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex gap-3 mt-8">
          <Link to="/shop" className="flex-1 py-3 bg-[#111111] border border-white/10 rounded-sm text-xs font-bold text-neutral-300 uppercase tracking-widest text-center hover:border-white/20 hover:text-white transition-all font-mono-custom">
            Continue Shopping
          </Link>
          {order?.status === 'delivered' && (
            <Link to="/returns" className="flex-1 py-3 bg-red-950/10 border border-red-500/20 rounded-sm text-xs font-bold text-red-400 uppercase tracking-widest text-center hover:border-red-500/40 hover:text-white transition-all font-mono-custom">
              Request Return
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
