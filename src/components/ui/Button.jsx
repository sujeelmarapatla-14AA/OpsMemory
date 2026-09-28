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
    // Ultra-premium obsidian black with luminous lime-green edge and platinum highlight
    obsidian: 'relative bg-gradient-to-b from-[#1C1F26] via-[#111317] to-[#0A0B0E] text-white font-semibold tracking-wide border border-[#84E071]/40 hover:border-[#84E071]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_2px_8px_rgba(0,0,0,0.6),0_0_16px_rgba(132,224,113,0.16)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_4px_16px_rgba(0,0,0,0.7),0_0_26px_rgba(132,224,113,0.32)] hover:-translate-y-[1px] active:translate-y-[1px] active:scale-[0.99] disabled:bg-[#15171B] disabled:border-[#272A2F] disabled:text-[#5A606B] disabled:shadow-none disabled:translate-y-0',
    primary: 'bg-[#84E071] hover:bg-[#73D460] text-[#090A0C] font-semibold shadow-sm hover:shadow active:scale-[0.98]',
    secondary: 'bg-[#1B1D21] hover:bg-[#23262B] text-[#EDEDED] border border-[#272A2F] active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-[#1B1D21] text-[#9CA3AF] hover:text-[#EDEDED] border border-[#272A2F]',
    ghost: 'bg-transparent hover:bg-[#1B1D21] text-[#9CA3AF] hover:text-[#EDEDED]',
    danger: 'bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 border border-rose-700/60 active:scale-[0.98]',
    success: 'bg-[#84E071] hover:bg-[#73D460] text-[#090A0C] font-semibold active:scale-[0.98]',
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
