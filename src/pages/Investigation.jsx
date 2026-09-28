import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Terminal,
  ArrowLeft,
  Copy,
  Check,
  Inbox,
  Lightbulb
} from 'lucide-react';
import IncidentHeader from '../components/incidents/IncidentHeader';
import MemoryMatchCard from '../components/incidents/MemoryMatchCard';
import RecommendationPanel from '../components/incidents/RecommendationPanel';
import ResolutionForm from '../components/incidents/ResolutionForm';
import MemoryConnectionFlow from '../components/incidents/MemoryConnectionFlow';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import { getIncident } from '../services/api';

export default function Investigation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedLogs, setCopiedLogs] = useState(false);

  const fetchInvestigation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getIncident(id);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvestigation();
  }, [fetchInvestigation]);

  const handleCopyLogs = () => {
    if (data?.incident?.logs) {
      navigator.clipboard.writeText(data.incident.logs);
      setCopiedLogs(true);
      setTimeout(() => setCopiedLogs(false), 2000);
    }
  };

  const handleIncidentResolved = () => {
    if (data?.incident) {
      setData((prev) => ({
        ...prev,
        incident: {
          ...prev.incident,
          status: 'Resolved'
        }
      }));
    }
  };

  if (loading) {
    return (
      <LoadingState
        title="🧠 Searching incident memory..."
        description={`Reviewing historical incidents for ${id || 'incident'}...`}
        isMemory={true}
      />
    );
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={fetchInvestigation} />;
  }

  if (!data || !data.incident) {
    return (
      <ErrorState
        message={`Incident ${id} could not be located in current telemetry.`}
        onRetry={fetchInvestigation}
      />
    );
  }

  const { incident, memory_matches = [], analysis } = data;
  const hasMemories = memory_matches && memory_matches.length > 0;
  const isResolved = incident.status === 'Resolved';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/incidents')}
          className="text-xs text-[#8E95A0] hover:text-[#EDEDED] flex items-center gap-1.5 transition-colors font-sans"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Incidents</span>
        </button>

        {/* Dynamic status pill */}
        <div className="flex items-center gap-2">
          {isResolved ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#84E071]/12 border border-[#84E071]/30 text-[#84E071] text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E071]"></span>
              <span>Memory Retained · Incident Resolved</span>
            </div>
          ) : hasMemories ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#84E071]/12 border border-[#84E071]/30 text-[#84E071] text-xs font-mono">
              <Brain className="w-3.5 h-3.5 text-[#84E071] animate-pulse" />
              <span>THE AI REMEMBERS: {memory_matches.length} Historical Matches</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#17191C] border border-[#272A2F] text-[#8E95A0] text-xs font-mono">
              <Inbox className="w-3.5 h-3.5" />
              <span>No Prior Memory Signature</span>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <IncidentHeader incident={incident} />

      {/* Main Two-Column Investigation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT / MAIN AREA: AI INVESTIGATION & TELEMETRY (7 cols)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI INVESTIGATION PANEL */}
          <div className="p-5 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#272A2F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#84E071]/12 border border-[#84E071]/25 flex items-center justify-center text-[#84E071]">
                  <Sparkles className="w-4 h-4 text-[#84E071]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
                    AI Investigation
                  </h3>
                  <p className="text-xs text-[#8E95A0] mt-0.5">
                    Hindsight synthesized root cause and remediation
                  </p>
                </div>
              </div>

              {analysis?.confidence && (
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

            {/* Incident Summary */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] block mb-1">
                Incident Summary
              </span>
              <p className="text-xs text-[#EDEDED] leading-relaxed p-3 rounded-xl bg-[#111214] border border-[#272A2F]">
                {analysis?.summary || 'Payment API is returning HTTP 500 errors because database connections are timing out.'}
              </p>
            </div>

            {/* Likely Root Cause */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] block mb-1">
                Likely Root Cause
              </span>
              <div className="p-3 rounded-xl bg-[#111214] border border-[#272A2F] flex items-center justify-between gap-3">
                <span className="text-xs font-mono font-semibold text-amber-400">
                  {analysis?.likely_root_cause || 'Connection pool exhaustion'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
                  High Corroboration
                </span>
              </div>
            </div>

            {/* Recommended Response */}
            {analysis && <RecommendationPanel analysis={analysis} />}

            {/* WHY THIS RECOMMENDATION? Compact Panel */}
            <div className="p-4 rounded-xl bg-[#111214] border border-[#272A2F] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#84E071]">
                <Lightbulb className="w-3.5 h-3.5 text-[#84E071]" />
                <span className="uppercase tracking-wider">WHY THIS RECOMMENDATION?</span>
              </div>
              <p className="text-xs text-[#EDEDED] leading-relaxed">
                {analysis?.reasoning ||
                  '3 similar incidents were found in Hindsight memory. 2 previous incidents were successfully resolved by addressing database connection pool exhaustion.'}
              </p>
            </div>
          </div>

          {/* TELEMETRY & ERROR LOGS */}
          <div className="p-5 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#272A2F]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#8E95A0]" />
                <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
                  Captured Telemetry &amp; Logs
                </h3>
              </div>
              <button
                onClick={handleCopyLogs}
                className="text-[11px] font-mono text-[#8E95A0] hover:text-[#EDEDED] flex items-center gap-1"
              >
                {copiedLogs ? (
                  <>
                    <Check className="w-3 h-3 text-[#84E071]" />
                    <span className="text-[#84E071]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Logs</span>
                  </>
                )}
              </button>
            </div>

            {/* Code log box */}
            <div className="rounded-xl border border-[#272A2F] bg-[#0E1013] overflow-hidden">
              <div className="px-3 py-1.5 bg-[#14161A] border-b border-[#272A2F] flex items-center justify-between text-[11px] font-mono text-[#8E95A0]">
                <span>stacktrace.log</span>
                <span>utf-8</span>
              </div>
              <pre className="p-3.5 text-xs text-[#84E071] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {incident.logs || 'No logs captured.'}
              </pre>
            </div>

            {/* Symptoms and Metadata */}
            <div className="space-y-3 pt-1">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E95A0] block mb-1">
                  Reported Symptoms
                </span>
                <p className="text-xs text-[#EDEDED] leading-relaxed p-3 rounded-xl bg-[#111214] border border-[#272A2F]">
                  {incident.symptoms || 'No symptoms provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#111214] border border-[#272A2F]">
                  <span className="text-[10px] text-[#5A606B] uppercase block">Affected Users</span>
                  <span className="text-[#EDEDED] font-semibold mt-0.5 block">{incident.affected_users || 'Unspecified'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#111214] border border-[#272A2F]">
                  <span className="text-[10px] text-[#5A606B] uppercase block">Recent Deployment</span>
                  <span className="text-[#EDEDED] font-semibold mt-0.5 block truncate">{incident.recent_change || 'None reported'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT / MEMORY PANEL: 🧠 HINDSIGHT MEMORY (5 cols)        */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 space-y-6">
          {/* HINDSIGHT MEMORY PANEL */}
          <div className="p-5 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#272A2F]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#84E071]/12 border border-[#84E071]/30 flex items-center justify-center text-[#84E071]">
                  <Brain className="w-4 h-4 text-[#84E071] animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#EDEDED] font-sans tracking-tight">
                    🧠 HINDSIGHT MEMORY
                  </h3>
                  <p className="text-xs text-[#8E95A0] mt-0.5">
                    {hasMemories
                      ? `${memory_matches.length} relevant experiences recalled`
                      : '0 relevant memories found'}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#84E071]/12 text-[#84E071] border border-[#84E071]/30">
                Recall Complete
              </span>
            </div>

            {/* Recalled Memory Cards */}
            {hasMemories ? (
              <div className="space-y-3">
                {memory_matches.map((match) => (
                  <MemoryMatchCard key={match.incident_id} match={match} />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#111214] border border-[#272A2F] text-center space-y-2">
                <Inbox className="w-6 h-6 text-[#5A606B] mx-auto" />
                <h4 className="text-xs font-semibold text-[#EDEDED]">
                  🧠 No relevant experience found
                </h4>
                <p className="text-xs text-[#8E95A0]">
                  This looks like a new incident for OpsMemory. Once resolved, the outcome will be retained for future incidents.
                </p>
              </div>
            )}
          </div>

          {/* MEMORY CONNECTION VISUAL */}
          <MemoryConnectionFlow incidentId={incident.id} />
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM RESOLUTION SECTION: "Did this fix work?"           */}
      {/* ========================================================= */}
      <div className="pt-2 border-t border-[#272A2F]">
        <ResolutionForm
          incidentId={incident.id}
          isAlreadyResolved={isResolved}
          onResolved={handleIncidentResolved}
        />
      </div>
    </div>
  );
}
