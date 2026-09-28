import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  RefreshCw,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import IncidentTable from '../components/dashboard/IncidentTable';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import { getIncidents } from '../services/api';

const SEVERITY_FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const STATUS_FILTERS = ['All', 'Open', 'Investigating', 'Resolved'];

export default function Incidents() {
  const navigate = useNavigate();

  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        incident.id?.toLowerCase().includes(q) ||
        incident.title?.toLowerCase().includes(q) ||
        incident.service?.toLowerCase().includes(q) ||
        incident.symptoms?.toLowerCase().includes(q);

      const matchesSeverity =
        severityFilter === 'All' ||
        incident.severity?.toLowerCase() === severityFilter.toLowerCase();

      const matchesStatus =
        statusFilter === 'All' ||
        incident.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [incidents, searchQuery, severityFilter, statusFilter]);

  if (loading) {
    return <LoadingState title="Loading incidents..." />;
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={loadIncidents} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Incidents
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Every production failure becomes operational knowledge.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={loadIncidents}
            className="text-xs font-mono"
          >
            Sync
          </Button>

          <Button
            variant="primary"
            size="pill"
            icon={Plus}
            onClick={() => navigate('/incidents/new')}
            className="text-xs"
          >
            New Incident
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar: #0d0d11, rounded-2xl */}
      <div className="p-4 rounded-2xl bg-[#0d0d11] border border-white/[0.08] space-y-3.5">
        {/* Search input with dark styling */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by incident ID, title, service, or symptoms..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9.5 pr-9 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 font-sans transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Severity:
            </span>
            <div className="flex flex-wrap gap-1">
              {SEVERITY_FILTERS.map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'bg-white/[0.03] text-zinc-400 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Status:
            </span>
            <div className="flex flex-wrap gap-1">
              {STATUS_FILTERS.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-black font-semibold shadow-xs'
                      : 'bg-white/[0.03] text-zinc-400 border border-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Incident List Rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredIncidents.length}</strong> of {incidents.length} incidents
          </span>
          {(searchQuery || severityFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('All');
                setStatusFilter('All');
              }}
              className="text-white hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredIncidents.length === 0 ? (
          <EmptyState
            title="No matching incidents"
            description="Try adjusting your search criteria or filter pills."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSeverityFilter('All');
              setStatusFilter('All');
            }}
          />
        ) : (
          <IncidentTable incidents={filteredIncidents} />
        )}
      </div>
    </div>
  );
}
