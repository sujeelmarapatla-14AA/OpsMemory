import React from 'react';

export default function StatCard({
  title,
  value,
  description,
  trend,
  trendUp = true,
  icon: Icon,
  variant = 'default',
}) {
  const variantIndicator = {
    critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    success: 'text-[#84E071] bg-[#84E071]/10 border-[#84E071]/20',
    green: 'text-[#84E071] bg-[#84E071]/10 border-[#84E071]/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    default: 'text-[#8E95A0] bg-[#1B1D21] border-[#272A2F]',
  };

  return (
    <div className="bg-[#17191C] border border-[#272A2F] rounded-2xl p-4 transition-all hover:border-[#383C44]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#8E95A0]">
            {title}
          </span>
          <div className="text-2xl font-bold font-mono text-[#EDEDED] mt-0.5 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              variantIndicator[variant] || variantIndicator.default
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-[#272A2F]/60 flex items-center justify-between text-xs">
        <span className="text-[#8E95A0] text-[11px] truncate">{description}</span>
        {trend && (
          <span
            className={`font-mono text-[10px] font-medium shrink-0 ml-2 ${
              trendUp ? 'text-[#84E071]' : 'text-[#8E95A0]'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
