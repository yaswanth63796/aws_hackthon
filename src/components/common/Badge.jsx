import React from 'react';

export function Badge({ 
  children, 
  variant = 'default', // 'normal' | 'warning' | 'critical' | 'simulated' | 'info' | 'default'
  size = 'md',
  className = '',
  dot = false
}) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const variantClasses = {
    normal: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    critical: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    simulated: 'bg-sky-50 text-sky-800 border border-sky-300 font-medium tracking-wide',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const dotColors = {
    normal: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500 animate-pulse',
    simulated: 'bg-sky-500 animate-pulse',
    info: 'bg-blue-500',
    default: 'bg-slate-400'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all ${sizeClasses[size]} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`} />
      )}
      {children}
    </span>
  );
}
