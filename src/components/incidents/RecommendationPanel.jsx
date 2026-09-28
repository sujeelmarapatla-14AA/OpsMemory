import {
  Sparkles,
  AlertTriangle,
  History
} from 'lucide-react';

export default function RecommendationPanel({ analysis }) {
  if (!analysis) return null;

  const steps = analysis.recommended_steps || [
    'Check active database connections.',
    'Compare connection usage against pool limits.',
    'Increase connection pool if exhaustion is confirmed.',
    'Restart affected service.',
    'Monitor recovery.'
  ];

  return (
    <div className="p-5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] space-y-4 shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Recommended Immediate Actions
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Groq AI synthesized mitigation steps based on Hindsight memory
            </p>
          </div>
        </div>

        {analysis.confidence && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block">
              Confidence
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {analysis.confidence}%
            </span>
          </div>
        )}
      </div>

      {/* Primary recommendation statement */}
      {analysis.recommended_resolution && (
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-200 leading-relaxed">
          <span className="text-[10px] font-mono uppercase tracking-wider text-white font-semibold block mb-1">
            Primary Remediation:
          </span>
          <p className="font-mono text-xs">{analysis.recommended_resolution}</p>
        </div>
      )}

      {/* Numbered Steps: 01, 02, 03, 04, 05 */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">
          Action Steps
        </span>
        {steps.map((step, idx) => {
          const stepNumber = String(idx + 1).padStart(2, '0');
          const cleanStep = step.replace(/^[0-9]{1,2}[.:)]\s*/, '');

          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {stepNumber}
              </div>
              <p className="text-xs text-zinc-200 font-mono pt-0.5 leading-relaxed">
                {cleanStep}
              </p>
            </div>
          );
        })}
      </div>

      {/* Previous Relevant Resolution */}
      {analysis.prior_resolution && (
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/15 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-white">
            <History className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Previous Relevant Resolution</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans pl-5">
            {analysis.prior_resolution}
          </p>
        </div>
      )}

      {/* Important Caution / Verification Step */}
      {analysis.caution && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Verification &amp; Caution</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed font-sans pl-5">
            {analysis.caution}
          </p>
        </div>
      )}
    </div>
  );
}
