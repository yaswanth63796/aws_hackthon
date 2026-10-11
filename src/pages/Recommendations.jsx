import React, { useState } from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  Droplets, 
  Info, 
  ShieldAlert,
  ListChecks,
  ChevronDown,
  Building2
} from 'lucide-react';
import { Badge } from '../components/common/Badge';

export function Recommendations({
  recommendations = [],
  building,
  buildings = [],
  selectedBuildingId,
  onSelectBuilding,
  activeAlertsCount = 0
}) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [filterPriority, setFilterPriority] = useState('all');

  const toggleStep = (stepKey) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filterPriority === 'all') return true;
    return rec.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0A192F] tracking-tight">Conservation Action Engine</h2>
            <Badge variant="simulated" size="sm">Rule-Driven Guidance</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Dynamic facility mitigation recommendations triggered by current consumption deviations and tank reserve levels in <strong className="text-slate-800">{building.name}</strong>.
          </p>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="rec-filter" className="text-xs font-semibold text-slate-500">Priority:</label>
          <select
            id="rec-filter"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="preventative">Preventative</option>
          </select>
        </div>
      </div>

      {/* Advisory Banner regarding Real Savings disclaimer */}
      <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl flex items-start gap-3 text-xs text-sky-900">
        <Info className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
        <div>
          <strong>Facility Advisory Notice:</strong> Recommendations are generated automatically via heuristic operational rule sets based on simulated telemetry. These suggestions prioritize rapid physical inspection; they do not calculate or claim verified dollar or litre savings until confirmed by metering reconciliation.
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec) => {
          const isUrgent = rec.priority === 'Urgent' || rec.priority === 'Critical';
          const isHigh = rec.priority === 'High';

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-md ${
                isUrgent 
                  ? 'border-rose-300 ring-1 ring-rose-200' 
                  : isHigh 
                    ? 'border-amber-300' 
                    : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    isUrgent ? 'bg-rose-100 text-rose-700' : isHigh ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                  }`}>
                    {isUrgent ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : (
                      <Lightbulb className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-[#0A192F] text-base">{rec.title}</h3>
                      <Badge 
                        variant={isUrgent ? 'critical' : isHigh ? 'warning' : 'info'}
                        size="sm"
                      >
                        {rec.priority} Priority
                      </Badge>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {rec.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 mt-2 font-medium">
                      {rec.action}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-semibold text-slate-500 block">Target Facility</span>
                  <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 inline-block mt-0.5">
                    {rec.targetFacility}
                  </span>
                </div>
              </div>

              {/* Rationale Explanation Box */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <strong className="text-slate-900">Why this recommendation appears: </strong>
                {rec.whyTriggered}
              </div>

              {/* Actionable Maintenance Steps Checklist */}
              {rec.steps && rec.steps.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                    <ListChecks className="w-4 h-4 text-sky-600" />
                    <span>Warden & Maintenance Inspection Checklist:</span>
                  </div>
                  
                  <div className="space-y-2">
                    {rec.steps.map((step, idx) => {
                      const stepKey = `${rec.id}-step-${idx}`;
                      const isDone = !!completedSteps[stepKey];

                      return (
                        <label 
                          key={idx}
                          className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                            isDone ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleStep(stepKey)}
                            className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                          />
                          <span className={isDone ? 'line-through text-slate-400 font-medium' : 'font-medium'}>
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
