import { createClient } from '@supabase/supabase-js';
import type { CartItem, PaymentMethod } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SubmitOrderPayload {
  userId: string;
  storeId: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: {
    label: string;
    line1: string;
    area: string;
    city: string;
    pincode: string;
  };
  items: CartItem[];
}

export async function submitOrder(payload: SubmitOrderPayload): Promise<string> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: payload.userId,
      store_id: payload.storeId,
      payment_method: payload.paymentMethod,
      subtotal: payload.subtotal,
      delivery_fee: payload.deliveryFee,
      total: payload.total,
      delivery_label: payload.address.label,
      delivery_line1: payload.address.line1,
      delivery_area: payload.address.area,
      delivery_city: payload.address.city,
      delivery_pincode: payload.address.pincode,
      status: 'Pending',
    })
    .select('id')
    .single();

  if (orderError || !orderData) {
    throw new Error(orderError?.message || 'Failed to create order');
  }

  const orderItems = payload.items.map((item) => ({
    order_id: orderData.id,
    product_id: item.productId,
    size: item.size,
    quantity: item.quantity,
    unit_price: item.product.price,
  }));

  const { error: itemError } = await supabase.from('order_items').insert(orderItems);

  if (itemError) {
    throw new Error(itemError.message || 'Failed to insert order items');
  }

  return orderData.id;
}
