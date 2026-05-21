import type { InventoryItem } from '@/types';

export const mockInventory: InventoryItem[] = [
  // Store 001 - Indiranagar
  { id: 'inv-001', storeId: 'store-001', productId: 'prod-001', size: '8', sku: 'APX1-WHT-8', quantity: 5, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-002', storeId: 'store-001', productId: 'prod-001', size: '9', sku: 'APX1-WHT-9', quantity: 3, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-003', storeId: 'store-001', productId: 'prod-001', size: '10', sku: 'APX1-WHT-10', quantity: 1, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-004', storeId: 'store-001', productId: 'prod-002', size: '9', sku: 'JRH-BLK-9', quantity: 2, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-005', storeId: 'store-001', productId: 'prod-002', size: '10', sku: 'JRH-BLK-10', quantity: 4, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-006', storeId: 'store-001', productId: 'prod-003', size: '8', sku: 'YZ350-ONX-8', quantity: 1, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-007', storeId: 'store-001', productId: 'prod-004', size: '9', sku: 'NB990-GRY-9', quantity: 6, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-008', storeId: 'store-001', productId: 'prod-005', size: '8', sku: 'DNKL-UBL-8', quantity: 8, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-009', storeId: 'store-001', productId: 'prod-006', size: '9', sku: 'AF1L-WHT-9', quantity: 10, lowStockThreshold: 5, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-010', storeId: 'store-001', productId: 'prod-006', size: '10', sku: 'AF1L-WHT-10', quantity: 7, lowStockThreshold: 5, updatedAt: '2024-04-10T10:00:00Z' },

  // Store 002 - Koramangala
  { id: 'inv-011', storeId: 'store-002', productId: 'prod-001', size: '7', sku: 'APX1-WHT-7', quantity: 4, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-012', storeId: 'store-002', productId: 'prod-001', size: '8', sku: 'APX1-WHT-8', quantity: 6, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-013', storeId: 'store-002', productId: 'prod-002', size: '8', sku: 'JRH-BLK-8', quantity: 3, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-014', storeId: 'store-002', productId: 'prod-003', size: '9', sku: 'YZ350-ONX-9', quantity: 2, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-015', storeId: 'store-002', productId: 'prod-003', size: '10', sku: 'YZ350-ONX-10', quantity: 0, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-016', storeId: 'store-002', productId: 'prod-004', size: '8', sku: 'NB990-GRY-8', quantity: 5, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-017', storeId: 'store-002', productId: 'prod-005', size: '9', sku: 'DNKL-UBL-9', quantity: 1, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-018', storeId: 'store-002', productId: 'prod-006', size: '8', sku: 'AF1L-WHT-8', quantity: 12, lowStockThreshold: 5, updatedAt: '2024-04-10T10:00:00Z' },

  // Store 003 - HSR Layout
  { id: 'inv-019', storeId: 'store-003', productId: 'prod-001', size: '9', sku: 'APX1-WHT-9', quantity: 3, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-020', storeId: 'store-003', productId: 'prod-002', size: '9', sku: 'JRH-BLK-9', quantity: 5, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-021', storeId: 'store-003', productId: 'prod-003', size: '8', sku: 'YZ350-ONX-8', quantity: 2, lowStockThreshold: 2, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-022', storeId: 'store-003', productId: 'prod-004', size: '10', sku: 'NB990-GRY-10', quantity: 4, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-023', storeId: 'store-003', productId: 'prod-005', size: '7', sku: 'DNKL-UBL-7', quantity: 0, lowStockThreshold: 3, updatedAt: '2024-04-10T10:00:00Z' },
  { id: 'inv-024', storeId: 'store-003', productId: 'prod-006', size: '9', sku: 'AF1L-WHT-9', quantity: 8, lowStockThreshold: 5, updatedAt: '2024-04-10T10:00:00Z' },
];
