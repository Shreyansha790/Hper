import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import type { Role } from '@/types';

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
  const {
    login,
    loginWithGoogle,
    loginWithPassword,
    signUpWithPassword,
    clearAuthError,
    authError,
    isLoading,
  } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'customer' as Role,
  });

  const onAuthSuccess = () => {
    const user = useAuthStore.getState().user;
    navigate(user?.role === 'admin' || user?.role === 'storekeeper' ? '/dashboard' : '/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = isSignUp
      ? await signUpWithPassword(form.email, form.password, form.fullName || 'User', form.role)
      : await loginWithPassword(form.email, form.password);

    if (success) onAuthSuccess();
  };

  const handleGoogle = async (role: Role) => {
    await loginWithGoogle(role);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20 pb-12 px-4">
      <div className="relative w-full max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0D0D0D] rounded-sm border border-white/[0.07] overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-sm bg-[#E8FF47] flex items-center justify-center"><Zap size={15} className="text-black fill-black" /></div>
              <span className="font-display text-[20px] text-white tracking-wide leading-none">KICKS<span className="text-[#E8FF47]">FLY</span></span>
            </div>

            <h1 className="font-display text-3xl tracking-wider text-white uppercase mb-2">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
            <p className="text-neutral-500 text-xs font-mono-custom mb-5">Supabase authentication with secure email/password and Google OAuth.</p>

            {isSupabaseConfigured && (
              <div className="space-y-2 mb-5">
                {(['customer', 'storekeeper', 'admin'] as Role[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleGoogle(role)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white text-black font-bold text-sm rounded-sm disabled:opacity-70"
                  >
                    <GoogleIcon />
                    <span className="font-mono-custom text-xs font-bold uppercase tracking-wider">Continue with Google ({role})</span>
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignUp && (
                <input className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-sm text-sm text-white" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              )}
              <input type="email" required className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-sm text-sm text-white" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input type="password" required minLength={6} className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-sm text-sm text-white" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

              {isSignUp && (
                <select className="w-full px-4 py-3 bg-[#111111] border border-white/10 rounded-sm text-sm text-white" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                  <option value="customer">Customer</option>
                  <option value="storekeeper">Storekeeper</option>
                  <option value="admin">Admin</option>
                </select>
              )}

              {authError && <p className="text-red-400 text-xs">{authError}</p>}

              <button type="submit" disabled={isLoading || !isSupabaseConfigured} className="w-full py-3 bg-[#E8FF47] text-black text-xs font-bold uppercase tracking-wider rounded-sm disabled:opacity-60">
                {isLoading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <button
              onClick={() => {
                clearAuthError();
                setIsSignUp((prev) => !prev);
              }}
              className="mt-3 text-xs text-[#E8FF47] font-mono-custom"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>

            {!isSupabaseConfigured && (
              <div className="mt-4 space-y-2">
                <button onClick={() => login('customer@kicksfly.in')} className="w-full flex items-center gap-2 p-3 bg-[#111111] border border-white/10 rounded-sm text-white text-xs">Demo Customer <ArrowRight size={13} className="ml-auto" /></button>
              </div>
            )}

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
