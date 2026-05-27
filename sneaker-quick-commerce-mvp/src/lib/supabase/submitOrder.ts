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

  const dbOrderId = ensureUUID(orderId);
  const dbUserId = ensureUUID(userId);
  const dbStoreId = ensureUUID('store-001'); // fallback to a valid uuid format

  console.log('[submitOrder] Saving local order:', newOrder);
  saveOrder(newOrder);

  if (isSupabaseConfigured) {
    console.log('[submitOrder] Supabase is configured. Inserting order into database...');
    try {
      // 1. Insert into orders table (lowercase, flat columns matching user schema)
      const { error: orderError } = await supabase.from('orders').insert({
        id: dbOrderId,
        user_id: dbUserId,
        store_id: dbStoreId,
        status: 'Pending', // Match their enum ('Pending', 'Packed', 'Ready for Delivery', 'Delivered')
        payment_method: customer.paymentMethod === 'razorpay' ? 'card' : 'cod',
        subtotal,
        delivery_fee: deliveryFee,
        total,
        delivery_label: 'Home',
        delivery_line1: customer.addressLine1,
        delivery_area: customer.city,
        delivery_city: customer.city,
        delivery_pincode: customer.postalCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (orderError) {
        console.error('[submitOrder] Failed to insert order into Supabase database:', orderError.message);
      } else {
        // 2. Insert items into order_items table (lowercase table, unit_price column matching user schema)
        const dbOrderItems = cartItems.map((item, idx) => ({
          id: ensureUUID(`oi-${orderId}-${idx}`),
          order_id: dbOrderId,
          product_id: ensureUUID(item.productId),
          size: item.selectedSize,
          quantity: item.quantity,
          unit_price: item.price
        }));

        const { error: itemsError } = await supabase.from('order_items').insert(dbOrderItems);
        if (itemsError) {
          console.error('[submitOrder] Failed to insert order items into Supabase database:', itemsError.message);
        } else {
          console.log('[submitOrder] Order and OrderItems successfully inserted into Supabase!');
        }
      }
    } catch (err) {
      console.error('[submitOrder] Database exception during insertion:', err);
    }
  }

  return { success: true, orderId };
}

// Helper to ensure IDs match UUID format required by database schema
function ensureUUID(str: string): string {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(str)) return str;

  // Generate a deterministic valid UUID from a string seed (fallback for mock IDs like prod-001)
  if (str === 'store-001') return '11111111-1111-4111-a111-111111111111';
  if (str.startsWith('prod-')) {
    const num = str.replace('prod-', '');
    return `22222222-2222-4222-b222-${num.padStart(12, '0')}`;
  }
  if (str.startsWith('user-')) {
    const num = str.replace(/[^0-9]/g, '');
    return `33333333-3333-4333-c333-${num.padStart(12, '0')}`;
  }
  if (str.startsWith('ORD-')) {
    const num = str.replace(/[^0-9]/g, '');
    return `44444444-4444-4444-d444-${num.padStart(12, '0')}`;
  }
  if (str.startsWith('oi-')) {
    const num = str.replace(/[^0-9]/g, '');
    return `55555555-5555-4555-e555-${num.padStart(12, '0')}`;
  }

  // Fallback default UUID
  return '00000000-0000-4000-a000-000000000000';
}

