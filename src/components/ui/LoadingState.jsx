import React from 'react';
import { Loader2, Brain } from 'lucide-react';

export default function LoadingState({
  title = 'Searching incident memory...',
  description = 'Consulting historical incident telemetry and Hindsight bank...',
  isMemory = false,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="relative mb-4">
        {isMemory ? (
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/20 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]">
            <Brain className="w-6 h-6 animate-pulse text-white" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/20 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]">
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-white font-mono">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-sm mt-1">{description}</p>
    </div>
  );
}
