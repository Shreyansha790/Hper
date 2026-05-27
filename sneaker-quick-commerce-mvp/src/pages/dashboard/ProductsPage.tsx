import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Star, Search, X } from 'lucide-react';
import { mockProducts } from '@/lib/mock';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const ProductsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'lifestyle',
    colorway: '',
    description: '',
  });

  const filtered = mockProducts.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#0A0A0A] text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-white uppercase">Products</h1>
          <p className="text-neutral-500 text-xs mt-1 font-mono-custom uppercase tracking-wider">{mockProducts.length} sneakers in catalog</p>
        </div>
        <Button variant="accent" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowModal(true)}>
          ADD PRODUCT
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH PRODUCTS..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#111111] border border-white/[0.07] text-white rounded-sm text-xs focus:outline-none focus:border-[#E8FF47] focus:ring-1 focus:ring-[#E8FF47] font-mono-custom placeholder-neutral-500 uppercase tracking-wider"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#111111] border border-white/[0.07] rounded-sm shadow-card overflow-hidden group hover:border-white/15 transition-all"
          >
            <div className="relative h-48 bg-gradient-to-br from-white/5 to-white/[0.02] border-b border-white/[0.05]">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="p-2.5 rounded-sm bg-white text-black hover:bg-[#E8FF47] transition-all"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              {product.featured && (
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#E8FF47] text-black text-[9px] font-mono-custom font-bold rounded-sm shadow-glow-sm">
                  FEATURED
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[9px] font-mono-custom font-bold text-[#E8FF47] uppercase tracking-wider">{product.brand}</p>
              <h3 className="font-bold text-white text-sm uppercase leading-tight mt-0.5">{product.name}</h3>
              <p className="text-[10px] text-neutral-400 font-mono-custom">{product.colorway}</p>
              <div className="flex items-center gap-1 mt-1 text-[10px] font-mono-custom text-neutral-400">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="font-bold text-neutral-200">{product.rating}</span>
                <span>({product.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] mt-2">
                <div>
                  <span className="font-bold text-white font-mono-custom text-sm">{formatCurrency(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-neutral-500 line-through font-mono-custom ml-1">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-neutral-400 text-[9px] font-mono-custom font-bold rounded-sm uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2 text-[10px] text-neutral-500 font-mono-custom uppercase tracking-wider flex items-center justify-between">
                <span>{product.sizes.length} SIZES</span>
                <span className="text-[#E8FF47]">{product.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0D0D0D] border border-white/[0.07] rounded-sm shadow-2xl z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/[0.07]">
                <h2 className="font-display text-xl tracking-wider text-white uppercase">Add New Sneaker</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-sm hover:bg-white/5 text-neutral-400 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Image Upload Placeholder */}
                <div className="border-2 border-dashed border-white/10 bg-white/[0.02] rounded-sm p-8 text-center hover:border-[#E8FF47]/40 hover:bg-white/[0.04] transition-all cursor-pointer">
                  <p className="text-3xl mb-2">📸</p>
                  <p className="text-xs font-bold text-white uppercase tracking-wider mt-2">Upload Product Images</p>
                  <p className="text-[10px] text-neutral-500 font-mono-custom mt-1">PNG, JPG UP TO 10MB EACH</p>
                  <button className="mt-3 px-3 py-1.5 rounded-sm border border-white/10 hover:border-white/20 text-[10px] font-mono-custom font-bold text-neutral-300 hover:text-white bg-transparent hover:bg-white/5 transition-all uppercase tracking-wider">
                    Browse Files
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Brand"
                    placeholder="Nike, Jordan..."
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  />
                  <div>
                    <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-sm border border-white/10 bg-[#111111] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20 font-mono-custom uppercase tracking-wider"
                    >
                      {['lifestyle', 'basketball', 'running', 'skateboarding'].map((c) => (
                        <option key={c} value={c} className="bg-[#111111] text-white">{c.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="Product Name"
                  placeholder="Air Phantom X1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <Input
                  label="Colorway"
                  placeholder="White / Volt Gold"
                  value={form.colorway}
                  onChange={(e) => setForm({ ...form, colorway: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Retail Price (₹)"
                    placeholder="16999"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  <Input label="MRP (₹)" placeholder="21999" type="number" />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the sneaker..."
                    className="w-full px-4 py-2.5 rounded-sm bg-[#111111] border border-white/10 text-white text-sm focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20 resize-none font-mono-custom placeholder-neutral-600"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" fullWidth onClick={() => setShowModal(false)}>CANCEL</Button>
                  <Button variant="accent" fullWidth onClick={() => setShowModal(false)}>SAVE PRODUCT</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
