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
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Inventory</h1>
          <p className="text-gray-500 text-sm">{filtered.length} SKUs · <span className="text-red-500 font-semibold">{lowStockCount} alerts</span></p>
        </div>
      </div>

      {/* Alert Banner */}
      {lowStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-5"
        >
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-red-700">
            {lowStockCount} SKUs are low or out of stock. Restock immediately to avoid order failures.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, SKU, brand..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <select
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="all">All Stores</option>
              {mockStores.map((s) => <option key={s.id} value={s.id}>{s.area}</option>)}
            </select>
          )}
          <select
            value={filterStock}
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="all">All Stock</option>
            <option value="out">Out of Stock</option>
            <option value="low">Low Stock</option>
            <option value="in">In Stock</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'In Stock', count: inventoryWithDetails.filter((i) => !i.isLow && !i.isOut).length, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
          { label: 'Low Stock', count: inventoryWithDetails.filter((i) => i.isLow).length, color: 'text-amber-600 bg-amber-50 border-amber-200' },
          { label: 'Out of Stock', count: inventoryWithDetails.filter((i) => i.isOut).length, color: 'text-red-600 bg-red-50 border-red-200' },
        ].map((stat) => (
          <div key={stat.label} className={`flex items-center justify-between p-3 rounded-xl border ${stat.color}`}>
            <span className="text-sm font-semibold">{stat.label}</span>
            <span className="text-xl font-black">{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">SKU</th>
                {isAdmin && <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Store</th>}
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Price</th>
                <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Action</th>
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
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${inv.isOut ? 'bg-red-50/30' : inv.isLow ? 'bg-amber-50/30' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          <img src={inv.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-violet-500 uppercase">{inv.brand}</p>
                          <p className="text-sm font-bold text-gray-900 leading-tight">{inv.productName}</p>
                          <p className="text-xs text-gray-500">UK {inv.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-lg inline-block">{inv.sku}</p>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-700">{inv.storeArea}</p>
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
                            className="w-16 px-2 py-1 border border-violet-300 rounded-lg text-sm font-bold focus:outline-none focus:ring-1 focus:ring-violet-500"
                            autoFocus
                          />
                          <button onClick={() => handleSaveQty(inv.id)} className="p-1 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setEditId(null)} className="p-1 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-black ${inv.isOut ? 'text-red-600' : inv.isLow ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {inv.quantity}
                          </span>
                          {(inv.isOut || inv.isLow) && (
                            <AlertTriangle size={12} className={inv.isOut ? 'text-red-500' : 'text-amber-500'} />
                          )}
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${inv.isOut ? 'bg-red-100 text-red-600' : inv.isLow ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {inv.isOut ? 'OUT' : inv.isLow ? 'LOW' : 'OK'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(inv.price)}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => { setEditId(inv.id); setEditQty(inv.quantity); }}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-violet-50 hover:border-violet-200 transition-all"
                      >
                        <Edit2 size={13} className="text-gray-500" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="font-bold text-gray-900">No inventory found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
