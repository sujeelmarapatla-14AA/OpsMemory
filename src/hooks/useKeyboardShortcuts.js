import { useEffect } from 'react';

/**
 * Global Keyboard Shortcut Listener
 * Safely guards against intercepting input/textarea typing.
 */
export function useKeyboardShortcuts({
  onNewIncident,
  onDemoIncident,
  onInvestigate,
  onResolve,
  onOpenHelp,
  onEscape
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Never intercept inside text inputs or textareas
      const target = e.target;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      if (isInput && e.key !== 'Escape') {
        return;
      }

      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'n' && onNewIncident) {
        e.preventDefault();
        onNewIncident();
      } else if (key === 'd' && onDemoIncident) {
        e.preventDefault();
        onDemoIncident();
      } else if (key === 'i' && onInvestigate) {
        e.preventDefault();
        onInvestigate();
      } else if (key === 'r' && onResolve) {
        e.preventDefault();
        onResolve();
      } else if (e.key === '?' && onOpenHelp) {
        e.preventDefault();
        onOpenHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewIncident, onDemoIncident, onInvestigate, onResolve, onOpenHelp, onEscape]);
}
