import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, CreditCard, Smartphone, Banknote, ChevronRight, Zap, Lock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import { submitOrder } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type PaymentType = 'upi' | 'card' | 'cod';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>('upi');
  const [isPlacing, setIsPlacing] = useState(false);

  const [address, setAddress] = useState({
    label: 'Home',
    line1: '',
    area: 'Indiranagar',
    city: 'Bangalore',
    pincode: '560038',
  });

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h2 className="text-2xl font-black">Your cart is empty</h2>
          <Button className="mt-4" onClick={() => navigate('/shop')}>Shop Sneakers</Button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const orderId = await submitOrder({
        userId: user.id,
        storeId: items[0].storeId,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
        address,
        items,
      });

      clearCart();
      navigate(`/order-tracking/${orderId}?new=1`);
    } catch (error) {
      console.error(error);
      setIsPlacing(false);
      return;
    }
  };

  const paymentOptions: { type: PaymentType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: 'upi', label: 'UPI', icon: <Smartphone size={18} />, desc: 'Pay via any UPI app instantly' },
    { type: 'card', label: 'Card', icon: <CreditCard size={18} />, desc: 'Debit / Credit card payment' },
    { type: 'cod', label: 'Cash on Delivery', icon: <Banknote size={18} />, desc: 'Pay when your order arrives' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Checkout</h1>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          {['Delivery', 'Payment', 'Review'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 text-sm font-semibold ${step > i + 1 ? 'text-emerald-600' : step === i + 1 ? 'text-violet-700' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span className="hidden sm:block">{s}</span>
              </div>
              {i < 2 && <ChevronRight size={14} className="text-gray-300" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step 1: Address */}
            <motion.div
              layout
              className={`bg-white rounded-2xl border ${step === 1 ? 'border-violet-200' : 'border-gray-100'} overflow-hidden shadow-card`}
            >
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => step > 1 && setStep(1)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${step >= 1 ? 'bg-violet-100' : 'bg-gray-100'}`}>
                    <MapPin size={16} className={step >= 1 ? 'text-violet-600' : 'text-gray-400'} />
                  </div>
                  <h2 className="font-bold text-gray-900">Delivery Address</h2>
                </div>
                {step > 1 && (
                  <span className="text-xs text-violet-600 font-semibold bg-violet-50 px-3 py-1 rounded-full">
                    {address.area}, {address.city}
                  </span>
                )}
              </div>

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {['Home', 'Work', 'Other'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setAddress({ ...address, label: l })}
                        className={`py-2 rounded-xl text-sm font-semibold border transition-all ${address.label === l ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600'}`}
                      >
                        {l === 'Home' ? '🏠' : l === 'Work' ? '💼' : '📍'} {l}
                      </button>
                    ))}
                  </div>

                  <Input
                    label="Full Address"
                    placeholder="House no., street, building name"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Area"
                      value={address.area}
                      onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    />
                    <Input
                      label="Pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    />
                  </div>

                  {user && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.phone}</p>
                    </div>
                  )}

                  <Button variant="primary" fullWidth onClick={() => setStep(2)}>
                    Continue to Payment →
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Step 2: Payment */}
            <motion.div
              layout
              className={`bg-white rounded-2xl border ${step === 2 ? 'border-violet-200' : 'border-gray-100'} overflow-hidden shadow-card ${step < 2 ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => step > 2 && setStep(2)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${step >= 2 ? 'bg-violet-100' : 'bg-gray-100'}`}>
                    <CreditCard size={16} className={step >= 2 ? 'text-violet-600' : 'text-gray-400'} />
                  </div>
                  <h2 className="font-bold text-gray-900">Payment Method</h2>
                </div>
                {step > 2 && (
                  <span className="text-xs text-violet-600 font-semibold bg-violet-50 px-3 py-1 rounded-full capitalize">
                    {paymentMethod}
                  </span>
                )}
              </div>

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-5 pb-5 space-y-3">
                  {paymentOptions.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setPaymentMethod(opt.type)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === opt.type ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === opt.type ? 'bg-violet-100 text-violet-600' : 'bg-gray-100 text-gray-500'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                      <div className={`ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.type ? 'border-violet-600' : 'border-gray-300'}`}>
                        {paymentMethod === opt.type && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                      </div>
                    </button>
                  ))}

                  {paymentMethod === 'upi' && (
                    <Input label="UPI ID" placeholder="yourname@paytm / @gpay" className="mt-3" />
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3 mt-3">
                      <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Expiry" placeholder="MM/YY" />
                        <Input label="CVV" placeholder="•••" />
                      </div>
                    </div>
                  )}

                  <Button variant="primary" fullWidth onClick={() => setStep(3)}>
                    Continue to Review →
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Step 3: Review */}
            <motion.div
              layout
              className={`bg-white rounded-2xl border ${step === 3 ? 'border-violet-200' : 'border-gray-100'} overflow-hidden shadow-card ${step < 3 ? 'opacity-50' : ''}`}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${step >= 3 ? 'bg-violet-100' : 'bg-gray-100'}`}>
                    <span className="text-sm">✓</span>
                  </div>
                  <h2 className="font-bold text-gray-900">Review Order</h2>
                </div>

                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-violet-500 font-bold">{item.product.brand}</p>
                          <p className="text-sm font-bold text-gray-900">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Size UK {item.size} · Qty {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">{formatCurrency(item.product.price * item.quantity)}</p>
                      </div>
                    ))}

                    <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery to</span>
                        <span className="font-medium">{address.area}, {address.city}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Payment</span>
                        <span className="font-medium capitalize">{paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>ETA</span>
                        <span className="font-semibold text-violet-600 flex items-center gap-1">
                          <Zap size={10} className="fill-violet-600" /> ~30 minutes
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      size="lg"
                      isLoading={isPlacing}
                      onClick={handlePlaceOrder}
                      leftIcon={<Lock size={16} />}
                    >
                      {isPlacing ? 'Placing Order...' : `Place Order · ${formatCurrency(total)}`}
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500">UK {item.size}</p>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600 font-semibold' : 'font-semibold'}>
                    {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-100 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-violet-50 rounded-xl flex items-center gap-2">
                <Zap size={14} className="text-violet-600 fill-violet-600 flex-shrink-0" />
                <p className="text-xs text-violet-700 font-semibold">Express delivery in ~30 minutes from Indiranagar store</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
