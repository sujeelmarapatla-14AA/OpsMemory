import React from 'react';
import {
  X,
  MessageSquare,
  Zap,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function QuickAssistanceModal({
  isOpen,
  onClose,
  onSelectExample,
  isLight = false,
}) {
  if (!isOpen) return null;

  const examples = [
    {
      title: 'Payment API database timeout',
      service: 'Payment API',
      severity: 'Critical',
      environment: 'Production',
      symptoms: 'Payment requests are returning HTTP 500 errors and database connection timeouts.',
      logs: 'Database connection pool exhausted. Timeout while acquiring database connection.'
    },
    {
      title: 'Authentication service Redis connection failure',
      service: 'Auth Service',
      severity: 'High',
      environment: 'Production',
      symptoms: 'Users are being logged out unexpectedly and new login attempts are failing.',
      logs: 'Redis clients unavailable. Authentication session store connection limit exceeded.'
    },
    {
      title: 'Order service database deadlock',
      service: 'Order Service',
      severity: 'High',
      environment: 'Production',
      symptoms: 'Some orders fail while multiple customers are placing orders at the same time.',
      logs: 'Database transaction deadlock detected. Multiple transactions are waiting for locked rows.'
    },
    {
      title: 'Notification API rate limit exceeded',
      service: 'Notification Service',
      severity: 'High',
      environment: 'Production',
      symptoms: 'Large numbers of notification requests are failing and delivery is delayed.',
      logs: 'External messaging provider returned HTTP 429 rate limit exceeded errors.'
    },
    {
      title: 'File upload service storage failure',
      service: 'File Upload Service',
      severity: 'Medium',
      environment: 'Production',
      symptoms: 'File uploads are failing even though the application is running normally.',
      logs: 'Storage bucket capacity limit reached. Upload operation rejected due to insufficient storage capacity.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl p-6 sm:p-7 rounded-2xl shadow-2xl transition-all bg-[#0d0d11] text-white border border-white/15"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer text-zinc-400 hover:text-white hover:bg-white/[0.06]"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pr-6 pl-6">
          <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-white">
            OpsMemory Quick Assistance
          </h2>
          <p className="text-xs mt-1 text-zinc-400">
            Start by selecting an incident scenario or describe symptoms. OpsMemory will recall prior incident memories and synthesize root causes.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Column 1: Examples */}
          <div className="p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-2.5 text-white font-mono">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Examples</span>
              </div>
              <div className="space-y-2">
                {examples.slice(0, 3).map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onSelectExample?.(ex);
                      onClose?.();
                    }}
                    className="w-full text-left p-2.5 rounded-lg text-[11px] leading-snug transition-all flex items-center justify-between gap-1 group cursor-pointer bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20"
                  >
                    <span className="truncate">&quot;{ex.title}&quot;</span>
                    <ArrowRight className="w-3 h-3 shrink-0 text-white opacity-60 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-center text-zinc-500 mt-2 font-mono">
              Click to load &amp; investigate
            </div>
          </div>

          {/* Column 2: Capabilities */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#171a1f] border-[#2b313a]'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-2.5 text-amber-500 font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>Capabilities</span>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed">
              <div
                className={`p-2 rounded-lg ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-600'
                    : 'bg-[#21262d] border border-[#30363d] text-[#8E95A0]'
                }`}
              >
                Remembers prior incident resolutions in Hindsight vector memory
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-600'
                    : 'bg-[#21262d] border border-[#30363d] text-[#8E95A0]'
                }`}
              >
                Synthesizes root causes &amp; step-by-step remediation via Groq AI
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-600'
                    : 'bg-[#21262d] border border-[#30363d] text-[#8E95A0]'
                }`}
              >
                Retains verified engineer fixes to prevent future repeat outages
              </div>
            </div>
          </div>

          {/* Column 3: Limitations */}
          <div
            className={`p-3.5 rounded-xl border ${
              isLight
                ? 'bg-slate-50 border-slate-200'
                : 'bg-[#171a1f] border-[#2b313a]'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold mb-2.5 text-rose-400 font-mono">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Limitations</span>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed">
              <div
                className={`p-2 rounded-lg ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-600'
                    : 'bg-[#21262d] border border-[#30363d] text-[#8E95A0]'
                }`}
              >
                Requires stack traces or symptoms telemetry for maximum accuracy
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-600'
                    : 'bg-[#21262d] border border-[#30363d] text-[#8E95A0]'
                }`}
              >
                Engineer verification step recommended prior to production scaling
              </div>
              <div
                className={`p-2 rounded-lg ${
                  isLight
                    ? 'bg-white border border-slate-200 text-slate-600'
                    : 'bg-[#21262d] border border-[#30363d] text-[#8E95A0]'
                }`}
              >
                Knowledge bank index reflects past recorded experiences
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
