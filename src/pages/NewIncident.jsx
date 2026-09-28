import React from 'react';
import IncidentForm from '../components/incidents/IncidentForm';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NewIncident() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Page Header */}
      <div>
        <button
          onClick={() => navigate('/incidents')}
          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 mb-3 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Incidents</span>
        </button>

        <div className="pb-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
            Report an Incident
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Give OpsMemory the symptoms. It will search what your team has already learned.
          </p>
        </div>
      </div>

      {/* Form Component */}
      <IncidentForm />
    </div>
  );
}
