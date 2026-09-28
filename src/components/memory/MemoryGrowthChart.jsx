import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d0d11] border border-white/15 p-2.5 rounded-xl shadow-lg text-xs font-mono">
        <p className="text-zinc-400 font-semibold mb-1">{label}</p>
        <div className="flex items-center gap-2 text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>{payload[0].value} memory entries</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function MemoryGrowthChart({ data, isLive = false }) {
  const chartData = data || [
    { date: 'Day 1', count: 12 },
    { date: 'Day 2', count: 18 },
    { date: 'Day 3', count: 27 },
    { date: 'Day 4', count: 39 },
    { date: 'Day 5', count: 51 },
    { date: 'Day 6', count: 67 },
    { date: 'Day 7', count: 84 },
  ];

  return (
    <div className="bg-[#0d0d11] border border-white/[0.08] rounded-2xl p-5 flex flex-col">
      <div className="flex items-start justify-between pb-3 border-b border-white/[0.06] mb-3">
        <div>
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Memory Growth
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hindsight memory entries accumulated across production incidents
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white border border-white/15">
          {isLive ? 'Live Bank' : 'Hindsight Active'}
        </span>
      </div>

      <div className="h-56 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="memoryWhiteFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            />
            <YAxis
              stroke="#71717a"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              name="Hindsight memory entries"
              stroke="#FFFFFF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#memoryWhiteFill)"
              activeDot={{ r: 4, fill: '#FFFFFF', stroke: '#0d0d11', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-500" />
          <span>Hindsight memory entries</span>
        </div>
        <span className="text-white font-semibold">Total: 84 entries</span>
      </div>
    </div>
  );
}
