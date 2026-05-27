import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Search, Edit2, Check, X, Package } from 'lucide-react';
import { mockInventory, mockProducts, mockStores } from '@/lib/mock';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';

interface InventoryWithDetails {
  id: string;
  storeId: string;
  storeName: string;
  storeArea: string;
  productId: string;
  productName: string;
  brand: string;
  size: string;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
  price: number;
  image: string;
  isLow: boolean;
  isOut: boolean;
}

export const InventoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [filterStore, setFilterStore] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState(0);
  const [localInventory, setLocalInventory] = useState(mockInventory);

  const isAdmin = user?.role === 'admin';

  const inventoryWithDetails: InventoryWithDetails[] = localInventory.map((inv) => {
    const product = mockProducts.find((p) => p.id === inv.productId);
    const store = mockStores.find((s) => s.id === inv.storeId);
    return {
      ...inv,
      storeName: store?.name || '',
      storeArea: store?.area || '',
      productName: product?.name || '',
      brand: product?.brand || '',
      price: product?.price || 0,
      image: product?.images[0] || '',
      isLow: inv.quantity > 0 && inv.quantity <= inv.lowStockThreshold,
      isOut: inv.quantity === 0,
    };
  });

  const filtered = inventoryWithDetails.filter((inv) => {
    const matchesStore = filterStore === 'all' || inv.storeId === filterStore || (!isAdmin && inv.storeId === user?.assignedStoreId);
    const matchesSearch = !search || inv.productName.toLowerCase().includes(search.toLowerCase()) || inv.sku.toLowerCase().includes(search.toLowerCase()) || inv.brand.toLowerCase().includes(search.toLowerCase());
    const matchesStockFilter = filterStock === 'all' || (filterStock === 'low' && inv.isLow) || (filterStock === 'out' && inv.isOut) || (filterStock === 'in' && !inv.isLow && !inv.isOut);
    const matchesUser = isAdmin || inv.storeId === user?.assignedStoreId;
    return matchesStore && matchesSearch && matchesStockFilter && matchesUser;
  });

  const lowStockCount = inventoryWithDetails.filter((i) => i.isLow || i.isOut).length;

  const handleSaveQty = (id: string) => {
    setLocalInventory((prev) => prev.map((inv) => inv.id === id ? { ...inv, quantity: editQty } : inv));
    setEditId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#0A0A0A] text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-white uppercase">Inventory</h1>
          <p className="text-neutral-500 text-xs mt-1 font-mono-custom uppercase tracking-wider">
            {filtered.length} SKU{filtered.length !== 1 ? 's' : ''} · <span className="text-red-400 font-bold font-mono-custom">{lowStockCount} alerts</span>
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {lowStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-950/15 border border-red-500/30 rounded-sm"
        >
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
          <p className="text-xs font-mono-custom font-bold text-red-400 uppercase tracking-wider">
            {lowStockCount} SKUs are low or out of stock. Restock immediately to avoid order failures.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH BY PRODUCT, SKU, BRAND..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#111111] border border-white/[0.07] text-white rounded-sm text-xs focus:outline-none focus:border-[#E8FF47] focus:ring-1 focus:ring-[#E8FF47] font-mono-custom placeholder-neutral-500 uppercase tracking-wider"
          />
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <select
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              className="px-3 py-2.5 bg-[#111111] border border-white/[0.07] text-white rounded-sm text-xs focus:outline-none focus:border-[#E8FF47] font-mono-custom uppercase tracking-wider"
            >
              <option value="all">ALL STORES</option>
              {mockStores.map((s) => <option key={s.id} value={s.id}>{s.area.toUpperCase()}</option>)}
            </select>
          )}
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-2.5 bg-[#111111] border border-white/[0.07] text-white rounded-sm text-xs focus:outline-none focus:border-[#E8FF47] font-mono-custom uppercase tracking-wider"
          >
            <option value="all">ALL STOCK</option>
            <option value="out">OUT OF STOCK</option>
            <option value="low">LOW STOCK</option>
            <option value="in">IN STOCK</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'In Stock', count: inventoryWithDetails.filter((i) => !i.isLow && !i.isOut).length, color: 'text-emerald-400 bg-emerald-950/10 border-white/10 hover:border-emerald-500/40' },
          { label: 'Low Stock', count: inventoryWithDetails.filter((i) => i.isLow).length, color: 'text-amber-400 bg-amber-950/10 border-white/10 hover:border-amber-500/40' },
          { label: 'Out of Stock', count: inventoryWithDetails.filter((i) => i.isOut).length, color: 'text-red-400 bg-red-950/10 border-white/10 hover:border-red-500/40' },
        ].map((stat) => (
          <div key={stat.label} className={`flex items-center justify-between p-4 rounded-sm border ${stat.color} transition-all`}>
            <span className="text-[10px] font-mono-custom font-bold uppercase tracking-wider text-white opacity-60">{stat.label}</span>
            <span className="text-xl font-bold font-mono-custom">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-white/[0.07] rounded-sm shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.05]">
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden sm:table-cell">SKU</th>
                {isAdmin && <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Store</th>}
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-left text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider hidden lg:table-cell">Price</th>
                <th className="px-5 py-3 text-right text-[10px] font-mono-custom font-bold text-neutral-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((inv, i) => (
                  <motion.tr
                    key={inv.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors ${inv.isOut ? 'bg-red-950/5' : inv.isLow ? 'bg-amber-950/5' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-white/[0.02] border border-white/[0.07] flex-shrink-0">
                          <img src={inv.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-[#E8FF47] uppercase tracking-wider">{inv.brand}</p>
                          <p className="text-xs font-bold text-white uppercase leading-tight mt-0.5">{inv.productName}</p>
                          <p className="text-[9px] text-neutral-500 font-mono-custom mt-0.5 uppercase">UK {inv.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="text-[10px] font-mono-custom text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm inline-block">{inv.sku}</p>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">{inv.storeArea}</p>
                      </td>
                    )}
                    <td className="px-5 py-4">
                      {editId === inv.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={0}
                            value={editQty}
                            onChange={(e) => setEditQty(Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-[#0A0A0A] border border-[#E8FF47] text-white rounded-sm text-xs font-bold font-mono-custom focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveQty(inv.id)}
                            className="p-1 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="p-1 rounded-sm bg-white/5 text-neutral-400 border border-white/10 hover:bg-white/10 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold font-mono-custom ${inv.isOut ? 'text-red-400' : inv.isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {inv.quantity}
                          </span>
                          {(inv.isOut || inv.isLow) && (
                            <AlertTriangle size={12} className={inv.isOut ? 'text-red-400' : 'text-amber-400'} />
                          )}
                          <span className={`text-[9px] font-bold font-mono-custom px-1.5 py-0.5 rounded-sm uppercase ${inv.isOut ? 'bg-red-500/10 text-red-400 border border-red-500/20' : inv.isLow ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {inv.isOut ? 'OUT' : inv.isLow ? 'LOW' : 'OK'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm font-bold text-white font-mono-custom">{formatCurrency(inv.price)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => { setEditId(inv.id); setEditQty(inv.quantity); }}
                        className="p-1.5 rounded-sm border border-white/10 bg-white/5 text-neutral-400 hover:bg-[#E8FF47] hover:text-black hover:border-[#E8FF47] transition-all"
                      >
                        <Edit2 size={13} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package size={40} className="text-neutral-700 mx-auto mb-3" />
              <p className="font-bold text-white font-mono-custom uppercase tracking-wider text-sm">No inventory found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
