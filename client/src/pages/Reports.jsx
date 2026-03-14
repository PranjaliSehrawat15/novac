import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Calendar, TrendingUp, Clock,
    Users, DollarSign, Briefcase
} from 'lucide-react';
import { motion } from 'motion/react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';
import { getDashboardSummary, getDashboardPipeline, getLeads, getDeals } from '../services/api';

export default function ReportsPage() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [summary, setSummary] = useState(null);
    const [pipeline, setPipeline] = useState([]);
    const [leads, setLeads] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setLeads(Array.isArray(leadsData) ? leadsData : []);
            setDeals(dealsData?.data || []);
            setLoading(false);
        });
    }, [navigate]);

    // Pipeline chart data from real DB
    const pipelineChartData = pipeline.map(p => ({
        name: p._id,
        revenue: p.revenue || 0,
        deals: p.count || 0,
    }));

    // Lead status breakdown
    const leadStatusData = ['new', 'qualified', 'in-progress', 'converted', 'lost'].map(status => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
        value: leads.filter(l => l.status === status).length,
    })).filter(d => d.value > 0);

    // Deals by stage for bar chart
    const dealStageData = pipeline.map(p => ({
        name: p._id,
        count: p.count || 0,
        revenue: p.revenue || 0,
    }));

    const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

    const bg = '';
    const textPrimary = '';
    const textMuted = '';
    const cardBg = '';
    const tooltipStyle = {
        backgroundColor: isDark ? '#1e293b' : '#fff',
        border: 'none',
        borderRadius: '8px',
        color: isDark ? '#fff' : '#111',
        fontSize: 12,
    };
    const gridStroke = isDark ? '#ffffff08' : '#f0f0f0';
    const tickFill = isDark ? '#64748b' : '#9ca3af';

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="glow-bg min-h-screen" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
            <SharedHeader activePage="reports" />

            <main className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className={`text-3xl font-bold tracking-tight mb-1 ${textPrimary}`}>Reports & Analytics</h1>
                        <p className={`${textMuted} text-sm`}>
                            Live performance metrics from your CRM database
                        </p>
                    </motion.div>
                    <div className={`flex items-center gap-2 ${isDark ? 'bg-[#151921] border-white/5' : 'bg-white border-gray-200'} border rounded-xl px-4 py-2`}>
                        <Calendar size={14} className="text-blue-400" />
                        <span className={`text-sm font-medium ${textPrimary}`}>{today}</span>
                    </div>
                </div>

                {/* Summary KPI Cards */}
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {[1,2,3,4].map(i => (
                            <div key={i} className={`border ${cardBg} rounded-2xl p-6 h-32 animate-pulse`}>
                                <div className={`h-4 w-20 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded mb-3`} />
                                <div className={`h-8 w-28 ${isDark ? 'bg-white/10' : 'bg-gray-200'} rounded`} />
                            </div>
                        ))}
                    </div>
                ) : summary ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {[
                            { label: 'Total Leads', value: summary.totalLeads, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { label: 'Total Deals', value: summary.totalDeals, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                            { label: 'Closed Won', value: summary.closedWonDeals, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'Total Revenue', value: `$${(summary.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        ].map((kpi, i) => (
                            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className={`border ${cardBg} rounded-2xl p-6`}>
                                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
                                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                                </div>
                                <p className={`text-xs font-semibold ${textMuted} mb-1`}>{kpi.label}</p>
                                <h3 className={`text-2xl font-bold ${textPrimary}`}>{kpi.value}</h3>
                            </motion.div>
                        ))}
                    </div>
                ) : null}

                {/* Pipeline Revenue + Lead Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Pipeline Revenue Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className={`lg:col-span-2 border ${cardBg} rounded-2xl p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className={`text-lg font-bold ${textPrimary}`}>Pipeline Revenue by Stage</h3>
                                <p className={`text-xs ${textMuted}`}>
                                    {pipelineChartData.length > 0 ? 'Live data from your CRM' : 'No deals in pipeline yet'}
                                </p>
                            </div>
                        </div>
                        {pipelineChartData.length === 0 ? (
                            <div className={`h-[250px] flex items-center justify-center ${textMuted}`}>
                                <div className="text-center">
                                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No pipeline data yet</p>
                                    <p className="text-xs mt-1 opacity-60">Add deals to see charts</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={pipelineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 11 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 11 }}
                                            tickFormatter={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} />
                                        <Tooltip contentStyle={tooltipStyle} formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                                        <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </motion.div>

                    {/* Lead Status Pie */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className={`border ${cardBg} rounded-2xl p-6`}>
                        <h3 className={`text-lg font-bold ${textPrimary} mb-1`}>Lead Status</h3>
                        <p className={`text-xs ${textMuted} mb-4`}>
                            {leads.length > 0 ? `${leads.length} leads total` : 'No leads yet'}
                        </p>
                        {leadStatusData.length === 0 ? (
                            <div className={`h-[200px] flex items-center justify-center ${textMuted}`}>
                                <div className="text-center">
                                    <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No leads yet</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="h-[180px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                                                paddingAngle={4} dataKey="value">
                                                {leadStatusData.map((entry, index) => (
                                                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={tooltipStyle} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                    {leadStatusData.map((item, i) => (
                                        <div key={item.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                <span className={`text-xs ${textMuted}`}>{item.name}</span>
                                            </div>
                                            <span className={`text-xs font-bold ${textPrimary}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Deals Count by Stage */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className={`border ${cardBg} rounded-2xl p-6 mb-6`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`text-lg font-bold ${textPrimary}`}>Deals per Stage</h3>
                            <p className={`text-xs ${textMuted}`}>
                                {dealStageData.length > 0 ? 'Count of deals in each pipeline stage' : 'No deals added yet'}
                            </p>
                        </div>
                    </div>
                    {dealStageData.length === 0 ? (
                        <div className={`h-[200px] flex items-center justify-center ${textMuted}`}>
                            <div className="text-center">
                                <DollarSign className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No deal data available</p>
                                <p className="text-xs mt-1 opacity-60">Add deals to your pipeline to see this chart</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dealStageData} barSize={32}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: tickFill, fontSize: 11 }} />
                                    <Tooltip contentStyle={tooltipStyle} formatter={v => [v, 'Deals']} />
                                    <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </motion.div>

                {/* Pipeline Table */}
                {dealStageData.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className={`border ${cardBg} rounded-2xl overflow-hidden`}>
                        <div className={`px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                            <h3 className={`text-lg font-bold ${textPrimary}`}>Pipeline Breakdown</h3>
                            <p className={`text-xs ${textMuted}`}>Revenue and deal count per stage from your database</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className={`text-[10px] ${textMuted} uppercase tracking-widest border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                        <th className="px-6 py-4 font-semibold">Stage</th>
                                        <th className="px-6 py-4 font-semibold text-center">Deal Count</th>
                                        <th className="px-6 py-4 font-semibold text-right">Revenue</th>
                                        <th className="px-6 py-4 font-semibold text-right">Avg Deal Size</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-gray-100'}`}>
                                    {dealStageData.map((row) => (
                                        <tr key={row.name} className={`${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'} transition-colors`}>
                                            <td className={`px-6 py-4 text-sm font-semibold ${textPrimary}`}>{row.name}</td>
                                            <td className={`px-6 py-4 text-sm text-center ${textMuted}`}>{row.count}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-emerald-400 text-right">
                                                ${row.revenue.toLocaleString()}
                                            </td>
                                            <td className={`px-6 py-4 text-sm text-right ${textMuted}`}>
                                                {row.count > 0 ? `$${Math.round(row.revenue / row.count).toLocaleString()}` : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
