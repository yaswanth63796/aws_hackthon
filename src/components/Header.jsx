import React from 'react';
import { 
  Building2, 
  Clock, 
  Sliders, 
  Menu, 
  Info,
  Activity,
  ChevronDown
} from 'lucide-react';
import { Badge } from './common/Badge';

export function Header({
  pageTitle,
  pageDescription,
  buildings = [],
  selectedBuildingId,
  onSelectBuilding,
  onOpenDemoControls,
  lastUpdated,
  onToggleMobileSidebar
}) {
  const currentBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Left: Mobile hamburger + Page Title & Description */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A192F] tracking-tight">
                {pageTitle}
              </h1>
              <Badge variant="simulated" size="sm" dot>
                SIMULATED DATA
              </Badge>
            </div>
            {pageDescription && (
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {pageDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right: Building Selector, Timestamp, Demo Controls Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 self-end lg:self-auto">
          
          {/* Building Selector */}
          <div className="relative">
            <label htmlFor="building-selector" className="sr-only">Select Campus Facility</label>
            <div className="relative flex items-center">
              <Building2 className="w-4 h-4 text-sky-600 absolute left-3 pointer-events-none" />
              <select
                id="building-selector"
                value={selectedBuildingId}
                onChange={(e) => onSelectBuilding(e.target.value)}
                className="pl-9 pr-9 py-2 text-xs sm:text-sm font-semibold bg-sky-50/80 hover:bg-sky-100/70 border border-sky-200 text-[#0A192F] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none transition-colors"
              >
                {buildings.map(b => (
                  <option key={b.id} value={b.id} className="bg-white text-slate-800">
                    {b.name} ({b.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-sky-700 absolute right-3 pointer-events-none" />
            </div>
          </div>

          {/* Last Simulated Telemetry Update */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-600 border border-slate-200/80" title="Simulated telemetry update cycle">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Telemetry: <strong className="font-semibold text-slate-700">{lastUpdated || 'Simulated'}</strong></span>
          </div>

          {/* Dedicated Demo Simulation Controls Button */}
          <button
            type="button"
            onClick={onOpenDemoControls}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-lg text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-95"
            title="Open Demo Simulation Controls to inject spikes, drop tank levels, or reset"
          >
            <Sliders className="w-4 h-4" />
            <span>Demo Controls</span>
          </button>

        </div>
      </div>
    </header>
  );
}
