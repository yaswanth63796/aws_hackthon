import React from 'react';
import { 
  Droplet, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Gauge
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { TankVisualizer } from '../components/TankVisualizer';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar 
} from 'recharts';

export function Overview({
  building,
  alerts = [],
  recommendations = [],
  config,
  onAcknowledgeAlert,
  onNavigate,
  onOpenDemoControls
}) {
  const buildingAlerts = alerts.filter(a => a.buildingId === building.id);
  const activeAlerts = buildingAlerts.filter(a => a.status === 'active');
  const recentAlerts = buildingAlerts.slice(0, 3);

  // Status badge styling
  const statusBadgeVariant = 
    building.status === 'Critical' ? 'critical' : 
    building.status === 'Warning' ? 'warning' : 'normal';

  // Difference vs average
  const diffFromAvg = building.todayConsumptionLitres - building.avgDailyConsumptionLitres;
  const diffPct = Number(((diffFromAvg / building.avgDailyConsumptionLitres) * 100).toFixed(1));
  const isUsageHigher = diffFromAvg > 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Facility Summary & Status */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#0A192F] tracking-tight">{building.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {building.type}
              </span>
              <Badge variant={statusBadgeVariant} dot size="md">
                Status: {building.status}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {building.subtitle} • {building.occupancy} occupants • {building.floors} floors • Zone: {building.primaryZone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={onOpenDemoControls}
            className="px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span>Simulate Anomaly</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Full Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tank Level */}
        <StatCard
          title="Current Tank Level"
          value={`${building.currentTankLevelPct}%`}
          unit={`(${Math.round((building.currentTankLevelPct / 100) * building.tankCapacityLitres).toLocaleString()} L)`}
          subtitle={`Capacity: ${building.tankCapacityLitres.toLocaleString()} L`}
          icon={Droplet}
          accentColor={building.currentTankLevelPct <= 15 ? 'rose' : building.currentTankLevelPct <= 25 ? 'amber' : 'sky'}
          trend={{
            direction: building.currentTankLevelPct <= 25 ? 'down' : 'neutral',
            label: building.currentTankLevelPct <= 25 ? 'Below reserve' : 'Nominal buffer',
            isPositive: building.currentTankLevelPct > 25
          }}
        />

        {/* Today's Consumption */}
        <StatCard
          title="Today's Consumption"
          value={building.todayConsumptionLitres.toLocaleString()}
          unit="Litres"
          subtitle={`Baseline: ${building.avgDailyConsumptionLitres.toLocaleString()} L`}
          icon={TrendingUp}
          accentColor={isUsageHigher ? 'amber' : 'emerald'}
          trend={{
            direction: isUsageHigher ? 'up' : 'down',
            label: `${isUsageHigher ? '+' : ''}${diffPct}% vs 30d avg`,
            isPositive: !isUsageHigher
          }}
        />

        {/* Average Daily Consumption */}
        <StatCard
          title="Daily Average (30d)"
          value={building.avgDailyConsumptionLitres.toLocaleString()}
          unit="Litres/day"
          subtitle={`~${Math.round(building.avgDailyConsumptionLitres / building.occupancy)} L per occupant`}
          icon={Activity}
          accentColor="sky"
          trend={{
            direction: 'neutral',
            label: 'Benchmark',
            isPositive: true
          }}
        />

        {/* Active Alerts */}
        <StatCard
          title="Active Alerts"
          value={activeAlerts.length}
          unit="events"
          subtitle={activeAlerts.length > 0 ? `${activeAlerts.filter(a => a.severity === 'Critical').length} critical issues` : 'Zero unresolved anomalies'}
          icon={AlertTriangle}
          accentColor={activeAlerts.length > 0 ? 'rose' : 'emerald'}
          trend={{
            direction: activeAlerts.length > 0 ? 'up' : 'neutral',
            label: activeAlerts.length > 0 ? 'Action needed' : 'All clear',
            isPositive: activeAlerts.length === 0
          }}
          onClick={() => onNavigate('alerts')}
        />

      </div>

      {/* Middle Section: Tank Cylinder Visualizer & Weekly Consumption Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Overhead Tank Visualizer */}
        <div className="lg:col-span-5">
          <TankVisualizer
            tankLevelPct={building.currentTankLevelPct}
            capacityLitres={building.tankCapacityLitres}
            buildingName={building.name}
            warningThreshold={config.lowTankWarningThresholdPct}
            criticalThreshold={config.lowTankCriticalThresholdPct}
            lastUpdated={building.lastUpdated}
          />
        </div>

        {/* Right: Weekly Water Consumption Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0A192F] text-base">Weekly Water Consumption</h3>
                <Badge variant="simulated" size="sm">Simulated 7-Day Trend</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison between actual simulated volume and historical baseline (Litres)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={building.weeklyConsumption} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} L`, 'Consumption']}
                  contentStyle={{ backgroundColor: '#0A192F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  name="Simulated Usage" 
                  dataKey="consumption" 
                  stroke="#0284C7" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#consumptionGradient)" 
                />
                <Area 
                  type="monotone" 
                  name="Baseline Expectation" 
                  dataKey="baseline" 
                  stroke="#94A3B8" 
                  strokeDasharray="4 4" 
                  strokeWidth={2} 
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>Peak Day: <strong className="text-slate-700">Friday (14,750 L)</strong></span>
            <span>7-Day Total: <strong className="text-slate-700">
              {building.weeklyConsumption.reduce((a, c) => a + c.consumption, 0).toLocaleString()} L
            </strong></span>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Alerts & Contextual Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Alerts List */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0A192F] text-base">Recent Possible Leaks & Alerts</h3>
              {activeAlerts.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                  {activeAlerts.length} Active
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onNavigate('alerts')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="font-semibold text-slate-700">No recent anomaly alerts for {building.name}.</p>
              <p className="mt-1">Telemetry parameters are inside safe operating boundaries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.status === 'active'
                      ? alert.severity === 'Critical'
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-amber-50/70 border-amber-200'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={alert.severity === 'Critical' ? 'critical' : alert.severity === 'High' || alert.severity === 'Warning' ? 'warning' : 'info'}
                          size="sm"
                          dot={alert.status === 'active'}
                        >
                          {alert.severity}
                        </Badge>
                        <span className="text-xs font-bold text-[#0A192F]">{alert.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {alert.reason}
                      </p>
                    </div>

                    {alert.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => onAcknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg shadow-2xs shrink-0"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Observed: <strong>{alert.observedValue}</strong> (Base: {alert.baselineValue})</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Context-Aware Recommendations */}
        <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0A192F] text-base">Conservation Recommendations</h3>
              <Badge variant="simulated" size="sm">Rule-Driven</Badge>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('recommendations')}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              Action Checklist <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div 
                key={rec.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-[#0A192F]">{rec.title}</span>
                  </div>
                  <Badge 
                    variant={rec.priority === 'Urgent' || rec.priority === 'Critical' ? 'critical' : rec.priority === 'High' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {rec.action}
                </p>
                <div className="mt-2 text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                  <strong className="text-slate-700">Why flagged: </strong>{rec.whyTriggered}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
