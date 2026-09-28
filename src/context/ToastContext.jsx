import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container floating bottom-right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-xl border border-white/10 bg-[#12151c]/95 backdrop-blur-md shadow-2xl text-xs font-sans transition-all duration-200 animate-fade-in"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              )}

              <div className="min-w-0">
                {toast.title && (
                  <h4 className="font-semibold text-[#f5f6f8] text-xs leading-snug">
                    {toast.title}
                  </h4>
                )}
                {toast.message && (
                  <p className="text-[#9ca3af] text-[11px] leading-relaxed mt-0.5 font-mono">
                    {toast.message}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6b7280] hover:text-[#f5f6f8] p-1 rounded-md transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      addToast: () => {},
      removeToast: () => {}
    };
  }
  return ctx;
}
