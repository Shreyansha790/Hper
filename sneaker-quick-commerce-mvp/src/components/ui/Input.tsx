import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'w-full rounded-sm border border-white/10 bg-[#111111] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600',
            'focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20',
            'transition-all duration-200',
            'disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
      {helperText && !error && (
        <p className="text-[10px] text-neutral-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-[10px] font-mono-custom text-neutral-400 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <select
        className={cn(
          'w-full rounded-sm border border-white/10 bg-[#111111] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E8FF47]/40 focus:ring-1 focus:ring-[#E8FF47]/20',
          'transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#111111] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
};
