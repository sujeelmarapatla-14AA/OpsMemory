import React from 'react';
import { ArrowDown, Brain, Zap } from 'lucide-react';

export default function MemoryConnectionFlow({ incidentId = 'INC-084' }) {
  return (
    <div className="p-4 rounded-2xl bg-[#17191C] border border-[#272A2F] text-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#272A2F]/80">
        <Zap className="w-3.5 h-3.5 text-[#84E071]" />
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] font-semibold">
          Memory Reasoning Flow
        </span>
      </div>

      <div className="flex flex-col items-center space-y-1.5 font-mono text-[11px]">
        {/* Step 1: Current Incident */}
        <div className="w-full text-center py-1.5 px-3 rounded-lg bg-[#111214] border border-[#272A2F] text-[#EDEDED] font-semibold">
          CURRENT INCIDENT ({incidentId})
        </div>

        <ArrowDown className="w-3 h-3 text-[#5A606B]" />

        {/* Step 2: Hindsight Recall */}
        <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#84E071]/10 border border-[#84E071]/25 text-[#84E071] font-semibold">
          <Brain className="w-3.5 h-3.5 text-[#84E071]" />
          <span>🧠 HINDSIGHT RECALL</span>
        </div>

        <ArrowDown className="w-3 h-3 text-[#5A606B]" />

        {/* Step 3: Historical Matches */}
        <div className="w-full py-1.5 px-3 rounded-lg bg-[#111214] border border-[#272A2F] text-[#8E95A0] text-center flex items-center justify-center gap-2">
          <span className="text-[#84E071]">INC-073</span>
          <span className="text-[#5A606B]">·</span>
          <span className="text-[#84E071]">INC-061</span>
          <span className="text-[#5A606B]">·</span>
          <span className="text-[#84E071]">INC-042</span>
        </div>

        <ArrowDown className="w-3 h-3 text-[#5A606B]" />

        {/* Step 4: Pattern Detected */}
        <div className="w-full text-center py-1.5 px-3 rounded-lg bg-[#111214] border border-[#272A2F] text-amber-400 font-semibold">
          PATTERN: Connection Pool Saturation
        </div>

        <ArrowDown className="w-3 h-3 text-[#5A606B]" />

        {/* Step 5: Recommended Fix */}
        <div className="w-full text-center py-1.5 px-3 rounded-lg bg-[#84E071] text-[#090A0C] font-semibold shadow-sm">
          RECOMMENDED FIX (Scale Pool to 150)
        </div>
      </div>
    </div>
  );
}
