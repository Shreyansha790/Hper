import type { CartLineItem } from '@/store/cartStore';

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
  const payload = {
    customer,
    cartItems,
    subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
  };

  console.log('[submitOrder] Dummy payload', payload);

  // TODO: SQL insert into Orders table should be done here.
  // TODO: SQL inserts into OrderItems table should be done here.
  // TODO: SQL inventory deduction updates should be done here.

  return { success: true };
}
