import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Shield, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import type { Role } from '@/types';

const DEMO_ACCOUNTS = [
  { role: 'customer' as Role, email: 'customer@kicksfly.in', label: 'Demo Customer Account', color: 'from-violet-500/20 to-purple-600/20 text-violet-400 border border-violet-500/30', emoji: '👟' },
  { role: 'storekeeper' as Role, email: 'kiran@kicksfly.in', label: 'Demo Storekeeper Dashboard', color: 'from-blue-500/20 to-indigo-600/20 text-blue-400 border border-blue-500/30', emoji: '🏪' },
  { role: 'admin' as Role, email: 'admin@kicksfly.in', label: 'Demo Administrator Panel', color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30', emoji: '👑' },
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
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Background glow blooms */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-[#E8FF47]/[0.03] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8FF47]/[0.02] blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D0D0D] rounded-sm shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/[0.07] overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 mb-6">
              {step === 'otp' && (
                <button onClick={() => setStep('phone')} className="p-1.5 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all mr-1">
                  <ChevronLeft size={16} />
                </button>
              )}
              <div className="w-8 h-8 rounded-sm bg-[#E8FF47] flex items-center justify-center shadow-glow-sm">
                <Zap size={15} className="text-black fill-black" />
              </div>
              <span className="font-display text-[20px] text-white tracking-wide leading-none">
                KICKS<span className="text-[#E8FF47]">FLY</span>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div key="phone" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                  <h1 className="font-display text-3xl tracking-wider text-white uppercase">Welcome back</h1>
                  <p className="text-neutral-500 text-xs mt-2 font-mono-custom">Enter your mobile number to check in</p>

                  <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase tracking-wider mb-1.5">Mobile Number</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-white/10 pr-2 font-mono-custom text-xs font-bold text-neutral-400">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="Enter 10 digits"
                          className="w-full pl-20 pr-4 py-3 bg-[#111111] border border-white/10 rounded-sm text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20 transition-all font-mono-custom"
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="accent" fullWidth size="lg" disabled={phone.length < 10} rightIcon={<ArrowRight size={14} />}>
                      Send OTP Code
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
                  <h1 className="font-display text-3xl tracking-wider text-white uppercase">Verify OTP</h1>
                  <p className="text-neutral-500 text-xs mt-2 font-mono-custom">
                    Sent to +91 {phone} · <button className="text-[#E8FF47] font-semibold underline" onClick={() => setStep('phone')}>Change</button>
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
                        className="w-full aspect-square bg-[#111111] border border-white/10 rounded-sm text-center text-lg font-bold text-[#E8FF47] focus:border-[#E8FF47]/50 focus:outline-none transition-all font-mono-custom"
                      />
                    ))}
                  </div>

                  <p className="text-[10px] text-neutral-600 mt-3 text-center font-mono-custom">
                    Demo Mode: enter any 6 digits to verify
                  </p>

                  <Button
                    className="mt-4"
                    variant="accent"
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

          {/* Quick Demo Login Accounts */}
          <div className="px-8 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className="text-[9px] font-mono-custom font-bold text-neutral-500 uppercase tracking-widest">Quick Demo Login</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => handleLogin(acc.email)}
                  className="w-full flex items-center gap-3 p-3 bg-[#111111] border border-white/10 rounded-sm hover:border-[#E8FF47]/40 hover:bg-[#E8FF47]/[0.02] transition-all text-left"
                >
                  <div className={`w-9 h-9 rounded-sm bg-gradient-to-br ${acc.color} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}>
                    {acc.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{acc.label}</p>
                    <p className="text-[10px] text-neutral-500 font-mono-custom truncate mt-0.5">{acc.email}</p>
                  </div>
                  <ArrowRight size={13} className="ml-auto text-neutral-600 flex-shrink-0" />
                </button>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] text-neutral-600 font-mono-custom uppercase tracking-wide">
              <Shield size={12} className="text-[#E8FF47]" />
              <span>Secure 256-bit encrypted authentication</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
