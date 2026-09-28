import React from 'react';
import {
  Check,
  Clock
} from 'lucide-react';

export default function MemoryMatchCard({ match }) {
  const isHighRelevance = match.relevance >= 90;

  return (
    <div className="p-4 rounded-xl bg-[#111214] border border-[#272A2F] hover:border-[#383C44] transition-all space-y-3">
      {/* Header: ID, Date & Relevance */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#84E071]">
              {match.incident_id}
            </span>
            <span className="text-[10px] font-mono text-[#5A606B]">
              {match.date}
            </span>
          </div>
          <h4 className="text-xs font-semibold text-[#EDEDED] mt-0.5 font-sans">
            {match.title}
          </h4>
        </div>

        {/* Relevance badge */}
        <span
          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            isHighRelevance
              ? 'bg-[#84E071]/12 text-[#84E071] border-[#84E071]/30'
              : 'bg-[#17191C] text-[#8E95A0] border-[#272A2F]'
          }`}
        >
          {match.relevance}% relevant
        </span>
      </div>

      {/* Root Cause & Previous Resolution */}
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-lg bg-[#17191C] border border-[#272A2F]/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] block mb-0.5">
            Root Cause:
          </span>
          <span className="text-[#EDEDED] font-mono text-[11px]">
            {match.root_cause}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#17191C] border border-[#272A2F]/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] block mb-0.5">
            Resolution Applied:
          </span>
          <p className="text-[#EDEDED] text-xs leading-relaxed">
            {match.previous_resolution}
          </p>
        </div>
      </div>

      {/* Footer: Outcome & Resolution time */}
      <div className="pt-2 border-t border-[#272A2F]/70 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-[#84E071] font-medium">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{match.outcome}</span>
        </div>

        {match.resolved_in && (
          <div className="flex items-center gap-1 text-[#8E95A0]">
            <Clock className="w-3 h-3 text-[#5A606B]" />
            <span>{match.resolved_in} resolution</span>
          </div>
        )}
      </div>
    </div>
  );
}
