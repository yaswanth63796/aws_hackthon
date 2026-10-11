import React, { useState } from 'react';
import { Info, Sparkles, X, Sliders } from 'lucide-react';
import { Badge } from './common/Badge';

export function DemoBanner({ onOpenDemoControls }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white px-4 py-2.5 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-sky-700/50">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide text-sky-100">
              Environmental Hacks 2026 Prototype
            </span>
            <Badge variant="simulated" size="sm">SIMULATED DATA</Badge>
          </div>
          <p className="text-sky-200/90 text-[11px] mt-0.5">
            Operating on realistic synthetic telemetry. No physical sensors connected. Use <strong>Demo Controls</strong> to simulate leak spikes and tank depletion in real time.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
        <button
          type="button"
          onClick={onOpenDemoControls}
          className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Test Scenarios</span>
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1 text-sky-300 hover:text-white rounded-md hover:bg-white/10"
          title="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
