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
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    green: 'text-white bg-white/[0.06] border-white/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    default: 'text-zinc-400 bg-white/[0.04] border-white/10',
  };

  return (
    <div className="bg-[#0d0d11] border border-white/[0.08] rounded-2xl p-4 transition-all hover:border-white/20">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-zinc-500">
            {title}
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-0.5 tracking-tight">
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

      <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
        <span className="text-zinc-400 text-[11px] truncate">{description}</span>
        {trend && (
          <span
            className={`font-mono text-[10px] font-medium shrink-0 ml-2 ${
              trendUp ? 'text-zinc-300' : 'text-zinc-500'
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
