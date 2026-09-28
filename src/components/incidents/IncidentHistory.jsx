import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertOctagon, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

export default function IncidentHistory({ incidents = [], onSelectIncident }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = incidents.filter((inc) => {
    if (filter === 'Open' && inc.status === 'Resolved') return false;
    if (filter === 'Investigating' && inc.status !== 'Investigating') return false;
    if (filter === 'Resolved' && inc.status !== 'Resolved') return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inc.title?.toLowerCase().includes(q) ||
      inc.service?.toLowerCase().includes(q) ||
      inc.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full rounded-2xl bg-[#0d0d11] border border-white/[0.08] shadow-lg font-sans overflow-hidden">
      {/* Header and Filter Controls */}
      <div className="p-4 sm:p-5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Incident History &amp; Memory Log
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Operational incidents recorded and learned by OpsMemory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Segmented Filter Pills */}
          <div className="p-1 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-1 text-[11px] font-mono">
            {['All', 'Investigating', 'Resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-black font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-3 py-1 text-xs rounded-xl bg-white/[0.03] text-white placeholder-zinc-500 border border-white/10 focus:border-white/30 focus:outline-none w-36 sm:w-44"
            />
          </div>
        </div>
      </div>

      {/* Rows Table */}
      <div className="divide-y divide-white/[0.05] overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-zinc-500">
            No incidents match this filter.
          </div>
        ) : (
          filtered.map((inc) => {
            const isResolved = inc.status === 'Resolved';

            return (
              <div
                key={inc.id}
                onClick={() => {
                  if (onSelectIncident) {
                    onSelectIncident(inc.id);
                  } else {
                    navigate(`/incidents/${inc.id}`);
                  }
                }}
                className="p-3.5 sm:px-5 flex items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors cursor-pointer group select-none"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    {isResolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertOctagon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {inc.id}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                        {inc.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-zinc-400">
                      <span>{inc.service}</span>
                      <span>·</span>
                      <span className="text-zinc-500">{inc.created_at || 'Recently'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mono text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] hidden sm:inline ${
                      inc.severity === 'Critical'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {inc.severity}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                      isResolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {inc.status || 'Investigating'}
                  </span>

                  <span className="text-[11px] text-zinc-500 hidden md:inline">
                    {inc.status === 'Resolved' ? '14m MTTR' : 'In triage'}
                  </span>

                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
