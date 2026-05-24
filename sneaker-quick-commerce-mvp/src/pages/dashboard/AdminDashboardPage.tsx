import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

type LiveOrder = {
  id: string;
  status: 'Pending' | 'Packed' | 'Ready for Delivery' | 'Delivered';
  delivery_line1: string;
  delivery_area: string;
  delivery_city: string;
  delivery_pincode: string;
  order_items: Array<{
    id: string;
    size: string;
    quantity: number;
    products: {
      name: string;
      brand: string;
    };
  }>;
};

const ORDER_STATUSES: LiveOrder['status'][] = ['Pending', 'Packed', 'Ready for Delivery', 'Delivered'];

export function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthorized = user?.role === 'storekeeper' || user?.role === 'admin';

  useEffect(() => {
    if (!isAuthorized) return;

    const loadOrders = async () => {
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from('orders')
        .select('id,status,delivery_line1,delivery_area,delivery_city,delivery_pincode,order_items(id,size,quantity,products(name,brand))')
        .in('status', ['Pending', 'Packed', 'Ready for Delivery'])
        .order('created_at', { ascending: false });

      if (queryError) {
        setError(queryError.message);
      } else {
        setOrders((data as LiveOrder[]) || []);
      }

      setLoading(false);
    };

    loadOrders();
  }, [isAuthorized]);

  const hasOrders = useMemo(() => orders.length > 0, [orders.length]);

  const handleStatusUpdate = async (orderId: string, status: LiveOrder['status']) => {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)));
  };

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAuthorized) return <Navigate to="/" replace />;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-black text-gray-900">Live Incoming Orders</h1>
      <p className="text-sm text-gray-500 mt-1">Track real-time sneaker orders and update fulfillment status.</p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="mt-6 text-sm text-gray-500">Loading orders…</div>
      ) : !hasOrders ? (
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-6 text-sm text-gray-600">No live incoming orders.</div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <p className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                <select
                  className="px-3 py-2 text-sm border border-gray-200 rounded-xl"
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.id, e.target.value as LiveOrder['status'])}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Delivery: {order.delivery_line1}, {order.delivery_area}, {order.delivery_city} - {order.delivery_pincode}
              </p>

              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">
                    <span className="font-semibold">{item.products.brand} {item.products.name}</span>
                    <span className="ml-2">Size {item.size}</span>
                    <span className="ml-2">Qty {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
