import React from 'react';
import { Link } from 'react-router-dom';
import { Download, UserPlus, Filter, ChevronDown, ChevronLeft, ChevronRight, Edit2, MoreVertical, Search, Bell, Rocket, User, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const customers = [
  { id: 1, name: 'Acme Corp', domain: 'acme.co', initials: 'AC', color: 'bg-slate-600', contact: 'Johnathan Doe', value: 1240000, stage: 'Loyal', lastActivity: '2 hours ago', activityDetail: 'Proposal Signed' },
  { id: 2, name: 'GlobalX Solutions', domain: 'globalx.io', initials: 'GX', color: 'bg-red-600', contact: 'Sarah Miller', value: 850000, stage: 'Active', lastActivity: 'Yesterday', activityDetail: 'Email Exchange' },
  { id: 3, name: 'TechFlow Systems', domain: 'techflow.com', initials: 'TF', color: 'bg-emerald-600', contact: 'Mike Harrison', value: 420000, stage: 'At Risk', lastActivity: '5 days ago', activityDetail: 'Support Ticket' },
  { id: 4, name: 'Starlight Inc', domain: 'starlight.agency', initials: 'SI', color: 'bg-amber-600', contact: 'Emma Wilson', value: 2100000, stage: 'Loyal', lastActivity: '3 hours ago', activityDetail: 'Account Review' },
  { id: 5, name: 'Nexus Ltd', domain: 'nexus.group', initials: 'NX', color: 'bg-slate-500', contact: 'David Brown', value: 150000, stage: 'Active', lastActivity: '1 week ago', activityDetail: 'License Updated' },
];

const stageColors = {
  'Loyal': 'bg-emerald-500/20 text-emerald-400',
  'Active': 'bg-blue-500/20 text-blue-400',
  'At Risk': 'bg-red-500/20 text-red-400',
};

const stageDotColors = {
  'Loyal': 'bg-emerald-500',
  'Active': 'bg-blue-500',
  'At Risk': 'bg-red-500',
};

export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans flex flex-col">
      {/* Navigation */}
      <header className="h-16 border-b border-white/5 px-6 flex items-center sticky top-0 bg-[#0B0E14]/80 backdrop-blur-xl z-50">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Rocket size={18} />
              </div>
              <h2 className="text-lg font-bold tracking-tight">NovaCRM</h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              <Link to="/leads" className="text-slate-400 hover:text-white transition-colors">Leads</Link>
              <Link to="/deals" className="text-slate-400 hover:text-white transition-colors">Deals</Link>
              <span className="text-blue-400 font-semibold border-b-2 border-blue-500 pb-4 -mb-[18px]">Customers</span>
              <Link to="/reports" className="text-slate-400 hover:text-white transition-colors">Reports</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search customers..."
                className="bg-[#151921] border border-white/5 rounded-xl pl-9 pr-4 py-2 w-52 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-600"
              />
            </div>
            <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="h-6 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold leading-none">Alex Rivera</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Admin Account</p>
              </div>
              <Link to="/settings" className="w-9 h-9 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                <img
                  className="w-full h-full object-cover"
                  src="https://picsum.photos/seed/alex/100/100"
                  alt="User profile"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 w-full grow flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-3xl font-bold tracking-tight">Customer Directory</h1>
            <p className="text-slate-400 text-sm">
              Manage relationships and lifetime value of your converted accounts.
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-sm transition-all">
              <Download size={16} />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
              <UserPlus size={16} />
              Add Customer
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-3 p-1.5 bg-[#151921] rounded-xl border border-white/5">
          <div className="flex items-center gap-2 px-3 text-slate-500">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Segments</span>
          </div>
          <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs">
            All Customers
          </button>
          {['Enterprise', 'Mid-Market', 'SMB'].map((seg) => (
            <button key={seg} className="px-4 py-1.5 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white font-bold text-xs transition-all">
              {seg}
            </button>
          ))}

          <div className="flex-grow" />

          <div className="flex items-center gap-2 pr-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/5 font-bold text-xs transition-all">
              Total Value
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-[#151921] rounded-2xl border border-white/5 overflow-hidden grow flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primary Contact</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Total Deal Value</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lifecycle Stage</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Activity</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((customer, idx) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/customers/${customer.id}`} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${customer.color} flex items-center justify-center`}>
                          <span className="text-white text-xs font-bold">{customer.initials}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-sm group-hover:text-blue-400 transition-colors">{customer.name}</p>
                          <p className="text-xs text-slate-500">{customer.domain}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <User className="text-blue-400" size={12} />
                        </div>
                        <span className="text-sm text-slate-300">{customer.contact}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-sm">
                      ${customer.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${stageColors[customer.stage]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stageDotColors[customer.stage]}`} />
                        {customer.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-300">{customer.lastActivity}</p>
                      <p className="text-xs text-slate-500">{customer.activityDetail}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1">
                        <Link to={`/customers/${customer.id}`} className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-blue-400">
                          <Edit2 size={14} />
                        </Link>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hover:text-white">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-white/5 mt-auto">
            <p className="text-sm text-slate-500">
              Showing <span className="text-white font-bold">1-5</span> of 248 customers
            </p>
            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-lg border border-white/10 text-slate-500 hover:bg-white/5 transition-all disabled:opacity-30" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs">1</button>
              {[2, 3].map(p => (
                <button key={p} className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 font-bold text-xs transition-all">{p}</button>
              ))}
              <span className="px-1 text-slate-500 text-xs">...</span>
              <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-slate-400 font-bold text-xs transition-all">24</button>
              <button className="p-2 rounded-lg border border-white/10 text-slate-500 hover:bg-white/5 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total ARR</p>
            <p className="text-2xl font-bold text-emerald-400">$4.8M</p>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1"><TrendingUp size={12} /> +12% this month</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Customers</p>
            <p className="text-2xl font-bold">1,842</p>
            <p className="text-xs text-slate-500">Across 12 regions</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Deal</p>
            <p className="text-2xl font-bold">$48.2k</p>
            <p className="text-xs text-slate-500">Per account annual</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Retention Rate</p>
            <p className="text-2xl font-bold text-emerald-400">98.4%</p>
            <p className="text-xs text-slate-500">Quarterly average</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
