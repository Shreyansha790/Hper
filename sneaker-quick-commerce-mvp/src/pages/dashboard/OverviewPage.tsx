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
import { mockAnalytics, mockRevenueData } from '@/lib/mock';
import { formatCurrency, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useDashboardStore } from '@/store/dashboardStore';

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  index: number;
}> = ({ title, value, change, icon, color, bg, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl border border-gray-100 shadow-card p-5"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        <div className={`flex items-center gap-1 mt-1.5 text-sm font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <TrendingUp size={12} className={change < 0 ? 'rotate-180' : ''} />
          {Math.abs(change)}% vs last week
        </div>
      </div>
      <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0 ${color}`}>
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

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      pendingOrders,
      deliveredToday,
      activeCustomers,
    };
  }, [orders]);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening with KicksFly today.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-xl border border-violet-100">
          <Zap size={14} className="text-violet-600 fill-violet-600" />
          <span className="text-sm font-bold text-violet-700">{metrics.deliveredToday} delivered today</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Revenue" value={formatCurrency(metrics.totalRevenue)} change={0} icon={<TrendingUp size={20} />} color="text-violet-600" bg="bg-violet-100" index={0} />
        <MetricCard title="Total Orders" value={metrics.totalOrders.toString()} change={0} icon={<ShoppingCart size={20} />} color="text-blue-600" bg="bg-blue-100" index={1} />
        <MetricCard title="Avg Order Value" value={formatCurrency(metrics.avgOrderValue)} change={0} icon={<Package size={20} />} color="text-emerald-600" bg="bg-emerald-100" index={2} />
        <MetricCard title="Active Customers" value={metrics.activeCustomers.toString()} change={0} icon={<Users size={20} />} color="text-orange-600" bg="bg-orange-100" index={3} />
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Orders', value: metrics.pendingOrders, icon: <ShoppingCart size={16} />, color: 'text-amber-600 bg-amber-50 border-amber-200', path: '/dashboard/orders' },
          { label: 'Delivered Today', value: metrics.deliveredToday, icon: <Truck size={16} />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', path: '/dashboard/orders' },
          { label: 'Low Stock Alerts', value: mockAnalytics.lowStockItems, icon: <AlertTriangle size={16} />, color: 'text-red-500 bg-red-50 border-red-200', path: '/dashboard/inventory' },
          { label: 'Return Requests', value: mockAnalytics.returnRequests, icon: <RotateCcw size={16} />, color: 'text-violet-600 bg-violet-50 border-violet-200', path: '/dashboard/returns' },
        ].map((item) => (
          <Link key={item.label} to={item.path}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-3 p-3 rounded-xl border ${item.color} hover:shadow-md transition-all cursor-pointer`}
            >
              <span>{item.icon}</span>
              <div>
                <p className="text-lg font-black">{item.value}</p>
                <p className="text-xs font-semibold opacity-75">{item.label}</p>
              </div>
              <ArrowRight size={12} className="ml-auto opacity-50" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black text-gray-900">Revenue Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Last 11 days performance</p>
            </div>
            <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">Daily</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockRevenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-gray-900">Top Products</h3>
            <Link to="/dashboard/products" className="text-xs text-violet-600 font-semibold">View all</Link>
          </div>
          <div className="space-y-4">
            {isLoadingOrders ? (
              <p className="text-sm text-gray-500">Loading live products...</p>
            ) : topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No product sales yet.</p>
            ) : topProducts.map((tp, i) => (
              <div key={tp.productId} className="flex items-center gap-3">
                <span className="text-sm font-black text-gray-300 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-500 uppercase">{tp.brand}</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{tp.name}</p>
                  <div className="mt-1 bg-gray-100 rounded-full h-1">
                    <div
                      className="h-1 rounded-full gradient-primary"
                      style={{ width: `${(tp.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-black text-gray-900">{formatCurrency(tp.revenue)}</p>
                  <p className="text-[10px] text-gray-400">{tp.unitsSold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Orders Chart + Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-card p-5"
        >
          <h3 className="font-black text-gray-900 mb-5">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Recent Orders</h3>
            <Link to="/dashboard/orders" className="text-xs text-violet-600 font-semibold">View all</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {order.user?.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{order.user?.name}</p>
                  <p className="text-xs text-gray-500">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {order.store?.area}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusLabel(order.status)}
                  </span>
                  <p className="text-xs font-black text-gray-900 mt-0.5">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
