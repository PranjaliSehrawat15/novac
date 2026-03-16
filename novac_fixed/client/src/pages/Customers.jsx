import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Download, UserPlus, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Edit2, MoreVertical, User, TrendingUp, Users, DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';
import { getLeads, getDeals, getDashboardSummary } from '../services/api';

// Deterministic color per initial letter
const AVATAR_COLORS = [
  'bg-blue-600','bg-emerald-600','bg-purple-600','bg-amber-600',
  'bg-rose-600','bg-cyan-600','bg-indigo-600','bg-teal-600',
];
function avatarColor(str) {
  const i = (str?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

const STAGE_COLORS = {
  Loyal:    'bg-emerald-500/20 text-emerald-400',
  Active:   'bg-blue-500/20 text-blue-400',
  'At Risk':'bg-red-500/20 text-red-400',
};
const STAGE_DOTS = {
  Loyal:    'bg-emerald-500',
  Active:   'bg-blue-500',
  'At Risk':'bg-red-500',
};

function statusToStage(status) {
  if (status === 'converted') return 'Loyal';
  if (status === 'qualified') return 'Active';
  if (status === 'lost')      return 'At Risk';
  return 'Active';
}

export default function CustomersPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [leads,   setLeads]   = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [segment, setSegment] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    Promise.all([
      getLeads().catch(() => []),
      getDashboardSummary().catch(() => null),
    ]).then(([leadsData, sum]) => {
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      if (sum) setSummary(sum.data);
      setLoading(false);
    });
  }, [navigate]);

  // Map all leads that have a company or converted status
  const customers = leads.map(l => ({
    id:             l.id,
    name:           l.company || l.name || '—',
    initials:       (l.company || l.name || '?').substring(0, 2).toUpperCase(),
    color:          avatarColor(l.company || l.name),
    contact:        l.name,
    email:          l.email,
    domain:         l.email ? l.email.split('@')[1] : '—',
    stage:          statusToStage(l.status),
    lastActivity:   l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—',
    activityDetail: l.notes ? l.notes.slice(0, 40) : `Status: ${l.status || 'new'}`,
  }));

  const filtered = customers.filter(c => {
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.contact?.toLowerCase().includes(search.toLowerCase()) ||
      c.domain?.toLowerCase().includes(search.toLowerCase());
    const matchSeg = segment === 'All' ||
      (segment === 'Loyal'    && c.stage === 'Loyal')   ||
      (segment === 'Active'   && c.stage === 'Active')  ||
      (segment === 'At Risk'  && c.stage === 'At Risk');
    return matchSearch && matchSeg;
  });

  // ── Styles ───────────────────────────────────────────────────────────────
  const bg = '';
  const textMain = '';
  const textMuted = '';
  const cardBg = '';
  const filterBg = '';
  const rowHover = '';
  const divider = '';
  const thStyle = 'px-6 py-4 text-[10px] font-bold uppercase tracking-widest';

  return (
    <div className="glow-bg min-h-screen flex flex-col" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
      <SharedHeader activePage="customers" />

      <main className="max-w-[1400px] mx-auto px-6 py-8 w-full flex flex-col gap-6">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className={`text-3xl font-bold tracking-tight ${textMain}`}>Contacts</h1>
            <p className={`${textMuted} text-sm mt-1`}>
              {loading ? 'Loading…' : `${customers.length} contacts from your CRM`}
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <div className={`relative hidden md:block`}>
              <input
                type="text"
                placeholder="Search contacts…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`${isDark ? 'bg-[#151921] border-white/5 text-white placeholder:text-slate-600' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'} border rounded-xl pl-4 pr-4 py-2 w-52 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all`}
              />
            </div>
            <Link to="/leads"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
              <UserPlus size={15} />
              Add Lead
            </Link>
          </div>
        </div>

        {/* Segment Filter Bar */}
        <div className={`flex flex-wrap items-center gap-2 p-1.5 ${filterBg} border rounded-xl`}>
          <div className={`flex items-center gap-2 px-3 ${textMuted}`}>
            <Filter size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Filter</span>
          </div>
          {['All', 'Loyal', 'Active', 'At Risk'].map(seg => (
            <button key={seg}
              onClick={() => setSegment(seg)}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
                segment === seg
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
              }`}>
              {seg}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`border ${cardBg} rounded-2xl overflow-hidden`}>
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className={`${textMuted} text-sm mt-4`}>Loading contacts…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Users className={`w-10 h-10 mx-auto mb-4 opacity-20 ${textMuted}`} />
              <p className={`${textMain} font-semibold`}>No contacts found</p>
              <p className={`${textMuted} text-sm mt-1`}>
                {search ? 'Try a different search term' : 'Add leads to populate this page'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                    <th className={thStyle}>Contact</th>
                    <th className={thStyle}>Email</th>
                    <th className={thStyle}>Stage</th>
                    <th className={thStyle}>Last Activity</th>
                    <th className={`${thStyle} text-center`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${divider}`}>
                  {filtered.map((c, idx) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`${rowHover} transition-colors group`}
                    >
                      <td className="px-6 py-4">
                        <Link to={`/customers/${c.id}`} className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-xs font-bold">{c.initials}</span>
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${textMain} group-hover:text-blue-400 transition-colors`}>{c.name}</p>
                            <p className={`text-xs ${textMuted}`}>{c.domain}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <User className="text-blue-400" size={11} />
                          </div>
                          <span className={`text-sm ${textMuted} truncate max-w-[160px]`}>{c.contact}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${STAGE_COLORS[c.stage]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STAGE_DOTS[c.stage]}`} />
                          {c.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`text-sm ${textMain}`}>{c.lastActivity}</p>
                        <p className={`text-xs ${textMuted} truncate max-w-[180px]`}>{c.activityDetail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1">
                          <Link to={`/customers/${c.id}`}
                            className={`p-2 rounded-lg transition-all ${textMuted} hover:text-blue-400 ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50'}`}>
                            <Edit2 size={14} />
                          </Link>
                          <button className={`p-2 rounded-lg transition-all ${textMuted} hover:text-white ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className={`px-6 py-3 border-t ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
              <p className={`text-sm ${textMuted}`}>
                Showing <span className={`font-bold ${textMain}`}>{filtered.length}</span> of {customers.length} contacts
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Leads',   value: summary.totalLeads,    icon: Users,      color: 'text-blue-400',    bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
              { label: 'Total Deals',   value: summary.totalDeals,    icon: DollarSign, color: 'text-purple-400',  bg: isDark ? 'bg-purple-500/10': 'bg-purple-50' },
              { label: 'Closed Won',    value: summary.closedWonDeals,icon: TrendingUp, color: 'text-emerald-400', bg: isDark ? 'bg-emerald-500/10':'bg-emerald-50' },
              { label: 'Revenue',       value: `$${(summary.totalRevenue||0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-400', bg: isDark ? 'bg-amber-500/10' : 'bg-amber-50' },
            ].map(kpi => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className={`border ${cardBg} rounded-2xl p-5 flex items-center gap-4`}>
                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className={`text-xs font-semibold ${textMuted}`}>{kpi.label}</p>
                  <p className={`text-xl font-bold ${textMain}`}>{kpi.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
