import React from 'react';
import { Droplet, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Badge } from './common/Badge';

export function TankVisualizer({
  tankLevelPct = 75,
  capacityLitres = 50000,
  buildingName = 'Hostel A',
  warningThreshold = 25,
  criticalThreshold = 15,
  lastUpdated = 'Just now (Simulated)'
}) {
  const currentLitres = Math.round((tankLevelPct / 100) * capacityLitres);

  // Status computation
  let status = 'normal';
  let statusLabel = 'Normal Water Reserve';
  let fillColor = 'from-sky-500 via-sky-400 to-cyan-400';
  let waterBg = 'bg-sky-500/20';

  if (tankLevelPct <= criticalThreshold) {
    status = 'critical';
    statusLabel = 'Critical Low Water';
    fillColor = 'from-rose-600 via-rose-500 to-red-400';
    waterBg = 'bg-rose-500/20';
  } else if (tankLevelPct <= warningThreshold) {
    status = 'warning';
    statusLabel = 'Warning: Low Reserve';
    fillColor = 'from-amber-500 via-amber-400 to-yellow-400';
    waterBg = 'bg-amber-500/20';
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#0A192F] text-base">Overhead Storage Reservoir</h3>
            <Badge variant="simulated" size="sm">Simulated Level</Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{buildingName} Primary Feeder Tank</p>
        </div>
        <Badge variant={status} dot size="md">
          {statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Tank Cylinder Graphic */}
        <div className="md:col-span-5 flex justify-center py-2">
          <div className="relative w-40 h-56 rounded-3xl border-4 border-slate-300 bg-slate-50/80 shadow-inner overflow-hidden flex flex-col justify-end">
            {/* Top tank rim effect */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-slate-200/90 border-b border-slate-300 rounded-t-2xl z-20" />
            
            {/* Guide line for Warning (25%) */}
            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-amber-400/80 z-20 flex justify-end pr-1 pointer-events-none"
              style={{ bottom: `${warningThreshold}%` }}
            >
              <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 rounded -translate-y-2">
                Warn ({warningThreshold}%)
              </span>
            </div>

            {/* Guide line for Critical (15%) */}
            <div 
              className="absolute left-0 right-0 border-b-2 border-dashed border-rose-500/80 z-20 flex justify-end pr-1 pointer-events-none"
              style={{ bottom: `${criticalThreshold}%` }}
            >
              <span className="text-[9px] font-semibold text-rose-700 bg-rose-50 px-1 rounded -translate-y-2">
                Crit ({criticalThreshold}%)
              </span>
            </div>

            {/* Liquid Fill */}
            <div 
              className={`w-full bg-gradient-to-t ${fillColor} transition-all duration-700 ease-out relative`}
              style={{ height: `${Math.min(100, Math.max(0, tankLevelPct))}%` }}
            >
              {/* Wave surface shimmer */}
              <div className="absolute -top-2 left-0 right-0 h-4 bg-white/40 rounded-full blur-[1px] animate-pulse" />
              
              {/* Level percentage inside tank */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white drop-shadow">
                <span className="text-2xl font-black">{tankLevelPct}%</span>
                <span className="text-[10px] font-medium opacity-90">Capacity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tank Details & Metrics */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Current Volume</span>
            <div className="text-right">
              <span className="text-lg font-bold text-[#0A192F]">{currentLitres.toLocaleString()} L</span>
              <span className="text-xs text-slate-400 block">of {capacityLitres.toLocaleString()} L capacity</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Available Headroom</span>
            <span className="text-sm font-semibold text-slate-700">
              {(capacityLitres - currentLitres).toLocaleString()} L ({(100 - tankLevelPct)}%)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Safety Thresholds</span>
            <div className="text-xs text-slate-600 font-medium">
              <span className="text-amber-600 font-semibold">{warningThreshold}%</span> advisory / <span className="text-rose-600 font-semibold">{criticalThreshold}%</span> critical
            </div>
          </div>

          {/* Quick status message */}
          {tankLevelPct <= criticalThreshold ? (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-rose-800 text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Urgent Action Required:</strong> Reserve is dangerously depleted. Recommend immediate feeder borehole pump activation to prevent campus supply cut.
              </div>
            </div>
          ) : tankLevelPct <= warningThreshold ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Reserve Low:</strong> Water reserve is below the {warningThreshold}% advisory margin. Refill pump scheduled prior to peak evening cycle.
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-emerald-800 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Optimal Reserve:</strong> Tank volume satisfies current hydraulic pressure and domestic requirements for this facility block.
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-400 text-right">
            Telemetry: {lastUpdated}
          </div>
        </div>
      </div>
    </div>
  );
}
