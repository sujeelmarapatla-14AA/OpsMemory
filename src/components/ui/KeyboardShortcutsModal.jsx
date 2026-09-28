import React from 'react';
import { X, Command } from 'lucide-react';

const SHORTCUTS = [
  { key: 'N', action: 'New / Report Incident', desc: 'Focus incident input form' },
  { key: 'D', action: 'Cycle Demo Incident', desc: 'Load next incident from shuffle-bag (1 to 5)' },
  { key: 'I', action: 'Investigate Incident', desc: 'Query Hindsight memory and invoke Groq' },
  { key: 'R', action: 'Resolve & Remember', desc: 'Jump to resolution and memory retention' },
  { key: '?', action: 'Shortcuts Help', desc: 'Show this keyboard navigation modal' },
  { key: 'ESC', action: 'Close Modal', desc: 'Dismiss active overlays and dialogs' }
];

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0e1117] border border-[#262c3b] shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c2230]">
          <div className="flex items-center gap-2">
            <Command className="w-4 h-4 text-blue-400" />
            <h3 className="font-mono text-sm font-bold text-[#f5f6f8] tracking-tight">
              Keyboard Navigation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#f5f6f8] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#141822] border border-[#1e2433]"
            >
              <div>
                <span className="text-[#f5f6f8] font-semibold">{s.action}</span>
                <p className="text-[10px] text-[#8e95a0] font-sans mt-0.5">{s.desc}</p>
              </div>
              <kbd className="text-xs px-2 py-1">{s.key}</kbd>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#6b7280] text-center pt-1 font-sans">
          Shortcuts are disabled while typing inside form inputs.
        </p>
      </div>
    </div>
  );
}
