import React from 'react';

export default function Card({
  children,
  className = '',
  highlight = false,
  panel = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-150 ${
        panel ? 'bg-[#111115]' : 'bg-[#0d0d11]'
      } border ${
        highlight ? 'border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.06)]' : 'border-white/[0.08]'
      } p-5 ${
        onClick ? 'cursor-pointer hover:border-white/20 hover:bg-[#121217]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-3.5 border-b border-white/[0.06] mb-4 ${className}`}>
      <div>
        <h3 className="text-xs font-semibold text-white tracking-wider uppercase font-mono">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
