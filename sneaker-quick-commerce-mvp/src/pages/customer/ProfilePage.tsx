import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Phone, Mail, Shield, LogOut, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  area: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [successMsg, setSuccessMsg] = useState('');
  
  // Local state for profile editing simulation
  const [name, setName] = useState(user?.name || 'Demo User');
  const [phone, setPhone] = useState(user?.phone || '+91 99999 99999');
  const [isEditing, setIsEditing] = useState(false);

  // Address simulation state
  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: 'addr-1',
      label: 'Home',
      line1: '12A, 5th Cross Road, Indiranagar',
      area: 'Indiranagar',
      city: 'Bangalore',
      pincode: '560038',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Work',
      line1: 'Building 4B, HAL Airport Road',
      area: 'Domlur',
      city: 'Bangalore',
      pincode: '560071',
      isDefault: false,
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    label: '',
    line1: '',
    area: '',
    city: 'Bangalore',
    pincode: '',
  });
  const [showAddAddress, setShowAddAddress] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20 text-white">
        <div className="text-center card-dark p-8 max-w-sm w-full mx-4">
          <p className="text-4xl mb-4 font-mono-custom">👤</p>
          <h2 className="font-display text-2xl tracking-wider">NOT LOGGED IN</h2>
          <p className="text-neutral-500 text-xs mt-2 font-mono-custom mb-6">Login to view your premium profile and order history</p>
          <a href="/auth" className="w-full inline-block py-2.5 bg-[#E8FF47] text-black text-xs font-bold tracking-wider hover:bg-[#d4eb30] transition-colors rounded-sm uppercase">
            Login Now
          </a>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    showNotification('Profile updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.line1 || !newAddress.pincode) return;

    const added: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddress.label,
      line1: newAddress.line1,
      area: newAddress.area,
      city: newAddress.city,
      pincode: newAddress.pincode,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, added]);
    setNewAddress({ label: '', line1: '', area: '', city: 'Bangalore', pincode: '' });
    setShowAddAddress(false);
    showNotification('Address added successfully!');
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(addr => addr.id !== id);
    if (updated.length > 0 && !updated.some(addr => addr.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    showNotification('Address deleted.');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showNotification('Default address updated.');
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Success Alert */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-[#111111] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-sm text-xs font-semibold shadow-premium"
          >
            <CheckCircle2 size={14} />
            {successMsg}
          </motion.div>
        )}

        <div className="mb-10">
          <p className="text-[10px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.2em] mb-1">Account settings</p>
          <h1 className="font-display text-[56px] leading-none tracking-wide text-white uppercase">USER PROFILE</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column — Account Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-dark p-6 space-y-6 flex flex-col items-center text-center">
              
              {/* Avatar circle */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#E8FF47]/10 border border-[#E8FF47]/30 flex items-center justify-center text-[#E8FF47] text-3xl font-display tracking-widest shadow-glow-sm">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 bg-[#E8FF47] text-black text-[9px] font-mono-custom font-bold uppercase rounded-sm border-2 border-[#0A0A0A]">
                  {user.role}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-wide text-white">{name}</h3>
                <p className="text-xs text-neutral-500 font-mono-custom mt-1">{user.email}</p>
              </div>

              <div className="w-full border-t border-white/[0.06] pt-6 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3 text-neutral-400 text-xs">
                  <Mail size={13} className="text-[#E8FF47]" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-xs">
                  <Phone size={13} className="text-[#E8FF47]" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-400 text-xs">
                  <Shield size={13} className="text-[#E8FF47]" />
                  <span className="capitalize">{user.role} Account</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-3 border border-red-500/25 hover:border-red-500 text-red-500 text-xs font-bold tracking-widest uppercase hover:bg-red-500/5 transition-all flex items-center justify-center gap-2 rounded-sm"
              >
                <LogOut size={12} /> Logout Account
              </button>
            </div>
          </div>

          {/* Right Column — Details & Addresses */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Details Form */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                <h2 className="font-display text-xl tracking-wider uppercase text-white">PERSONAL DETAILS</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-[#E8FF47] hover:text-[#d4eb30] font-bold tracking-wider font-mono-custom uppercase"
                  >
                    Edit Info
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      disabled={!isEditing}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#161616] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-[#E8FF47]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      disabled={!isEditing}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#161616] border border-white/10 rounded-sm text-sm text-white focus:outline-none focus:border-[#E8FF47]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="ghost" type="button" size="sm" onClick={() => { setIsEditing(false); setName(user.name); setPhone(user.phone); }}>
                      Cancel
                    </Button>
                    <Button variant="accent" type="submit" size="sm">
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Saved Addresses */}
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                <h2 className="font-display text-xl tracking-wider uppercase text-white">SAVED ADDRESSES</h2>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs text-[#E8FF47] hover:text-[#d4eb30] font-bold tracking-wider font-mono-custom uppercase flex items-center gap-1"
                >
                  <Plus size={12} /> Add New
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-[#161616] border border-white/10 rounded-sm space-y-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1">Label (e.g. Home)</label>
                      <input
                        required
                        placeholder="Home"
                        value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8FF47]/40"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1">Flat / Building / Line 1</label>
                      <input
                        required
                        placeholder="Flat 101, A Block"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8FF47]/40"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1">Area / Locality</label>
                      <input
                        placeholder="Indiranagar"
                        value={newAddress.area}
                        onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8FF47]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1">City</label>
                      <input
                        disabled
                        value={newAddress.city}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-sm text-xs text-white opacity-60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider mb-1">Pincode</label>
                      <input
                        required
                        maxLength={6}
                        placeholder="560038"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8FF47]/40"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white font-mono-custom uppercase"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#E8FF47] text-black text-xs font-bold tracking-wider hover:bg-[#d4eb30] transition-colors rounded-sm uppercase"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Addresses List */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`flex items-start gap-4 p-4 border rounded-sm transition-all ${
                      addr.isDefault
                        ? 'border-[#E8FF47] bg-[#E8FF47]/[0.02]'
                        : 'border-white/10 bg-[#111111] hover:border-white/20'
                    }`}
                  >
                    <MapPin size={16} className={addr.isDefault ? 'text-[#E8FF47] mt-0.5' : 'text-neutral-500 mt-0.5'} />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white uppercase tracking-wide">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="px-1.5 py-0.5 bg-[#E8FF47] text-black text-[8px] font-mono-custom font-bold uppercase rounded-sm">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-400 mt-1">{addr.line1}</p>
                      <p className="text-neutral-400">{addr.area}, {addr.city} — {addr.pincode}</p>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[10px] text-[#E8FF47] hover:text-[#d4eb30] font-bold mt-2 font-mono-custom uppercase"
                        >
                          Set As Default
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-neutral-600 hover:text-red-500 transition-colors p-1"
                      title="Delete Address"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
