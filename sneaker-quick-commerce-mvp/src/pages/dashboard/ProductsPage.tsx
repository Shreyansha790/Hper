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
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{mockProducts.length} sneakers in catalog</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowModal(true)}>
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden group"
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-50 to-violet-50/20">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="p-2.5 rounded-xl bg-white text-gray-900 hover:bg-violet-50 transition-all"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              {product.featured && (
                <span className="absolute top-3 left-3 px-2 py-1 bg-violet-600 text-white text-[10px] font-bold rounded-full">
                  FEATURED
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">{product.brand}</p>
              <h3 className="font-black text-gray-900 mt-0.5 leading-tight">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{product.colorway}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-gray-600">{product.rating}</span>
                <span className="text-xs text-gray-400">({product.reviewCount})</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="font-black text-gray-900">{formatCurrency(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
                <div className="flex gap-1 flex-wrap">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-gray-500">{product.sizes.length} sizes · {product.category}</p>
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
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-black text-gray-900">Add New Sneaker</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Image Upload Placeholder */}
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-violet-300 transition-all cursor-pointer">
                  <p className="text-3xl mb-2">📸</p>
                  <p className="text-sm font-semibold text-gray-700">Upload Product Images</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                  <button className="mt-3 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      {['lifestyle', 'basketball', 'running', 'skateboarding'].map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the sneaker..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button variant="primary" fullWidth onClick={() => setShowModal(false)}>Save Product</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
