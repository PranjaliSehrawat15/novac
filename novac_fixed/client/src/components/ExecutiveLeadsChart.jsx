import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChevronDown, BarChart2 } from 'lucide-react';

const data = [
  { name: 'NEW', value: 2450, opacity: 0.2 },
  { name: 'CONTACTED', value: 5120, opacity: 0.4 },
  { name: 'QUALIFIED', value: 3890, opacity: 0.7 },
  { name: 'PROPOSAL', value: 1210, opacity: 0.1 },
  { name: 'NEGOTIATION', value: 2940, opacity: 0.3 },
];

export function ExecutiveLeadsChart() {
  return (
    <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
        <BarChart2 className="w-20 h-20 text-blue-400" />
      </div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h4 className="text-lg font-bold">Leads by Status</h4>
          <p className="text-slate-400 text-xs">Real-time engagement tracking</p>
        </div>
        <button className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-500/20 transition-colors">
          Last 30 Days <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="h-56 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
            />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded">
                      {payload[0].value.toLocaleString()}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 6, 6]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#7f13ec" fillOpacity={entry.opacity} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
