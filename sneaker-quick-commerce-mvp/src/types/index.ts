// ============================================================
// CORE TYPES
// ============================================================

export type Role = 'admin' | 'storekeeper' | 'customer';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'rider_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned';

export type PaymentMethod = 'cod' | 'upi' | 'card';

export type ReturnReason =
  | 'wrong_size'
  | 'defective'
  | 'not_as_described'
  | 'changed_mind'
  | 'damaged_delivery';

export type ReturnStatus = 'requested' | 'approved' | 'rejected' | 'refunded';

// ============================================================
// USER
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  assignedStoreId?: string;
  avatar?: string;
  createdAt: string;
}

// ============================================================
// PRODUCT
// ============================================================

export interface SizeVariant {
  size: string; // UK sizes: 6, 7, 8, 9, 10, 11, 12
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  colorway: string;
  sizes: SizeVariant[];
  tags: string[];
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// ============================================================
// INVENTORY
// ============================================================

export interface InventoryItem {
  id: string;
  storeId: string;
  productId: string;
  size: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
}

// ============================================================
// STORE
// ============================================================

export interface Store {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  phone: string;
  isActive: boolean;
  assignedStorekeepers: string[];
  deliveryRadius: number; // km
  avgDeliveryTime: number; // minutes
}

// ============================================================
// CART
// ============================================================

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  quantity: number;
  storeId: string;
}

// ============================================================
// ADDRESS
// ============================================================

export interface Address {
  id: string;
  userId: string;
  label: string; // Home, Work, etc.
  line1: string;
  line2?: string;
  area: string;
  city: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

// ============================================================
// ORDER
// ============================================================

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  size: string;
  quantity: number;
  price: number;
  storeId: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  storeId: string;
  store?: Store;
  items: OrderItem[];
  address: Address;
  status: OrderStatus;
  timeline: OrderTimeline[];
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  estimatedDelivery: string; // ISO string
  riderId?: string;
  riderName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// RETURN REQUEST
// ============================================================

export interface ReturnRequest {
  id: string;
  orderId: string;
  order?: Order;
  userId: string;
  user?: User;
  items: OrderItem[];
  reason: ReturnReason;
  description: string;
  status: ReturnStatus;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// ANALYTICS
// ============================================================

export interface AnalyticsMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  avgOrderValue: number;
  aovGrowth: number;
  activeCustomers: number;
  customersGrowth: number;
  pendingOrders: number;
  deliveredToday: number;
  lowStockItems: number;
  returnRequests: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: string;
  name: string;
  brand: string;
  revenue: number;
  unitsSold: number;
}
