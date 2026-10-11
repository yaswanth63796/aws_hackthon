import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  TrendingUp, 
  Droplet, 
  RotateCcw, 
  Settings2, 
  Sliders, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { Badge } from './common/Badge';

export function SimulationControlsModal({
  isOpen,
  onClose,
  buildings = [],
  selectedBuildingId,
  onSelectBuilding,
  onSimulateSpike,
  onSimulateLowTank,
  onSimulateNormal,
  onResetDemo,
  config,
  onUpdateConfig
}) {
  const [activeTab, setActiveTab] = useState('scenarios'); // 'scenarios' | 'thresholds'
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  if (!isOpen) return null;

  const currentBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  const triggerFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleSpike = () => {
    onSimulateSpike(selectedBuildingId);
    triggerFeedback(`Injected +75% consumption surge on ${currentBuilding.name}. Rule evaluated: Possible leak alert created!`);
  };

  const handleLowTank = () => {
    onSimulateLowTank(selectedBuildingId);
    triggerFeedback(`Drained simulated reservoir to 12% on ${currentBuilding.name}. Rule evaluated: Low-water critical alert generated!`);
  };

  const handleNormal = () => {
    onSimulateNormal(selectedBuildingId);
    triggerFeedback(`Restored normal baseline usage for ${currentBuilding.name}. Active alerts auto-resolved.`);
  };

  const handleReset = () => {
    onResetDemo();
    triggerFeedback('Full demo reset: all buildings restored to baseline conditions and standard alerts.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-[#0A192F] to-[#122A4D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Live Demo Simulation Controls</h3>
                <Badge variant="simulated" size="sm">Prototype Tool</Badge>
              </div>
              <p className="text-xs text-slate-300">
                Trigger anomalies or calibrate detection algorithms in real time
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Building Selector Bar */}
        <div className="px-5 py-3 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Target Building:</span>
          <select
            value={selectedBuildingId}
            onChange={(e) => onSelectBuilding(e.target.value)}
            className="font-bold text-sky-900 bg-white border border-sky-200 rounded-lg px-3 py-1.5 shadow-sm focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            {buildings.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.type})
              </option>
            ))}
          </select>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('scenarios')}
            className={`py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'scenarios'
                ? 'border-sky-600 text-sky-700 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Anomalous Scenarios
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('thresholds')}
            className={`py-2.5 px-4 border-b-2 transition-colors ${
              activeTab === 'thresholds'
                ? 'border-sky-600 text-sky-700 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Detection Thresholds
          </button>
        </div>

        {/* Feedback message banner if triggered */}
        {feedbackMessage && (
          <div className="mx-5 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'scenarios' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Execute controlled simulated scenarios to test rule-based telemetry detection and observe UI state transitions immediately:
              </p>

              {/* 1. Simulate Consumption Spike (Possible Leak) */}
              <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/70 transition-all flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                    <span className="text-sm font-bold text-rose-950">Simulate Consumption Spike</span>
                    <Badge variant="critical" size="sm">Triggers Leak Rule</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Surges current hour flow to <strong>+75% above baseline</strong>. Transparently evaluates leak threshold and generates an actionable alert.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSpike}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-sm transition-all active:scale-95"
                >
                  Trigger Spike
                </button>
              </div>

              {/* 2. Simulate Low Tank Level */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50/70 transition-all flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-950">Simulate Low Tank Level</span>
                    <Badge variant="warning" size="sm">Triggers Low-Water</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Depletes overhead reservoir to <strong>12% capacity</strong>, breaching critical and warning margins and triggering pump refill warnings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLowTank}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-sm transition-all active:scale-95"
                >
                  Drop Tank
                </button>
              </div>

              {/* 3. Simulate Normal Usage */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 transition-all flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-950">Simulate Normal Usage</span>
                    <Badge variant="normal" size="sm">Healthy Baseline</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Restores nominal expected consumption flow rates and healthy tank levels for {currentBuilding.name}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleNormal}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 shadow-sm transition-all active:scale-95"
                >
                  Normalize
                </button>
              </div>

              {/* 4. Full Reset Demo */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 mt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-900">Reset Demo to Initial State</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Wipes all active injected simulations across all campus blocks and resets alerts back to standard pristine prototype defaults.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold shrink-0 shadow-sm transition-all active:scale-95"
                >
                  Reset Demo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Adjust detection algorithm thresholds. When telemetry exceeds these limits, AquaGuard generates corresponding alerts and conservation recommendations:
              </p>

              {/* Leak Deviation Threshold */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Possible Leak Spike Threshold</span>
                  <span className="text-sky-700 font-bold">+{config.leakThresholdPct}% deviation</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="5"
                  value={config.leakThresholdPct}
                  onChange={(e) => onUpdateConfig({ leakThresholdPct: Number(e.target.value) })}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Hourly readings exceeding baseline by &ge; {config.leakThresholdPct}% are flagged as possible leaks.
                </span>
              </div>

              {/* Tank Warning Threshold */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Low Tank Warning Margin</span>
                  <span className="text-amber-700 font-bold">&le; {config.lowTankWarningThresholdPct}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="5"
                  value={config.lowTankWarningThresholdPct}
                  onChange={(e) => onUpdateConfig({ lowTankWarningThresholdPct: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Triggers standard advisory warning when tank volume drops below this level.
                </span>
              </div>

              {/* Tank Critical Threshold */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>Critical Low Tank Cutoff</span>
                  <span className="text-rose-700 font-bold">&le; {config.lowTankCriticalThresholdPct}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="5"
                  value={config.lowTankCriticalThresholdPct}
                  onChange={(e) => onUpdateConfig({ lowTankCriticalThresholdPct: Number(e.target.value) })}
                  className="w-full accent-rose-600 cursor-pointer"
                />
                <span className="text-[11px] text-slate-500 block">
                  Triggers urgent priority alarm to prevent pump dry-runs and water outages.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Simulated evaluations execute in-browser</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
