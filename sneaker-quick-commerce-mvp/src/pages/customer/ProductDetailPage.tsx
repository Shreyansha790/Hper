import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Zap,
  Shield,
  Truck,
  ChevronRight,
  Heart,
  Share2,
  Clock,
  X,
} from 'lucide-react';
import { mockProducts, mockInventory } from '@/lib/mock';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';
import { safeLocalStorage, isBrowser } from '@/lib/utils/browser';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  const product = mockProducts.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Persistent wishlist via localStorage
  const [wishlist, setWishlist] = useState(() => {
    const saved = safeLocalStorage.getItem('kicksfly-wishlist');
    const list = saved ? JSON.parse(saved) : [];
    return list.includes(id || '');
  });

  if (!product) {
    return (
      <div className="min-h-screen-safe bg-[#0A0A0A] flex items-center justify-center pt-20 text-white">
        <div className="text-center card-dark p-8 max-w-sm w-full mx-4">
          <p className="text-4xl mb-4">👟</p>
          <h2 className="font-display text-2xl tracking-wider text-white">SNEAKER NOT FOUND</h2>
          <Link to="/shop" className="mt-6 inline-block text-[#E8FF47] hover:text-[#d4eb30] font-bold text-xs tracking-wider uppercase font-mono-custom">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const storeInventory = mockInventory.filter((inv) => inv.productId === product.id);
  const getSizeStock = (size: string) => {
    return storeInventory.filter((inv) => inv.size === size).reduce((sum, inv) => sum + inv.quantity, 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      openCart();
    }, 800);
  };

  const toggleWishlist = () => {
    const saved = safeLocalStorage.getItem('kicksfly-wishlist');
    let list = saved ? JSON.parse(saved) : [];
    if (list.includes(product.id)) {
      list = list.filter((pid: string) => pid !== product.id);
      setWishlist(false);
    } else {
      list.push(product.id);
      setWishlist(true);
    }
    safeLocalStorage.setItem('kicksfly-wishlist', JSON.stringify(list));
  };

  const related = mockProducts.filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category)).slice(0, 3);

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on KicksFly`,
      url: isBrowser ? window.location.href : '',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(isBrowser ? window.location.href : '');
        window.alert('Product link copied to clipboard!');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        window.alert('Unable to share right now. Please try again.');
      }
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen-safe bg-[#0A0A0A] text-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-8 tracking-wider uppercase font-mono-custom">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={12} className="text-neutral-700" />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight size={12} className="text-neutral-700" />
          <span className="text-[#E8FF47] font-semibold truncate">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-sm overflow-hidden bg-gradient-to-b from-[#161616] to-[#0D0D0D] border border-white/[0.07] aspect-square flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover" loading="eager" decoding="async"
                />
              </AnimatePresence>

              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 p-2.5 rounded-sm bg-black/60 border border-white/10 hover:border-white/20 shadow-md transition-all text-white"
              >
                <Heart
                  size={18}
                  className={wishlist ? 'fill-[#FF3131] text-[#FF3131]' : 'text-neutral-400'}
                />
              </button>

              {/* Share Button */}
              <button onClick={handleShare} className="absolute top-4 left-4 p-2.5 rounded-sm bg-black/60 border border-white/10 hover:border-white/20 shadow-md transition-all text-white">
                <Share2 size={18} className="text-neutral-400" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-sm overflow-hidden border-2 transition-all bg-[#111111] ${selectedImage === i ? 'border-[#E8FF47]' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="eager" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {product.tags.includes('new') && (
                <span className="px-2.5 py-0.5 bg-[#E8FF47] text-black text-[9px] font-mono-custom font-bold rounded-sm tracking-wider uppercase">NEW</span>
              )}
              {product.tags.includes('limited') && (
                <span className="px-2.5 py-0.5 bg-white text-black text-[9px] font-mono-custom font-bold rounded-sm tracking-wider uppercase">LIMITED EDITION</span>
              )}
              {product.tags.includes('bestseller') && (
                <span className="px-2.5 py-0.5 bg-amber-500 text-black text-[9px] font-mono-custom font-bold rounded-sm tracking-wider uppercase">🔥 BESTSELLER</span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-[#E8FF47] font-mono-custom uppercase tracking-[0.2em]">{product.brand}</p>
              <h1 className="font-display text-[44px] text-white mt-1 leading-tight uppercase tracking-wide">{product.name}</h1>
              <p className="text-neutral-500 text-sm mt-0.5">{product.colorway}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? 'fill-[#E8FF47] text-[#E8FF47]' : 'text-neutral-800 fill-neutral-800'}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white font-mono-custom">{product.rating}</span>
              <span className="text-xs text-neutral-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white font-mono-custom">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-neutral-600 line-through font-mono-custom">{formatCurrency(product.originalPrice)}</span>
                  <span className="px-2 py-0.5 bg-[#FF3131] text-white text-[10px] font-mono-custom font-bold rounded-sm uppercase tracking-wide">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Delivery ETA */}
            <div className="flex items-center gap-4 p-4 bg-[#111111] border border-white/[0.07] rounded-sm">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#E8FF47] fill-[#E8FF47]" />
                <span className="text-xs font-bold text-[#E8FF47] font-mono-custom uppercase tracking-wider">Express 30-min Delivery</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500 ml-auto font-mono-custom">
                <Clock size={12} />
                <span>Arrives by ~3:30 PM</span>
              </div>
            </div>

            {/* Size Selector */}
            <div id="size-selector" className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-mono-custom text-neutral-400 uppercase tracking-wider">Select Size (UK)</h3>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-xs text-[#E8FF47] hover:text-[#d4eb30] font-bold font-mono-custom uppercase tracking-wide"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {product.sizes.map((sv) => {
                  const stock = getSizeStock(sv.size);
                  const isOutOfStock = stock === 0;
                  const isSelected = selectedSize === sv.size;
                  const isLow = stock > 0 && stock <= 2;

                  return (
                    <button
                      key={sv.size}
                      onClick={() => !isOutOfStock && setSelectedSize(sv.size)}
                      disabled={isOutOfStock}
                      className={`relative flex flex-col items-center justify-center py-3 rounded-sm border text-xs font-bold font-mono-custom transition-all ${
                        isOutOfStock
                          ? 'border-white/5 bg-transparent text-neutral-700 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#E8FF47] bg-[#E8FF47] text-black shadow-glow-sm'
                          : 'border-white/10 bg-[#111111] text-neutral-300 hover:border-white/30 hover:bg-[#1A1A1A]'
                      }`}
                    >
                      {sv.size}
                      {isLow && !isOutOfStock && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full" title={`Only ${stock} left`} />
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-px bg-neutral-800 rotate-45" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedSize && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-neutral-400 font-mono-custom"
                >
                  {getSizeStock(selectedSize) > 2
                    ? `✓ In stock at Indiranagar Warehouse`
                    : `⚡ Only ${getSizeStock(selectedSize)} left in stock!`}
                </motion.p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                variant={selectedSize ? "accent" : "outline"}
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                isLoading={addedToCart}
              >
                {addedToCart ? '✓ Added to Cart!' : selectedSize ? 'Add to Cart' : 'Select a Size'}
              </Button>
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                onClick={handleBuyNow}
                disabled={!selectedSize}
              >
                Buy Now — Pay on Delivery
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
              {[
                { icon: <Shield size={13} />, text: '1:1 Master Craftsmanship' },
                { icon: <Truck size={13} />, text: '7-Day Return Policy' },
                { icon: <Zap size={13} />, text: '30-Min Delivery Limit' },
                { icon: <Star size={13} />, text: 'Premium Import Quality' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                  <span className="text-[#E8FF47]">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-white/[0.06] pt-6">
              <h3 className="text-xs font-bold font-mono-custom text-neutral-400 uppercase tracking-wider mb-2">About this Sneaker</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-medium">{product.description}</p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/[0.06]">
            <h2 className="font-display text-[32px] text-white mb-8 tracking-wider uppercase">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="group bg-[#111111] border border-white/[0.07] rounded-sm overflow-hidden hover:border-[#E8FF47]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="h-56 bg-gradient-to-b from-[#161616] to-[#111111] overflow-hidden">
                    <img
                      src={rp.images[0]}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-mono-custom text-[#E8FF47] uppercase tracking-[0.18em]">{rp.brand}</p>
                    <h3 className="font-display text-[20px] text-white mt-1 leading-tight group-hover:text-[#E8FF47] transition-colors">{rp.name.toUpperCase()}</h3>
                    <p className="font-mono-custom text-sm text-white mt-3">{formatCurrency(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing Modal Overlay */}
      <AnimatePresence>
        {showSizeGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSizeGuide(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0D0D0D] border border-white/10 p-6 shadow-premium z-10 rounded-sm"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.06]">
                <h3 className="font-display text-2xl tracking-wider">SIZE GUIDE (UNISEX)</h3>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="p-1.5 text-neutral-500 hover:text-white transition-all hover:bg-white/5 rounded-sm"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs font-mono-custom">
                  <thead>
                    <tr className="border-b border-white/10 text-neutral-500 font-bold uppercase tracking-wider">
                      <th className="py-2.5">UK (India)</th>
                      <th className="py-2.5">US Men</th>
                      <th className="py-2.5">US Women</th>
                      <th className="py-2.5">EU</th>
                      <th className="py-2.5">CM (Length)</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-300">
                    {[
                      { uk: '6', usM: '7', usW: '8', eu: '40', cm: '25.0' },
                      { uk: '7', usM: '8', usW: '9', eu: '41', cm: '26.0' },
                      { uk: '8', usM: '9', usW: '10', eu: '42.5', cm: '27.0' },
                      { uk: '9', usM: '10', usW: '11', eu: '44', cm: '28.0' },
                      { uk: '10', usM: '11', usW: '12', eu: '45', cm: '29.0' },
                      { uk: '11', usM: '12', usW: '13', eu: '46', cm: '30.0' },
                      { uk: '12', usM: '13', usW: '14', eu: '47.5', cm: '31.0' },
                    ].map((row) => (
                      <tr key={row.uk} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 font-bold text-white">UK {row.uk}</td>
                        <td className="py-2.5">US {row.usM}</td>
                        <td className="py-2.5">US {row.usW}</td>
                        <td className="py-2.5">EU {row.eu}</td>
                        <td className="py-2.5">{row.cm} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] text-neutral-600 mt-4 text-center">
                * KicksFly imports fit true to size. If you wear half sizes, we recommend sizing up.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
