import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, TrendingUp, Users, DollarSign, Briefcase, Target, BarChart2, Award } from 'lucide-react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';
import { getDashboardSummary, getDashboardPipeline, getLeads, getDeals } from '../services/api';

const STAGE_COLORS = {
  'Prospect':    '#3b82f6',
  'Proposal':    '#8b5cf6',
  'Negotiation': '#f59e0b',
  'Closed Won':  '#10b981',
  'Closed Lost': '#ef4444',
};
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export default function ReportsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [summary, setSummary] = useState(null);
  const [pipeline, setPipeline] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    Promise.all([
      getDashboardSummary().catch(() => null),
      getDashboardPipeline().catch(() => null),
      getLeads().catch(() => []),
      getDeals().catch(() => ({ data: [] })),
    ]).then(([sum, pipe, leadsData, dealsData]) => {
      if (sum) setSummary(sum.data);
      if (pipe) setPipeline(pipe.data || []);
      setLeads(Array.isArray(leadsData) ? leadsData : leadsData?.data || []);
      setDeals(dealsData?.data || []);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  }, [navigate]);

  // Chart data
  const pipelineChartData = pipeline.map(p => ({
    name: p._id,
    revenue: p.revenue || 0,
    deals: p.count || 0,
    fill: STAGE_COLORS[p._id] || '#3b82f6',
  }));

  const leadStatusData = ['new', 'qualified', 'in-progress', 'converted', 'lost'].map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    value: leads.filter(l => l.status === status).length,
  })).filter(d => d.value > 0);

  // Tooltip style
  const tooltipStyle = {
    backgroundColor: isDark ? '#1a2235' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
    borderRadius: 10,
    color: isDark ? '#f1f5f9' : '#111827',
    fontSize: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  };
  const gridStroke = isDark ? 'rgba(255,255,255,0.04)' : '#f0f0f0';
  const tickFill = isDark ? '#475569' : '#9ca3af';

  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const kpiCards = summary ? [
    {
      label: 'Total Leads',
      value: summary.totalLeads || 0,
      icon: Users,
      color: 'var(--accent-blue)',
      dimColor: 'var(--accent-blue-dim)',
      display: String(summary.totalLeads || 0),
    },
    {
      label: 'Total Deals',
      value: summary.totalDeals || 0,
      icon: Briefcase,
      color: 'var(--accent-violet)',
      dimColor: 'var(--accent-violet-dim)',
      display: String(summary.totalDeals || 0),
    },
    {
      label: 'Total Revenue',
      value: summary.totalRevenue || 0,
      icon: DollarSign,
      color: 'var(--accent-emerald)',
      dimColor: 'var(--accent-emerald-dim)',
      display: `$${(summary.totalRevenue || 0).toLocaleString()}`,
    },
    {
      label: 'Pipeline Value',
      value: summary.pipelineValue || 0,
      icon: TrendingUp,
      color: 'var(--accent-amber)',
      dimColor: 'var(--accent-amber-dim)',
      display: `$${(summary.pipelineValue || 0).toLocaleString()}`,
    },
    {
      label: 'Closed Won',
      value: summary.closedWonDeals || 0,
      icon: Award,
      color: 'var(--accent-emerald)',
      dimColor: 'var(--accent-emerald-dim)',
      display: String(summary.closedWonDeals || 0),
    },
    {
      label: 'Win Rate',
      value: summary.winRate || 0,
      icon: Target,
      color: 'var(--accent-violet)',
      dimColor: 'var(--accent-violet-dim)',
      display: `${summary.winRate || 0}%`,
    },
  ] : [];

  return (
    <div className="glow-bg min-h-screen" style={{ background: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <SharedHeader activePage="reports" />

      <main className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-blue)' }}>
                Analytics
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Reports & Analytics
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Live performance metrics from your CRM database
            </p>
          </motion.div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <Calendar size={14} style={{ color: 'var(--accent-blue)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{today}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'var(--accent-rose-dim)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)30' }}>
            {error}
          </div>
        )}

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="nova-card p-5 h-28 animate-pulse" />
            ))}
          </div>
        ) : summary ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            {kpiCards.map((kpi, i) => (
              <motion.div key={kpi.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="nova-card p-5"
                style={{ borderTop: `2px solid ${kpi.color}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: kpi.dimColor }}>
                    <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                </div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{kpi.display}</h3>
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* Pipeline Revenue + Lead Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Pipeline Revenue Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 nova-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Pipeline Revenue by Stage
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  {pipelineChartData.length > 0 ? 'Live deal values from your CRM' : 'No deals in pipeline yet'}
                </p>
              </div>
            </div>
            {pipelineChartData.length === 0 ? (
              <div className="h-[240px] flex items-center justify-center flex-col gap-3"
                style={{ color: 'var(--text-disabled)' }}>
                <Briefcase className="w-10 h-10 opacity-20" />
                <p className="text-sm">No pipeline data yet</p>
                <p className="text-xs opacity-60">Add deals to see charts</p>
              </div>
            ) : (
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineChartData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fill: tickFill, fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fill: tickFill, fontSize: 11 }}
                      tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} />
                    <Tooltip contentStyle={tooltipStyle}
                      formatter={v => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {pipelineChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Lead Status Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="nova-card p-6">
            <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Lead Status</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
              {leads.length > 0 ? `${leads.length} leads total` : 'No leads yet'}
            </p>
            {leadStatusData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center flex-col gap-3"
                style={{ color: 'var(--text-disabled)' }}>
                <Users className="w-10 h-10 opacity-20" />
                <p className="text-sm">No leads yet</p>
              </div>
            ) : (
              <>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={leadStatusData} cx="50%" cy="50%"
                        innerRadius={45} outerRadius={72}
                        paddingAngle={4} dataKey="value">
                        {leadStatusData.map((entry, index) => (
                          <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  {leadStatusData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Deals Per Stage Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="nova-card p-6 mb-6">
          <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>Deals per Stage</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--text-tertiary)' }}>
            {pipelineChartData.length > 0 ? 'Count of deals in each pipeline stage' : 'No deals added yet'}
          </p>
          {pipelineChartData.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center flex-col gap-3"
              style={{ color: 'var(--text-disabled)' }}>
              <DollarSign className="w-10 h-10 opacity-20" />
              <p className="text-sm">No deal data available</p>
              <p className="text-xs opacity-60">Add deals to your pipeline to see this chart</p>
            </div>
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineChartData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: tickFill, fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fill: tickFill, fontSize: 11 }}
                    allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Deals']} />
                  <Bar dataKey="deals" radius={[6, 6, 0, 0]}>
                    {pipelineChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Pipeline Breakdown Table */}
        {pipelineChartData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="nova-card overflow-hidden">
            <div className="px-6 py-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Pipeline Breakdown</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                Revenue and deal count per stage
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {['Stage', 'Deal Count', 'Revenue', 'Avg Deal Size', '% of Total Revenue'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const grandTotal = pipelineChartData.reduce((s, r) => s + r.revenue, 0);
                    return pipelineChartData.map((row) => {
                      const stageColor = STAGE_COLORS[row.name] || '#3b82f6';
                      const pct = grandTotal > 0 ? ((row.revenue / grandTotal) * 100).toFixed(1) : '0.0';
                      return (
                        <tr key={row.name}
                          className="transition-colors"
                          style={{ borderBottom: '1px solid var(--border-subtle)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stageColor }} />
                              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {row.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                            {row.deals}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: 'var(--accent-emerald)' }}>
                            ${row.revenue.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-right" style={{ color: 'var(--text-secondary)' }}>
                            {row.deals > 0 ? `$${Math.round(row.revenue / row.deals).toLocaleString()}` : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-right" style={{ color: 'var(--text-tertiary)' }}>
                            {pct}%
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-surface)' }}>
                    <td className="px-6 py-4 text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-tertiary)' }}>
                      Total
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                      {pipelineChartData.reduce((s, r) => s + r.deals, 0)}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: 'var(--accent-emerald)' }}>
                      ${pipelineChartData.reduce((s, r) => s + r.revenue, 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: 'var(--text-primary)' }}>
                      {pipelineChartData.reduce((s, r) => s + r.deals, 0) > 0
                        ? `$${Math.round(pipelineChartData.reduce((s, r) => s + r.revenue, 0) / pipelineChartData.reduce((s, r) => s + r.deals, 0)).toLocaleString()}`
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right" style={{ color: 'var(--text-primary)' }}>
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
