import React from 'react';
import {
  AlertOctagon,
  Brain,
  Sparkles,
  Wrench,
  Database,
  ArrowDown,
  CheckCircle2,
  Clock
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    id: 'new',
    name: 'NEW INCIDENT',
    subtitle: 'Telemetry & Logs Submitted',
    icon: AlertOctagon,
  },
  {
    id: 'recall',
    name: 'MEMORY RECALL',
    subtitle: 'Hindsight Recalls Experiences',
    icon: Brain,
  },
  {
    id: 'investigation',
    name: 'AI INVESTIGATION',
    subtitle: 'Groq Synthesizes Analysis',
    icon: Sparkles,
  },
  {
    id: 'resolution',
    name: 'ENGINEER RESOLUTION',
    subtitle: 'Engineer Validates Fix',
    icon: Wrench,
  },
  {
    id: 'retained',
    name: 'MEMORY RETAIN',
    subtitle: 'Experience Saved to Bank',
    icon: Database,
  },
];

export default function MemoryConnectionFlow({
  incidentId = 'INC-084',
  currentStep = 'resolution',
  isResolved = false,
  memoriesCount = 0,
  variant = 'vertical',
}) {
  const activeStepId = isResolved ? 'retained' : currentStep;

  const getStepStatus = (stepId) => {
    const stepOrder = ['new', 'recall', 'investigation', 'resolution', 'retained'];
    const activeIdx = stepOrder.indexOf(activeStepId);
    const thisIdx = stepOrder.indexOf(stepId);

    if (thisIdx < activeIdx || (isResolved && stepId === 'retained')) {
      return 'completed';
    }
    if (thisIdx === activeIdx) {
      return 'active';
    }
    return 'pending';
  };

  if (variant === 'horizontal') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              OpsMemory Autonomous Reasoning Workflow
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/10">
            Pipeline: 5 Stages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
          {WORKFLOW_STEPS.map((step, idx) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    status === 'completed'
                      ? 'bg-white/[0.03] border-white/20 text-zinc-300'
                      : status === 'active'
                      ? 'bg-white/[0.08] border-white/50 text-white shadow-sm shadow-white/5'
                      : 'bg-white/[0.01] border-white/[0.05] text-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${status === 'pending' ? 'text-zinc-600' : 'text-white'}`} />
                      <span className="text-[10px] font-mono font-bold tracking-tight">
                        0{idx + 1}
                      </span>
                    </div>
                    {status === 'completed' && (
                      <CheckCircle2 className="w-3 h-3 text-zinc-300" />
                    )}
                    {status === 'active' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    )}
                  </div>
                  <div className="text-[11px] font-mono font-bold truncate">
                    {step.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {step.id === 'recall' && memoriesCount > 0
                      ? `${memoriesCount} memories found`
                      : step.subtitle}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // Vertical layout (default for sidebar in Investigation view)
  return (
    <div className="p-5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] text-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-white" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Reasoning Workflow
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/10">
          {isResolved ? 'Resolved' : 'Active'}
        </span>
      </div>

      <div className="flex flex-col items-stretch space-y-2 font-mono text-[11px]">
        {WORKFLOW_STEPS.map((step, idx) => {
          const status = getStepStatus(step.id, idx);
          const Icon = step.icon;
          const isLast = idx === WORKFLOW_STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  status === 'completed'
                    ? 'bg-white/[0.03] border-white/20 text-zinc-300'
                    : status === 'active'
                    ? 'bg-white/[0.08] border-white/50 text-white shadow-sm shadow-white/5'
                    : 'bg-white/[0.01] border-white/[0.05] text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      status === 'completed'
                        ? 'bg-white/10 border-white/20 text-white'
                        : status === 'active'
                        ? 'bg-white border-white text-black'
                        : 'bg-white/[0.02] border-white/[0.06] text-zinc-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[11px] truncate">
                      {step.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {step.id === 'new'
                        ? `ID: ${incidentId}`
                        : step.id === 'recall' && memoriesCount > 0
                        ? `${memoriesCount} memories recalled`
                        : step.subtitle}
                    </div>
                  </div>
                </div>

                <div>
                  {status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-zinc-300" />
                  )}
                  {status === 'active' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white border border-white/30 animate-pulse">
                      Active
                    </span>
                  )}
                  {status === 'pending' && (
                    <Clock className="w-3.5 h-3.5 text-zinc-600" />
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown
                    className={`w-3.5 h-3.5 ${
                      status === 'completed' ? 'text-zinc-500' : 'text-zinc-700'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
