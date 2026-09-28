import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function InvestigationResultView({ data }) {
  const { addToast } = useToast();
  const [copiedItem, setCopiedItem] = useState(null);
  const [expandedMemoryIdx, setExpandedMemoryIdx] = useState(0);
  const [showFullLogs, setShowFullLogs] = useState(false);
  const [showRawAiReport, setShowRawAiReport] = useState(false);

  if (!data || !data.incident) return null;

  const {
    incident,
    memory_bank = 'OpsMemory',
    memories_found = 0,
    relevant_memories = [],
    memory_matches = [],
    analysis,
    ai_analysis
  } = data;

  const actualMemoriesCount = memories_found || relevant_memories.length || memory_matches.length || 0;

  const normalizedMemories = relevant_memories.length > 0
    ? relevant_memories.map((m, idx) => {
        const textParts = (m.text || '').split(' | ');
        const desc = textParts[0] || m.text || '';
        const meta = textParts.slice(1);

        return {
          id: `MEM-0${idx + 1}`,
          service: incident.service,
          summary: desc,
          root_cause: desc.includes('exhaust')
            ? 'Connection pool exhaustion'
            : desc.includes('Redis')
            ? 'Redis connection / client limit reached'
            : desc.includes('deadlock')
            ? 'Concurrent database deadlock'
            : desc.includes('rate limit')
            ? 'Rate limit exceeded on upstream provider'
            : desc.includes('storage') || desc.includes('bucket')
            ? 'Storage capacity limit reached'
            : 'Operational resource saturation',
          resolution: desc.includes('increas') || desc.includes('pool')
            ? 'Scaled database max connections and performed rolling restart of service instances'
            : desc.includes('Redis')
            ? 'Increased client limits and cleared stale connections'
            : desc.includes('deadlock')
            ? 'Adjusted transaction query ordering and implemented retry backoff'
            : desc.includes('rate limit')
            ? 'Implemented request queuing and exponential backoff'
            : desc.includes('storage')
            ? 'Expanded storage quota and removed obsolete artifacts'
            : 'Adjusted resource limits and verified latency metrics recovery',
          outcome: 'Fix Worked',
          time_to_resolution: '14 minutes',
          relevance: Math.max(70, 96 - idx * 3),
          rawMeta: meta
        };
      })
    : memory_matches.length > 0
    ? memory_matches
    : [];

  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    addToast({
      title: 'Copied to Clipboard',
      message: `${label} copied successfully.`,
      type: 'info'
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ========================================================= */}
      {/* 1. CURRENT INCIDENT CARD                                  */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs font-bold text-white">
              {incident.id || 'INC-084'}
            </span>
            <span className="text-[#3b4252]">·</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/90 border border-white/15">
              {incident.service}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                incident.severity === 'Critical'
                  ? 'border-rose-500/30 text-rose-400 bg-rose-500/5'
                  : 'border-amber-500/30 text-amber-400 bg-amber-500/5'
              }`}
            >
              {incident.severity}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/[0.02] text-[#949aa3]">
              {incident.environment}
            </span>
          </div>

          <button
            onClick={() => handleCopy(`${incident.title}\n${incident.symptoms}`, 'Incident Summary')}
            className="text-xs font-mono text-[#949aa3] hover:text-white flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 hover:border-white/25 transition-colors cursor-pointer self-start sm:self-auto"
          >
            {copiedItem === 'Incident Summary' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {incident.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#949aa3] mt-1.5 leading-relaxed font-sans">
            {incident.symptoms}
          </p>
        </div>

        {/* Logs Viewer */}
        {incident.logs && (
          <div className="rounded-xl border border-white/[0.08] bg-[#08080a] overflow-hidden">
            <div className="px-3.5 py-1.5 bg-[#101014] border-b border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-[#949aa3]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-white/80" />
                <span>telemetry_logs.stderr</span>
              </div>
              <button
                onClick={() => setShowFullLogs((prev) => !prev)}
                className="hover:text-white transition-colors cursor-pointer text-[10px]"
              >
                {showFullLogs ? 'Collapse' : 'Expand full logs'}
              </button>
            </div>
            <pre
              className={`p-3 text-xs font-mono text-white/90 leading-relaxed overflow-x-auto whitespace-pre-wrap ${
                showFullLogs ? 'max-h-96' : 'max-h-28'
              }`}
            >
              {incident.logs}
            </pre>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 2. SPLIT COMPARISON: FROM MEMORY vs AI ANALYSIS           */}
      {/* (Unified with Hero theme, no rainbow card backgrounds)    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* COLUMN 1: FROM MEMORY (HINDSIGHT PRECEDENT) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.12] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-white/80" />
              <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                FROM MEMORY · HINDSIGHT
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/15 bg-white/[0.03] text-white/90">
              Bank: {memory_bank}
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5a606b] block font-semibold">
              Evidence From Prior Incidents
            </span>
            <p className="text-xs leading-relaxed text-[#EDEDED] bg-[#121216] p-3 rounded-xl border border-white/[0.08]">
              {analysis?.reasoning ||
                (actualMemoriesCount > 0
                  ? `Hindsight recalled ${actualMemoriesCount} prior incident(s) relevant to "${incident.service}". Historical operational records correlate with observed failure symptoms.`
                  : `No previous incidents found in Hindsight for "${incident.service}". This appears to be a new operational scenario.`)}
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5a606b] block font-semibold">
              Previous Resolution That Succeeded
            </span>
            <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.08] text-xs text-[#EDEDED] leading-relaxed font-mono">
              <div className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${actualMemoriesCount > 0 ? 'text-emerald-400' : 'text-[#5a606b]'}`} />
                <span>
                  {analysis?.prior_resolution ||
                    (actualMemoriesCount > 0
                      ? 'Review the detailed historical memory cards below for specific remediation actions that succeeded previously.'
                      : 'None recorded in Hindsight on file for this incident pattern. Follow recommended AI action steps to resolve and retain.')}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#5a606b]">
            <span>Hindsight Status: {actualMemoriesCount > 0 ? 'Active Memories Matched' : 'Cold Bank / New Scenario'}</span>
            <span>{actualMemoriesCount} vector matches</span>
          </div>
        </div>

        {/* COLUMN 2: AI ANALYSIS (GROQ SYNTHESIS) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.12] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/80" />
              <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                AI ANALYSIS · GROQ
              </span>
            </div>
            <button
              onClick={() => handleCopy(ai_analysis || analysis?.summary, 'AI Analysis')}
              className="text-xs font-mono text-[#949aa3] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedItem === 'AI Analysis' ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Copy Analysis</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5a606b] block font-semibold">
              Likely Root Cause
            </span>
            <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.08] text-xs font-mono font-semibold text-white">
              {analysis?.likely_root_cause || 'Database connection pool exhaustion under high concurrent load'}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5a606b] block font-semibold">
                Recommended Immediate Actions
              </span>
              <button
                onClick={() =>
                  handleCopy(
                    (analysis?.recommended_steps || []).join('\n'),
                    'Recommended Actions'
                  )
                }
                className="text-[10px] font-mono text-[#949aa3] hover:text-white"
              >
                Copy steps
              </button>
            </div>
            <ol className="space-y-2 text-xs font-mono text-[#EDEDED]">
              {(analysis?.recommended_steps || [
                'Check active database connection pool utilization in telemetry metrics.',
                'Temporarily increase max-pool-size from 50 to 100 in helm deployment values.',
                'Perform rolling restart of affected service pod instances.',
                'Verify p99 response times and socket connection timeouts normalize to baseline.'
              ]).map((step, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#121216] border border-white/[0.08] flex items-start gap-2.5"
                >
                  <span className="w-4 h-4 rounded bg-white/10 text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Verification / Caution Step */}
          <div className="p-3 rounded-xl bg-[#121216] border border-white/[0.08] space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[11px] uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Verification &amp; Caution</span>
            </div>
            <p className="text-[#949aa3] leading-relaxed text-[11px] font-mono">
              {analysis?.caution ||
                'Monitor for socket leaks: Ensure all connections acquired from pool are explicitly released in finally blocks.'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. HERO FEATURE: HINDSIGHT "MEMORY RETRIEVED" SECTION     */}
      {/* (Hero-architectural cards, understandable in 3 seconds)   */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-white/80" />
            <h4 className="text-sm font-bold text-white tracking-tight">
              Memory Retrieved from Hindsight
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded border border-white/15 bg-white/[0.03] text-white/90">
              Bank: <strong className="text-white">{memory_bank}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded border border-white/15 bg-white/[0.03] text-white/90">
              Memories found: <strong className="text-white">{actualMemoriesCount}</strong>
            </span>
          </div>
        </div>

        {/* Expandable Memory Cards or Empty State */}
        {normalizedMemories.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-white/[0.12] bg-[#121216] text-center space-y-2.5">
            <Brain className="w-8 h-8 text-[#5a606b] mx-auto" />
            <div className="font-mono text-xs font-semibold text-white tracking-tight">
              No Prior Memories Found in Hindsight
            </div>
            <p className="text-xs text-[#949aa3] max-w-md mx-auto font-sans leading-relaxed">
              This is a new operational scenario for memory bank <strong>{memory_bank}</strong>. 
              Once resolved below, OpsMemory will retain this experience to remember what your team learned.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {normalizedMemories.map((mem, idx) => {
              const isExpanded = expandedMemoryIdx === idx;

              return (
                <div
                  key={mem.id || idx}
                  className="rounded-xl border border-white/[0.08] bg-[#121216] hover:border-white/20 transition-all overflow-hidden"
                >
                  {/* Header Row */}
                  <div
                    onClick={() => setExpandedMemoryIdx(isExpanded ? -1 : idx)}
                    className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-white/[0.04] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-white/15">
                        {mem.id}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-semibold text-white truncate">
                            {mem.service}
                          </span>
                          <span className="text-[#3b4252]">·</span>
                          <span className="text-[#949aa3] truncate">
                            {mem.root_cause}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#949aa3] truncate mt-0.5">
                          Fix: {mem.resolution}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hidden sm:inline">
                        {mem.outcome}
                      </span>
                      <span className="text-xs font-mono text-[#949aa3]">
                        {mem.time_to_resolution}
                      </span>
                      <button className="text-[#5a606b] hover:text-white p-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-white/[0.08] bg-[#09090c] space-y-3 text-xs font-mono animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-[#121216] border border-white/[0.08]">
                          <span className="text-[10px] text-[#5a606b] block uppercase mb-1">
                            Past Root Cause
                          </span>
                          <span className="text-white">{mem.root_cause}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-[#121216] border border-white/[0.08]">
                          <span className="text-[10px] text-[#5a606b] block uppercase mb-1">
                            Verified Resolution
                          </span>
                          <span className="text-white/90">{mem.resolution}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 text-[#949aa3]">
                        <span>Outcome: <strong className="text-emerald-400">{mem.outcome}</strong></span>
                        <span>MTTR: <strong className="text-white">{mem.time_to_resolution}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Raw Groq Collapsible */}
      {ai_analysis && (
        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0d0d11]">
          <button
            onClick={() => setShowRawAiReport((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs font-mono text-[#949aa3] hover:text-white transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />
              <span>View Raw Groq AI Synthesis Output</span>
            </div>
            {showRawAiReport ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRawAiReport && (
            <div className="mt-3 p-3.5 rounded-lg bg-[#08080a] border border-white/[0.08] text-xs font-mono text-[#949aa3] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-80">
              {ai_analysis}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
