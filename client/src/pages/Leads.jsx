import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket, Search, Bell, Settings, Download, Plus, Filter,
  ChevronLeft, ChevronRight, MoreVertical, Globe, Mail,
  Users, TrendingUp, DollarSign, Clock, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const leadsData = [
  {
    id: 1,
    name: 'John Cooper',
    role: 'CTO, CloudScale',
    email: 'john.cooper@cloudscale.io',
    source: 'LinkedIn',
    sourceIcon: <Globe className="w-4 h-4" />,
    status: 'New Lead',
    statusColor: 'bg-blue-500/20 text-blue-400',
    assignedUser: 'Sarah Chen',
    assignedInitials: 'SC',
    assignedColor: 'bg-orange-500',
    avatar: 'https://picsum.photos/seed/john/100/100'
  },
  {
    id: 2,
    name: 'Alice Freeman',
    role: 'Founder, Innovate',
    email: 'alice@innovate.co',
    source: 'Website',
    sourceIcon: <Globe className="w-4 h-4" />,
    status: 'Qualified',
    statusColor: 'bg-emerald-500/20 text-emerald-400',
    assignedUser: 'Mike Ross',
    assignedInitials: 'MR',
    assignedColor: 'bg-indigo-500',
    avatar: 'https://picsum.photos/seed/alice/100/100'
  },
  {
    id: 3,
    name: 'Robert Fox',
    role: 'Marketing VP',
    email: 'robert@velocity.com',
    source: 'Referral',
    sourceIcon: <Users className="w-4 h-4" />,
    status: 'In Progress',
    statusColor: 'bg-amber-500/20 text-amber-400',
    assignedUser: 'Sarah Chen',
    assignedInitials: 'SC',
    assignedColor: 'bg-orange-500',
    avatar: 'https://picsum.photos/seed/robert/100/100'
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    role: 'Manager, TechFlow',
    email: 'elena.r@techflow.net',
    source: 'Cold Email',
    sourceIcon: <Mail className="w-4 h-4" />,
    status: 'New Lead',
    statusColor: 'bg-blue-500/20 text-blue-400',
    assignedUser: 'Harvey Specter',
    assignedInitials: 'HS',
    assignedColor: 'bg-rose-500',
    avatar: 'https://picsum.photos/seed/elena/100/100'
  }
];

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState('All Leads');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Rocket className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">NovaCRM</h2>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <span className="text-blue-400 font-semibold">Leads</span>
              <Link to="/deals" className="text-slate-400 hover:text-white transition-colors">Deals</Link>
              <Link to="/customers" className="text-slate-400 hover:text-white transition-colors">Contacts</Link>
              <Link to="/reports" className="text-slate-400 hover:text-white transition-colors">Reports</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:relative lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-56 pl-9 pr-4 py-2 bg-[#151921] border border-white/5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0E14]" />
              </button>
              <Link to="/settings" className="p-2 text-slate-400 hover:bg-white/5 rounded-xl transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <Link to="/settings" className="w-9 h-9 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                <img
                  src="https://picsum.photos/seed/alex/100/100"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-1"
          >
            <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
            <p className="text-slate-400 text-sm">
              Track and nurture your sales pipeline with real-time data.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold text-sm transition-all border border-white/10">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              Add Lead
            </button>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-[#151921] p-1 rounded-xl border border-white/5">
              {['All Leads', 'New', 'Qualified'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:bg-white/5 rounded-xl text-xs font-bold transition-all">
              <Filter className="w-3 h-3" />
              More Filters
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <button className="flex items-center gap-1 text-sm font-bold text-white">
              Date Created
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#151921] rounded-2xl border border-white/5 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Lead Source</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Assigned User</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {leadsData.map((lead, i) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={lead.avatar}
                            alt={lead.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-blue-500/20 transition-all"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-sm font-semibold group-hover:text-blue-400 transition-colors">
                              {lead.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              {lead.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <div className="flex items-center gap-2 font-medium">
                          <span className="text-slate-500">{lead.sourceIcon}</span>
                          {lead.source}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${lead.statusColor}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${lead.assignedColor} flex items-center justify-center text-[10px] text-white font-bold`}>
                            {lead.assignedInitials}
                          </div>
                          <span className="text-sm text-slate-300">
                            {lead.assignedUser}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-blue-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Showing <span className="font-bold text-white">1</span> to{' '}
                <span className="font-bold text-white">10</span> of{' '}
                <span className="font-bold text-white">248</span> leads
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Page size:</span>
                <select className="bg-[#0B0E14] border border-white/10 rounded-lg text-xs font-bold py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500/30">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, '...', 25].map((page, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${page === 1
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'hover:bg-white/5 text-slate-400'
                    } ${page === '...' ? 'cursor-default' : ''}`}
                >
                  {page}
                </button>
              ))}
              <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: 'Conversion Rate', value: '12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Pipeline Value', value: '$42.5k', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Avg. Response Time', value: '4.2d', icon: <Clock className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#151921] p-5 rounded-2xl border border-white/5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
