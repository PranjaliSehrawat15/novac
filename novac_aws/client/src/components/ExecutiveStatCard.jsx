import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../utils';

export function ExecutiveStatCard({ label, value, change, trend, icon: Icon, color, sparkline }) {
  const colorMap = {
    blue: 'text-blue-500 bg-blue-500/10',
    primary: 'text-blue-500 bg-blue-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
  };

  const barColorMap = {
    blue: 'bg-blue-500',
    primary: 'bg-blue-500',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
  };

  return (
    <div className="p-6 bg-[#151921] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
          )}
        >
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="mt-4 h-8 flex items-end gap-1">
        {sparkline.map((h, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 rounded-t transition-all',
              barColorMap[color],
              i === sparkline.length - 1 ? 'opacity-100' : 'opacity-20 group-hover:opacity-40'
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
