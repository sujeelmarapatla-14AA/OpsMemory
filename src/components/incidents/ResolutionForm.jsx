import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Brain,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { resolveIncident } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ResolutionForm({
  incident,
  incidentId,
  suggestedRootCause,
  suggestedResolution,
  onResolved,
  isAlreadyResolved = false
}) {
  const { addToast } = useToast();

  const title = incident?.title || '';
  const service = incident?.service || '';

  const [rootCause, setRootCause] = useState(suggestedRootCause || '');
  const [resolution, setResolution] = useState(suggestedResolution || '');
  const [outcome, setOutcome] = useState('Fix Worked');
  const [timeToResolution, setTimeToResolution] = useState('15 minutes');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedData, setConfirmedData] = useState(isAlreadyResolved ? { isAlready: true } : null);

  useEffect(() => {
    if (suggestedRootCause && !rootCause) {
      setRootCause(suggestedRootCause);
    }
    if (suggestedResolution && !resolution) {
      setResolution(suggestedResolution);
    }
  }, [suggestedRootCause, suggestedResolution]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rootCause.trim() || !resolution.trim()) {
      setError('Please provide both the actual root cause and the resolution applied.');
      addToast({
        title: 'Missing Resolution Details',
        message: 'Root cause and resolution are required to retain operational knowledge.',
        type: 'warning'
      });
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      incident_title: title,
      service: service,
      root_cause: rootCause.trim(),
      resolution: resolution.trim(),
      outcome: outcome,
      time_to_resolution: timeToResolution.trim() || '14 minutes',
      id: incidentId || incident?.id || 'INC-084'
    };

    try {
      const result = await resolveIncident(payload);
      setConfirmedData(result);

      addToast({
        title: 'Incident Resolved & Remembered',
        message: 'Experience successfully committed to OpsMemory Hindsight bank.',
        type: 'success'
      });

      if (onResolved) {
        onResolved(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit resolution to OpsMemory backend.');
      addToast({
        title: 'Resolution Error',
        message: err.message || 'Could not reach backend.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS STATE (Hero aesthetic: dark surface, subtle emerald beacon, no giant green cards)
  if (confirmedData) {
    const exp = confirmedData.stored_experience || {
      incident: title,
      service: service,
      root_cause: rootCause,
      resolution: resolution,
      outcome: outcome,
      time_to_resolution: timeToResolution
    };

    return (
      <div className="p-6 sm:p-7 rounded-2xl bg-[#0d0d11] border border-white/[0.15] shadow-2xl space-y-6 font-sans animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white tracking-tight">
                {confirmedData.memory_retained === false
                  ? 'INCIDENT RESOLVED (MEMORY RETENTION PENDING)'
                  : confirmedData.database_updated === false
                  ? 'EXPERIENCE STORED (DATABASE STATUS PENDING)'
                  : 'EXPERIENCE STORED IN OPSMEMORY'}
              </h3>
              <p className="text-xs text-[#949aa3] mt-0.5 font-sans">
                {confirmedData.memory_retained === false
                  ? 'Incident was updated in database, but Hindsight memory retention was not completed.'
                  : confirmedData.database_updated === false
                  ? 'Incident resolution was committed to Hindsight, but database record update encountered an issue.'
                  : 'Incident experience successfully committed to Hindsight memory bank.'}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-3 py-1 rounded border border-white/15 bg-white/[0.03] text-white/90 self-start sm:self-auto">
            Hindsight Bank: OpsMemory
          </span>
        </div>

        {/* Visual Knowledge Feedback */}
        <div className="p-4 rounded-xl bg-[#121216] border border-white/[0.08] space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#5a606b] block font-semibold">
            Knowledge Loop Status
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#0d0d11] border border-white/[0.08] flex items-center gap-2 text-white">
              <span className={confirmedData.database_updated !== false ? "text-emerald-400" : "text-amber-400"}>
                {confirmedData.database_updated !== false ? "✓" : "!"}
              </span>
              <span>Incident Resolved</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d0d11] border border-white/[0.08] flex items-center gap-2 text-white">
              <span className={confirmedData.memory_retained !== false ? "text-emerald-400" : "text-amber-400"}>
                {confirmedData.memory_retained !== false ? "✓" : "!"}
              </span>
              <span>{confirmedData.memory_retained !== false ? "Experience Remembered" : "Retention Failed"}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0d0d11] border border-white/[0.08] flex items-center gap-2 text-white">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span>Future Incidents Reuse</span>
            </div>
          </div>
        </div>

        {/* Retained Metadata Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#121216] border border-white/[0.08]">
            <span className="text-[10px] text-[#5a606b] block mb-0.5">ACTUAL ROOT CAUSE</span>
            <span className="text-white">{exp.root_cause}</span>
          </div>
          <div className="p-3 rounded-lg bg-[#121216] border border-white/[0.08]">
            <span className="text-[10px] text-[#5a606b] block mb-0.5">VERIFIED RESOLUTION</span>
            <span className="text-white/90">{exp.resolution}</span>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE RESOLUTION FORM
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-xl space-y-5 font-sans">
      <div className="pb-3 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white/80" />
            <span>Resolve &amp; Retain Incident Experience</span>
          </h3>
          <p className="text-xs text-[#949aa3] mt-0.5 font-sans">
            Validate the resolution applied. OpsMemory will store this experience to prevent repeat outages.
          </p>
        </div>
        <span className="text-[11px] font-mono text-[#5a606b] hidden sm:inline">
          FastAPI /api/incidents/resolve
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/25 text-xs text-rose-400 flex items-center gap-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Root Cause Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white">
            Actual Root Cause
          </label>
          <input
            type="text"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="What actually caused the outage?"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#121216] text-[#EDEDED] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/20 focus:outline-none font-mono"
          />
        </div>

        {/* Resolution Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white">
            Resolution Applied &amp; Verification
          </label>
          <textarea
            rows={3}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Explain steps taken to restore service (e.g. pool configuration, rollback, instance restart)..."
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[#121216] text-[#EDEDED] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/20 focus:outline-none font-mono resize-y"
          />
        </div>

        {/* Outcome & MTTR Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white">
              Resolution Outcome
            </label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#121216] text-[#EDEDED] border border-white/[0.08] focus:border-white/40 focus:outline-none"
            >
              <option value="Fix Worked">Fix Worked (Zero Repeat Outages)</option>
              <option value="Partially Mitigated">Partially Mitigated</option>
              <option value="Temporary Workaround">Temporary Workaround</option>
              <option value="Requires Architectural Revision">Requires Architectural Revision</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white">
              Time to Resolution (MTTR)
            </label>
            <input
              type="text"
              value={timeToResolution}
              onChange={(e) => setTimeToResolution(e.target.value)}
              placeholder="e.g. 14 minutes"
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#121216] text-[#EDEDED] border border-white/[0.08] focus:border-white/40 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Submit Button (Matching Hero Accent) */}
        <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
          <span className="text-[11px] font-mono text-[#5a606b]">
            Shortcut: <kbd>R</kbd>
          </span>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-white text-black hover:bg-neutral-200 border border-white/30 shadow-lg shadow-white/5 transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Storing in Hindsight...</span>
              </>
            ) : (
              <>
                <span>✓</span>
                <span>Resolve &amp; Remember</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
