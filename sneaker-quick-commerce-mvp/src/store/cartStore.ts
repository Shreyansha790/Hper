import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

export interface CartLineItem {
  id: string;
  productId: string;
  sneakerName: string;
  selectedSize: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartLineItem[];
  isOpen: boolean;
  addItem: (product: Product, selectedSize: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, selectedSize) => {
        const existing = get().items.find(
          (item) => item.productId === product.id && item.selectedSize === selectedSize
        );

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
          return;
        }

        const lineItem: CartLineItem = {
          id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          productId: product.id,
          sneakerName: product.name,
          selectedSize,
          price: product.price,
          quantity: 1,
          imageUrl: product.images[0] || '',
        };

        set({ items: [...get().items, lineItem] });
      },
      removeItem: (itemId) => set({ items: get().items.filter((item) => item.id !== itemId) }),
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'kicksfly-cart-v2' }
  )
);
