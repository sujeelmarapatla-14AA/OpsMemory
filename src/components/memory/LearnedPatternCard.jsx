import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function LearnedPatternCard({ pattern }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-[#17191C] border border-[#272A2F] hover:border-[#383C44] transition-all space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#84E071] shrink-0" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0]">
              Learned Signature
            </div>
            <h4 className="text-xs font-semibold text-[#EDEDED] font-mono">
              {pattern.pattern}
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#84E071]/12 text-[#84E071] border border-[#84E071]/30">
          {pattern.success_rate}% success
        </span>
      </div>

      {/* Cause description */}
      <div className="p-3 rounded-xl bg-[#111214] border border-[#272A2F] space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#8E95A0] uppercase">Identified Cause:</span>
          <ArrowRight className="w-3 h-3 text-[#84E071] shrink-0" />
          <span className="text-[#EDEDED] font-mono font-semibold text-[11px] truncate">{pattern.cause}</span>
        </div>
        {pattern.description && (
          <p className="text-[#8E95A0] text-xs leading-relaxed pt-0.5">
            {pattern.description}
          </p>
        )}
      </div>

      {/* Stats and services */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-[#111214] border border-[#272A2F]">
          <span className="text-[10px] text-[#5A606B] uppercase block">Incidents</span>
          <span className="text-[#EDEDED] font-semibold">{pattern.incidents} logged</span>
        </div>
        <div className="p-2 rounded-lg bg-[#111214] border border-[#272A2F]">
          <span className="text-[10px] text-[#5A606B] uppercase block">Last Seen</span>
          <span className="text-[#EDEDED] font-semibold">{pattern.last_seen}</span>
        </div>
      </div>

      {/* Services */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] font-mono text-[#5A606B] uppercase">Services:</span>
        {pattern.related_services.map((service) => (
          <span
            key={service}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#111214] border border-[#272A2F] text-[#8E95A0]"
          >
            {service}
          </span>
        ))}
      </div>

      {/* Expandable Preventive Rule */}
      {expanded && pattern.preventive_rule && (
        <div className="p-3 rounded-xl bg-[#111214] border border-[#84E071]/30 text-xs font-mono space-y-1">
          <span className="text-[10px] text-[#84E071] font-semibold uppercase block">
            Hindsight Preventive Rule
          </span>
          <p className="text-[#EDEDED] text-[11px] leading-relaxed">
            {pattern.preventive_rule}
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full pt-2 border-t border-[#272A2F] flex items-center justify-between text-[11px] text-[#84E071] hover:underline cursor-pointer"
      >
        <span>{expanded ? 'Hide preventive rule' : 'Inspect learned mitigation'}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
