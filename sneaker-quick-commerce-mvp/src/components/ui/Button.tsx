import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-40 disabled:cursor-not-allowed select-none rounded-sm tracking-wide';

  const variants = {
    // Electric yellow — highest-contrast CTA
    accent:
      'bg-[#E8FF47] text-black hover:bg-[#d4eb30] focus:ring-[#E8FF47] shadow-[0_0_24px_rgba(232,255,71,0.25)] hover:shadow-[0_0_36px_rgba(232,255,71,0.35)] hover:-translate-y-0.5 active:translate-y-0',
    // Dark outlined — primary interactive
    primary:
      'bg-transparent text-white border border-white/20 hover:border-[#E8FF47] hover:text-[#E8FF47] focus:ring-white/30 hover:-translate-y-0.5 active:translate-y-0',
    // Filled white — secondary
    secondary:
      'bg-white text-black hover:bg-neutral-100 focus:ring-white/40 shadow-sm hover:-translate-y-0.5 active:translate-y-0',
    // Pure ghost
    ghost:
      'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 focus:ring-white/20',
    // Outline white
    outline:
      'bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/5 focus:ring-white/30',
    danger:
      'bg-[#FF3131] text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:-translate-y-0.5',
    success:
      'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400 shadow-sm',
  };

  const sizes = {
    xs: 'text-xs px-3 py-1.5',
    sm: 'text-sm px-4 py-2',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
    xl: 'text-base px-8 py-4',
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
