import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs px-3.5 py-2 gap-2 rounded-xl font-medium',
    lg: 'text-sm px-5 py-2.5 gap-2.5 rounded-[14px] font-semibold',
    pill: 'text-xs px-4 py-2.5 gap-2 rounded-full font-semibold',
  };

  const variantStyles = {
    // Ultra-premium Hero obsidian with luminous platinum highlight
    obsidian: 'relative bg-gradient-to-b from-[#18181b] via-[#111114] to-[#09090b] text-white font-semibold tracking-wide border border-white/20 hover:border-white/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.6),0_0_16px_rgba(255,255,255,0.06)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.7),0_0_24px_rgba(255,255,255,0.12)] hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] disabled:bg-[#111114] disabled:border-white/10 disabled:text-zinc-600 disabled:shadow-none disabled:translate-y-0',
    primary: 'bg-white hover:bg-zinc-200 text-black font-semibold shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/15 active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-white/[0.05] text-zinc-400 hover:text-white border border-white/15',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-zinc-400 hover:text-white',
    danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 active:scale-[0.98]',
    success: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold active:scale-[0.98]',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}
