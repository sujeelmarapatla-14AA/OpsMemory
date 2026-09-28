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
    default: 'bg-white/[0.04] text-zinc-300 border-white/10',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hindsight: 'bg-white/[0.08] text-white border-white/20 font-semibold',
    critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20 font-semibold',
    high: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
    low: 'bg-white/[0.03] text-zinc-400 border-white/[0.08]',
    investigating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    open: 'bg-white/[0.06] text-zinc-200 border-white/15',
  };

  const dotColors = {
    default: 'bg-zinc-400',
    green: 'bg-emerald-400',
    hindsight: 'bg-white',
    critical: 'bg-rose-500 animate-pulse',
    high: 'bg-amber-400',
    medium: 'bg-yellow-400',
    low: 'bg-zinc-500',
    investigating: 'bg-amber-400 animate-pulse',
    resolved: 'bg-emerald-400',
    open: 'bg-zinc-300',
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
