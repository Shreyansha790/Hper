import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Shield, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/types';

const DEMO_ACCOUNTS = [
  { role: 'customer' as Role, email: 'customer@kicksfly.in', label: 'Demo Customer', color: 'from-violet-500 to-purple-600', emoji: '👟' },
  { role: 'storekeeper' as Role, email: 'kiran@kicksfly.in', label: 'Demo Storekeeper', color: 'from-blue-500 to-indigo-600', emoji: '🏪' },
  { role: 'admin' as Role, email: 'admin@kicksfly.in', label: 'Demo Admin', color: 'from-emerald-500 to-teal-600', emoji: '👑' },
];

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email] = useState('customer@kicksfly.in');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('otp');
  };

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleLogin = async (loginEmail = email) => {
    const success = await login(loginEmail);
    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin' || user?.role === 'storekeeper') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="relative w-full max-w-md mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 mb-6">
              {step === 'otp' && (
                <button onClick={() => setStep('phone')} className="p-1.5 rounded-lg hover:bg-gray-100 transition-all mr-1">
                  <ChevronLeft size={16} />
                </button>
              )}
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-xl font-black">Kicks<span className="text-gradient">Fly</span></span>
            </div>

            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <h1 className="text-3xl font-black text-gray-900">Welcome!</h1>
                  <p className="text-gray-500 text-sm mt-2">Enter your phone to get started</p>

                  <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-2">
                        <span className="text-sm">🇮🇳</span>
                        <span className="text-sm font-semibold text-gray-700">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter mobile number"
                        className="w-full pl-24 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                    <Button type="submit" variant="primary" fullWidth size="lg" disabled={phone.length < 10} rightIcon={<ArrowRight size={16} />}>
                      Send OTP
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h1 className="text-3xl font-black text-gray-900">Verify OTP</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Sent to +91 {phone} · <button className="text-violet-600 font-semibold" onClick={() => setStep('phone')}>Change</button>
                  </p>

                  <div className="flex gap-2 mt-6">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-full aspect-square rounded-xl border-2 border-gray-200 text-center text-xl font-black focus:border-violet-500 focus:outline-none transition-all"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Demo: use any 6 digits
                  </p>

                  <Button
                    className="mt-4"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                    onClick={() => handleLogin()}
                  >
                    Verify & Login
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Demo Accounts */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-gray-400">Quick Demo Login</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => handleLogin(acc.email)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-violet-200 hover:bg-violet-50 transition-all text-left"
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-lg flex-shrink-0`}>
                    {acc.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{acc.label}</p>
                    <p className="text-xs text-gray-500">{acc.email}</p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-gray-300" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <Shield size={12} />
              <span>Your data is encrypted and secure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
