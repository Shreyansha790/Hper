import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getTimeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export function getDeliveryETA(minutes: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    placed: 'Order Placed',
    confirmed: 'Confirmed',
    packed: 'Packed',
    rider_assigned: 'Rider Assigned',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    return_requested: 'Return Requested',
    returned: 'Returned',
  };
  return labels[status] || status;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    placed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    confirmed: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    packed: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    rider_assigned: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
    out_for_delivery: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    return_requested: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    returned: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20',
  };
  return colors[status] || 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}`;
}
