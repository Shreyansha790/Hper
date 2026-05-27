import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Truck,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { mockProducts } from '@/lib/mock';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';

const categories = [
  { name: 'Lifestyle', emoji: '✨', color: 'from-violet-500 to-purple-600', count: 24 },
  { name: 'Basketball', emoji: '🏀', color: 'from-orange-500 to-red-600', count: 18 },
  { name: 'Running', emoji: '🏃', color: 'from-blue-500 to-indigo-600', count: 15 },
  { name: 'Skateboarding', emoji: '🛹', color: 'from-emerald-500 to-teal-600', count: 12 },
];

const features = [
  {
    icon: <Zap size={20} />,
    title: '30-Min Delivery',
    desc: 'From our store to your door faster than a pizza.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: <Shield size={20} />,
    title: 'Premium UA Quality',
    desc: 'Crafted with exact 1:1 precision, utilizing high-grade materials for an identical look and feel.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: <Truck size={20} />,
    title: 'Free Delivery',
    desc: 'Free on orders above ₹15,000. Always.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: <Clock size={20} />,
    title: 'Easy Returns',
    desc: '7-day no-questions-asked return policy.',
    color: 'text-orange-600 bg-orange-50',
  },
];

const FloatingOrb: React.FC<{ className: string; delay?: number }> = ({ className, delay = 0 }) => (
  <motion.div
    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
  />
);

export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { addItem } = useCartStore();

  const featuredProducts = mockProducts.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* HERO SECTION */}
      <div ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-subtle" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-200/40 via-purple-100/30 to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-200/30 via-violet-100/20 to-transparent blur-3xl" />
        </div>

        {/* Floating Orbs */}
        <FloatingOrb className="absolute top-20 right-20 w-64 h-64 rounded-full bg-violet-300/20 blur-2xl" delay={0} />
        <FloatingOrb className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-purple-300/20 blur-xl" delay={2} />
        <FloatingOrb className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-indigo-300/15 blur-xl" delay={4} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-200 mb-6"
            >
              <Sparkles size={14} className="text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">Bangalore's Fastest Top-Tier Import Delivery</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-none tracking-tight"
            >
              Premium 1:1 Master Copies
              <br />
              <span className="text-gradient">In 30</span>
              <br />
              Minutes
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed max-w-md"
            >
              Nike. Jordan. Yeezy. New Balance. Discover top-tier imports and master replicas delivered express from our city warehouses. No waiting, no compromise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/shop">
                <Button size="xl" variant="primary" rightIcon={<ArrowRight size={18} />}>
                  Shop Now
                </Button>
              </Link>
              <Link to="/shop?category=featured">
                <Button size="xl" variant="secondary" rightIcon={<Sparkles size={18} />}>
                  New Drops
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 flex items-center gap-6"
            >
              <div>
                <p className="text-2xl font-black text-gray-900">2,000+</p>
                <p className="text-xs text-gray-500 font-medium">Happy Customers</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-black text-gray-900">3</p>
                <p className="text-xs text-gray-500 font-medium">City Warehouses</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <p className="text-2xl font-black text-gray-900">4.9</p>
                <p className="text-xs text-gray-500 font-medium ml-1">Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glow */}
              <div className="absolute inset-0 blur-3xl rounded-full bg-violet-400/30 scale-75" />
              {/* Main Image */}
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <img
                  src="/images/hero-sneaker.jpg"
                  alt="Featured Sneaker"
                  className="w-full object-contain drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 30px 60px rgba(139, 92, 246, 0.4))' }}
                />
              </motion.div>

              {/* Floating Pills */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-8 -left-4 glass rounded-2xl px-4 py-3 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-gray-900">In Stock · Indiranagar</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">12 units available</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 -right-4 glass rounded-2xl px-4 py-3 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <Zap size={12} className="text-violet-600 fill-violet-600" />
                  <p className="text-xs font-bold text-violet-700">Express Delivery</p>
                </div>
                <p className="text-xl font-black text-gray-900 mt-0.5">~25 mins</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -bottom-2 left-8 glass rounded-xl px-3 py-2 shadow-premium flex items-center gap-2"
              >
                <TrendingUp size={12} className="text-violet-600" />
                <p className="text-xs font-semibold text-gray-700">🔥 Top Seller This Week</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-gray-300 rounded-full flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* FEATURES BAR */}
      <div className="py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{f.title}</p>
                  <p className="text-xs text-gray-400 leading-tight">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide mb-2">Explore</p>
            <h2 className="text-4xl font-black text-gray-900">Shop by Category</h2>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            View All <ChevronRight size={16} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/shop?category=${cat.name.toLowerCase()}`}
                className="group block relative overflow-hidden rounded-2xl p-6 hover-lift"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-15 transition-opacity`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5`} />
                <div className="relative">
                  <span className="text-4xl">{cat.emoji}</span>
                  <h3 className="text-lg font-black text-gray-900 mt-3">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.count} styles</p>
                  <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r ${cat.color} bg-clip-text text-transparent`}>
                    Shop Now <ArrowRight size={12} />
                  </div>
                </div>
                <div className={`absolute inset-0 rounded-2xl border border-gray-100 group-hover:border-violet-200 transition-colors`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide mb-2">🔥 Hot Right Now</p>
              <h2 className="text-4xl font-black text-gray-900">Featured Master Replicas</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
              View All <ChevronRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-card hover-lift border border-gray-100"
              >
                {/* Tags */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {product.tags.includes('new') && (
                    <span className="px-2 py-1 bg-violet-600 text-white text-xs font-bold rounded-full">NEW</span>
                  )}
                  {product.tags.includes('limited') && (
                    <span className="px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">LIMITED</span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative h-64 bg-gradient-to-br from-gray-50 to-violet-50/30 overflow-hidden">
                    <motion.img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>

                <div className="p-5">
                  <p className="text-xs font-bold text-violet-500 uppercase tracking-widest">{product.brand}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-black text-gray-900 mt-1 hover:text-violet-700 transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">{product.colorway}</p>
                  <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[10px] font-bold uppercase tracking-wide">
                    {product.tags.includes('ua-grade') ? 'UA Grade' : '1:1 Import'}
                  </span>

                  <div className="flex items-center gap-1 mt-2">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-xl font-black text-gray-900">{formatCurrency(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem(product, product.sizes[0]?.size || '9')}
                      className="px-4 py-2 rounded-xl text-sm font-bold text-white gradient-primary hover:opacity-90 transition-all shadow-md shadow-violet-200 hover:-translate-y-0.5"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-violet-600">
                    <Zap size={10} className="fill-violet-600" />
                    <span className="font-semibold">~25 min delivery</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-dark" />
        <FloatingOrb className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-700/20 blur-3xl" delay={0} />
        <FloatingOrb className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-700/20 blur-3xl" delay={3} />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold mb-6">
              <Zap size={14} className="fill-white" />
              Limited time launch offer
            </span>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-none">
              Get Your First Pair
              <br />
              <span className="text-gradient">Delivered Free</span>
            </h2>
            <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
              Use code <span className="font-black text-white">KICKSFLY</span> at checkout for free express delivery on your first order.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button size="xl" className="bg-white text-gray-900 hover:bg-gray-100 shadow-2xl">
                  Shop Now <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                <Zap size={14} className="text-white fill-white" />
              </div>
              <span className="font-black text-gray-900">Kicks<span className="text-gradient">Fly</span></span>
            </div>
            <div className="flex gap-6">
              <Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Shop</Link>
              <Link to="/orders" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Orders</Link>
              <Link to="/returns" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Returns</Link>
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
            </div>
            <p className="text-sm text-gray-400">© 2024 KicksFly. Bangalore, India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
