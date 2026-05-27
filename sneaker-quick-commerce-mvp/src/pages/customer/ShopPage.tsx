import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { mockProducts } from '@/lib/mock';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

const BRANDS = ['All', 'Nike', 'Jordan', 'Yeezy', 'New Balance'];
const CATEGORIES = ['All', 'Lifestyle', 'Basketball', 'Running', 'Skateboarding'];
const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Best Rated' },
  { value: 'newest',     label: 'Newest' },
];

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addItem } = useCartStore();
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category')
      ? searchParams.get('category')!.charAt(0).toUpperCase() + searchParams.get('category')!.slice(1)
      : 'All'
  );
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQ, setSearchQ] = useState(searchParams.get('q') || '');
  const [maxPrice, setMaxPrice] = useState(35000);
  const [addedId, setAddedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...mockProducts];

    if (searchQ) {
      const q = searchQ.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.colorway.toLowerCase().includes(q)
      );
    }
    if (selectedBrand !== 'All') list = list.filter((p) => p.brand === selectedBrand);
    if (selectedCategory !== 'All') list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    list = list.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }, [searchQ, selectedBrand, selectedCategory, sortBy, maxPrice]);

  const handleQuickAdd = (product: typeof mockProducts[0]) => {
    addItem(product, product.sizes[Math.floor(product.sizes.length / 2)]?.size || '9');
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const hasActiveFilters = selectedBrand !== 'All' || selectedCategory !== 'All';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">

      {/* ── Page Header ── */}
      <div className="bg-[#0D0D0D] border-b border-white/[0.07] pt-6 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.2em] mb-1">
              {filtered.length} Results
            </p>
            <h1 className="font-display text-[56px] text-white leading-none tracking-wide">
              EXCLUSIVE DROPS
            </h1>
            <p className="text-xs text-neutral-500 mt-2">30-minute express delivery guaranteed across Bangalore</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search master replicas..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-white/10 rounded-sm text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 bg-[#111111] border border-white/10 rounded-sm text-xs text-white focus:outline-none focus:border-[#E8FF47]/40 cursor-pointer transition-all"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-sm text-xs font-bold transition-all tracking-wider ${
                showFilters
                  ? 'bg-[#E8FF47] text-black border-[#E8FF47]'
                  : 'border-white/10 text-neutral-400 hover:border-white/25 hover:text-white bg-[#111111]'
              }`}
            >
              <SlidersHorizontal size={13} />
              FILTERS {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
            </button>
          </div>
        </div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 bg-[#111111] border border-white/[0.07] rounded-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white tracking-[0.1em] uppercase">Filters</h3>
                  <button
                    onClick={() => { setSelectedBrand('All'); setSelectedCategory('All'); setMaxPrice(35000); }}
                    className="text-[10px] font-mono-custom text-neutral-500 hover:text-[#E8FF47] transition-colors uppercase tracking-wider"
                  >
                    Reset All
                  </button>
                </div>

                {/* Brand */}
                <div>
                  <p className="text-[10px] font-mono-custom text-neutral-500 uppercase tracking-[0.15em] mb-3">Brand</p>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all tracking-wide ${
                          selectedBrand === brand
                            ? 'bg-[#E8FF47] text-black'
                            : 'border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="text-[10px] font-mono-custom text-neutral-500 uppercase tracking-[0.15em] mb-3">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all tracking-wide ${
                          selectedCategory === cat
                            ? 'bg-[#E8FF47] text-black'
                            : 'border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono-custom text-neutral-500 uppercase tracking-[0.15em]">Max Price</p>
                    <span className="text-xs font-bold text-[#E8FF47] font-mono-custom">{formatCurrency(maxPrice)}</span>
                  </div>
                  <input
                    type="range" min={5000} max={35000} step={1000}
                    value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#E8FF47]"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-600 mt-1 font-mono-custom">
                    <span>₹5,000</span><span>₹35,000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active Filter Pills ── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedBrand !== 'All' && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8FF47] text-black text-[10px] font-bold rounded-sm tracking-wider">
                {selectedBrand}
                <button onClick={() => setSelectedBrand('All')}><X size={10} /></button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#E8FF47] text-black text-[10px] font-bold rounded-sm tracking-wider">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* ── Product Grid ── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">👟</p>
            <h3 className="font-display text-3xl text-neutral-600 tracking-wide">NO SNEAKERS FOUND</h3>
            <p className="text-neutral-600 text-xs mt-2 font-mono-custom">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="group bg-[#111111] border border-white/[0.07] rounded-sm overflow-hidden hover:border-[#E8FF47]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Badges */}
                  <div className="flex gap-1 flex-wrap p-3 pb-0">
                    {product.tags.includes('new') && (
                      <span className="px-1.5 py-0.5 bg-[#E8FF47] text-black text-[8px] font-bold rounded-sm tracking-wider uppercase">NEW</span>
                    )}
                    {product.originalPrice > product.price && (
                      <span className="px-1.5 py-0.5 bg-[#FF3131] text-white text-[8px] font-bold rounded-sm tracking-wider uppercase">SALE</span>
                    )}
                  </div>

                  {/* Image */}
                  <Link to={`/product/${product.id}`}>
                    <div className="relative h-48 sm:h-56 bg-gradient-to-b from-[#161616] to-[#111111] overflow-hidden mx-3 mt-2 rounded-sm">
                      <span className="absolute top-2 right-2 z-20 px-2 py-0.5 border border-white/15 bg-black/70 text-[8px] font-mono-custom uppercase tracking-[0.18em] text-neutral-400 rounded-sm">1:1</span>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                      />
                    </div>
                  </Link>

                  <div className="p-3.5">
                    <p className="text-[9px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.18em]">{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-[18px] text-white mt-0.5 leading-tight hover:text-[#E8FF47] transition-colors">
                        {product.name.toUpperCase()}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={9} className="fill-[#E8FF47] text-[#E8FF47]" />
                      <span className="text-[10px] font-semibold text-neutral-300">{product.rating}</span>
                      <span className="text-[10px] text-neutral-600">({product.reviewCount})</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-base font-bold text-white font-mono-custom">{formatCurrency(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-neutral-600 line-through ml-1.5 font-mono-custom">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAdd(product)}
                        className={`px-3 py-1.5 rounded-sm text-[10px] font-bold transition-all tracking-wider ${
                          addedId === product.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#E8FF47] text-black hover:bg-[#d4eb30]'
                        }`}
                      >
                        {addedId === product.id ? '✓ ADDED' : '+ ADD'}
                      </motion.button>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1 pt-2.5 border-t border-white/[0.06]">
                      <Zap size={8} className="fill-[#E8FF47] text-[#E8FF47]" />
                      <span className="text-[9px] font-mono-custom text-[#E8FF47]">~25 MIN DELIVERY</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
