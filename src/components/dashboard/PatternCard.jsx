import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PatternCard({ pattern, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-[#17191C] border border-[#272A2F] hover:border-[#383C44] hover:bg-[#1C1E23] transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Small green indicator dot */}
          <span className="w-2 h-2 rounded-full bg-[#84E071] shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-[#8E95A0] uppercase tracking-wider">
              Pattern
            </div>
            <h4 className="text-xs font-semibold text-[#EDEDED] group-hover:text-[#84E071] transition-colors font-mono">
              {pattern.pattern}
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#84E071]/12 text-[#84E071] border border-[#84E071]/30 font-semibold">
          {pattern.success_rate}% Success
        </span>
      </div>

      {/* Identified Root Cause */}
      <div className="mt-3 p-2.5 rounded-xl bg-[#111214] border border-[#272A2F] flex items-center gap-2 text-xs">
        <span className="text-[#8E95A0] font-mono text-[11px]">Cause:</span>
        <ArrowRight className="w-3 h-3 text-[#84E071] shrink-0" />
        <span className="text-[#EDEDED] font-mono text-[11px] truncate">
          {pattern.cause}
        </span>
      </div>

      {/* Footer stats */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#8E95A0] font-mono">
        <div className="flex items-center gap-1.5">
          <span>{pattern.incidents} incidents</span>
          <span className="text-[#5A606B]">·</span>
          <span>{pattern.successful_resolutions} successful resolutions</span>
        </div>
        <span>{pattern.last_seen}</span>
      </div>
    </div>
  );
}
