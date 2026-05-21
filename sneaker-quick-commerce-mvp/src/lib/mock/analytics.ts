import type { AnalyticsMetrics, RevenueDataPoint, TopProduct } from '@/types';

export const mockAnalytics: AnalyticsMetrics = {
  totalRevenue: 847600,
  revenueGrowth: 23.4,
  totalOrders: 342,
  ordersGrowth: 18.7,
  avgOrderValue: 24783,
  aovGrowth: 4.2,
  activeCustomers: 189,
  customersGrowth: 31.5,
  pendingOrders: 12,
  deliveredToday: 38,
  lowStockItems: 5,
  returnRequests: 3,
};

export const mockRevenueData: RevenueDataPoint[] = [
  { date: 'Apr 1', revenue: 24500, orders: 11 },
  { date: 'Apr 2', revenue: 31200, orders: 14 },
  { date: 'Apr 3', revenue: 18900, orders: 8 },
  { date: 'Apr 4', revenue: 42100, orders: 19 },
  { date: 'Apr 5', revenue: 28700, orders: 13 },
  { date: 'Apr 6', revenue: 55300, orders: 24 },
  { date: 'Apr 7', revenue: 39800, orders: 17 },
  { date: 'Apr 8', revenue: 47200, orders: 21 },
  { date: 'Apr 9', revenue: 33600, orders: 15 },
  { date: 'Apr 10', revenue: 61400, orders: 27 },
  { date: 'Apr 11', revenue: 52800, orders: 23 },
];

export const mockTopProducts: TopProduct[] = [
  { productId: 'prod-002', name: 'Retro High OG', brand: 'Jordan', revenue: 183992, unitsSold: 8 },
  { productId: 'prod-003', name: 'Boost 350 V3 Onyx', brand: 'Yeezy', revenue: 149995, unitsSold: 5 },
  { productId: 'prod-001', name: 'Air Phantom X1', brand: 'Nike', revenue: 118993, unitsSold: 7 },
  { productId: 'prod-004', name: '990v6 Grey Day', brand: 'New Balance', revenue: 94995, unitsSold: 5 },
  { productId: 'prod-005', name: 'Dunk Low Pro SB', brand: 'Nike', revenue: 77994, unitsSold: 6 },
  { productId: 'prod-006', name: 'Air Force 1 Luxe', brand: 'Nike', revenue: 62993, unitsSold: 7 },
];

export const mockReturnRequests = [
  {
    id: 'ret-001',
    orderId: 'ord-001',
    userId: 'user-002',
    reason: 'wrong_size' as const,
    description: 'Ordered size 9 but it runs small, need size 10',
    status: 'requested' as const,
    refundAmount: 16999,
    createdAt: '2024-04-11T08:00:00Z',
    updatedAt: '2024-04-11T08:00:00Z',
  },
  {
    id: 'ret-002',
    orderId: 'ord-002',
    userId: 'user-006',
    reason: 'defective' as const,
    description: 'The sole is coming off from the right shoe',
    status: 'approved' as const,
    refundAmount: 22999,
    createdAt: '2024-04-10T15:00:00Z',
    updatedAt: '2024-04-11T09:00:00Z',
  },
  {
    id: 'ret-003',
    orderId: 'ord-003',
    userId: 'user-007',
    reason: 'not_as_described' as const,
    description: 'Color looks different from what was shown online',
    status: 'refunded' as const,
    refundAmount: 29999,
    createdAt: '2024-04-09T12:00:00Z',
    updatedAt: '2024-04-10T14:00:00Z',
  },
];
