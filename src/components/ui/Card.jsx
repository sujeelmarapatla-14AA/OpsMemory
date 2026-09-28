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
        panel ? 'bg-[#1B1D21]' : 'bg-[#17191C]'
      } border ${
        highlight ? 'border-[#84E071]/40' : 'border-[#272A2F]'
      } p-5 ${
        onClick ? 'cursor-pointer hover:border-[#383C44] hover:bg-[#1C1E23]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-3.5 border-b border-[#272A2F] mb-4 ${className}`}>
      <div>
        <h3 className="text-xs font-semibold text-[#EDEDED] tracking-wider uppercase font-mono">{title}</h3>
        {subtitle && <p className="text-xs text-[#8E95A0] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
