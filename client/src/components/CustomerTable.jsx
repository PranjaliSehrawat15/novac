import React from 'react';
import { User, Edit2, MoreVertical, ChevronLeft, ChevronRight, Zap, Waves, Star } from 'lucide-react';
import { customers } from '../data/customerMockData';
import { motion } from 'motion/react';

const iconMap = {
  Zap,
  Waves,
  Star,
};

export default function CustomerTable() {
  return (
    <div className="bg-white dark:bg-indigo-500/5 rounded-2xl border border-slate-200 dark:border-indigo-500/10 overflow-hidden shadow-xl shadow-black/5 grow flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-indigo-500/10 bg-slate-50/50 dark:bg-indigo-500/10">
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Primary Contact</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">Total Deal Value</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Lifecycle Stage</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-indigo-500/10">
            {customers.map((customer, idx) => (
              <motion.tr
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50/50 dark:hover:bg-indigo-500/10 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className={`size-10 rounded-xl ${customer.color} flex items-center justify-center p-2`}>
                      {customer.type === 'initials' ? (
                        <span className="text-white text-xs font-black">{customer.initials}</span>
                      ) : (
                        React.createElement(iconMap[customer.icon], { className: 'text-white', size: 18 })
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <User className="text-indigo-600 dark:text-indigo-400" size={14} />
                    </div>
                    <span className="font-medium dark:text-slate-300">{customer.contact}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-slate-100">
                  ${customer.value.toLocaleString()}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      customer.stage === 'Loyal'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : customer.stage === 'Active'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        customer.stage === 'Loyal'
                          ? 'bg-green-500'
                          : customer.stage === 'Active'
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    {customer.stage}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium dark:text-slate-300">{customer.lastActivity}</p>
                  <p className="text-xs text-slate-500">{customer.activityDetail}</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center gap-2">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-indigo-500/20 rounded-lg transition-all text-slate-400 hover:text-indigo-600">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-indigo-500/20 rounded-lg transition-all text-slate-400 hover:text-slate-200">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-4 flex items-center justify-between bg-slate-50/50 dark:bg-indigo-500/10 border-t border-slate-200 dark:border-indigo-500/10 mt-auto">
        <p className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900 dark:text-slate-100 font-bold">1-5</span> of 248 customers
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-slate-200 dark:border-indigo-500/20 text-slate-400 hover:bg-white dark:hover:bg-indigo-500/20 transition-all disabled:opacity-50" disabled>
            <ChevronLeft size={18} />
          </button>
          <button className="size-9 rounded-lg bg-indigo-600 text-white font-bold text-sm">1</button>
          <button className="size-9 rounded-lg hover:bg-slate-200 dark:hover:bg-indigo-500/20 text-slate-600 dark:text-slate-400 font-bold text-sm transition-all">
            2
          </button>
          <button className="size-9 rounded-lg hover:bg-slate-200 dark:hover:bg-indigo-500/20 text-slate-600 dark:text-slate-400 font-bold text-sm transition-all">
            3
          </button>
          <span className="px-2 text-slate-400">...</span>
          <button className="size-9 rounded-lg hover:bg-slate-200 dark:hover:bg-indigo-500/20 text-slate-600 dark:text-slate-400 font-bold text-sm transition-all">
            24
          </button>
          <button className="p-2 rounded-lg border border-slate-200 dark:border-indigo-500/20 text-slate-400 hover:bg-white dark:hover:bg-indigo-500/20 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

