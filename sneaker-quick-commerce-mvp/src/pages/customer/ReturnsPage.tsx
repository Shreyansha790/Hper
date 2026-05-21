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
  requested: { label: 'Requested', color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 size={12} /> },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: <X size={12} /> },
  refunded: { label: 'Refunded', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={12} /> },
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Returns & Refunds</h1>
            <p className="text-gray-500 text-sm mt-1">7-day no-questions-asked return policy</p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            + Request Return
          </Button>
        </div>

        {/* Return Request Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl border border-violet-200 shadow-card p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-gray-900">New Return Request</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Reason for Return</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RETURN_REASONS.map((r) => (
                      <button
                        key={r.value}
                        onClick={() => setSelectedReason(r.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${selectedReason === r.value ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                      >
                        <span>{r.emoji}</span>
                        <span>{r.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Additional Details</p>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button
                    variant="primary"
                    isLoading={submitted}
                    onClick={handleSubmit}
                    disabled={!selectedReason}
                  >
                    Submit Return Request
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Policy Info */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { emoji: '7️⃣', title: '7-Day Returns', desc: 'From delivery date' },
            { emoji: '💰', title: 'Full Refund', desc: 'Original payment method' },
            { emoji: '🚀', title: 'Quick Process', desc: 'Pickup in 24hrs' },
          ].map((info) => (
            <div key={info.title} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 text-center">
              <p className="text-2xl mb-2">{info.emoji}</p>
              <p className="text-sm font-bold text-gray-900">{info.title}</p>
              <p className="text-xs text-gray-500">{info.desc}</p>
            </div>
          ))}
        </div>

        {/* Returns List */}
        <h2 className="text-lg font-black text-gray-900 mb-4">Return History</h2>
        {mockReturnRequests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-900">No return requests</p>
            <p className="text-sm text-gray-500 mt-1">Your return history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockReturnRequests.map((ret, i) => {
              const config = STATUS_CONFIG[ret.status];
              const reason = RETURN_REASONS.find((r) => r.value === ret.reason);

              return (
                <motion.div
                  key={ret.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-card p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Return ID</p>
                      <p className="font-black text-gray-900 text-sm">{ret.id}</p>
                    </div>
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{reason?.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{reason?.label}</p>
                      <p className="text-xs text-gray-500">{ret.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Requested {formatDate(ret.createdAt)}</p>
                    <p className="text-sm font-black text-gray-900">
                      {ret.status === 'refunded' ? (
                        <span className="text-emerald-600">Refunded {formatCurrency(ret.refundAmount)}</span>
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
