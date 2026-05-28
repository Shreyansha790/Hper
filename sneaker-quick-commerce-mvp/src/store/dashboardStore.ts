import { create } from 'zustand';
import type { Order, OrderStatus, PaymentMethod } from '@/types';
import { supabase } from '@/lib/supabase/client';

type DbOrderRow = Record<string, any>;

const mapDbStatusToAppStatus = (status: string): OrderStatus => {
  const map: Record<string, OrderStatus> = {
    'Pending': 'placed',
    'Packed': 'packed',
    'Ready for Delivery': 'out_for_delivery',
    'Delivered': 'delivered'
  };
  return map[status] || 'placed';
};

const mapAppStatusToDbStatus = (status: OrderStatus): string => {
  const map: Record<OrderStatus, string> = {
    'placed': 'Pending',
    'confirmed': 'Pending',
    'packed': 'Packed',
    'rider_assigned': 'Packed',
    'out_for_delivery': 'Ready for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Pending',
    'return_requested': 'Pending',
    'returned': 'Delivered'
  };
  return map[status] || 'Pending';
};

const mapDbOrderToOrder = (row: DbOrderRow): Order => {
  const rawItems = row.order_items ?? row.OrderItems ?? [];

  return {
    id: row.id,
    userId: row.user_id ?? 'unknown-user',
    user: row.user ?? undefined,
    storeId: row.store_id ?? 'unknown-store',
    store: row.store ?? undefined,
    items: rawItems.map((item: any) => ({
      id: item.id,
      productId: item.product_id,
      product: item.products ?? item.product,
      size: item.size,
      quantity: item.quantity,
      price: item.unit_price ?? item.price,
      storeId: item.store_id ?? row.store_id,
    })),
    address: {
      id: `${row.id}-address`,
      userId: row.user_id ?? 'unknown-user',
      label: row.delivery_label ?? 'Home',
      line1: row.delivery_line1 ?? '-',
      line2: undefined,
      area: row.delivery_area ?? '-',
      city: row.delivery_city ?? '-',
      pincode: row.delivery_pincode ?? '-',
      isDefault: true,
    },
    status: mapDbStatusToAppStatus(row.status),
    timeline: Array.isArray(row.timeline) ? row.timeline : [{ status: mapDbStatusToAppStatus(row.status), timestamp: row.updated_at ?? row.created_at }],
    paymentMethod: (row.payment_method ?? 'cod') as PaymentMethod,
    paymentStatus: row.payment_status ?? 'pending',
    subtotal: row.subtotal ?? row.total ?? 0,
    deliveryFee: row.delivery_fee ?? 0,
    discount: row.discount ?? 0,
    total: row.total ?? 0,
    estimatedDelivery: row.estimated_delivery ?? row.created_at,
    riderId: row.rider_id,
    riderName: row.rider_name ?? 'Anil Kumar',
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
};

interface DashboardState {
  orders: Order[];
  selectedOrder: Order | null;
  isOrderDrawerOpen: boolean;
  activeTab: string;
  isLoadingOrders: boolean;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  openOrderDrawer: (order: Order) => void;
  closeOrderDrawer: () => void;
  setActiveTab: (tab: string) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  isOrderDrawerOpen: false,
  activeTab: 'overview',
  isLoadingOrders: false,

  fetchOrders: async () => {
    set({ isLoadingOrders: true });
    // Fetch from lowercase tables matching user's custom schema
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[dashboard] Failed to fetch orders', error);
      set({ isLoadingOrders: false });
      return;
    }

    const orders = (data ?? []).map(mapDbOrderToOrder);
    set({ orders, isLoadingOrders: false });
  },

  updateOrderStatus: async (orderId, status) => {
    const dbStatus = mapAppStatusToDbStatus(status);
    const { error } = await supabase
      .from('orders')
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('[dashboard] Failed to update order status', error);
      return;
    }

    await get().fetchOrders();

    const refreshed = get().orders.find((order) => order.id === orderId) ?? null;
    if (get().selectedOrder?.id === orderId) {
      set({ selectedOrder: refreshed });
    }
  },

  openOrderDrawer: (order) => set({ selectedOrder: order, isOrderDrawerOpen: true }),
  closeOrderDrawer: () => set({ isOrderDrawerOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

