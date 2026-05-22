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
} from 'lucide-react';
import { mockProducts, mockInventory } from '@/lib/mock';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/Button';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  const product = mockProducts.find((p) => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">👟</p>
          <h2 className="text-2xl font-black text-gray-900">Sneaker not found</h2>
          <Link to="/shop" className="mt-4 inline-block text-violet-600 hover:text-violet-700 font-semibold">
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
    addItem(product, selectedSize, 'store-001');
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      openCart();
    }, 800);
  };

  const related = mockProducts.filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category)).slice(0, 3);

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on KicksFly`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
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
    addItem(product, selectedSize, 'store-001');
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-gray-900 transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-violet-50/30 aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <button
                onClick={() => setWishlist(!wishlist)}
                className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all"
              >
                <Heart
                  size={18}
                  className={wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>

              <button onClick={handleShare} className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all">
                <Share2 size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-violet-500' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
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
                <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">NEW</span>
              )}
              {product.tags.includes('limited') && (
                <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">LIMITED EDITION</span>
              )}
              {product.tags.includes('bestseller') && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">🔥 BESTSELLER</span>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-violet-500 uppercase tracking-widest">{product.brand}</p>
              <h1 className="text-4xl font-black text-gray-900 mt-1 leading-tight">{product.name}</h1>
              <p className="text-gray-500 mt-1">{product.colorway}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-900">{product.rating}</span>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-gray-900">{formatCurrency(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-lg">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Delivery ETA */}
            <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-violet-600 fill-violet-600" />
                <span className="text-sm font-bold text-violet-700">Express 30-min Delivery</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600 ml-auto">
                <Clock size={14} />
                <span>Arrives by ~3:30 PM</span>
              </div>
            </div>

            {/* Size Selector */}
            <div id="size-selector">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900">Select Size (UK)</h3>
                <a href="#size-selector" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                  Size Guide
                </a>
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
                      className={`relative flex flex-col items-center justify-center py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        isOutOfStock
                          ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                          : isSelected
                          ? 'border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-200'
                          : 'border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50'
                      }`}
                    >
                      {sv.size}
                      {isLow && !isOutOfStock && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" title={`Only ${stock} left`} />
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-gray-200 rotate-45" />
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
                  className="mt-2 text-sm text-gray-600"
                >
                  {getSizeStock(selectedSize) > 2
                    ? `✓ In stock at Indiranagar`
                    : `⚡ Only ${getSizeStock(selectedSize)} left!`}
                </motion.p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize}
                isLoading={addedToCart}
              >
                {addedToCart ? '✓ Added to Cart!' : selectedSize ? 'Add to Cart' : 'Select a Size'}
              </Button>
              <Button variant="secondary" fullWidth size="lg" onClick={handleBuyNow} disabled={!selectedSize}>
                Buy Now — Pay on Delivery
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Shield size={14} />, text: '100% Authentic' },
                { icon: <Truck size={14} />, text: 'Free Returns' },
                { icon: <Zap size={14} />, text: '30-Min Delivery' },
                { icon: <Star size={14} />, text: 'Premium Quality' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-violet-500">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-gray-900 mb-3">About this Sneaker</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-black text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover-lift shadow-card"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-50 to-violet-50/20 overflow-hidden">
                    <img
                      src={rp.images[0]}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-violet-500 uppercase">{rp.brand}</p>
                    <h3 className="font-black text-gray-900 mt-0.5 text-sm">{rp.name}</h3>
                    <p className="font-bold text-gray-900 mt-2">{formatCurrency(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
