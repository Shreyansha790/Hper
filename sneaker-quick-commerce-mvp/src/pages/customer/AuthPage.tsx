import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Shield, ChevronLeft, MapPin, Search, ShoppingBag, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import type { Role } from '@/types';

const DEMO_ACCOUNTS = [
  { role: 'customer' as Role, email: 'customer@kicksfly.in', label: 'Demo Customer Account', color: 'from-violet-500/20 to-purple-600/20 text-violet-400 border border-violet-500/30', emoji: '👟' },
  { role: 'storekeeper' as Role, email: 'kiran@kicksfly.in', label: 'Demo Storekeeper Dashboard', color: 'from-blue-500/20 to-indigo-600/20 text-blue-400 border border-blue-500/30', emoji: '🏪' },
  { role: 'admin' as Role, email: 'admin@kicksfly.in', label: 'Demo Administrator Panel', color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30', emoji: '👑' },
];

// Google Icon SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087C16.6582 14.0518 17.64 11.8282 17.64 9.2045z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.4673-.8063 5.9564-2.1804l-2.9087-2.2582c-.8063.54-1.8368.8591-3.0477.8591-2.3441 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71C3.7841 10.17 3.6818 9.5945 3.6818 9s.1023-1.17.2823-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9c0 1.4523.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
    <path d="M9 3.5795c1.3213 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z" fill="#EA4335"/>
  </svg>
);

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email] = useState('customer@kicksfly.in');
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async (role: Role) => {
    setGoogleLoading(true);
    await loginWithGoogle(role);
    // Browser will redirect to Google — setGoogleLoading stays true during redirect
  };

  return (
    <div className="min-h-screen bg-[#060606] relative overflow-hidden">
      <div className="absolute top-28 right-8 w-96 h-96 rounded-full bg-[#E8FF47]/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#D8FF1A]/[0.03] blur-[100px] pointer-events-none" />

      <div className="relative z-10 border-b border-[#E8FF47]/30 bg-[#C9FF1A] text-black text-[10px] font-mono-custom uppercase tracking-[0.25em] text-center py-1.5">
        Free express shipping on premium drops above ₹4,999
      </div>

      <header className="relative z-10 border-b border-white/10 bg-[#0B0B0B]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2 min-w-[160px]">
            <div className="w-8 h-8 rounded-sm bg-[#E8FF47] flex items-center justify-center">
              <Zap size={15} className="text-black fill-black" />
            </div>
            <span className="font-display text-[20px] text-white tracking-wide leading-none">
              KICKS<span className="text-[#E8FF47]">FLY</span>
            </span>
          </div>
          <button className="hidden md:flex items-center gap-1.5 text-neutral-300 border border-white/15 rounded-full px-3 py-1.5 text-[11px] font-mono-custom uppercase tracking-wider hover:border-[#E8FF47]/40">
            <MapPin size={13} className="text-[#E8FF47]" />
            <span>Mumbai</span>
          </button>
          <nav className="hidden lg:flex items-center gap-6 mx-auto text-[11px] font-mono-custom uppercase tracking-[0.22em] text-neutral-400">
            <a href="#" className="text-white">New Arrivals</a>
            <a href="#" className="hover:text-white transition-colors">Men</a>
            <a href="#" className="hover:text-white transition-colors">Women</a>
            <a href="#" className="hover:text-white transition-colors">Collections</a>
            <a href="#" className="hover:text-white transition-colors">Sale</a>
          </nav>
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {[Search, ShoppingBag, User].map((Icon, idx) => (
              <button key={idx} className="w-9 h-9 rounded-full border border-white/15 hover:border-[#E8FF47]/60 text-neutral-300 hover:text-[#E8FF47] flex items-center justify-center transition-all">
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:py-14 md:py-20 flex items-center justify-center">
      <div className="relative w-full max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0C0C0C] rounded-2xl shadow-[0_30px_120px_rgba(0,0,0,0.75)] border border-white/[0.08] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8">
            <div className="flex items-center gap-2 mb-8 justify-center">
              {step === 'otp' && (
                <button onClick={() => setStep('phone')} className="p-1.5 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all mr-1">
                  <ChevronLeft size={16} />
                </button>
              )}
              <div className="w-9 h-9 rounded-md bg-[#E8FF47] flex items-center justify-center shadow-[0_0_20px_rgba(232,255,71,0.3)]">
                <Zap size={15} className="text-black fill-black" />
              </div>
              <span className="font-display text-[22px] text-white tracking-wide leading-none">
                KICKS<span className="text-[#E8FF47]">FLY</span>
              </span>
            </div>

            {/* Google Sign-In */}
            <div className="mb-6">
              <h1 className="font-display text-4xl tracking-[0.12em] text-white uppercase mb-2 text-center">Sign In</h1>
              <p className="text-neutral-400 text-xs font-mono-custom mb-6 text-center tracking-wide">Use Google for instant access, or continue with demo sign-in below.</p>

              <div className="space-y-3">
                {[
                  { role: 'customer' as Role, label: 'Continue as Customer' },
                  { role: 'storekeeper' as Role, label: 'Continue as Shopkeeper' },
                  { role: 'admin' as Role, label: 'Continue as Admin' },
                ].map((item) => (
                  <button
                    key={item.role}
                    id={`google-signin-btn-${item.role}`}
                    onClick={() => handleGoogleLogin(item.role)}
                    disabled={googleLoading || !isSupabaseConfigured}
                    className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white hover:bg-neutral-100 active:bg-neutral-200 text-black font-bold text-sm rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <GoogleIcon />
                    )}
                    <span className="font-mono-custom text-xs font-bold uppercase tracking-wider">
                      {googleLoading ? 'Redirecting...' : item.label}
                    </span>
                  </button>
                ))}
              </div>

              {!isSupabaseConfigured && (
                <p className="text-[10px] text-amber-300/80 mt-3 font-mono-custom uppercase tracking-wide text-center">
                  Google sign-in is disabled until Supabase auth is configured.
                </p>
              )}

              <div className="flex items-center gap-3 mt-6 mb-1">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[9px] font-mono-custom font-bold text-neutral-500 uppercase tracking-widest">or use demo accounts</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>
            </div>

            {/* Demo OTP Flow */}
            {!isSupabaseConfigured && (
              <AnimatePresence mode="wait">
                {step === 'phone' ? (
                  <motion.div key="phone" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
                    <h1 className="font-display text-3xl tracking-[0.12em] text-white uppercase text-center">Welcome back</h1>
                    <p className="text-neutral-500 text-xs mt-2 font-mono-custom text-center">Enter your mobile number to check in</p>

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
                            className="w-full pl-20 pr-4 py-3.5 bg-[#101010] border border-white/10 rounded-xl text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20 transition-all font-mono-custom"
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
                    <h1 className="font-display text-3xl tracking-[0.12em] text-white uppercase">Verify OTP</h1>
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
                          className="w-full aspect-square bg-[#111111] border border-white/10 rounded-xl text-center text-lg font-bold text-[#E8FF47] focus:border-[#E8FF47]/50 focus:outline-none transition-all font-mono-custom"
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
            )}
          </div>

          {/* Quick Demo Login Accounts */}
          <div className="px-6 sm:px-10 pb-8 sm:pb-10">
            {isSupabaseConfigured && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[9px] font-mono-custom font-bold text-neutral-500 uppercase tracking-widest">Dev / Demo Access</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>
            )}

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => handleLogin(acc.email)}
                  className="w-full flex items-center gap-3 p-3.5 bg-[#101010] border border-white/10 rounded-xl hover:border-[#E8FF47]/40 hover:bg-[#E8FF47]/[0.02] transition-all text-left"
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
      </main>
    </div>
  );
};
