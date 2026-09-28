import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import HeroSection from '../landing/HeroSection';
import CommandHeader from './CommandHeader';
import KeyboardShortcutsModal from '../ui/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // On non-root paths (e.g. /memory, /telemetry, /incidents/...), console workspace is active.
  // On root '/', console workspace only opens if explicitly launched or ?console=true is in URL.
  const isDirectConsoleRoute = location.pathname !== '/';
  const hasConsoleParam = searchParams.get('console') === 'true';

  const [isConsoleOpen, setIsConsoleOpen] = useState(isDirectConsoleRoute || hasConsoleParam);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsConsoleOpen(true);
    } else if (searchParams.get('console') === 'true') {
      setIsConsoleOpen(true);
    }
  }, [location.pathname, searchParams]);

  const handleLaunchConsole = (autoDemo = false) => {
    setIsConsoleOpen(true);
    if (location.pathname === '/') {
      setSearchParams({ console: 'true' }, { replace: true });
    }
    if (autoDemo) {
      setTimeout(() => {
        const demoBtn = document.querySelector('button[title*="Demo Incident"], button[title*="demo"]');
        demoBtn?.click();
      }, 350);
    }
  };

  const handleBackToLanding = () => {
    setIsConsoleOpen(false);
    navigate('/');
    setSearchParams({}, { replace: true });
  };

  // Global Keyboard Shortcuts (Phase 11)
  useKeyboardShortcuts({
    onNewIncident: () => {
      if (!isConsoleOpen) handleLaunchConsole();
      const formEl = document.getElementById('incident-console-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
        const titleInput = document.getElementById('title');
        titleInput?.focus();
      } else {
        navigate('/incidents/new');
      }
    },
    onDemoIncident: () => {
      if (!isConsoleOpen) handleLaunchConsole(true);
      const demoBtn = document.querySelector('button[title*="Demo Incident"], button[title*="demo"]');
      demoBtn?.click();
    },
    onInvestigate: () => {
      const invBtn = document.querySelector('button[type="submit"]');
      if (invBtn) invBtn.click();
    },
    onResolve: () => {
      const resSection = document.getElementById('resolution-section');
      if (resSection) resSection.scrollIntoView({ behavior: 'smooth' });
    },
    onOpenHelp: () => setShortcutsOpen(true),
    onEscape: () => {
      setShortcutsOpen(false);
    }
  });

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#EDEDED] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {!isConsoleOpen ? (
        /* PURE LANDING EXPERIENCE: ONLY HERO SECTION AS REQUESTED */
        <HeroSection onLaunchConsole={handleLaunchConsole} />
      ) : (
        /* FULL SRE CONSOLE WORKSPACE (APPEARS WHEN LAUNCH IS CLICKED) */
        <div className="flex flex-col min-h-screen animate-fade-in">
          {/* Sticky Command Center Header */}
          <CommandHeader
            onOpenShortcuts={() => setShortcutsOpen(true)}
            onBackToLanding={handleBackToLanding}
          />

          {/* Main Product Workspace */}
          <main className="w-full flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8">
            <Outlet />
          </main>

          {/* Minimal Footer */}
          <footer className="w-full border-t border-white/[0.08] py-8 text-center text-xs font-mono text-[#5a606b]">
            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBackToLanding}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ← Back to Landing
                </button>
                <span>·</span>
                <span>OPSMEMORY · Hindsight Vector Intelligence + Groq AI Synthesis</span>
              </div>
              <span>Zero Repeat Outages While You Sleep</span>
            </div>
          </footer>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </div>
  );
}
