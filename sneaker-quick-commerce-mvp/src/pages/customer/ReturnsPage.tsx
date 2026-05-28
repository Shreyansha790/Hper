import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle2, Clock, X } from 'lucide-react';
import { mockReturnRequests } from '@/lib/mock';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const RETURN_REASONS = [
  { value: 'wrong_size', label: 'Wrong Size', emoji: '📏' },
  { value: 'defective', label: 'Defective Product', emoji: '⚠️' },
  { value: 'not_as_described', label: 'Not as Described', emoji: '🖼️' },
  { value: 'changed_mind', label: 'Changed Mind', emoji: '💭' },
  { value: 'damaged_delivery', label: 'Damaged in Delivery', emoji: '📦' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  requested: { label: 'Requested', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: <Clock size={12} /> },
  approved: { label: 'Approved', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: <CheckCircle2 size={12} /> },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: <X size={12} /> },
  refunded: { label: 'Refunded', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: <CheckCircle2 size={12} /> },
};

export const ReturnsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setSubmitted(true);
    await new Promise((r) => setTimeout(r, 1000));
    setShowForm(false);
    setSubmitted(false);
    setSelectedReason('');
    setDescription('');
  };

  return (
    <div className="min-h-screen-safe bg-[#0A0A0A] text-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
          <div>
            <h1 className="font-display text-[44px] leading-none tracking-wide text-white uppercase">RETURNS</h1>
            <p className="text-neutral-500 text-xs mt-1 font-mono-custom">7-day no-questions-asked return policy</p>
          </div>
          <Button variant="accent" size="sm" onClick={() => setShowForm(true)}>
            + Request Return
          </Button>
        </div>

        {/* Return Request Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-[#111111] rounded-sm border border-white/10 p-6 mb-6 shadow-premium"
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.06]">
                <h2 className="font-display text-xl tracking-wider uppercase text-white">New Return Request</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-sm text-neutral-500 hover:bg-white/5 hover:text-white transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold font-mono-custom text-neutral-400 uppercase tracking-wider mb-3">Reason for Return</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RETURN_REASONS.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setSelectedReason(r.value)}
                        className={`flex items-center gap-2 p-3 rounded-sm border text-left text-xs font-bold tracking-wider uppercase transition-all ${
                          selectedReason === r.value
                            ? 'border-[#E8FF47] bg-[#E8FF47]/10 text-white'
                            : 'border-white/10 bg-[#0A0A0A] text-neutral-400 hover:border-white/20'
                        }`}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold font-mono-custom text-neutral-400 uppercase tracking-wider mb-2">Additional Details</p>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product or sizing issue in detail..."
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button
                    variant="accent"
                    size="sm"
                    isLoading={submitted}
                    onClick={handleSubmit}
                    disabled={!selectedReason}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Policy Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { emoji: '7️⃣', title: '7-Day Limit', desc: 'From delivery date' },
            { emoji: '💰', title: 'Full Refund', desc: 'Back to payment source' },
            { emoji: '🚀', title: 'Instant Pickup', desc: 'Rider arrives in 24hrs' },
          ].map((info, i) => (
            <div key={i} className="bg-[#111111] rounded-sm border border-white/[0.07] p-4 text-center font-mono-custom">
              <p className="text-2xl mb-2">{info.emoji}</p>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{info.title}</p>
              <p className="text-[10px] text-neutral-500 mt-1">{info.desc}</p>
            </div>
          ))}
        </div>

        {/* Returns List */}
        <h2 className="text-xs font-bold font-mono-custom text-neutral-400 uppercase tracking-wider mb-4">Return History</h2>
        {mockReturnRequests.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] rounded-sm border border-white/[0.07]">
            <Package size={40} className="text-neutral-700 mx-auto mb-3" />
            <p className="font-display text-xl tracking-wide uppercase text-white">No returns logged</p>
            <p className="text-xs text-neutral-500 mt-1 font-mono-custom">Your sneaker return history will show up here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockReturnRequests.map((ret, i) => {
              const config = STATUS_CONFIG[ret.status];
              const reason = RETURN_REASONS.find((r) => r.value === ret.reason);

              return (
                <motion.div
                  key={ret.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#111111] rounded-sm border border-white/[0.07] p-5"
                >
                  <div className="flex items-start justify-between mb-4 pb-2 border-b border-white/[0.04]">
                    <div>
                      <p className="text-[9px] font-mono-custom text-neutral-500 uppercase tracking-wider">Return Reference ID</p>
                      <p className="font-bold text-white text-xs font-mono-custom">{ret.id}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider font-mono-custom ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-2xl mt-0.5">{reason?.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-wider font-mono-custom">{reason?.label}</p>
                      <p className="text-xs text-neutral-400 mt-0.5 font-medium">{ret.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono-custom">
                    <p className="text-neutral-500">Requested {formatDate(ret.createdAt)}</p>
                    <p className="font-bold text-white">
                      {ret.status === 'refunded' ? (
                        <span className="text-emerald-400">Refunded {formatCurrency(ret.refundAmount)}</span>
                      ) : (
                        formatCurrency(ret.refundAmount)
                      )}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
