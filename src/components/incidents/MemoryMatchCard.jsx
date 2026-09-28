import {
  Check,
  Clock
} from 'lucide-react';

export default function MemoryMatchCard({ match }) {
  const isHighRelevance = (match.relevance || 90) >= 88;
  const memoryType = match.type || 'experience';
  const hasRawText = Boolean(match.text);

  // If text contains delimiters like " | "
  const textParts = hasRawText ? match.text.split(' | ') : [];
  const mainDescription = textParts[0] || match.text || match.title;
  const metadataParts = textParts.slice(1);

  return (
    <div className="p-4 rounded-xl bg-[#0d0d11] border border-white/[0.08] hover:border-white/20 transition-all space-y-3 shadow-md">
      {/* Header: ID/Type, Date & Relevance */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-white">
              {match.incident_id || 'MEM-01'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 uppercase">
              {memoryType}
            </span>
            {match.date && (
              <span className="text-[10px] font-mono text-zinc-500">
                {match.date}
              </span>
            )}
          </div>
          <h4 className="text-xs font-semibold text-zinc-200 mt-1.5 font-sans leading-snug">
            {mainDescription}
          </h4>
        </div>

        {/* Relevance badge */}
        <span
          className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
            isHighRelevance
              ? 'bg-white/[0.08] text-white border-white/25 shadow-xs'
              : 'bg-white/[0.03] text-zinc-400 border-white/10'
          }`}
        >
          {match.relevance || 92}% match
        </span>
      </div>

      {/* Metadata tags if from Hindsight memory */}
      {metadataParts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {metadataParts.map((part, i) => (
            <span
              key={i}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-zinc-400 border border-white/[0.06]"
            >
              {part}
            </span>
          ))}
        </div>
      )}

      {/* Root Cause & Previous Resolution */}
      {(match.root_cause || match.previous_resolution) && (
        <div className="space-y-2 text-xs">
          {match.root_cause && (
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                Past Root Cause:
              </span>
              <span className="text-zinc-200 font-mono text-[11px]">
                {match.root_cause}
              </span>
            </div>
          )}

          {match.previous_resolution && (
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-0.5">
                Resolution Applied:
              </span>
              <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                {match.previous_resolution}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer: Outcome & Resolution time */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
          <span>{match.outcome || 'Retained in Hindsight'}</span>
        </div>

        {match.resolved_in && (
          <div className="flex items-center gap-1 text-zinc-500">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>{match.resolved_in}</span>
          </div>
        )}
      </div>
    </div>
  );
}
