import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function ErrorState({
  message,
  isMemoryError = false,
  onRetry,
}) {
  const navigate = useNavigate();

  if (isMemoryError) {
    return (
      <div className="p-5 rounded-2xl border border-amber-500/30 bg-[#17191C] text-amber-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
              Memory temporarily unavailable
            </h4>
            <p className="text-xs text-[#8E95A0] mt-1 leading-relaxed">
              Fresh analysis can continue, but historical context cannot be retrieved.
            </p>
            {onRetry && (
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={onRetry} icon={RefreshCw}>
                  Retry Memory Connection
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-rose-500/30 rounded-2xl bg-[#17191C]">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400 mb-4">
        <WifiOff className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#EDEDED]">
        Backend unavailable
      </h3>
      <p className="text-xs text-[#8E95A0] max-w-md mt-1 mb-6">
        {message || 'Unable to connect to the OpsMemory service.'}
      </p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button size="sm" variant="secondary" onClick={onRetry} icon={RefreshCw}>
            Retry
          </Button>
        )}
        <Button size="sm" variant="primary" onClick={() => navigate('/')} icon={Compass}>
          Return to Overview
        </Button>
      </div>
    </div>
  );
}
