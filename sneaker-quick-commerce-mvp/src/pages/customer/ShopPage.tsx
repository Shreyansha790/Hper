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
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest' },
];

export const ShopPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addItem } = useCartStore();
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ? searchParams.get('category')!.charAt(0).toUpperCase() + searchParams.get('category')!.slice(1) : 'All'
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

    if (selectedBrand !== 'All') {
      list = list.filter((p) => p.brand === selectedBrand);
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    list = list.filter((p) => p.price <= maxPrice);

    switch (sortBy) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      case 'newest': list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [searchQ, selectedBrand, selectedCategory, sortBy, maxPrice]);

  const handleQuickAdd = (product: typeof mockProducts[0]) => {
    addItem(product, product.sizes[Math.floor(product.sizes.length / 2)]?.size || '9');
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-gray-900">All Sneakers</h1>
            <p className="text-gray-500 mt-2">{filtered.length} styles available · Express delivery in your area</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search sneakers..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all ${showFilters ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'}`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Filters</h3>
                  <button onClick={() => { setSelectedBrand('All'); setSelectedCategory('All'); setMaxPrice(35000); }}
                    className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >Reset all</button>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Brand</p>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedBrand === brand ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-violet-300'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-violet-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-violet-300'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">Max Price</p>
                    <span className="text-sm font-bold text-violet-600">{formatCurrency(maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={5000}
                    max={35000}
                    step={1000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-violet-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>₹5,000</span>
                    <span>₹35,000</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedBrand !== 'All' && (
            <span className="flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {selectedBrand}
              <button onClick={() => setSelectedBrand('All')}><X size={10} /></button>
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('All')}><X size={10} /></button>
            </span>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">👟</p>
            <h3 className="text-lg font-bold text-gray-900">No sneakers found</h3>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-card hover-lift"
                >
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex gap-1 flex-wrap" style={{ position: 'relative' }}>
                    <div className="flex gap-1 flex-wrap p-3 pb-0">
                      {product.tags.includes('new') && (
                        <span className="px-2 py-0.5 bg-violet-600 text-white text-[10px] font-bold rounded-full">NEW</span>
                      )}
                      {product.originalPrice > product.price && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-violet-50/20 overflow-hidden -mt-8 pt-8">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm font-black text-gray-900 mt-0.5 leading-tight hover:text-violet-700 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="text-base font-black text-gray-900">{formatCurrency(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through ml-1">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuickAdd(product)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${addedId === product.id ? 'bg-emerald-500 text-white' : 'gradient-primary text-white'} shadow-sm`}
                      >
                        {addedId === product.id ? '✓ Added' : '+ Add'}
                      </motion.button>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[10px] text-violet-600">
                      <Zap size={8} className="fill-violet-600" />
                      <span className="font-semibold">~25 min delivery</span>
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
