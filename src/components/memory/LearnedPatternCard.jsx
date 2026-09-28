import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function LearnedPatternCard({ pattern }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-[#0d0d11] border border-white/[0.08] hover:border-white/20 transition-all space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Learned Signature
            </div>
            <h4 className="text-xs font-semibold text-white font-mono">
              {pattern.pattern}
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-white border border-white/15">
          {pattern.success_rate}% success
        </span>
      </div>

      {/* Cause description */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Identified Cause:</span>
          <ArrowRight className="w-3 h-3 text-white shrink-0" />
          <span className="text-zinc-200 font-mono font-semibold text-[11px] truncate">{pattern.cause}</span>
        </div>
        {pattern.description && (
          <p className="text-zinc-400 text-xs leading-relaxed pt-0.5">
            {pattern.description}
          </p>
        )}
      </div>

      {/* Stats and services */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[10px] text-zinc-500 uppercase block">Incidents</span>
          <span className="text-zinc-200 font-semibold">{pattern.incidents} logged</span>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[10px] text-zinc-500 uppercase block">Last Seen</span>
          <span className="text-zinc-200 font-semibold">{pattern.last_seen}</span>
        </div>
      </div>

      {/* Services */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[10px] font-mono text-zinc-500 uppercase">Services:</span>
        {pattern.related_services.map((service) => (
          <span
            key={service}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-400"
          >
            {service}
          </span>
        ))}
      </div>

      {/* Expandable Preventive Rule */}
      {expanded && pattern.preventive_rule && (
        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/20 text-xs font-mono space-y-1">
          <span className="text-[10px] text-white font-semibold uppercase block">
            Hindsight Preventive Rule
          </span>
          <p className="text-zinc-300 text-[11px] leading-relaxed">
            {pattern.preventive_rule}
          </p>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400 hover:text-white cursor-pointer transition-colors"
      >
        <span>{expanded ? 'Hide preventive rule' : 'Inspect learned mitigation'}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
