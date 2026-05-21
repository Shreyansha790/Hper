import { create } from 'zustand';

interface UIState {
  selectedLocation: string;
  isLocationModalOpen: boolean;
  isMobileMenuOpen: boolean;
  searchQuery: string;
  setLocation: (location: string) => void;
  toggleLocationModal: () => void;
  closeLocationModal: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setSearchQuery: (q: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedLocation: 'Indiranagar, Bangalore',
  isLocationModalOpen: false,
  isMobileMenuOpen: false,
  searchQuery: '',
  setLocation: (location) => set({ selectedLocation: location, isLocationModalOpen: false }),
  toggleLocationModal: () => set((s) => ({ isLocationModalOpen: !s.isLocationModalOpen })),
  closeLocationModal: () => set({ isLocationModalOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
