import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('loading-skeleton rounded-xl', className)}
        />
      ))}
    </>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <Skeleton className="h-64 rounded-none" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);
