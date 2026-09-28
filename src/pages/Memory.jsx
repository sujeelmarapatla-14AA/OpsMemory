import React, { useState, useEffect } from 'react';
import {
  Brain,
  Layers,
  CheckCircle2,
  Database,
  RefreshCw
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import MemoryGrowthChart from '../components/memory/MemoryGrowthChart';
import LearnedPatternCard from '../components/memory/LearnedPatternCard';
import MemoryTimeline from '../components/memory/MemoryTimeline';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';
import { getMemoryStats, getMemoryPatterns } from '../services/api';

export default function Memory() {
  const [stats, setStats] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

  const loadMemoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, patternsData] = await Promise.all([
        getMemoryStats(),
        getMemoryPatterns()
      ]);

      setStats(statsData);
      setPatterns(patternsData.patterns || []);
      setTimeline(patternsData.timeline || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemoryData();
  }, []);

  if (loading) {
    return (
      <LoadingState
        title="Consulting Hindsight memory bank..."
        description="Aggregating learned patterns, vector embeddings, and historical resolutions..."
        isMemory={true}
      />
    );
  }

  if (error) {
    return <ErrorState message={error.message} isMemoryError={error.isMemoryError} onRetry={loadMemoryData} />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-white">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              🧠 Hindsight Memory
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Everything OpsMemory has learned from previous incidents.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span className="text-zinc-200">Bank: ops-incidents</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadMemoryData}
            className="text-xs font-mono"
          >
            Refresh Bank
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Memories"
          value={stats?.total_memories || 84}
          description="Vectorized incident experiences"
          trend="+5 today"
          trendUp={true}
          icon={Database}
          variant="green"
        />

        <StatCard
          title="Incidents Learned"
          value={stats?.incidents_learned || 67}
          description="Indexed post-mortems"
          trend="92% retention rate"
          trendUp={true}
          icon={Brain}
          variant="default"
        />

        <StatCard
          title="Successful Resolutions"
          value={stats?.successful_resolutions || 52}
          description="Verified operational fixes"
          trend="89% first-try success"
          trendUp={true}
          icon={CheckCircle2}
          variant="success"
        />

        <StatCard
          title="Learned Patterns"
          value={stats?.learned_patterns || 12}
          description="Automated failure clusters"
          trend="Across 6 services"
          trendUp={true}
          icon={Layers}
          variant="amber"
        />
      </div>

      {/* Memory Growth Chart */}
      <MemoryGrowthChart data={stats?.growth} isLive={!isMock} />

      {/* Two Column Section: Learned Failure Signatures & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Learned Patterns (7 cols) */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#EDEDED] font-mono">
              Learned Failure Signatures
            </h2>
            <span className="text-xs font-mono text-[#8E95A0]">
              {patterns.length} Active Patterns
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {patterns.map((pat) => (
              <LearnedPatternCard key={pat.id} pattern={pat} />
            ))}
          </div>
        </div>

        {/* Right Column: Memory Timeline (5 cols) */}
        <div className="lg:col-span-5">
          <MemoryTimeline events={timeline} />
        </div>
      </div>
    </div>
  );
}
