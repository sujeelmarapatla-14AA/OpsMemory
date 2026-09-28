import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import MemoryLoopDiagram from '../components/incidents/MemoryLoopDiagram';
import InvestigationResultView from '../components/incidents/InvestigationResultView';
import ResolutionForm from '../components/incidents/ResolutionForm';
import IncidentHistory from '../components/incidents/IncidentHistory';
import IncidentForm from '../components/incidents/IncidentForm';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import { getIncident, getIncidents } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Investigation({ defaultId = 'INC-084' }) {
  const { id: paramId } = useParams();
  const id = paramId || defaultId;
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const [data, setData] = useState(location.state?.investigation || null);
  const [allIncidents, setAllIncidents] = useState([]);
  const [loading, setLoading] = useState(!location.state?.investigation);
  const [error, setError] = useState(null);
  const [showInputForm, setShowInputForm] = useState(false);

  // Fetch incident data
  const fetchInvestigation = useCallback(async () => {
    if (location.state?.investigation && location.state?.investigation.incident?.id === id) {
      setData(location.state.investigation);
      setLoading(false);
      return;
    }

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
  }, [id, location.state]);

  // Fetch all incidents for history
  useEffect(() => {
    let mounted = true;
    const loadList = async () => {
      try {
        const list = await getIncidents();
        if (mounted) setAllIncidents(list || []);
      } catch (_e) {
        // fallback
      }
    };
    loadList();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    fetchInvestigation();
  }, [fetchInvestigation]);

  const handleIncidentResolved = (result) => {
    if (data?.incident) {
      setData((prev) => ({
        ...prev,
        incident: {
          ...prev.incident,
          status: 'Resolved',
          actual_root_cause: result?.stored_experience?.root_cause,
          resolution_applied: result?.stored_experience?.resolution
        },
        resolved_experience: result?.stored_experience
      }));

      // Update in history list
      setAllIncidents((prev) =>
        prev.map((inc) => (inc.id === id ? { ...inc, status: 'Resolved' } : inc))
      );
    }
  };

  const handleNewInvestigationComplete = (result) => {
    setData(result);
    setShowInputForm(false);
    if (result.incident?.id) {
      navigate(`/incidents/${result.incident.id}`, { state: { investigation: result } });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <LoadingState
          title="Querying Hindsight Memory Bank..."
          description={`Recalling historical incident resolutions for ${id} via semantic vector search...`}
          isMemory={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ErrorState message={error.message} onRetry={fetchInvestigation} />
      </div>
    );
  }

  const incident = data?.incident;
  const isResolved = incident?.status === 'Resolved';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 font-sans animate-fade-in">
      {/* 1. Memory Learning Visualization (Phase 8) */}
      <MemoryLoopDiagram
        currentStage={isResolved ? 'retain' : 'investigation'}
        isResolved={isResolved}
      />

      {/* 2. Top Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0d0d11] border border-white/[0.08] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Active Incident:</span>
          <span className="text-white font-bold">{incident?.id || id}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300">{incident?.service}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] ${
              isResolved
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isResolved ? 'Resolved' : 'Investigating'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInputForm((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white" />
            <span>{showInputForm ? 'Hide Form' : 'New Incident'}</span>
          </button>
        </div>
      </div>

      {/* 3. Collapsible Incident Input Form (Phase 4) */}
      {showInputForm && (
        <div className="animate-fade-in">
          <IncidentForm onInvestigationComplete={handleNewInvestigationComplete} />
        </div>
      )}

      {/* 4. Investigation Result View (Phase 6 AI Result + Phase 7 Hindsight Memories) */}
      <InvestigationResultView
        data={data}
        onScrollToResolution={() => {
          const el = document.getElementById('resolution-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. Resolution / Learning Experience (Phase 9) */}
      <div id="resolution-section" className="pt-2">
        <ResolutionForm
          incident={incident}
          incidentId={incident?.id || id}
          suggestedRootCause={data?.analysis?.likely_root_cause}
          suggestedResolution={data?.analysis?.recommended_resolution || data?.analysis?.prior_resolution}
          isAlreadyResolved={isResolved}
          onResolved={handleIncidentResolved}
        />
      </div>

      {/* 6. Incident History (Phase 10) */}
      <div className="pt-4">
        <IncidentHistory
          incidents={allIncidents}
          onSelectIncident={(selectedId) => {
            navigate(`/incidents/${selectedId}`);
          }}
        />
      </div>
    </div>
  );
}
