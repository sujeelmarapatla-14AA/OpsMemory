import React from 'react';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';
import { Server, Clock, Globe } from 'lucide-react';

export default function IncidentHeader({ incident }) {
  if (!incident) return null;

  return (
    <div className="p-5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: ID & Title */}
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-2.5 py-0.5 rounded-full border border-white/15">
              {incident.id}
            </span>
            <SeverityBadge severity={incident.severity} size="sm" />
            <StatusBadge status={incident.status} size="sm" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
            {incident.title}
          </h1>
        </div>

        {/* Right: Service, Environment, Detected */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-1.5 text-zinc-400">
            <Server className="w-3 h-3 text-zinc-500" />
            <span>Service:</span>
            <span className="text-white font-semibold">{incident.service}</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-1.5 text-zinc-400">
            <Globe className="w-3 h-3 text-zinc-500" />
            <span>Env:</span>
            <span className="text-white font-semibold">{incident.environment}</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-1.5 text-zinc-400">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>{incident.created_at || 'Just now'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
