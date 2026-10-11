import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  unit = '',
  subtitle,
  icon: Icon,
  trend, // { direction: 'up' | 'down' | 'neutral', label: string, isPositive?: boolean }
  accentColor = 'sky', // 'sky' | 'emerald' | 'amber' | 'rose'
  isSimulated = true,
  onClick,
  className = ''
}) {
  const accentBorder = {
    sky: 'border-l-4 border-l-sky-500',
    emerald: 'border-l-4 border-l-emerald-500',
    amber: 'border-l-4 border-l-amber-500',
    rose: 'border-l-4 border-l-rose-500',
  };

  const iconBg = {
    sky: 'bg-sky-50 text-sky-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 ${accentBorder[accentColor] || ''} ${onClick ? 'cursor-pointer hover:border-slate-300' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
            {isSimulated && (
              <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded" title="Value generated from simulated model">
                Simulated
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-extrabold text-[#0A192F] tracking-tight">{value}</span>
            {unit && <span className="text-sm font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBg[accentColor] || 'bg-slate-100 text-slate-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {trend && (
            <div className={`flex items-center gap-0.5 font-medium ${trend.isPositive === false ? 'text-rose-600' : trend.isPositive === true ? 'text-emerald-600' : 'text-slate-600'}`}>
              {trend.direction === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{trend.label}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
