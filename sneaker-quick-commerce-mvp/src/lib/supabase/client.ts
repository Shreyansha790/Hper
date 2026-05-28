import { createClient } from '@supabase/supabase-js';
import { mockOrders, updateMockOrderStatus } from '../mock/orders';
import { mockProducts } from '../mock/products';

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL ?? '',
  anonKey:
    import.meta.env.VITE_SUPABASE_ANON_KEY ??
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    '',
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

type QueryResponse<T = unknown> = Promise<{ data: T; error: null }>;

const resolved = <T>(data: T): QueryResponse<T> => Promise.resolve({ data, error: null });

// Map frontend status values to DB enum values
const toDbStatus = (status: string): string => {
  const map: Record<string, string> = {
    placed: 'Pending',
    confirmed: 'Pending',
    packed: 'Packed',
    rider_assigned: 'Packed',
    out_for_delivery: 'Ready for Delivery',
    delivered: 'Delivered',
    cancelled: 'Pending',
    return_requested: 'Pending',
    returned: 'Delivered',
  };
  return map[status] ?? 'Pending';
};

const buildMockDbOrders = () =>
  mockOrders.map((order) => ({
    id: order.id,
    user_id: order.userId,
    user: order.user,
    store_id: order.storeId,
    store: order.store,
    // DB enum values
    status: toDbStatus(order.status),
    timeline: order.timeline,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    discount: order.discount,
    total: order.total,
    estimated_delivery: order.estimatedDelivery,
    rider_name: order.riderName,
    delivery_label: order.address?.label ?? 'Home',
    delivery_line1: order.address?.line1 ?? '',
    delivery_area: order.address?.area ?? '',
    delivery_city: order.address?.city ?? '',
    delivery_pincode: order.address?.pincode ?? '',
    created_at: order.createdAt,
    updated_at: order.updatedAt,
    // Nested join — lowercase keys to match Supabase response shape
    order_items: order.items.map((item) => ({
      id: item.id,
      order_id: order.id,
      product_id: item.productId,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
      // Nested product join
      products: item.product ?? mockProducts.find((p) => p.id === item.productId) ?? null,
    })),
  }));

// Minimal mock Supabase query builder that mimics the real client's chained API
const createMockQueryBuilder = (table: string) => {
  let _updates: any = null;
  let _eqCol: string | null = null;
  let _eqVal: any = null;

  const builder = {
    select: (_cols?: string) => ({
      order: (_col: string, _opts?: any) => resolved(buildMockDbOrders()),
      eq: (col: string, val: any) => {
        const rows = buildMockDbOrders().filter((r: any) => r[col] === val);
        return resolved(rows);
      },
    }),
    insert: (payload: any) => {
      // We just silently accept inserts on the mock path
      return resolved(null);
    },
    update: (updates: any) => {
      _updates = updates;
      return {
        eq: (col: string, val: any) => {
          if (_updates?.status) {
            // Map DB status back to frontend status for the mock store
            const statusBack: Record<string, string> = {
              Pending: 'placed',
              Packed: 'packed',
              'Ready for Delivery': 'out_for_delivery',
              Delivered: 'delivered',
            };
            updateMockOrderStatus(val, statusBack[_updates.status] ?? _updates.status);
          }
          return resolved(null);
        },
      };
    },
  };

  return builder;
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : ({
      from: (table: string) => createMockQueryBuilder(table),
    } as any);
