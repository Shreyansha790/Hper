import { create } from 'zustand';
import type { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/lib/mock';

interface DashboardState {
  orders: Order[];
  selectedOrder: Order | null;
  isOrderDrawerOpen: boolean;
  activeTab: string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  selectOrder: (order: Order | null) => void;
  openOrderDrawer: (order: Order) => void;
  closeOrderDrawer: () => void;
  setActiveTab: (tab: string) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  orders: mockOrders,
  selectedOrder: null,
  isOrderDrawerOpen: false,
  activeTab: 'overview',

  updateOrderStatus: (orderId, status) => {
    const orders = get().orders.map((order) => {
      if (order.id === orderId) {
        const newTimeline = [
          ...order.timeline,
          { status, timestamp: new Date().toISOString() },
        ];
        return { ...order, status, timeline: newTimeline, updatedAt: new Date().toISOString() };
      }
      return order;
    });
    set({ orders });

    // Update selected order too
    const selected = get().selectedOrder;
    if (selected?.id === orderId) {
      set({ selectedOrder: orders.find((o) => o.id === orderId) || null });
    }
  },

  selectOrder: (order) => set({ selectedOrder: order }),
  openOrderDrawer: (order) => set({ selectedOrder: order, isOrderDrawerOpen: true }),
  closeOrderDrawer: () => set({ isOrderDrawerOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
