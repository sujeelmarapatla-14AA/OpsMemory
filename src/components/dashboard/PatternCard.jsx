import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PatternCard({ pattern, onClick }) {
  return (
    <div
      onClick={onClick}
      className="p-4 rounded-2xl bg-[#0d0d11] border border-white/[0.08] hover:border-white/20 hover:bg-[#121217] transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Small indicator dot */}
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Pattern
            </div>
            <h4 className="text-xs font-semibold text-white group-hover:text-white transition-colors font-mono">
              {pattern.pattern}
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-white border border-white/15 font-semibold">
          {pattern.success_rate}% Success
        </span>
      </div>

      {/* Identified Root Cause */}
      <div className="mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2 text-xs">
        <span className="text-zinc-400 font-mono text-[11px]">Cause:</span>
        <ArrowRight className="w-3 h-3 text-white shrink-0" />
        <span className="text-zinc-200 font-mono text-[11px] truncate">
          {pattern.cause}
        </span>
      </div>

      {/* Footer stats */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
        <div className="flex items-center gap-1.5">
          <span>{pattern.incidents} incidents</span>
          <span className="text-zinc-700">·</span>
          <span>{pattern.successful_resolutions} successful resolutions</span>
        </div>
        <span>{pattern.last_seen}</span>
      </div>
    </div>
  );
}
