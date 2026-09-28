import React from 'react';
import {
  Sparkles
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
    <div className="p-5 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#272A2F]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#84E071]/12 border border-[#84E071]/25 flex items-center justify-center text-[#84E071]">
            <Sparkles className="w-4 h-4 text-[#84E071]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
              Recommended Response
            </h3>
            <p className="text-xs text-[#8E95A0] mt-0.5">
              Hindsight suggested operational mitigation steps
            </p>
          </div>
        </div>

        {analysis.confidence && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#8E95A0] uppercase block">
              Confidence
            </span>
            <span className="text-xs font-mono font-bold text-[#84E071]">
              {analysis.confidence}%
            </span>
          </div>
        )}
      </div>

      {/* Primary recommendation statement */}
      {analysis.recommended_resolution && (
        <div className="p-3 rounded-xl bg-[#111214] border border-[#272A2F] text-xs text-[#EDEDED] leading-relaxed">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#84E071] font-semibold block mb-1">
            Action:
          </span>
          <p>{analysis.recommended_resolution}</p>
        </div>
      )}

      {/* Numbered Steps: 01, 02, 03, 04, 05 */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] block">
          Response Steps
        </span>
        {steps.map((step, idx) => {
          const stepNumber = String(idx + 1).padStart(2, '0');
          const cleanStep = step.replace(/^[0-9]{2}\s*/, '');

          return (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#111214] border border-[#272A2F] hover:border-[#383C44] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-[#1B1D21] border border-[#272A2F] text-[#84E071] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {stepNumber}
              </div>
              <p className="text-xs text-[#EDEDED] font-mono pt-0.5 leading-relaxed">
                {cleanStep}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
