import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Truck,
  RotateCcw,
  Zap,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Link } from 'react-router-dom';
import { mockInventory, mockReturnRequests } from '@/lib/mock';
import { formatCurrency, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  index: number;
}> = ({ title, value, change, icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-[#111111] border border-white/[0.07] rounded-sm p-5 shadow-card hover:border-white/15 transition-all"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono-custom text-neutral-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-white mt-1 font-mono-custom">{value}</p>
        <div className="flex items-center gap-1 mt-1.5 text-xs font-mono-custom font-bold text-emerald-400">
          <TrendingUp size={10} />
          {change}% vs last week
        </div>
      </div>
      <div className="w-10 h-10 rounded-sm bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center flex-shrink-0 text-[#E8FF47]">
        {icon}
      </div>
    </div>
  </motion.div>
);

export const OverviewPage: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, isLoadingOrders, fetchOrders } = useDashboardStore();

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const recentOrders = orders.slice(0, 4);

  // Group real orders dynamically by date for the charts!
  const revenueData = useMemo(() => {
    const dailyData: Record<string, { date: string; revenue: number; orders: number }> = {};
    
    // Default last 11 days (starting 10 days ago to today) with zeros so the chart renders cleanly
    for (let i = 10; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      dailyData[dateStr] = { date: dateStr, revenue: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dateStr = orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (dailyData[dateStr]) {
        dailyData[dateStr].revenue += order.total;
        dailyData[dateStr].orders += 1;
      } else {
        // Fallback for orders older than 11 days
        dailyData[dateStr] = { date: dateStr, revenue: order.total, orders: 1 };
      }
    });

    return Object.values(dailyData);
  }, [orders]);

  const topProducts = useMemo(() => {
    const productsMap = new Map<string, {
      productId: string;
      name: string;
      brand: string;
      revenue: number;
      unitsSold: number;
    }>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productsMap.get(item.productId);
        const itemRevenue = item.price * item.quantity;

        if (existing) {
          existing.unitsSold += item.quantity;
          existing.revenue += itemRevenue;
          return;
        }

        productsMap.set(item.productId, {
          productId: item.productId,
          name: item.product?.name ?? 'Unknown product',
          brand: item.product?.brand ?? 'Unknown brand',
          revenue: itemRevenue,
          unitsSold: item.quantity,
        });
      });
    });

    return [...productsMap.values()]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter((order) =>
      ['placed', 'confirmed', 'packed', 'rider_assigned', 'out_for_delivery'].includes(order.status),
    ).length;

    const todayDate = new Date().toISOString().split('T')[0];
    const deliveredToday = orders.filter((order) =>
      order.status === 'delivered' && order.updatedAt?.startsWith(todayDate),
    ).length;

    const activeCustomers = new Set(orders.map((order) => order.userId)).size;

    // Real-time stock alerts and return requests
    const lowStockItems = mockInventory.filter((inv) => inv.quantity <= inv.lowStockThreshold).length;
    const returnRequests = mockReturnRequests.length;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders,
      deliveredToday,
      activeCustomers,
      lowStockItems,
      returnRequests,
    };
  }, [orders]);

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#0A0A0A] text-white">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-white uppercase">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-neutral-500 text-xs mt-1 font-mono-custom">Operations summary and real-time storefront overview</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#E8FF47]/10 border border-[#E8FF47]/20 rounded-sm">
          <Zap size={12} className="text-[#E8FF47] fill-[#E8FF47]" />
          <span className="text-xs font-bold font-mono-custom text-[#E8FF47] uppercase tracking-wider">{metrics.deliveredToday} delivered today</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} change={0} icon={<TrendingUp size={18} />} index={0} />
        <MetricCard title="Total Orders" value={metrics.totalOrders.toString()} change={0} icon={<ShoppingCart size={18} />} index={1} />
        <MetricCard title="Avg Order Value" value={formatCurrency(metrics.avgOrderValue)} change={0} icon={<Package size={18} />} index={2} />
        <MetricCard title="Active Customers" value={metrics.activeCustomers.toString()} change={0} icon={<Users size={18} />} index={3} />
      </div>

      {/* Dynamic Status / Alert Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Orders', value: metrics.pendingOrders, icon: <ShoppingCart size={14} />, color: 'text-[#E8FF47] bg-[#E8FF47]/5 border-white/10 hover:border-[#E8FF47]/40', path: '/dashboard/orders' },
          { label: 'Delivered Today', value: metrics.deliveredToday, icon: <Truck size={14} />, color: 'text-emerald-400 bg-emerald-950/10 border-white/10 hover:border-emerald-500/40', path: '/dashboard/orders' },
          { label: 'Low Stock Alerts', value: metrics.lowStockItems, icon: <AlertTriangle size={14} />, color: 'text-red-400 bg-red-950/10 border-white/10 hover:border-red-500/40', path: '/dashboard/inventory' },
          { label: 'Return Requests', value: metrics.returnRequests, icon: <RotateCcw size={14} />, color: 'text-violet-400 bg-violet-950/10 border-white/10 hover:border-violet-500/40', path: '/dashboard/returns' },
        ].map((item) => (
          <Link key={item.label} to={item.path}>
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-3 p-3.5 rounded-sm border ${item.color} transition-all cursor-pointer group`}
            >
              <span>{item.icon}</span>
              <div>
                <p className="text-lg font-bold font-mono-custom text-white">{item.value}</p>
                <p className="text-[10px] font-bold font-mono-custom uppercase tracking-wider opacity-60 mt-0.5">{item.label}</p>
              </div>
              <ArrowRight size={12} className="ml-auto opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-white" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#111111] border border-white/[0.07] rounded-sm p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.05]">
            <div>
              <h3 className="font-display text-lg tracking-wider uppercase text-white">Revenue Trend</h3>
              <p className="text-[10px] text-neutral-500 font-mono-custom mt-0.5 uppercase tracking-wide">Dynamic revenue grouped by date</p>
            </div>
            <span className="px-2 py-0.5 bg-[#E8FF47] text-black text-[9px] font-mono-custom font-bold uppercase rounded-sm">Daily</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8FF47" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E8FF47" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#666666', fontFamily: 'Space Mono' }} />
              <YAxis tick={{ fontSize: 9, fill: '#666666', fontFamily: 'Space Mono' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ backgroundColor: '#0D0D0D', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'Space Mono', fontSize: '11px' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#E8FF47"
                strokeWidth={2}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#111111] border border-white/[0.07] rounded-sm p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.05]">
            <h3 className="font-display text-lg tracking-wider uppercase text-white">Top Products</h3>
            <Link to="/dashboard/products" className="text-xs text-[#E8FF47] font-bold font-mono-custom uppercase tracking-wide">View all</Link>
          </div>
          <div className="space-y-4">
            {isLoadingOrders ? (
              <p className="text-xs font-mono-custom text-neutral-500 uppercase">Loading products...</p>
            ) : topProducts.length === 0 ? (
              <p className="text-xs font-mono-custom text-neutral-500 uppercase">No catalog sales logged</p>
            ) : topProducts.map((tp, i) => (
              <div key={tp.productId} className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono-custom text-neutral-700 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-bold font-mono-custom text-[#E8FF47] uppercase tracking-wider">{tp.brand}</p>
                  <p className="text-sm font-bold text-white truncate leading-tight mt-0.5">{tp.name}</p>
                  <div className="mt-2 bg-white/5 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-[#E8FF47]"
                      style={{ width: `${(tp.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-white font-mono-custom">{formatCurrency(tp.revenue)}</p>
                  <p className="text-[9px] text-neutral-500 font-mono-custom mt-0.5">{tp.unitsSold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Orders Bar Chart + Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Orders Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111111] border border-white/[0.07] rounded-sm p-5 shadow-card"
        >
          <h3 className="font-display text-lg tracking-wider uppercase text-white mb-6 pb-2 border-b border-white/[0.05]">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#666666', fontFamily: 'Space Mono' }} />
              <YAxis tick={{ fontSize: 9, fill: '#666666', fontFamily: 'Space Mono' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0D0D0D', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'Space Mono', fontSize: '11px' }}
              />
              <Bar dataKey="orders" fill="#E8FF47" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#111111] border border-white/[0.07] rounded-sm p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.05]">
            <h3 className="font-display text-lg tracking-wider uppercase text-white">Recent Orders</h3>
            <Link to="/dashboard/orders" className="text-xs text-[#E8FF47] font-bold font-mono-custom uppercase tracking-wide">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
                <div className="w-8 h-8 rounded-sm bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center text-[#E8FF47] text-xs font-bold flex-shrink-0">
                  {order.user?.name?.charAt(0).toUpperCase() || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{order.user?.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono-custom mt-0.5">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.store?.area}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider font-mono-custom ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <p className="text-xs font-bold text-white mt-1 font-mono-custom">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
