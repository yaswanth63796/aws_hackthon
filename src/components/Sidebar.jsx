import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  AlertOctagon, 
  Building2, 
  Lightbulb, 
  Info, 
  Droplets,
  CloudUpload,
  X,
  ShieldCheck
} from 'lucide-react';
import { Badge } from './common/Badge';

export function Sidebar({
  activeTab,
  onTabChange,
  activeAlertsCount = 0,
  campusStatus = 'Normal',
  isOpenMobile = false,
  onCloseMobile
}) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Water Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Leak Alerts', icon: AlertOctagon, count: activeAlertsCount },
    { id: 'buildings', label: 'Buildings', icon: Building2 },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  const handleNavClick = (id) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0A192F] to-[#0E2442] text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">AquaGuard</span>
              </div>
              <span className="text-[10px] font-semibold text-sky-300 tracking-wider uppercase block">
                Heat & Water Track • 2026
              </span>
            </div>
          </div>

          <button 
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hackathon Badge */}
        <div className="px-5 py-3 bg-sky-950/40 border-b border-sky-900/30 flex items-center justify-between text-xs">
          <span className="text-slate-400">Environmental Hacks</span>
          <span className="text-cyan-300 font-semibold text-[11px] bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded-md">
            Hackathon Prototype
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-sky-700' : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer / Status Card */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          {/* Status Box */}
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 font-medium">Campus Water State</span>
              <Badge 
                variant={campusStatus === 'Critical' ? 'critical' : campusStatus === 'Warning' ? 'warning' : 'normal'}
                size="sm"
                dot
              >
                {campusStatus}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              {activeAlertsCount === 0 
                ? 'All facilities running within safe historical parameters.' 
                : `${activeAlertsCount} active abnormal event(s) requiring warden attention.`}
            </p>
          </div>

          {/* AWS Handoff Bridge Indicator */}
          <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 flex items-center justify-between text-xs text-sky-200">
            <div className="flex items-center gap-2">
              <CloudUpload className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-[11px]">AWS Integration Ready</span>
            </div>
            <span className="text-[10px] text-sky-300/80 font-mono">v1.0 Hand-off</span>
          </div>

          <div className="text-[10px] text-slate-500 text-center">
            AquaGuard Prototype • Simulated Telemetry
          </div>
        </div>

      </aside>
    </>
  );
}
