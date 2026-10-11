import React, { useState } from 'react';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Building2, 
  Info, 
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Droplet
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';

export function WaterAnalytics({
  allBuildings = [],
  currentBuilding,
  onSelectBuilding
}) {
  const [timeRange, setTimeRange] = useState('24h'); // '24h' | '7d' | '30d'

  // Comparative data across all buildings for the campus-wide bar chart
  const buildingComparisonData = allBuildings.map(b => ({
    name: b.name,
    todayConsumption: b.todayConsumptionLitres,
    avgDaily: b.avgDailyConsumptionLitres,
    capacity: b.tankCapacityLitres,
    tankLevel: b.currentTankLevelPct,
    occupancy: b.occupancy,
    perCapita: Math.round(b.todayConsumptionLitres / (b.occupancy || 1))
  }));

  // Trend analysis summary text
  const getTrendAnalysis = () => {
    if (timeRange === '24h') {
      return {
        title: '24-Hour Diurnal Flow Dynamics',
        summary: `Peak consumption occurs between 06:00 - 09:00 (morning student prep) and 18:00 - 21:00 (evening return). Nocturnal baseline (01:00 - 04:00) represents approximately 140–180 L/hr. Any nocturnal flow rising above this baseline suggests valve weepage or continuously cycling pump valves.`,
        keyStat: 'Peak: 1,780 L/hr at 20:00'
      };
    } else if (timeRange === '7d') {
      return {
        title: '7-Day Weekly Consumption Pattern',
        summary: `Weekly variance demonstrates strong weekend divergence: hostel residences maintain consistent demand throughout weekends, while College Block academic consumption drops sharply on Saturday afternoon through Sunday evening. Friday represents the weekly campus-wide peak demand day.`,
        keyStat: 'Highest Load: Friday (14,750 L)'
      };
    } else {
      return {
        title: '30-Day Monthly Macro Trends',
        summary: `Monthly consumption shows consistent adherence to expected baseline with less than ±4.2% overall variance. Academic semester exam periods correlate with extended evening occupancy in student residences and elevated library water requirements.`,
        keyStat: 'Monthly Stability: ±3.8% Delta'
      };
    }
  };

  const trendInfo = getTrendAnalysis();

  return (
    <div className="space-y-6">
      
      {/* Analytics Header & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#0A192F] tracking-tight">Water Consumption Telemetry</h2>
            <Badge variant="simulated" size="sm">Simulated Data</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detailed consumption profiling for <strong className="text-slate-800">{currentBuilding.name}</strong> and cross-campus facility benchmarking.
          </p>
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTimeRange('24h')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === '24h'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            24 Hours (Hourly)
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === '7d'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7 Days (Daily)
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              timeRange === '30d'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30 Days (Weekly)
          </button>
        </div>
      </div>

      {/* Main Timeline Chart */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0A192F] text-base">
                {timeRange === '24h' ? `24-Hour Hourly Consumption — ${currentBuilding.name}` :
                 timeRange === '7d' ? `7-Day Daily Consumption Profile — ${currentBuilding.name}` :
                 `30-Day Aggregated Volume Breakdown — ${currentBuilding.name}`}
              </h3>
              <Badge variant="simulated" size="sm">Telemetry Stream</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Litres monitored vs expected baseline. Anomalous spikes above baseline are highlighted.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            Selected: <span className="font-bold text-sky-800">{currentBuilding.name}</span>
          </div>
        </div>

        {/* Chart View based on selected filter */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {timeRange === '24h' ? (
              <AreaChart data={currentBuilding.hourlyConsumption} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <defs>
                  <linearGradient id="hourlyColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.03}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v} L`} />
                <Tooltip 
                  formatter={(value, name) => [`${value.toLocaleString()} L`, name === 'consumption' ? 'Simulated Flow' : 'Expected Baseline']}
                  contentStyle={{ backgroundColor: '#0A192F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area 
                  type="monotone" 
                  name="Hourly Flow Rate" 
                  dataKey="consumption" 
                  stroke="#0284C7" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#hourlyColor)" 
                />
                <Area 
                  type="monotone" 
                  name="Baseline Benchmark" 
                  dataKey="baseline" 
                  stroke="#94A3B8" 
                  strokeDasharray="4 4" 
                  strokeWidth={2} 
                  fill="none" 
                />
              </AreaChart>
            ) : timeRange === '7d' ? (
              <BarChart data={currentBuilding.weeklyConsumption} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k L`} />
                <Tooltip 
                  formatter={(value, name) => [`${value.toLocaleString()} L`, name === 'consumption' ? 'Daily Usage' : 'Baseline']}
                  contentStyle={{ backgroundColor: '#0A192F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="rect" />
                <Bar name="Simulated Daily Consumption" dataKey="consumption" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar name="Historical Daily Baseline" dataKey="baseline" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={currentBuilding.monthlyConsumption} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k L`} />
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} L`, 'Weekly Total']}
                  contentStyle={{ backgroundColor: '#0A192F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} iconType="rect" />
                <Bar name="Observed Cumulative Volume" dataKey="consumption" fill="#0369A1" radius={[4, 4, 0, 0]} />
                <Bar name="Baseline Expected Range" dataKey="baseline" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Dynamic Pattern Explanation Banner */}
        <div className="mt-4 p-4 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-950">{trendInfo.title}</span>
              <span className="bg-sky-200/70 text-sky-900 font-semibold px-2 py-0.5 rounded text-[10px]">
                {trendInfo.keyStat}
              </span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {trendInfo.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Building-Wise Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Comparative Bar Chart across all 3 buildings */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0A192F] text-base">Campus Building Comparison</h3>
                <Badge variant="simulated" size="sm">Simulated Cross-Facility</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Side-by-side view of daily volume (Litres) across Hostel A, Hostel B, and College Block
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingComparisonData} margin={{ top: 15, right: 15, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k L`} />
                <Tooltip 
                  formatter={(value, name) => [`${value.toLocaleString()} L`, name === 'todayConsumption' ? "Today's Consumption" : "Historical Baseline"]}
                  contentStyle={{ backgroundColor: '#0A192F', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar name="Today's Consumption" dataKey="todayConsumption" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar name="Baseline Average" dataKey="avgDaily" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-3 text-center text-xs">
            {buildingComparisonData.map(b => (
              <div 
                key={b.name} 
                onClick={() => onSelectBuilding(allBuildings.find(x => x.name === b.name)?.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  currentBuilding.name === b.name
                    ? 'border-sky-500 bg-sky-50/70 font-semibold text-sky-950'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <div className="font-bold text-xs">{b.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Per-Capita: <strong>~{b.perCapita} L/day</strong></div>
                <div className="text-[10px] text-sky-600 mt-1">Tank: {b.tankLevel}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub-Zones / Facility Breakdown for Current Building */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-[#0A192F] text-base">Facility Sub-Zone Distribution</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Estimated distribution share across {currentBuilding.name} wings
            </p>

            <div className="space-y-3.5">
              {currentBuilding.subZones?.map((zone) => (
                <div key={zone.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{zone.name}</span>
                    <span className="text-sky-700">{zone.sharePct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${zone.sharePct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Est. {Math.round((zone.sharePct / 100) * currentBuilding.todayConsumptionLitres).toLocaleString()} L today
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 mt-4">
            <strong className="text-slate-700">Sub-metering note:</strong> Distribution percentages are modeled based on typical fixture counts and usage density for {currentBuilding.type.toLowerCase()} facilities.
          </div>
        </div>

      </div>

    </div>
  );
}
