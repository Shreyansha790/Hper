import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import { submitOrder } from '@/lib/supabase/submitOrder';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [details, setDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const canSubmit = useMemo(
    () => Object.values(details).every(Boolean) && items.length > 0,
    [details, items.length]
  );

  if (items.length === 0) {
    return <div className="min-h-screen pt-24 text-center">Your cart is empty.</div>;
  }

  const placeOrder = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitOrder(items, { ...details, paymentMethod });
      clearCart();
      navigate('/orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-violet-100 shadow-sm p-6 space-y-4">
          <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
          <Input label="Full Name" value={details.fullName} onChange={(e) => setDetails({ ...details, fullName: e.target.value })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Phone" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
            <Input label="Email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
          </div>
          <Input label="Delivery Address" value={details.addressLine1} onChange={(e) => setDetails({ ...details, addressLine1: e.target.value })} />
          <div className="grid sm:grid-cols-3 gap-3">
            <Input label="City" value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} />
            <Input label="State" value={details.state} onChange={(e) => setDetails({ ...details, state: e.target.value })} />
            <Input label="Postal Code" value={details.postalCode} onChange={(e) => setDetails({ ...details, postalCode: e.target.value })} />
          </div>

          <div className="pt-2">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Payment</h2>
            <div className="space-y-2">
              <button onClick={() => setPaymentMethod('cod')} className={`w-full border rounded-xl p-3 text-left ${paymentMethod === 'cod' ? 'border-violet-500 bg-violet-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 font-semibold"><Banknote size={16} /> Cash on Delivery (COD)</div>
              </button>
              <button onClick={() => setPaymentMethod('razorpay')} className={`w-full border rounded-xl p-3 text-left ${paymentMethod === 'razorpay' ? 'border-violet-500 bg-violet-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-2 font-semibold">Pay with Razorpay (Mock)</div>
              </button>
            </div>
          </div>
        </div>

        <aside className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 h-fit">
          <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-2">
                <span className="text-gray-600">{item.sneakerName} × {item.quantity}</span>
                <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold mb-4"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>

          <div className="text-xs text-gray-500 space-y-2 mb-4">
            <p className="flex items-center gap-2"><ShieldCheck size={14} className="text-violet-600" /> Secure checkout placeholder enabled</p>
            <p className="flex items-center gap-2"><Truck size={14} className="text-violet-600" /> Fast delivery updates after order placement</p>
          </div>

          <Button fullWidth size="lg" onClick={placeOrder} disabled={!canSubmit} isLoading={isSubmitting}>
            Proceed to Checkout
          </Button>
        </aside>
      </div>
    </div>
  );
};
