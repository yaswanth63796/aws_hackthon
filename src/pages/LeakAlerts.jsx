import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Building2, 
  Clock, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export function LeakAlerts({
  alerts = [],
  buildings = [],
  selectedBuildingId,
  onAcknowledgeAlert,
  onOpenDemoControls
}) {
  const [filterTab, setFilterTab] = useState('active'); // 'active' | 'acknowledged' | 'all'
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all' | 'Critical' | 'High' | 'Warning' | 'Medium'
  const [filterBuilding, setFilterBuilding] = useState('all'); // 'all' | buildingId
  const [expandedAlertId, setExpandedAlertId] = useState(null);

  // Filter alerts based on selection
  const filteredAlerts = alerts.filter(alert => {
    if (filterTab === 'active' && alert.status !== 'active') return false;
    if (filterTab === 'acknowledged' && alert.status !== 'acknowledged') return false;
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterBuilding !== 'all' && alert.buildingId !== filterBuilding) return false;
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const acknowledgedCount = alerts.filter(a => a.status === 'acknowledged').length;

  const toggleExpand = (id) => {
    setExpandedAlertId(expandedAlertId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Status Overview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0A192F] tracking-tight">Possible Leak & Anomaly Alerts</h2>
            <Badge variant="simulated" size="sm">Rule-Based Detection</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transparent threshold evaluation for early investigation of consumption spikes and low tank conditions.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDemoControls}
          className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5 self-start md:self-auto"
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Inject Test Anomaly</span>
        </button>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setFilterTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'active'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Alerts</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                {activeCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('acknowledged')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterTab === 'acknowledged'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Acknowledged History</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">
              {acknowledgedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Events ({alerts.length})
          </button>
        </div>

        {/* Filters: Facility and Severity */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Facility Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-building" className="text-xs font-semibold text-slate-500">Building:</label>
            <select
              id="filter-building"
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Buildings</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-severity" className="text-xs font-semibold text-slate-500">Severity:</label>
            <select
              id="filter-severity"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Warning">Warning</option>
              <option value="Medium">Medium</option>
            </select>
          </div>
        </div>

      </div>

      {/* Detection Disclaimer Notice */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Evaluation Policy:</strong> AquaGuard flags potential anomalies purely based on statistical divergence from historical telemetry models. No alert constitutes physical hardware verification of a pipe fracture until verified by ground maintenance personnel.
        </div>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-sm">
          <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-3 opacity-90" />
          <h3 className="text-base font-bold text-slate-800">No Alerts Matching Criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {filterTab === 'active' 
              ? 'Great! All facility monitors report nominal flow parameters and adequate reservoir storage.' 
              : 'No matching records in the historical alert ledger.'}
          </p>
          {filterTab === 'active' && (
            <button
              type="button"
              onClick={onOpenDemoControls}
              className="mt-4 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5"
            >
              Simulate Test Anomaly Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const isExpanded = expandedAlertId === alert.id;
            const isCritical = alert.severity === 'Critical';
            const isHigh = alert.severity === 'High';

            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs hover:shadow-md ${
                  alert.status === 'active'
                    ? isCritical 
                      ? 'border-rose-300 ring-1 ring-rose-200' 
                      : isHigh 
                        ? 'border-amber-300 ring-1 ring-amber-200' 
                        : 'border-sky-300'
                    : 'border-slate-200 opacity-90'
                }`}
              >
                {/* Alert Card Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      alert.status === 'active'
                        ? isCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {alert.status === 'active' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-[#0A192F] text-base">
                          {alert.title}
                        </span>
                        <Badge 
                          variant={isCritical ? 'critical' : isHigh ? 'warning' : 'info'}
                          size="sm"
                          dot={alert.status === 'active'}
                        >
                          Severity: {alert.severity}
                        </Badge>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {alert.buildingName}
                        </span>
                        {alert.status === 'acknowledged' && (
                          <Badge variant="normal" size="sm">
                            Acknowledged
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                        {alert.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Timestamp */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    {alert.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold shadow-xs hover:border-slate-400 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <div className="text-right text-[11px] text-slate-400">
                        <span>Acknowledged</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleExpand(alert.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Toggle breakdown details"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Quick Telemetry Row */}
                <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
                  <div className="flex items-center gap-4">
                    <span>Observed: <strong className="text-slate-800">{alert.observedValue}</strong></span>
                    <span>Baseline Expectation: <strong className="text-slate-800">{alert.baselineValue}</strong></span>
                    <span className="hidden sm:inline text-slate-400">•</span>
                    <span className="hidden sm:inline font-mono text-[11px] text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {alert.thresholdDescription}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>

                {/* Expanded Diagnostic Detail Accordion */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-200 bg-slate-50/40 text-xs space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Suggested Action Box */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">Recommended Physical Investigation:</strong>
                        <p className="text-slate-600 leading-relaxed">
                          {alert.suggestedAction}
                        </p>
                      </div>

                      {/* Transparent Rule Evaluation Rationale */}
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                        <strong className="text-slate-900 block mb-1">Detection Logic Rationale:</strong>
                        <p className="text-slate-600 leading-relaxed">
                          {alert.thresholdDescription}. Evaluated by AquaGuard transparent statistical rule engine comparing moving diurnal averages.
                        </p>
                        {alert.status === 'acknowledged' && (
                          <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">
                            Acknowledged by: <strong>{alert.acknowledgedBy}</strong> at {alert.acknowledgedAt}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
