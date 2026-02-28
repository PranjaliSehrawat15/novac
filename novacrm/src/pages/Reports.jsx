import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Rocket, Search, Bell, Settings, ChevronLeft, ChevronRight,
    Calendar, TrendingUp, Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const conversionData = [
    { month: 'Jan', inbound: 30, outbound: 20 },
    { month: 'Feb', inbound: 45, outbound: 35 },
    { month: 'Mar', inbound: 35, outbound: 40 },
    { month: 'Apr', inbound: 50, outbound: 30 },
    { month: 'May', inbound: 60, outbound: 45 },
    { month: 'Jun', inbound: 40, outbound: 50 },
    { month: 'Jul', inbound: 55, outbound: 35 },
    { month: 'Aug', inbound: 70, outbound: 55 },
    { month: 'Sep', inbound: 65, outbound: 60 },
    { month: 'Oct', inbound: 75, outbound: 50 },
];

const revenueData = [
    { month: 'Jan', actual: 180, target: 200 },
    { month: 'Feb', actual: 220, target: 210 },
    { month: 'Mar', actual: 250, target: 220 },
    { month: 'Apr', actual: 240, target: 230 },
    { month: 'May', actual: 280, target: 250 },
    { month: 'Jun', actual: 310, target: 260 },
    { month: 'Jul', actual: 290, target: 270 },
    { month: 'Aug', actual: 340, target: 300 },
    { month: 'Sep', actual: 380, target: 320 },
    { month: 'Oct', actual: 350, target: 340 },
    { month: 'Nov', actual: 300, target: 350 },
    { month: 'Dec', actual: 280, target: 360 },
];

const leaderboardData = [
    { rank: 1, name: 'Sarah Jenkins', role: 'Senior Account Exec', region: 'North America', deals: 42, revenue: '$842,000', conversion: '32.4%', avatar: 'https://picsum.photos/seed/sarah/40/40' },
    { rank: 2, name: 'Marcus Thorne', role: 'Growth Specialist', region: 'Europe', deals: 38, revenue: '$715,200', conversion: '28.1%', avatar: 'https://picsum.photos/seed/marcus/40/40' },
    { rank: 3, name: 'Elena Rodriguez', role: 'Regional Manager', region: 'LATAM', deals: 31, revenue: '$650,400', conversion: '24.5%', avatar: 'https://picsum.photos/seed/elena/40/40' },
    { rank: 4, name: 'David Chen', role: 'Enterprise Sales', region: 'APAC', deals: 29, revenue: '$592,000', conversion: '21.8%', avatar: 'https://picsum.photos/seed/david/40/40' },
];

export default function ReportsPage() {
    const [dateRange] = useState('Oct 1, 2023 - Oct 31, 2023');

    return (
        <div className="min-h-screen bg-[#0B0E14] text-white font-sans">
            {/* Navigation */}
            <nav className="h-16 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 bg-[#0B0E14]/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-10">
                    <Link to="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                            <Rocket className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">NovaCRM</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                        <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                        <Link to="/leads" className="hover:text-white transition-colors">Leads</Link>
                        <Link to="/deals" className="hover:text-white transition-colors">Deals</Link>
                        <Link to="/tasks" className="hover:text-white transition-colors">Tasks</Link>
                        <span className="text-blue-400 font-semibold">Reports</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0E14]" />
                    </button>
                    <Link to="/settings" className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
                        <Settings className="w-5 h-5" />
                    </Link>
                    <Link to="/settings" className="w-9 h-9 rounded-full overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                        <img src="https://picsum.photos/seed/alex/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </Link>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <p className="text-slate-400 text-sm mb-1">
                            Visualizing real-time performance metrics, lead conversion cycles, and revenue growth targets across your organization.
                        </p>
                    </motion.div>
                    <div className="flex items-center gap-2 bg-[#151921] border border-white/5 rounded-xl px-4 py-2">
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Calendar size={14} className="text-blue-400" />
                            <span>{dateRange}</span>
                        </div>
                        <button className="text-slate-400 hover:text-white transition-colors">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Top Row: Conversion Chart + KPIs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Lead Conversion Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-[#151921] border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Lead Conversion Rate</h3>
                                <p className="text-xs text-slate-400">Comparing Inbound vs Outbound rates over the last 30 days</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-slate-400">Inbound</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-slate-400">Outbound</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={conversionData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: 12 }}
                                    />
                                    <Line type="monotone" dataKey="inbound" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                                    <Line type="monotone" dataKey="outbound" stroke="#10b981" strokeWidth={2.5} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* KPI Stack */}
                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 flex-1"
                        >
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-sm text-blue-100 font-medium mb-1">Annual Recurring Revenue</p>
                            <h2 className="text-3xl font-bold mb-2">$4,280,000</h2>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                                +12.4% vs last year
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#151921] border border-white/5 rounded-2xl p-6"
                        >
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4">
                                <Clock className="w-5 h-5 text-slate-400" />
                            </div>
                            <p className="text-sm text-slate-400 font-medium mb-1">Deal Velocity</p>
                            <h2 className="text-3xl font-bold mb-2">18.4 Days</h2>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Goal: 15.0 days</p>
                        </motion.div>
                    </div>
                </div>

                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-[#151921] border border-white/5 rounded-2xl p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Monthly Revenue vs Targets</h3>
                            <p className="text-xs text-slate-400">Revenue breakdown by product category vs monthly projections</p>
                        </div>
                        <select className="bg-[#0B0E14] border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500/30">
                            <option>Fiscal Year 2023</option>
                            <option>Fiscal Year 2022</option>
                        </select>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: 12 }} />
                                <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-[#151921] border border-white/5 rounded-2xl overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Employee Performance Leaderboard</h3>
                            <p className="text-xs text-slate-400">Ranking teams based on closed deals, revenue generated, and efficiency</p>
                        </div>
                        <button className="text-xs text-blue-400 font-semibold hover:text-blue-300 transition-colors">View All Teams</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                                    <th className="px-6 py-4 font-semibold">Rank</th>
                                    <th className="px-6 py-4 font-semibold">Employee</th>
                                    <th className="px-6 py-4 font-semibold">Region</th>
                                    <th className="px-6 py-4 font-semibold text-center">Deals Closed</th>
                                    <th className="px-6 py-4 font-semibold text-right">Revenue</th>
                                    <th className="px-6 py-4 font-semibold text-right">Conversion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {leaderboardData.map((emp) => (
                                    <tr key={emp.rank} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${emp.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                                                    emp.rank === 2 ? 'bg-slate-500/20 text-slate-300' :
                                                        emp.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                                                            'bg-white/5 text-slate-400'
                                                }`}>
                                                {emp.rank}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                                                <div>
                                                    <p className="text-sm font-semibold">{emp.name}</p>
                                                    <p className="text-xs text-slate-500">{emp.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-300">{emp.region}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-center">{emp.deals}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-emerald-400 text-right">{emp.revenue}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg">{emp.conversion}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
