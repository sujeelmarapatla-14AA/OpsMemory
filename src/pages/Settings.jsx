import React from 'react';
import {
  Server,
  Database,
  Cpu,
  Shield,
  Layers,
  Info
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { API_URL } from '../services/api';

export default function Settings() {
  const displayApiUrl = API_URL || 'Configured via VITE_API_URL in production';
  const isMock = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Page Header */}
      <div className="pb-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#EDEDED] font-sans">
          System Configuration
        </h1>
        <p className="text-xs text-[#8E95A0] mt-1">
          Cluster connectivity, Hindsight memory bank metadata, and environment runtime.
        </p>
      </div>

      {/* Primary Configuration Panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            Runtime Environment
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Connection endpoints for OpsMemory orchestrator and Hindsight memory bank
          </p>
        </div>

        <div className="divide-y divide-white/[0.05] text-xs font-mono">
          {/* Backend Status */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-medium font-sans">OpsMemory Backend</span>
                <p className="text-[11px] text-zinc-500">{displayApiUrl}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-emerald-400 font-semibold">{isMock ? 'Mock Fallback Ready' : 'Connected'}</span>
            </div>
          </div>

          {/* Hindsight Status */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-white">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-medium font-sans">Hindsight Memory Technology</span>
                <p className="text-[11px] text-zinc-500">Persistent Vector &amp; Post-Mortem Index</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-semibold">Connected</span>
            </div>
          </div>

          {/* AI Provider */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-medium font-sans">AI Inference Provider</span>
                <p className="text-[11px] text-zinc-500">Fast low-latency token streaming</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white font-semibold">
              Groq (Llama-3-70b-versatile)
            </span>
          </div>

          {/* Memory Bank */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-medium font-sans">Active Memory Bank</span>
                <p className="text-[11px] text-zinc-500">Cross-service production incident namespace</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-white font-semibold">
              ops-incidents
            </span>
          </div>

          {/* Environment */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-medium font-sans">Environment Mode</span>
                <p className="text-[11px] text-zinc-500">Configured via VITE_USE_MOCK_DATA</p>
              </div>
            </div>
            <Badge variant={isMock ? 'investigating' : 'resolved'} size="md">
              {isMock ? 'Demo Mode' : 'Production Live API'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Security & Isolation Note */}
      <div className="p-4 rounded-2xl bg-[#0d0d11] border border-white/[0.08] text-xs text-zinc-400 space-y-2">
        <div className="flex items-center gap-2 text-white font-mono font-semibold">
          <Info className="w-4 h-4 text-white" />
          <span>Security &amp; API Key Isolation</span>
        </div>
        <p className="leading-relaxed">
          Zero API keys (including <code className="text-white bg-white/[0.06] px-1 py-0.5 rounded">GROQ_API_KEY</code> and <code className="text-white bg-white/[0.06] px-1 py-0.5 rounded">HINDSIGHT_API_KEY</code>)
          are bundled into the frontend source code. All inference and vector operations are proxied exclusively
          through the FastAPI backend.
        </p>
      </div>

      {/* Architecture Flow */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d0d11] border border-white/[0.08] space-y-3">
        <div className="pb-3 border-b border-white/[0.06]">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
            OpsMemory Pipeline
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Closed-loop operational learning architecture
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#08080a] border border-white/[0.08] font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
{`New Incident Detected
       ↓
AI Telemetry Analysis
       ↓
🧠 Hindsight Vector Recall (Embedding Match against past incidents)
       ↓
Historical Incident Corroboration (INC-073, INC-061, etc.)
       ↓
Root Cause + Previous Resolutions Extracted
       ↓
Recommended Response Formulated (01, 02, 03, 04, 05)
       ↓
Engineer Applies Fix & Confirms Resolution Outcome
       ↓
🧠 Hindsight Retain (Vector & Metadata stored in ops-incidents bank)
       ↓
Future incidents become more informed & MTTR decreases`}
        </div>
      </div>
    </div>
  );
}
