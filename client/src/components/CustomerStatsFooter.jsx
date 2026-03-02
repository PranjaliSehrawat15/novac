import React from 'react';
import { TrendingUp } from 'lucide-react';
import { customerStats } from '../data/customerMockData';

export default function CustomerStatsFooter() {
  return (
    <footer className="bg-white dark:bg-[#101222] border-t border-slate-200 dark:border-indigo-500/10 py-8">
      <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {customerStats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.highlight || 'dark:text-white'}`}>{stat.value}</p>
            {stat.trend ? (
              <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                <TrendingUp size={14} /> {stat.trend}
              </p>
            ) : (
              <p className="text-xs text-slate-500 font-medium">{stat.detail}</p>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
}

