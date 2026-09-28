import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
  ...props
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantStyles = {
    default: 'bg-[#1B1D21] text-[#9CA3AF] border-[#272A2F]',
    green: 'bg-[#84E071]/12 text-[#84E071] border-[#84E071]/30',
    hindsight: 'bg-[#84E071]/12 text-[#84E071] border-[#84E071]/30 font-semibold',
    critical: 'bg-rose-500/12 text-rose-400 border-rose-500/30 font-semibold',
    high: 'bg-amber-500/12 text-amber-400 border-amber-500/30',
    medium: 'bg-yellow-500/12 text-yellow-300 border-yellow-500/30',
    low: 'bg-[#1B1D21] text-[#8E95A0] border-[#272A2F]',
    investigating: 'bg-amber-500/12 text-amber-400 border-amber-500/30',
    resolved: 'bg-[#84E071]/12 text-[#84E071] border-[#84E071]/30',
    open: 'bg-sky-500/12 text-sky-400 border-sky-500/30',
  };

  const dotColors = {
    default: 'bg-[#8E95A0]',
    green: 'bg-[#84E071]',
    hindsight: 'bg-[#84E071]',
    critical: 'bg-rose-500 animate-pulse',
    high: 'bg-amber-400',
    medium: 'bg-yellow-400',
    low: 'bg-[#8E95A0]',
    investigating: 'bg-amber-400 animate-pulse',
    resolved: 'bg-[#84E071]',
    open: 'bg-sky-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeStyles[size] || sizeStyles.sm} ${
        variantStyles[variant] || variantStyles.default
      } ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            dotColors[variant] || dotColors.default
          }`}
        />
      )}
      {children}
    </span>
  );
}
