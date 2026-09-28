import React from 'react';

export default function MemoryTimeline({ events = [] }) {
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'retained':
        return 'bg-white/[0.06] text-white border-white/20';
      case 'reinforced':
        return 'bg-white/[0.04] text-zinc-300 border-white/10';
      case 'recalled':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-white/[0.02] text-zinc-400 border-white/[0.06]';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#0d0d11] border border-white/[0.08] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Memory Timeline
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Operational experience continuous retention loop
          </p>
        </div>

        {/* Visual Pipeline indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
          <span>RETAIN</span>
          <span className="text-zinc-600">→</span>
          <span>RECALL</span>
          <span className="text-zinc-600">→</span>
          <span>LEARN</span>
          <span className="text-zinc-600">→</span>
          <span>IMPROVE</span>
        </div>
      </div>

      {/* Events List */}
      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/[0.08]">
        {events.map((event, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-[#0d0d11] border border-white/40 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-white"></span>
            </div>

            {/* Event box */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-colors space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-zinc-500">
                    {event.time}
                  </span>
                  <span className="text-xs font-mono font-semibold text-white">
                    {event.incident_id}
                  </span>
                  <span className="text-xs text-zinc-200 font-medium font-sans">
                    {event.action}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase tracking-wider ${getBadgeStyle(
                    event.type
                  )}`}
                >
                  {event.type === 'retained' ? '🧠 Memory Retained' : event.status_label}
                </span>
              </div>

              <p className="text-xs text-zinc-400 font-mono pl-0.5">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
