import { mockOrders, updateMockOrderStatus } from '../mock/orders';

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
};

type QueryResponse<T = unknown> = Promise<{ data: T; error: null }>;

const resolved = <T>(data: T): QueryResponse<T> => Promise.resolve({ data, error: null });

const queryBuilder = {
  select: () => ({
    order: () => {
      const dbOrders = mockOrders.map((order) => ({
        id: order.id,
        user_id: order.userId,
        user: order.user,
        store_id: order.storeId,
        store: order.store,
        address: order.address,
        status: order.status,
        timeline: order.timeline,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        subtotal: order.subtotal,
        delivery_fee: order.deliveryFee,
        discount: order.discount,
        total: order.total,
        estimated_delivery: order.estimatedDelivery,
        rider_name: order.riderName,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        OrderItems: order.items.map((item) => ({
          id: item.id,
          product_id: item.productId,
          Products: item.product,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
      }));
      return resolved(dbOrders);
    },
  }),
  update: (updates: any) => ({
    eq: (column: string, val: any) => {
      if (updates && updates.status) {
        updateMockOrderStatus(val, updates.status);
      }
      return resolved(null);
    },
  }),
};

export const supabase = {
  from: (table: string) => queryBuilder,
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
