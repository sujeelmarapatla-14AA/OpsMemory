import React from 'react';

export default function MemoryTimeline({ events = [] }) {
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'retained':
        return 'bg-[#84E071]/12 text-[#84E071] border-[#84E071]/30';
      case 'reinforced':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'recalled':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      default:
        return 'bg-[#111214] text-[#8E95A0] border-[#272A2F]';
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#272A2F]">
        <div>
          <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
            Memory Timeline
          </h3>
          <p className="text-xs text-[#8E95A0] mt-0.5">
            Operational experience continuous retention loop
          </p>
        </div>

        {/* Visual Pipeline indicator */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#84E071]">
          <span>RETAIN</span>
          <span className="text-[#5A606B]">→</span>
          <span>RECALL</span>
          <span className="text-[#5A606B]">→</span>
          <span>LEARN</span>
          <span className="text-[#5A606B]">→</span>
          <span>IMPROVE</span>
        </div>
      </div>

      {/* Events List */}
      <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#272A2F]">
        {events.map((event, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-[#111214] border border-[#84E071] flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-[#84E071]"></span>
            </div>

            {/* Event box */}
            <div className="p-3 rounded-xl bg-[#111214] border border-[#272A2F] hover:border-[#383C44] transition-colors space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#8E95A0]">
                    {event.time}
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#84E071]">
                    {event.incident_id}
                  </span>
                  <span className="text-xs text-[#EDEDED] font-medium font-sans">
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

              <p className="text-xs text-[#8E95A0] font-mono pl-0.5">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
