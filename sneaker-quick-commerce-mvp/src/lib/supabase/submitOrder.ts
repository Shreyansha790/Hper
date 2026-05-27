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

  console.log('[submitOrder] Saving local order:', newOrder);
  saveOrder(newOrder);

  if (isSupabaseConfigured) {
    console.log('[submitOrder] Supabase is configured. Inserting order into database...');
    try {
      // 1. Insert into Orders table
      const { error: orderError } = await supabase.from('Orders').insert({
        id: orderId,
        user_id: userId,
        store_id: 'store-001',
        status: 'placed',
        payment_method: customer.paymentMethod === 'razorpay' ? 'card' : 'cod',
        payment_status: customer.paymentMethod === 'razorpay' ? 'paid' : 'pending',
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total,
        estimated_delivery: newOrder.estimatedDelivery,
        rider_name: 'Anil Kumar',
        address: {
          label: 'Home',
          line1: customer.addressLine1,
          area: customer.city,
          city: customer.city,
          pincode: customer.postalCode,
        },
        timeline: [
          { status: 'placed', timestamp: new Date().toISOString() }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (orderError) {
        console.error('[submitOrder] Failed to insert order into Supabase database:', orderError.message);
      } else {
        // 2. Insert items into OrderItems table
        const dbOrderItems = cartItems.map((item, idx) => ({
          id: `oi-${orderId}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          order_id: orderId,
          product_id: item.productId,
          size: item.selectedSize,
          quantity: item.quantity,
          price: item.price,
          store_id: 'store-001'
        }));

        const { error: itemsError } = await supabase.from('OrderItems').insert(dbOrderItems);
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
