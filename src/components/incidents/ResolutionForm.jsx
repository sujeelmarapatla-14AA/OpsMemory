import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  Brain,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import { resolveIncident } from '../../services/api';

export default function ResolutionForm({ incidentId, onResolved, isAlreadyResolved = false }) {
  const navigate = useNavigate();
  const [selectedOutcome, setSelectedOutcome] = useState('Fix Worked');
  const [showFields, setShowFields] = useState(true);
  const [rootCause, setRootCause] = useState('HikariCP database connection pool starvation under high concurrent webhook traffic.');
  const [resolution, setResolution] = useState('Scaled database max-pool-size from 100 to 150 in helm config and restarted Payment API pods.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(isAlreadyResolved ? { already: true } : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rootCause.trim() || !resolution.trim()) {
      setError('Please provide both the actual root cause and resolution applied.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await resolveIncident(incidentId, {
        root_cause: rootCause,
        resolution: resolution,
        outcome: selectedOutcome
      });

      setSuccessData(result);
      if (onResolved) {
        onResolved(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit incident resolution.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="p-6 rounded-2xl bg-[#17191C] border border-[#84E071]/40 space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#84E071] font-mono font-bold text-base">
              <Check className="w-5 h-5 text-[#84E071] stroke-[2.5]" />
              <span>✓ EXPERIENCE SAVED</span>
            </div>
            <p className="text-xs text-[#EDEDED] pl-7">
              OpsMemory will use this incident when similar failures occur.
            </p>
            <p className="text-[11px] text-[#8E95A0] pl-7">
              Root cause and mitigation indexed into Hindsight bank: <span className="font-mono text-[#84E071]">ops-incidents</span>
            </p>
          </div>

          <div className="pl-7 sm:pl-0">
            <Button
              variant="obsidian"
              size="md"
              icon={Brain}
              onClick={() => navigate('/memory')}
              className="text-xs font-mono"
            >
              View Memory →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#272A2F]">
        <div>
          <h3 className="text-sm font-semibold text-[#EDEDED] font-sans">
            Confirm Incident Resolution
          </h3>
          <p className="text-xs text-[#8E95A0] mt-0.5">
            Retain verified fix in Hindsight to prevent future repeat triage
          </p>
        </div>

        <span className="text-[11px] font-mono text-[#8E95A0]">
          Status: <strong className="text-[#84E071]">Ready for Retention</strong>
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* "Did this fix work?" Buttons */}
        <div>
          <label className="block text-xs font-mono font-medium text-[#8E95A0] mb-2 uppercase tracking-wider">
            Did this fix work?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'Fix Worked', label: '✓ Fix Worked' },
              { id: 'Fix Partially Worked', label: 'Fix Partially Worked' },
              { id: 'Fix Failed', label: '✕ Fix Failed' },
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => {
                  setSelectedOutcome(opt.id);
                  setShowFields(true);
                }}
                className={`py-2.5 px-4 rounded-xl text-xs font-mono font-semibold transition-all border ${
                  selectedOutcome === opt.id
                    ? opt.id === 'Fix Worked'
                      ? 'bg-[#84E071] text-[#090A0C] border-[#84E071] shadow-xs'
                      : opt.id === 'Fix Partially Worked'
                      ? 'bg-amber-400 text-[#090A0C] border-amber-400'
                      : 'bg-rose-500 text-white border-rose-500'
                    : 'bg-[#111214] text-[#8E95A0] border-[#272A2F] hover:text-[#EDEDED] hover:border-[#383C44]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Textareas */}
        {showFields && (
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-mono font-medium text-[#8E95A0] mb-1.5 uppercase tracking-wider">
                Actual Root Cause
              </label>
              <textarea
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="e.g. HikariCP database connection pool starvation under high concurrent payment webhook traffic..."
                className="w-full bg-[#111214] border border-[#272A2F] rounded-xl p-3 text-xs text-[#EDEDED] placeholder-[#5A606B] focus:outline-none focus:border-[#84E071]/50 font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#8E95A0] mb-1.5 uppercase tracking-wider">
                Resolution Applied
              </label>
              <textarea
                rows={2}
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="e.g. Scaled database max connections to 150 and rolled restart Payment API pod deployment..."
                className="w-full bg-[#111214] border border-[#272A2F] rounded-xl p-3 text-xs text-[#EDEDED] placeholder-[#5A606B] focus:outline-none focus:border-[#84E071]/50 font-mono transition-colors"
                required
              />
            </div>

            {/* Save Experience Button */}
            <div className="pt-3 border-t border-[#272A2F] flex items-center justify-end gap-3">
              <Button
                type="submit"
                variant="obsidian"
                size="lg"
                loading={loading}
                icon={Brain}
                className="text-xs font-mono"
              >
                🧠 Save Experience to Memory
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
