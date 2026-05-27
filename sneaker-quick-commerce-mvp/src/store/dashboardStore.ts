import { create } from 'zustand';
import type { Order, OrderStatus, PaymentMethod } from '@/types';
import { supabase } from '@/lib/supabase/client';

type DbOrderRow = Record<string, any>;

const mapDbOrderToOrder = (row: DbOrderRow): Order => {
  const address = row.address ?? {};
  const rawItems = row.OrderItems ?? row.order_items ?? [];

  return {
    id: row.id,
    userId: row.user_id ?? row.userId ?? 'unknown-user',
    user: row.user ?? undefined,
    storeId: row.store_id ?? row.storeId ?? 'unknown-store',
    store: row.store ?? undefined,
    items: rawItems.map((item: any) => ({
      id: item.id,
      productId: item.product_id ?? item.productId,
      product: item.Products ?? item.product,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      storeId: item.store_id ?? row.store_id ?? row.storeId,
    })),
    address: {
      id: address.id ?? `${row.id}-address`,
      userId: row.user_id ?? row.userId ?? 'unknown-user',
      label: address.label ?? 'Home',
      line1: address.line1 ?? address.addressLine1 ?? '-',
      line2: address.line2 ?? undefined,
      area: address.area ?? '-',
      city: address.city ?? '-',
      pincode: address.pincode ?? '-',
      lat: address.lat,
      lng: address.lng,
      isDefault: Boolean(address.isDefault),
    },
    status: row.status,
    timeline: Array.isArray(row.timeline) ? row.timeline : [{ status: row.status, timestamp: row.updated_at ?? row.created_at }],
    paymentMethod: (row.payment_method ?? 'cod') as PaymentMethod,
    paymentStatus: row.payment_status ?? 'pending',
    subtotal: row.subtotal ?? row.total ?? 0,
    deliveryFee: row.delivery_fee ?? 0,
    discount: row.discount ?? 0,
    total: row.total ?? 0,
    estimatedDelivery: row.estimated_delivery ?? row.created_at,
    riderId: row.rider_id,
    riderName: row.rider_name,
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
    const { data, error } = await supabase
      .from('Orders')
      .select('*, OrderItems(*, Products(*))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[dashboard] Failed to fetch Orders', error);
      set({ isLoadingOrders: false });
      return;
    }

    const orders = (data ?? []).map(mapDbOrderToOrder);
    set({ orders, isLoadingOrders: false });
  },

  updateOrderStatus: async (orderId, status) => {
    const { error } = await supabase
      .from('Orders')
      .update({ status, updated_at: new Date().toISOString() })
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
