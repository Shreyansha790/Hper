import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = false,
  hover = false,
  onClick,
  padding = 'md',
}) => {
  const pads = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl',
        glass
          ? 'glass shadow-premium'
          : 'bg-white border border-gray-100 shadow-card',
        hover && 'hover-lift cursor-pointer',
        onClick && 'cursor-pointer',
        pads[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = 'purple',
}) => {
  const colors = {
    purple: 'from-violet-500 to-purple-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
  };

  const bgColors = {
    purple: 'bg-violet-50',
    blue: 'bg-blue-50',
    green: 'bg-emerald-50',
    orange: 'bg-orange-50',
    red: 'bg-red-50',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <p className={cn('text-sm font-medium mt-1', change >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last week
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', bgColors[color])}>
          <div className={cn('w-6 h-6 bg-gradient-to-br rounded-lg', colors[color], 'text-white flex items-center justify-center')}>
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
