import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, ShieldCheck, Truck, CreditCard } from 'lucide-react';
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
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 flex items-center justify-center">
        <div className="text-center card-dark p-8 max-w-sm w-full mx-4">
          <p className="text-4xl mb-4 font-mono-custom">🛒</p>
          <h2 className="font-display text-2xl tracking-wider uppercase">YOUR CART IS EMPTY</h2>
          <p className="text-neutral-500 text-xs mt-2 font-mono-custom mb-6">Add sneakers to cart before checking out.</p>
          <a href="/shop" className="w-full inline-block py-2.5 bg-[#E8FF47] text-black text-xs font-bold tracking-wider hover:bg-[#d4eb30] transition-colors rounded-sm uppercase">
            Shop sneakers
          </a>
        </div>
      </div>
    );
  }

  const placeOrder = async () => {
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitOrder(items, { ...details, paymentMethod });
      clearCart();
      if (res && res.orderId) {
        navigate(`/track-order/${res.orderId}?new=1`);
      } else {
        navigate('/orders');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-8">
          <p className="text-[10px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.2em] mb-1">Secure checkout</p>
          <h1 className="font-display text-[44px] leading-none tracking-wide text-white uppercase">CHECKOUT</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column — Address & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-dark p-6 space-y-5">
              <h2 className="font-display text-xl tracking-wider uppercase text-white pb-2 border-b border-white/[0.06]">Delivery Details</h2>
              
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={details.fullName}
                onChange={(e) => setDetails({ ...details, fullName: e.target.value })}
              />
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  placeholder="Enter 10-digit number"
                  value={details.phone}
                  onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                />
                <Input
                  label="Email Address"
                  placeholder="name@email.com"
                  value={details.email}
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                />
              </div>

              <Input
                label="Delivery Address (Flat, Building, Street)"
                placeholder="Flat No, Wing, Apartment name, Street details"
                value={details.addressLine1}
                onChange={(e) => setDetails({ ...details, addressLine1: e.target.value })}
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                />
                <Input
                  label="State"
                  placeholder="Karnataka"
                  value={details.state}
                  onChange={(e) => setDetails({ ...details, state: e.target.value })}
                />
                <Input
                  label="Postal Code"
                  maxLength={6}
                  placeholder="560038"
                  value={details.postalCode}
                  onChange={(e) => setDetails({ ...details, postalCode: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="card-dark p-6">
              <h2 className="font-display text-xl tracking-wider uppercase text-white pb-3 border-b border-white/[0.06] mb-4">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-3 p-4 border rounded-sm transition-all text-left ${
                    paymentMethod === 'cod'
                      ? 'border-[#E8FF47] bg-[#E8FF47]/[0.02] text-white'
                      : 'border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  <Banknote size={16} className={paymentMethod === 'cod' ? 'text-[#E8FF47]' : 'text-neutral-500'} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider font-mono-custom">Cash on Delivery</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Pay in cash or UPI at delivery</p>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`flex items-center gap-3 p-4 border rounded-sm transition-all text-left ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#E8FF47] bg-[#E8FF47]/[0.02] text-white'
                      : 'border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  <CreditCard size={16} className={paymentMethod === 'razorpay' ? 'text-[#E8FF47]' : 'text-neutral-500'} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider font-mono-custom">Mock Razorpay</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Simulate instant online payment</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column — Summary */}
          <aside className="space-y-6">
            <div className="card-dark p-5 h-fit space-y-4">
              <h3 className="font-display text-lg tracking-wider text-white uppercase pb-2 border-b border-white/[0.06]">Order Summary</h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-xs text-neutral-400 font-mono-custom">
                    <span className="truncate flex-1">
                      {item.sneakerName} <span className="text-[#E8FF47]">({item.selectedSize})</span> × {item.quantity}
                    </span>
                    <span className="font-bold text-white flex-shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[0.07] pt-3 flex justify-between text-xs font-mono-custom text-neutral-400">
                <span>Shipping Fee</span>
                <span className="text-white">{subtotal >= 15000 ? 'FREE' : formatCurrency(49)}</span>
              </div>

              <div className="border-t border-white/[0.07] pt-3 flex justify-between font-bold font-mono-custom text-sm">
                <span className="text-white">Subtotal</span>
                <span className="text-[#E8FF47]">{formatCurrency(subtotal >= 15000 ? subtotal : subtotal + 49)}</span>
              </div>

              <div className="text-[10px] text-neutral-500 space-y-2 pt-3 border-t border-white/[0.07]">
                <p className="flex items-center gap-2">
                  <ShieldCheck size={13} className="text-[#E8FF47]" />
                  <span>Premium 1:1 import authenticity guaranteed</span>
                </p>
                <p className="flex items-center gap-2">
                  <Truck size={13} className="text-[#E8FF47]" />
                  <span>Express ~25 min delivery across Bangalore</span>
                </p>
              </div>

              <Button
                variant="accent"
                fullWidth
                size="lg"
                onClick={placeOrder}
                disabled={!canSubmit || isSubmitting}
                isLoading={isSubmitting}
              >
                Place Order — {formatCurrency(subtotal >= 15000 ? subtotal : subtotal + 49)}
              </Button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};
