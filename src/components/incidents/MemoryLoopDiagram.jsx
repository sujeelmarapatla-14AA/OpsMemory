import React from 'react';
import {
  AlertTriangle,
  Brain,
  Sparkles,
  CheckCircle,
  Database,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const STAGES = [
  {
    id: 'incident',
    number: '01',
    label: 'INCIDENT',
    description: 'Telemetry & logs anomaly',
    icon: AlertTriangle,
  },
  {
    id: 'recall',
    number: '02',
    label: 'RECALL',
    description: 'Hindsight semantic search',
    icon: Brain,
  },
  {
    id: 'investigation',
    number: '03',
    label: 'INVESTIGATE',
    description: 'Groq root cause synthesis',
    icon: Sparkles,
  },
  {
    id: 'resolution',
    number: '04',
    label: 'RESOLVE',
    description: 'Engineer applies validated fix',
    icon: CheckCircle,
  },
  {
    id: 'retain',
    number: '05',
    label: 'RETAIN',
    description: 'Experience stored in bank',
    icon: Database,
  },
  {
    id: 'loop',
    number: '06',
    label: 'LEARN',
    description: 'Zero repeat outage loop',
    icon: TrendingUp,
  }
];

export default function MemoryLoopDiagram({ currentStage = 'incident', isResolved = false }) {
  const getStageState = (stageId) => {
    if (isResolved) return 'completed';
    const order = ['incident', 'recall', 'investigation', 'resolution', 'retain', 'loop'];
    const curIdx = order.indexOf(currentStage);
    const thisIdx = order.indexOf(stageId);
    if (thisIdx < curIdx) return 'completed';
    if (thisIdx === curIdx) return 'active';
    return 'idle';
  };

  return (
    <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-lg text-xs font-sans transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5 text-white" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300 font-semibold">
            Continuous Operational Memory Loop
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Hindsight Vector Index · Groq Synthesis · Supabase Storage
        </span>
      </div>

      {/* 6-Stage Process Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 sm:gap-2.5 items-stretch">
        {STAGES.map((stg, i) => {
          const state = getStageState(stg.id);
          const Icon = stg.icon;
          const isActive = state === 'active';
          const isCompleted = state === 'completed';

          return (
            <div
              key={stg.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 relative ${
                isActive
                  ? 'bg-white/[0.08] border-white/50 shadow-[0_0_16px_rgba(255,255,255,0.08)] text-white'
                  : isCompleted
                  ? 'bg-white/[0.03] border-white/20 text-zinc-200'
                  : 'bg-white/[0.01] border-white/[0.06] text-zinc-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-[9px] font-bold ${
                      isActive ? 'text-white' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {stg.number}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? 'text-white animate-pulse'
                        : isCompleted
                        ? 'text-zinc-300'
                        : 'text-zinc-600'
                    }`}
                  />
                </div>

                <h4
                  className={`font-mono font-bold text-[10.5px] tracking-tight leading-tight ${
                    isActive ? 'text-white' : isCompleted ? 'text-zinc-200' : 'text-zinc-500'
                  }`}
                >
                  {stg.label}
                </h4>

                <p className="text-[10px] text-zinc-400 leading-snug mt-1 font-sans">
                  {stg.description}
                </p>
              </div>

              {/* Step indicator dot */}
              <div className="mt-3 pt-2 border-t border-white/[0.05] flex items-center justify-between">
                <span
                  className={`text-[9px] font-mono ${
                    isActive
                      ? 'text-white font-bold'
                      : isCompleted
                      ? 'text-zinc-400'
                      : 'text-zinc-600'
                  }`}
                >
                  {isActive ? '● Active' : isCompleted ? '✓ Done' : 'Standby'}
                </span>
                {i < STAGES.length - 1 && (
                  <ArrowRight className="w-2.5 h-2.5 text-zinc-600 hidden md:block" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
