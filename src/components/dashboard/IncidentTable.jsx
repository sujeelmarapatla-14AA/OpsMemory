import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Brain } from 'lucide-react';
import SeverityBadge from '../incidents/SeverityBadge';
import StatusBadge from '../incidents/StatusBadge';
import EmptyState from '../ui/EmptyState';

export default function IncidentTable({ incidents = [], limit }) {
  const navigate = useNavigate();
  const displayIncidents = limit ? incidents.slice(0, limit) : incidents;

  if (!displayIncidents || displayIncidents.length === 0) {
    return (
      <EmptyState
        title="No incidents logged"
        description="No operational incidents currently recorded in this view."
      />
    );
  }

  const getSeverityDot = (sev) => {
    switch ((sev || '').toLowerCase()) {
      case 'critical':
        return 'bg-rose-500 shadow-sm shadow-rose-500/50';
      case 'high':
        return 'bg-amber-400';
      case 'medium':
        return 'bg-yellow-400';
      default:
        return 'bg-[#8E95A0]';
    }
  };

  return (
    <div className="space-y-2">
      {displayIncidents.map((incident) => (
        <div
          key={incident.id}
          onClick={() => navigate(`/incidents/${incident.id}`)}
          className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:px-4 sm:py-3.5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] hover:border-white/20 hover:bg-[#121217] cursor-pointer transition-all duration-150"
        >
          {/* Left: Severity dot, ID, Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Severity dot */}
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${getSeverityDot(
                incident.severity
              )}`}
              title={`Severity: ${incident.severity}`}
            />

            {/* Incident ID */}
            <span className="font-mono text-xs font-bold text-white group-hover:text-white transition-colors shrink-0">
              {incident.id}
            </span>

            {/* Title */}
            <span className="text-xs text-zinc-200 font-medium truncate font-sans">
              {incident.title}
            </span>
          </div>

          {/* Right: Service, Severity Badge, Memory Matches, Created timestamp, Arrow */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Service */}
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/10 text-zinc-400 font-mono">
              {incident.service}
            </span>

            {/* Severity */}
            <SeverityBadge severity={incident.severity} size="sm" />

            {/* Status */}
            <StatusBadge status={incident.status} size="sm" />

            {/* Memory Matches Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-zinc-200 text-[11px] font-mono">
              <Brain className="w-3 h-3 text-white shrink-0" />
              <span>{incident.memory_matches} {incident.memory_matches === 1 ? 'match' : 'matches'}</span>
            </div>

            {/* Created time */}
            <span className="text-[11px] text-zinc-500 font-mono hidden md:inline-block">
              {incident.created_at}
            </span>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-0.5 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
