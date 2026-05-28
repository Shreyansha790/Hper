import type { CartLineItem } from '@/store/cartStore';
import { saveOrder } from '@/lib/mock/orders';
import { mockProducts } from '@/lib/mock/products';
import { mockStores } from '@/lib/mock/stores';
import { useAuthStore } from '@/store/authStore';
import type { Order, OrderItem } from '@/types';
import { supabase, isSupabaseConfigured } from './client';

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: 'cod' | 'razorpay';
}

export async function submitOrder(cartItems: CartLineItem[], customer: CheckoutDetails) {
  const { user } = useAuthStore.getState();
  const userId = user?.id || `user-guest-${Date.now()}`;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 15000 ? 0 : 49;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const orderItems: OrderItem[] = cartItems.map((item, idx) => {
    const matchedProduct = mockProducts.find((p) => p.id === item.productId) || mockProducts[0];
    return {
      id: `oi-${orderId}-${idx}`,
      productId: item.productId,
      product: matchedProduct,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.price,
      storeId: 'store-001',
    };
  });

  const newOrder: Order = {
    id: orderId,
    userId,
    user: user || {
      id: userId,
      name: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      role: 'customer',
      createdAt: new Date().toISOString(),
    },
    storeId: 'store-001',
    store: mockStores[0],
    items: orderItems,
    address: {
      id: `addr-${orderId}`,
      userId,
      label: 'Home',
      line1: customer.addressLine1,
      area: customer.city,
      city: customer.city,
      pincode: customer.postalCode,
      isDefault: true,
    },
    status: 'placed',
    timeline: [
      { status: 'placed', timestamp: new Date().toISOString() }
    ],
    paymentMethod: customer.paymentMethod === 'razorpay' ? 'card' : 'cod',
    paymentStatus: customer.paymentMethod === 'razorpay' ? 'paid' : 'pending',
    subtotal,
    deliveryFee,
    discount,
    total,
    estimatedDelivery: new Date(Date.now() + 25 * 60000).toISOString(),
    riderName: 'Anil Kumar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Always save to local mock store first (works offline / without Supabase)
  console.log('[submitOrder] Saving local order:', orderId);
  saveOrder(newOrder);

  if (isSupabaseConfigured) {
    console.log('[submitOrder] Supabase configured. Attempting to insert order into DB...');
    await insertOrderToSupabase(newOrder, cartItems, customer);
  } else {
    console.log('[submitOrder] Supabase not configured — using local mock store only.');
  }

  return { success: true, orderId };
}

async function insertOrderToSupabase(
  order: Order,
  cartItems: CartLineItem[],
  customer: CheckoutDetails
) {
  // Check if we have a real Supabase auth session
  const { data: { session } } = await (supabase as any).auth.getSession();
  
  // Use the real auth UID if available, otherwise use a deterministic UUID
  const dbUserId = session?.user?.id ?? ensureUUID(order.userId);
  const dbOrderId = ensureUUID(order.id);
  const dbStoreId = ensureUUID('store-001');

  console.log('[submitOrder] DB user_id:', dbUserId, '| Has session:', !!session);

  try {
    // 1. Try to upsert user record (will fail if RLS blocks it without auth session)
    if (!session) {
      console.warn(
        '[submitOrder] No Supabase auth session — RLS policies may block the insert. ' +
        'To fix: either disable RLS on the orders table, or add a policy that allows ' +
        'anonymous inserts (e.g., FOR INSERT WITH CHECK (true)).'
      );
    }

    // 2. Insert into orders table (flat columns matching user schema)
    const orderPayload = {
      id: dbOrderId,
      user_id: dbUserId,
      store_id: dbStoreId,
      status: 'Pending' as const,
      payment_method: customer.paymentMethod === 'razorpay' ? 'card' : 'cod',
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total: order.total,
      delivery_label: 'Home',
      delivery_line1: customer.addressLine1,
      delivery_area: customer.city,
      delivery_city: customer.city,
      delivery_pincode: customer.postalCode,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    };

    console.log('[submitOrder] Inserting order payload:', orderPayload);
    const { error: orderError } = await (supabase as any).from('orders').insert(orderPayload);

    if (orderError) {
      console.error('[submitOrder] ❌ Failed to insert order:', orderError.message, orderError);
      console.error(
        '[submitOrder] Common causes:\n' +
        '  1. RLS is blocking — add policy: CREATE POLICY "allow_insert" ON orders FOR INSERT WITH CHECK (true);\n' +
        '  2. The store_id UUID does not exist in the stores table\n' +
        '  3. The user_id UUID does not exist in auth.users\n' +
        '  4. Missing required column — check schema'
      );
      return;
    }

    console.log('[submitOrder] ✅ Order inserted successfully');

    // 3. Insert order items
    const dbOrderItems = cartItems.map((item, idx) => ({
      id: ensureUUID(`oi-${order.id}-${idx}`),
      order_id: dbOrderId,
      product_id: ensureUUID(item.productId),
      size: item.selectedSize,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    console.log('[submitOrder] Inserting order items:', dbOrderItems.length, 'items');
    const { error: itemsError } = await (supabase as any).from('order_items').insert(dbOrderItems);

    if (itemsError) {
      console.error('[submitOrder] ❌ Failed to insert order items:', itemsError.message, itemsError);
    } else {
      console.log('[submitOrder] ✅ Order items inserted successfully');
    }
  } catch (err) {
    console.error('[submitOrder] 💥 Unexpected exception during Supabase insert:', err);
  }
}

// Helper to ensure IDs match UUID format required by database schema
function ensureUUID(str: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) return str;

  // Generate deterministic UUID from known mock IDs
  if (str === 'store-001') return '11111111-1111-4111-a111-111111111111';
  if (str.startsWith('prod-')) {
    const num = str.replace('prod-', '').replace(/\D/g, '').padStart(12, '0');
    return `22222222-2222-4222-b222-${num}`;
  }
  if (str.startsWith('user-')) {
    const num = str.replace(/\D/g, '').padStart(12, '0');
    return `33333333-3333-4333-c333-${num}`;
  }
  if (str.startsWith('ORD-')) {
    const num = str.replace(/\D/g, '').padStart(12, '0');
    return `44444444-4444-4444-d444-${num}`;
  }
  if (str.startsWith('oi-')) {
    const num = str.replace(/\D/g, '').padStart(12, '0');
    return `55555555-5555-4555-e555-${num}`;
  }

  // Fallback default UUID
  return '00000000-0000-4000-a000-000000000000';
}
