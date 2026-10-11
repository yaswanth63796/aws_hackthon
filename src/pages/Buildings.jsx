import React from 'react';
import { 
  Building2, 
  Users, 
  Droplet, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Sparkles,
  Gauge
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export function Buildings({
  buildings = [],
  selectedBuildingId,
  onSelectBuilding,
  alerts = [],
  onNavigate,
  onOpenDemoControls
}) {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0A192F] tracking-tight">Campus Facility Directory</h2>
            <Badge variant="simulated" size="sm">Simulated Buildings</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare water consumption metrics, tank capacities, and operational statuses across campus residential and academic buildings.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDemoControls}
          className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <span>Simulate Building Spike</span>
        </button>
      </div>

      {/* Buildings Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {buildings.map((b) => {
          const isSelected = b.id === selectedBuildingId;
          const activeBuildingAlerts = alerts.filter(a => a.buildingId === b.id && a.status === 'active');
          const currentLitres = Math.round((b.currentTankLevelPct / 100) * b.tankCapacityLitres);
          const perCapita = Math.round(b.todayConsumptionLitres / (b.occupancy || 1));

          return (
            <div
              key={b.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg ${
                isSelected 
                  ? 'border-sky-500 ring-2 ring-sky-500/20' 
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-[#0A192F]">{b.name}</h3>
                        {isSelected && (
                          <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                            Active Focus
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{b.subtitle}</p>
                    </div>

                    <Badge 
                      variant={b.status === 'Critical' ? 'critical' : b.status === 'Warning' ? 'warning' : 'normal'}
                      size="sm"
                      dot
                    >
                      {b.status}
                    </Badge>
                  </div>

                  {/* Building Type & Occupancy */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {b.occupancy} Occupants
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      {b.floors} Floors
                    </span>
                    <span>•</span>
                    <span className="text-sky-700 font-semibold">
                      {b.type}
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="p-5 space-y-3.5">
                  
                  {/* Tank Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-sky-600" />
                        Tank Storage ({b.currentTankLevelPct}%)
                      </span>
                      <span className="font-bold text-slate-800">
                        {currentLitres.toLocaleString()} / {b.tankCapacityLitres.toLocaleString()} L
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          b.currentTankLevelPct <= 15
                            ? 'bg-rose-500'
                            : b.currentTankLevelPct <= 25
                            ? 'bg-amber-500'
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${b.currentTankLevelPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Consumption Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-medium text-slate-500 block">Today's Usage</span>
                      <span className="text-base font-extrabold text-[#0A192F] mt-0.5 block">
                        {b.todayConsumptionLitres.toLocaleString()} L
                      </span>
                      <span className="text-[10px] text-slate-400">~{perCapita} L/person</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[11px] font-medium text-slate-500 block">30d Daily Avg</span>
                      <span className="text-base font-extrabold text-[#0A192F] mt-0.5 block">
                        {b.avgDailyConsumptionLitres.toLocaleString()} L
                      </span>
                      <span className="text-[10px] text-slate-400">Baseline Target</span>
                    </div>
                  </div>

                  {/* Active Anomaly Alerts in this Building */}
                  <div className="pt-2">
                    {activeBuildingAlerts.length > 0 ? (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-800">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>{activeBuildingAlerts.length} Active Anomaly Alert(s)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBuilding(b.id);
                            onNavigate('alerts');
                          }}
                          className="text-[11px] underline font-bold"
                        >
                          Inspect
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-1.5 text-xs text-emerald-800">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>All readings within normal parameters</span>
                      </div>
                    )}
                  </div>

                  {/* Sub-Zones */}
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-slate-600 block mb-2">Monitored Sub-Zones</span>
                    <div className="space-y-1.5">
                      {b.subZones?.map(z => (
                        <div key={z.name} className="flex items-center justify-between text-xs text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100">
                          <span>{z.name}</span>
                          <span className="font-semibold text-sky-800">{z.sharePct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectBuilding(b.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? 'Currently Viewing' : 'Select Building'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectBuilding(b.id);
                    onNavigate('overview');
                  }}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
