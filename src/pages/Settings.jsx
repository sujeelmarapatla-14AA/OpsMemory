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

export default function Settings() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const isMock = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

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
      <div className="p-5 sm:p-6 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-4">
        <div className="pb-3 border-b border-[#272A2F]">
          <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
            Runtime Environment
          </h3>
          <p className="text-xs text-[#8E95A0] mt-0.5">
            Connection endpoints for OpsMemory orchestrator and Hindsight memory bank
          </p>
        </div>

        <div className="divide-y divide-[#272A2F]/80 text-xs font-mono">
          {/* Backend Status */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111214] border border-[#272A2F] flex items-center justify-center text-[#8E95A0]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#EDEDED] font-medium font-sans">OpsMemory Backend</span>
                <p className="text-[11px] text-[#5A606B]">{apiBaseUrl}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E071]"></span>
              <span className="text-[#84E071] font-semibold">{isMock ? 'Mock Fallback Ready' : 'Connected'}</span>
            </div>
          </div>

          {/* Hindsight Status */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#84E071]/12 border border-[#84E071]/30 flex items-center justify-center text-[#84E071]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#EDEDED] font-medium font-sans">Hindsight Memory Technology</span>
                <p className="text-[11px] text-[#5A606B]">Persistent Vector &amp; Post-Mortem Index</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84E071] animate-pulse"></span>
              <span className="text-[#84E071] font-semibold">Connected</span>
            </div>
          </div>

          {/* AI Provider */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111214] border border-[#272A2F] flex items-center justify-center text-[#8E95A0]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#EDEDED] font-medium font-sans">AI Inference Provider</span>
                <p className="text-[11px] text-[#5A606B]">Fast low-latency token streaming</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#111214] border border-[#272A2F] text-[#EDEDED] font-semibold">
              Groq (Llama-3-70b-versatile)
            </span>
          </div>

          {/* Memory Bank */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111214] border border-[#272A2F] flex items-center justify-center text-[#8E95A0]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#EDEDED] font-medium font-sans">Active Memory Bank</span>
                <p className="text-[11px] text-[#5A606B]">Cross-service production incident namespace</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#84E071]/12 border border-[#84E071]/30 text-[#84E071] font-semibold">
              ops-incidents
            </span>
          </div>

          {/* Environment */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111214] border border-[#272A2F] flex items-center justify-center text-[#8E95A0]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[#EDEDED] font-medium font-sans">Environment Mode</span>
                <p className="text-[11px] text-[#5A606B]">Configured via VITE_USE_MOCK_DATA</p>
              </div>
            </div>
            <Badge variant={isMock ? 'investigating' : 'green'} size="md">
              {isMock ? 'Demo Mode' : 'Production Live API'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Security & Isolation Note */}
      <div className="p-4 rounded-2xl bg-[#17191C] border border-[#272A2F] text-xs text-[#8E95A0] space-y-2">
        <div className="flex items-center gap-2 text-[#EDEDED] font-mono font-semibold">
          <Info className="w-4 h-4 text-[#84E071]" />
          <span>Security &amp; API Key Isolation</span>
        </div>
        <p className="leading-relaxed">
          Zero API keys (including <code className="text-[#EDEDED] bg-[#111214] px-1 py-0.5 rounded">GROQ_API_KEY</code> and <code className="text-[#EDEDED] bg-[#111214] px-1 py-0.5 rounded">HINDSIGHT_API_KEY</code>)
          are bundled into the frontend source code. All inference and vector operations are proxied exclusively
          through the FastAPI backend.
        </p>
      </div>

      {/* Architecture Flow */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#17191C] border border-[#272A2F] space-y-3">
        <div className="pb-3 border-b border-[#272A2F]">
          <h3 className="text-xs font-semibold text-[#EDEDED] uppercase tracking-wider font-mono">
            OpsMemory Pipeline
          </h3>
          <p className="text-xs text-[#8E95A0] mt-0.5">
            Closed-loop operational learning architecture
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0E1013] border border-[#272A2F] font-mono text-xs text-[#84E071] overflow-x-auto whitespace-pre leading-relaxed">
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
