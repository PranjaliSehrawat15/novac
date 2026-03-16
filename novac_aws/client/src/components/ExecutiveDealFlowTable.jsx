import React from 'react';
import { cn } from '../utils';

const deals = [
  {
    id: 1,
    account: 'Skyline Corp',
    industry: 'Cloud Infrastructure',
    initials: 'SC',
    color: 'bg-blue-500/10 text-blue-400',
    stage: 'Negotiation',
    value: '$84,000',
    owner: 'Jane Doe',
    ownerInitials: 'JD',
    probability: 80,
  },
  {
    id: 2,
    account: 'Apex Solutions',
    industry: 'Security Software',
    initials: 'AX',
    color: 'bg-amber-500/10 text-amber-400',
    stage: 'Discovery',
    value: '$32,500',
    owner: 'Mark King',
    ownerInitials: 'MK',
    probability: 35,
  },
  {
    id: 3,
    account: 'NextTech Inc',
    industry: 'AI Research',
    initials: 'NT',
    color: 'bg-emerald-500/10 text-emerald-400',
    stage: 'Closed Won',
    value: '$150,000',
    owner: 'Alex Rivera',
    ownerInitials: 'AR',
    probability: 100,
  },
];

export function ExecutiveDealFlowTable() {
  return (
    <div className="bg-[#151921] rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
        <h4 className="text-lg font-bold">Active Deal Flow</h4>
        <button className="text-blue-400 text-xs font-bold hover:text-blue-300 transition-colors">View All Pipeline</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="px-6 py-4 font-semibold">Account</th>
              <th className="px-6 py-4 font-semibold">Stage</th>
              <th className="px-6 py-4 font-semibold">Value</th>
              <th className="px-6 py-4 font-semibold">Owner</th>
              <th className="px-6 py-4 font-semibold">Probability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {deals.map((deal) => (
              <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm', deal.color)}>
                      {deal.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{deal.account}</p>
                      <p className="text-xs text-slate-500">{deal.industry}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'px-3 py-1 text-[10px] font-bold rounded-full uppercase',
                      deal.stage === 'Negotiation'
                        ? 'bg-blue-500/10 text-blue-400'
                        : deal.stage === 'Discovery'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                    )}
                  >
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-sm">{deal.value}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      {deal.ownerInitials}
                    </div>
                    <span className="text-sm text-slate-300">{deal.owner}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-1000 rounded-full',
                        deal.probability === 100
                          ? 'bg-emerald-500'
                          : deal.probability > 50
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                      )}
                      style={{ width: `${deal.probability}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
