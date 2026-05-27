import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, ArrowRight, Star, Clock, Shield, Truck, ChevronRight, TrendingUp } from 'lucide-react';
import { mockProducts } from '@/lib/mock';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

/* ─── Data ─────────────────────────────────────────────── */
const categories = [
  { name: 'Lifestyle',     slug: 'lifestyle',     label: '01', count: 24 },
  { name: 'Basketball',    slug: 'basketball',    label: '02', count: 18 },
  { name: 'Running',       slug: 'running',       label: '03', count: 15 },
  { name: 'Skateboarding', slug: 'skateboarding', label: '04', count: 12 },
];

const features = [
  { icon: <Zap size={18} />,   title: '30-MIN DELIVERY',   desc: 'From our city warehouse to your door' },
  { icon: <Shield size={18} />, title: 'PREMIUM UA GRADE',  desc: 'Exact 1:1 precision, high-grade materials' },
  { icon: <Truck size={18} />,  title: 'FREE ON ₹15K+',    desc: 'Always free above threshold' },
  { icon: <Clock size={18} />,  title: '7-DAY RETURNS',    desc: 'No questions asked return policy' },
];

// Ticker brands repeated for seamless loop
const BRAND_TICKER = 'NIKE · JORDAN · YEEZY · NEW BALANCE · ADIDAS · OFF-WHITE · TRAVIS SCOTT · FRAGMENT · SACAI · DUNK · AIR MAX · AIR FORCE 1 · ';

/* ─── Component ─────────────────────────────────────────── */
export const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY      = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { addItem } = useCartStore();

  const featuredProducts = mockProducts.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] overflow-hidden">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <div ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Accent glow blobs */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-[#E8FF47]/[0.04] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#E8FF47]/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Left — Copy */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>

            {/* Label pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8FF47]/10 border border-[#E8FF47]/25 rounded-sm mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8FF47] animate-pulse-soft" />
              <span className="text-[11px] font-bold text-[#E8FF47] tracking-[0.12em] uppercase font-mono-custom">
                Bangalore's Fastest Import Delivery
              </span>
            </motion.div>

            {/* Hero Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-display text-[clamp(72px,10vw,130px)] leading-[0.92] tracking-wide text-white"
            >
              PREMIUM<br />
              1:1<br />
              <span className="text-[#E8FF47]">MASTER</span><br />
              COPIES
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 text-sm text-neutral-400 leading-relaxed max-w-sm font-medium"
            >
              Nike. Jordan. Yeezy. New Balance. Top-tier imports delivered express from our Bangalore warehouses.{' '}
              <span className="text-white font-semibold">No waiting. No compromise.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/shop">
                <button className="flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-black bg-[#E8FF47] rounded-sm hover:bg-[#d4eb30] transition-all shadow-[0_0_28px_rgba(232,255,71,0.3)] hover:shadow-[0_0_44px_rgba(232,255,71,0.45)] hover:-translate-y-0.5 tracking-wider">
                  SHOP NOW <ArrowRight size={15} />
                </button>
              </Link>
              <Link to="/shop?category=featured">
                <button className="flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white border border-white/15 rounded-sm hover:border-[#E8FF47]/50 hover:text-[#E8FF47] transition-all hover:-translate-y-0.5 tracking-wider">
                  NEW DROPS <ChevronRight size={15} />
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-10 flex items-center gap-6"
            >
              {[
                { value: '2,000+', label: 'Happy Customers' },
                { value: '3',      label: 'City Warehouses' },
                { value: '4.9★',   label: 'Average Rating' },
              ].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div className="w-px h-8 bg-white/[0.08]" />}
                  <div>
                    <p className="text-lg font-bold text-white font-mono-custom">{s.value}</p>
                    <p className="text-[10px] text-neutral-500 tracking-wide mt-0.5">{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.9, type: 'spring', stiffness: 60 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Glow behind shoe */}
              <div className="absolute inset-0 blur-[80px] rounded-full bg-[#E8FF47]/15 scale-75 pointer-events-none" />

              {/* Shoe */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <img
                  src="/images/hero-sneaker.jpg"
                  alt="Featured Sneaker"
                  className="w-full object-contain"
                  style={{ filter: 'drop-shadow(0 40px 80px rgba(232,255,71,0.2))' }}
                />
              </motion.div>

              {/* Floating pill — Stock */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute top-8 -left-4 glass rounded-sm px-3.5 py-2.5 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] font-bold text-white font-mono-custom">IN STOCK · INDIRANAGAR</p>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5 font-mono-custom">12 units available</p>
              </motion.div>

              {/* Floating pill — ETA */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 }}
                className="absolute bottom-12 -right-4 glass rounded-sm px-3.5 py-2.5 shadow-premium"
              >
                <div className="flex items-center gap-1.5">
                  <Zap size={11} className="text-[#E8FF47] fill-[#E8FF47]" />
                  <p className="text-[10px] font-bold text-[#E8FF47] uppercase tracking-wide">Express Delivery</p>
                </div>
                <p className="text-xl font-bold text-white mt-0.5 font-mono-custom">~25 MIN</p>
              </motion.div>

              {/* Floating pill — Trending */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="absolute -bottom-2 left-6 glass rounded-sm px-3 py-2 shadow-premium flex items-center gap-2"
              >
                <TrendingUp size={11} className="text-[#E8FF47]" />
                <p className="text-[10px] font-semibold text-neutral-300">🔥 Top Seller This Week</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-600"
        >
          <span className="text-[10px] font-mono-custom tracking-[0.15em] uppercase">Scroll</span>
          <div className="w-4 h-7 border border-neutral-700 rounded-full flex items-start justify-center pt-1">
            <div className="w-0.5 h-2 bg-[#E8FF47] rounded-full animate-pulse-soft" />
          </div>
        </motion.div>
      </div>

      {/* ════════════════════════════════════════
          BRAND MARQUEE
      ════════════════════════════════════════ */}
      <div className="py-4 border-y border-white/[0.07] overflow-hidden bg-[#0D0D0D]">
        <div className="flex whitespace-nowrap">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="animate-ticker-slow inline-flex items-center font-display text-[22px] text-neutral-700 tracking-[0.08em] pr-0"
            >
              {BRAND_TICKER}{BRAND_TICKER}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FEATURES BAR
      ════════════════════════════════════════ */}
      <div className="py-10 bg-[#0D0D0D] border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3.5 p-5 bg-[#0D0D0D]"
              >
                <div className="w-9 h-9 rounded-sm bg-[#E8FF47]/10 border border-[#E8FF47]/20 flex items-center justify-center text-[#E8FF47] flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white tracking-[0.08em] font-mono-custom">{f.title}</p>
                  <p className="text-[11px] text-neutral-500 leading-snug mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════ */}
      <div className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[10px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.2em] mb-2">Explore</p>
            <h2 className="font-display text-[52px] text-white leading-none tracking-wide">SHOP BY CATEGORY</h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-[#E8FF47] transition-colors tracking-wider uppercase"
          >
            View All <ChevronRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group block relative overflow-hidden bg-[#111111] border border-white/[0.07] rounded-sm p-6 hover:border-[#E8FF47]/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Number label */}
                <p className="text-[10px] font-mono-custom text-neutral-700 mb-3">{cat.label}</p>
                <h3 className="font-display text-[32px] text-white leading-none group-hover:text-[#E8FF47] transition-colors duration-300">
                  {cat.name.toUpperCase()}
                </h3>
                <p className="text-[11px] text-neutral-600 mt-1.5">{cat.count} styles</p>

                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-neutral-600 group-hover:text-[#E8FF47] transition-colors tracking-wider">
                  SHOP <ArrowRight size={10} />
                </div>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8FF47] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          FEATURED PRODUCTS
      ════════════════════════════════════════ */}
      <div className="py-20 bg-[#0D0D0D] border-y border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-[10px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.2em] mb-2">🔥 Hot Right Now</p>
              <h2 className="font-display text-[52px] text-white leading-none tracking-wide">FEATURED DROPS</h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-[#E8FF47] transition-colors tracking-wider uppercase"
            >
              View All <ChevronRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="group relative bg-[#111111] border border-white/[0.07] rounded-sm overflow-hidden hover:border-[#E8FF47]/40 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                  {product.tags.includes('new') && (
                    <span className="px-2 py-0.5 bg-[#E8FF47] text-black text-[9px] font-bold rounded-sm tracking-wider uppercase">NEW</span>
                  )}
                  {product.tags.includes('limited') && (
                    <span className="px-2 py-0.5 bg-white text-black text-[9px] font-bold rounded-sm tracking-wider uppercase">LIMITED</span>
                  )}
                  {product.originalPrice > product.price && (
                    <span className="px-2 py-0.5 bg-[#FF3131] text-white text-[9px] font-bold rounded-sm tracking-wider uppercase">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* 1:1 badge */}
                <span className="absolute top-3 right-3 z-10 px-2 py-0.5 border border-white/20 text-[9px] font-mono-custom text-neutral-400 uppercase tracking-[0.15em] rounded-sm bg-black/60">
                  1:1 IMPORT
                </span>

                {/* Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative h-60 bg-gradient-to-b from-[#161616] to-[#111111] overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-[9px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.18em]">{product.brand}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-display text-[22px] text-white mt-0.5 leading-tight hover:text-[#E8FF47] transition-colors">
                      {product.name.toUpperCase()}
                    </h3>
                  </Link>
                  <p className="text-[10px] text-neutral-600 mt-0.5">{product.colorway}</p>

                  <div className="flex items-center gap-1 mt-2">
                    <Star size={10} className="fill-[#E8FF47] text-[#E8FF47]" />
                    <span className="text-[11px] font-semibold text-neutral-300">{product.rating}</span>
                    <span className="text-[10px] text-neutral-600">({product.reviewCount})</span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <span className="text-lg font-bold text-white font-mono-custom">{formatCurrency(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-neutral-600 line-through ml-2 font-mono-custom">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addItem(product, product.sizes[0]?.size || '9')}
                      className="px-4 py-2 bg-[#E8FF47] text-black text-xs font-bold rounded-sm hover:bg-[#d4eb30] transition-all hover:-translate-y-0.5 tracking-wider"
                    >
                      + ADD
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-white/[0.06]">
                    <Zap size={9} className="text-[#E8FF47] fill-[#E8FF47]" />
                    <span className="text-[10px] font-mono-custom text-[#E8FF47]">~25 MIN DELIVERY</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CTA — YELLOW SECTION
      ════════════════════════════════════════ */}
      <div className="py-24 bg-[#E8FF47] relative overflow-hidden">
        {/* Texture grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/10 rounded-sm text-[10px] font-mono-custom font-bold text-black tracking-[0.15em] uppercase mb-6">
              <Zap size={11} className="fill-black" /> Limited Launch Offer
            </span>
            <h2 className="font-display text-[clamp(52px,9vw,110px)] text-black leading-[0.9] tracking-wide">
              YOUR FIRST PAIR<br />DELIVERED FREE
            </h2>
            <p className="mt-6 text-sm text-black/60 max-w-md mx-auto font-medium">
              Use code{' '}
              <span className="font-mono-custom font-bold text-black bg-black/10 px-2 py-0.5 rounded-sm">KICKSFLY</span>
              {' '}at checkout for free express delivery on your first order.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/shop">
                <button className="flex items-center gap-2 px-8 py-4 text-sm font-bold text-[#E8FF47] bg-black rounded-sm hover:bg-neutral-900 transition-all shadow-[0_8px_40px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 tracking-widest">
                  SHOP NOW <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="py-10 border-t border-white/[0.07] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#E8FF47] rounded-sm flex items-center justify-center">
                <Zap size={12} className="text-black fill-black" />
              </div>
              <span className="font-display text-[20px] text-white tracking-wide">
                KICKS<span className="text-[#E8FF47]">FLY</span>
              </span>
            </div>

            <div className="flex gap-6">
              {[
                { label: 'Shop', to: '/shop' },
                { label: 'Orders', to: '/orders' },
                { label: 'Returns', to: '/returns' },
                { label: 'Dashboard', to: '/dashboard' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-[11px] text-neutral-600 hover:text-white transition-colors tracking-wider uppercase"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="text-[10px] text-neutral-700 font-mono-custom">
              © 2024 KICKSFLY · BANGALORE, INDIA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
