import type { CartLineItem } from '@/store/cartStore';
import { saveOrder } from '@/lib/mock/orders';
import { mockProducts } from '@/lib/mock/products';
import { mockStores } from '@/lib/mock/stores';
import { useAuthStore } from '@/store/authStore';
import type { Order, OrderItem } from '@/types';

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

  console.log('[submitOrder] Saving dynamic order:', newOrder);
  saveOrder(newOrder);

  return { success: true, orderId };
}
