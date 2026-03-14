import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Briefcase, DollarSign, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getDashboardSummary, getDashboardPipeline } from '../services/api';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';

const STAT_CARDS = [
  { key: 'totalLeads',      label: 'Active Leads',      icon: Users,      accent: 'blue',   accentVar: '--accent-blue',    dimVar: '--accent-blue-dim'    },
  { key: 'totalDeals',      label: 'Pipeline Deals',    icon: Briefcase,  accent: 'violet', accentVar: '--accent-violet',  dimVar: '--accent-violet-dim'  },
  { key: 'totalRevenue',    label: 'Total Revenue',     icon: DollarSign, accent: 'emerald',accentVar: '--accent-emerald', dimVar: '--accent-emerald-dim' },
  { key: 'closedWonDeals',  label: 'Closed Won',        icon: TrendingUp, accent: 'amber',  accentVar: '--accent-amber',   dimVar: '--accent-amber-dim'   },
];

function StatCard({ label, value, icon: Icon, accentVar, dimVar, delay }) {
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay, duration: 0.35, ease:[0.16,1,0.3,1] }}
      className="nova-card relative overflow-hidden p-5 flex flex-col gap-4 group"
      style={{ borderTop: `2px solid var(${accentVar})` }}>
      {/* ambient glow */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40 blur-2xl transition-all duration-500 group-hover:opacity-70"
        style={{ background: `var(${dimVar})` }} />
      <div className="flex items-center justify-between relative">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `var(${dimVar})` }}>
          <Icon className="w-4.5 h-4.5" style={{ color: `var(${accentVar})` }} size={18} />
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md" style={{ background: `var(${dimVar})`, color: `var(${accentVar})` }}>
          <ArrowUpRight size={11} />Live
        </div>
      </div>
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color:'var(--text-tertiary)' }}>{label}</p>
        <p className="text-3xl font-bold tracking-tight" style={{ color:'var(--text-primary)' }}>{value}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [summary,  setSummary]  = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    Promise.all([getDashboardSummary().catch(()=>null), getDashboardPipeline().catch(()=>null)])
      .then(([sum, pipe]) => {
        if (sum)  setSummary(sum.data);
        if (pipe) setPipeline(pipe.data || []);
        setLoading(false);
      });
  }, [navigate]);

  const chartData = pipeline.map(p => ({ name: p._id, revenue: p.revenue||0, deals: p.count||0 }));

  const gridColor  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';
  const tickColor  = isDark ? '#54637A' : '#94A3B8';
  const tooltipStyle = { backgroundColor: isDark?'#1A2233':'#ffffff', border:'none', borderRadius:10, color: isDark?'#F1F5FB':'#0F172A', fontSize:12, boxShadow:'0 8px 32px rgba(0,0,0,0.2)' };

  const formatValue = (key, val) => {
    if (key === 'totalRevenue') return `$${(val||0).toLocaleString()}`;
    return (val ?? (loading ? '…' : '—'));
  };

  return (
    <div className="glow-bg min-h-screen" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
      <SharedHeader />
      <main className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Welcome */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1" style={{ color:'var(--text-primary)' }}>
            Good {new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'},{' '}
            <span style={{ color:'var(--accent-blue)' }}>{currentUser.name?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-sm" style={{ color:'var(--text-secondary)' }}>Here's what's happening in your CRM today.</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((card, i) => (
            <StatCard key={card.key} {...card}
              value={loading ? '…' : formatValue(card.key, summary?.[card.key])}
              delay={i * 0.06}
            />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5">
          {/* Revenue Area — spans 3 cols */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}
            className="nova-card p-5 lg:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'var(--text-tertiary)' }}>Pipeline Revenue</p>
                <h2 className="text-base font-bold" style={{ color:'var(--text-primary)' }}>Revenue by Stage</h2>
              </div>
              {chartData.length > 0 && (
                <span className="badge badge-blue">Live</span>
              )}
            </div>
            {chartData.length === 0 ? (
              <div className="h-[240px] flex flex-col items-center justify-center gap-2" style={{ color:'var(--text-tertiary)' }}>
                <Briefcase size={32} className="opacity-20" />
                <p className="text-sm">No deal data yet</p>
                <p className="text-xs opacity-60">Add deals to see pipeline charts</p>
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#3B82F6" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0}    />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize:11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize:11 }} tickFormatter={v => v>=1000?`$${(v/1000).toFixed(0)}k`:`$${v}`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v=>[`$${v.toLocaleString()}`,'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Deals Bar — spans 2 cols */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.34 }}
            className="nova-card p-5 lg:col-span-2">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'var(--text-tertiary)' }}>Distribution</p>
              <h2 className="text-base font-bold" style={{ color:'var(--text-primary)' }}>Deals by Stage</h2>
            </div>
            {chartData.length === 0 ? (
              <div className="h-[240px] flex flex-col items-center justify-center gap-2" style={{ color:'var(--text-tertiary)' }}>
                <DollarSign size={32} className="opacity-20" />
                <p className="text-sm">No deals yet</p>
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize:10 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tickColor, fontSize:11 }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={v=>[v,'Deals']} />
                    <Bar dataKey="deals" fill="#8B5CF6" radius={[5,5,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>

        {/* Pipeline summary row */}
        {summary && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42 }}
            className="nova-card p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'var(--text-tertiary)' }}>Pipeline Breakdown</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label:'Total Leads',  val: summary.totalLeads,     accentVar:'--accent-blue',    dimVar:'--accent-blue-dim'    },
                { label:'Total Deals',  val: summary.totalDeals,     accentVar:'--accent-violet',  dimVar:'--accent-violet-dim'  },
                { label:'Closed Won',   val: summary.closedWonDeals, accentVar:'--accent-emerald', dimVar:'--accent-emerald-dim' },
                { label:'Closed Lost',  val: summary.closedLostDeals,accentVar:'--accent-rose',    dimVar:'--accent-rose-dim'    },
              ].map(item => (
                <div key={item.label} className="nova-card-inner p-4 text-center" style={{ background:'var(--bg-surface)' }}>
                  <p className="text-2xl font-bold mb-1" style={{ color:`var(${item.accentVar})` }}>{item.val ?? 0}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color:'var(--text-tertiary)' }}>{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
