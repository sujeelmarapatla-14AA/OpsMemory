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
          <div className="w-12 h-12 rounded-2xl bg-[#84E071]/12 border border-[#84E071]/30 flex items-center justify-center text-[#84E071]">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-[#17191C] border border-[#272A2F] flex items-center justify-center text-[#84E071]">
            <Loader2 className="w-6 h-6 animate-spin text-[#84E071]" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-[#EDEDED]">{title}</h3>
      <p className="text-xs text-[#8E95A0] max-w-sm mt-1">{description}</p>
    </div>
  );
}
