import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  CheckCircle2,
  Brain,
  Layers,
  Plus,
  ArrowRight
} from 'lucide-react';
import Button from '../components/ui/Button';
import StatCard from '../components/dashboard/StatCard';
import IncidentTable from '../components/dashboard/IncidentTable';
import PatternCard from '../components/dashboard/PatternCard';
import MemoryGrowthChart from '../components/memory/MemoryGrowthChart';
import MemoryConnectionFlow from '../components/incidents/MemoryConnectionFlow';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import { getIncidents, getMemoryStats, getMemoryPatterns } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incidentsData, statsData, patternsData] = await Promise.all([
        getIncidents(),
        getMemoryStats(),
        getMemoryPatterns(),
      ]);

      setIncidents(incidentsData);
      setStats(statsData);
      setPatterns(patternsData.patterns || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingState title="Loading incident intelligence..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={loadDashboardData} />;
  }

  const activeCount = incidents.filter((i) => i.status !== 'Resolved').length || 3;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length || 17;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDED] font-sans">
            Incident Intelligence
          </h1>
          <p className="text-xs text-[#8E95A0] mt-1">
            See what's happening, what we've seen before, and what OpsMemory has learned.
          </p>
        </div>

        <Button
          variant="primary"
          size="pill"
          icon={Plus}
          onClick={() => navigate('/incidents/new')}
          className="text-xs shrink-0"
        >
          New Incident
        </Button>
      </div>

      {/* Visual DevOps Response Workflow */}
      <MemoryConnectionFlow variant="horizontal" currentStep="new" />

      {/* Horizontal Compact Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Active Incidents"
          value={activeCount}
          description="Requires engineer triage"
          trend="1 critical"
          trendUp={false}
          icon={AlertOctagon}
          variant="critical"
        />

        <StatCard
          title="Resolved Today"
          value={resolvedCount}
          description="Mean MTTR: 14 mins"
          trend="+4 vs yesterday"
          trendUp={true}
          icon={CheckCircle2}
          variant="success"
        />

        <StatCard
          title="Memory Entries"
          value={stats?.total_memories || 84}
          description="Retained in Hindsight"
          trend="+17 this week"
          trendUp={true}
          icon={Brain}
          variant="green"
        />

        <StatCard
          title="Learned Patterns"
          value={stats?.learned_patterns || 12}
          description="Automated failure clusters"
          trend="86% match rate"
          trendUp={true}
          icon={Layers}
          variant="default"
        />
      </div>

      {/* ACTIVE / RECENT INCIDENTS (Modern List) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
              Active &amp; Recent Incidents
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400">
              {incidents.length} Logged
            </span>
          </div>

          <button
            onClick={() => navigate('/incidents')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <IncidentTable incidents={incidents} limit={4} />
      </div>

      {/* DASHBOARD MEMORY PANEL: Prominent 🧠 OPSMEMORY Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-white">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white font-sans">
                  🧠 OPSMEMORY
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-white border border-white/15">
                  Hindsight Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Your incident response memory
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/memory')}
            className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors font-sans"
          >
            <span>Explore Memory Bank</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Memory Grid: Chart + Learned Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chart */}
          <div className="lg:col-span-6">
            <MemoryGrowthChart data={stats?.growth} />
          </div>

          {/* Learned Patterns */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E95A0]">
                Learned Failure Patterns
              </span>
              <span className="text-[11px] text-[#5A606B] font-mono">
                Auto-reinforced
              </span>
            </div>

            <div className="space-y-2.5">
              {patterns.slice(0, 3).map((pat) => (
                <PatternCard
                  key={pat.id}
                  pattern={pat}
                  onClick={() => navigate('/memory')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
