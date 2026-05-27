import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'limited';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  className,
}) => {
  const variants = {
    // Electric yellow — "NEW" / featured
    accent:    'bg-[#E8FF47] text-black font-bold',
    // Default — neutral dark
    default:   'bg-white/10 text-white/80 border border-white/10',
    // Green — stock / delivered
    success:   'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    // Amber — warning / processing
    warning:   'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    // Red — SALE / error
    danger:    'bg-[#FF3131]/15 text-[#FF3131] border border-[#FF3131]/25',
    // Blue — info
    info:      'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    // White bordered — 1:1 IMPORT / label
    outline:   'bg-transparent text-white/70 border border-white/20 font-mono-custom tracking-widest',
    // White on black — LIMITED
    limited:   'bg-white text-black font-bold',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm uppercase tracking-wider',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
