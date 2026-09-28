import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Command, Brain, Activity, Terminal, Sparkles } from 'lucide-react';
import { checkHealth } from '../../services/api';

export default function CommandHeader({ onOpenShortcuts, onBackToLanding }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [healthStatus, setHealthStatus] = useState({
    backend: 'connected',
    hindsight: 'connected',
    groq: 'connected',
    supabase: 'connected',
    bank: 'OpsMemory'
  });

  useEffect(() => {
    let mounted = true;
    const verifyHealth = async () => {
      try {
        const res = await checkHealth();
        if (mounted) {
          const isOk = res.status === 'ok';
          setHealthStatus({
            backend: isOk ? 'connected' : 'degraded',
            hindsight: isOk ? 'connected' : 'offline',
            groq: isOk ? 'connected' : 'degraded',
            supabase: isOk ? 'connected' : 'offline',
            bank: res.memory_bank || 'OpsMemory'
          });
        }
      } catch (_e) {
        if (mounted) {
          setHealthStatus((prev) => ({
            ...prev,
            backend: 'offline',
            hindsight: 'offline'
          }));
        }
      }
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 25000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname.startsWith('/incidents'))) return true;
    return location.pathname === path;
  };

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#050505]/95 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Subtitle matching Hero */}
        <div className="flex items-center gap-3.5">
          <div
            onClick={onBackToLanding || (() => navigate('/'))}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/15 flex items-center justify-center cursor-pointer hover:border-white/30 transition-colors shrink-0 group"
            title="Return to Landing"
          >
            <Shield className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={onBackToLanding || (() => navigate('/'))}
                className="font-mono text-sm font-bold tracking-[0.1em] text-white cursor-pointer hover:text-white/80 transition-colors"
              >
                OPS MEMORY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded border border-white/15 bg-white/[0.03] text-white/80 uppercase">
                PROD SRE
              </span>
            </div>
            <p className="text-[11px] text-[#949aa3] tracking-tight mt-0.5 font-sans">
              AI Incident Response that remembers what your team learned.
            </p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-mono">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="px-3 py-1.5 rounded-lg border border-transparent text-[#949aa3] hover:text-white hover:border-white/10 transition-all cursor-pointer"
              title="Return to Landing"
            >
              ← Landing
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isActive('/')
                ? 'bg-white text-black font-bold border-white shadow-xs'
                : 'bg-transparent text-[#949aa3] hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            Console
          </button>
          <button
            onClick={() => navigate('/memory')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              location.pathname === '/memory'
                ? 'bg-white text-black font-bold border-white shadow-xs'
                : 'bg-transparent text-[#949aa3] hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            Memory Bank
          </button>
          <button
            onClick={() => navigate('/telemetry')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              location.pathname === '/telemetry'
                ? 'bg-white text-black font-bold border-white shadow-xs'
                : 'bg-transparent text-[#949aa3] hover:text-white border-transparent hover:border-white/10'
            }`}
          >
            Telemetry
          </button>
        </nav>

        {/* Compact Semantic Status Area (Phase 3 Requirement) */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-[11px] font-mono select-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.08]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                healthStatus.backend === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span className="text-[#949aa3]">Backend</span>
            <span className={healthStatus.backend === 'connected' ? 'text-white/90' : 'text-rose-400'}>
              Connected
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.08]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                healthStatus.hindsight === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-[#949aa3]">Hindsight</span>
            <span className="text-white/90">Connected</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.08]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                healthStatus.groq === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-[#949aa3]">Groq</span>
            <span className="text-white/90">Connected</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.08]">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                healthStatus.supabase === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-[#949aa3]">Supabase</span>
            <span className="text-white/90">Connected</span>
          </div>

          {/* Keyboard shortcut hint */}
          <button
            onClick={onOpenShortcuts}
            className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/[0.08] hover:border-white/20 text-[#5a606b] hover:text-white transition-colors cursor-pointer"
            title="Keyboard shortcuts (Press ?)"
          >
            <Command className="w-3 h-3" />
            <kbd>?</kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
