import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { roleRoutes } from '@/services/auth/authService';
const roles: Role[] = ['customer', 'storekeeper', 'admin'];
export function LoginPage() { const [email, setEmail] = useState(''); const [role, setRole] = useState<Role>('customer'); const { login, isLoading } = useAuthStore(); const navigate = useNavigate();
const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); await login(email, role); navigate(roleRoutes[role]); };
return <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-purple-100 p-6"><form onSubmit={onSubmit} className="mx-auto mt-20 max-w-md space-y-4 rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur"><h1 className="text-3xl font-bold">Welcome Back</h1><input className="w-full rounded-xl border p-3" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required /><select className="w-full rounded-xl border p-3" value={role} onChange={(e)=>setRole(e.target.value as Role)}>{roles.map((r)=><option key={r} value={r}>{r}</option>)}</select><button className="w-full rounded-xl bg-violet-600 p-3 text-white" disabled={isLoading}>Login</button><p className="text-xs text-zinc-500">OTP verification placeholder will be enabled in the next phase.</p></form></div>; }
