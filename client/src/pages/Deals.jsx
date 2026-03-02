import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Rocket, Search, Bell, Settings, Plus, Filter,
    MoreVertical, Calendar, LayoutGrid, List,
    Zap
} from 'lucide-react';
import { motion } from 'motion/react';

const dealsData = {
    prospect: {
        label: 'Prospect',
        color: 'border-blue-500',
        dotColor: 'bg-blue-500',
        total: '$145,000',
        deals: [
            {
                id: 1,
                title: 'Enterprise Cloud Migration',
                value: '$54,200',
                company: 'Global Systems',
                avatar: 'https://picsum.photos/seed/gs/40/40',
                date: 'OCT 24',
            },
            {
                id: 2,
                title: 'Q4 Software Licensing',
                value: '$12,500',
                company: 'Acme Corp',
                avatar: 'https://picsum.photos/seed/ac/40/40',
                date: 'NOV 02',
            },
        ],
    },
    negotiation: {
        label: 'Negotiation',
        color: 'border-amber-500',
        dotColor: 'bg-amber-500',
        total: '$320,000',
        deals: [
            {
                id: 3,
                title: 'Mobile App Dev Phase 1',
                value: '$210,000',
                company: 'Innovate Inc',
                avatar: 'https://picsum.photos/seed/ii/40/40',
                date: null,
                urgent: true,
                progress: 75,
            },
        ],
    },
    closedWon: {
        label: 'Closed Won',
        color: 'border-emerald-500',
        dotColor: 'bg-emerald-500',
        total: '$1.2M',
        deals: [
            {
                id: 4,
                title: 'Cyber Security Audit',
                value: '$85,000',
                company: 'Nexus Retail',
                avatar: 'https://picsum.photos/seed/nr/40/40',
                completed: true,
            },
            {
                id: 5,
                title: 'Annual Support Plan',
                value: '$14,000',
                company: 'Skyline Logics',
                avatar: 'https://picsum.photos/seed/sl/40/40',
                completed: true,
            },
        ],
    },
    closedLost: {
        label: 'Closed Lost',
        color: 'border-red-500',
        dotColor: 'bg-red-500',
        total: '$32,000',
        deals: [
            {
                id: 6,
                title: 'Legacy Database Restructure',
                value: '$32,000',
                company: 'Old Tech Ltd',
                avatar: 'https://picsum.photos/seed/ot/40/40',
                lost: true,
            },
        ],
    },
};

const DealCard = ({ deal }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-[#151921] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer group ${deal.lost ? 'opacity-60' : ''
            }`}
    >
        <div className="flex justify-between items-start mb-3">
            <h4 className="text-sm font-semibold text-white leading-snug pr-2">{deal.title}</h4>
            <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={16} />
            </button>
        </div>

        <p className={`text-lg font-bold mb-3 ${deal.lost ? 'text-red-400' : deal.completed ? 'text-emerald-400' : 'text-blue-400'
            }`}>
            {deal.value}
        </p>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <img
                    src={deal.avatar}
                    alt={deal.company}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                />
                <span className="text-xs text-slate-400 font-medium">{deal.company}</span>
            </div>
            {deal.date && (
                <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                    <Calendar size={10} />
                    <span>{deal.date}</span>
                </div>
            )}
            {deal.urgent && (
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-bold">
                    Urgent
                </span>
            )}
            {deal.completed && (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>

        {deal.progress && (
            <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deal.progress}%` }}
                    className="h-full bg-amber-500 rounded-full"
                />
            </div>
        )}
    </motion.div>
);

const DealColumn = ({ stage }) => (
    <div className="flex-1 min-w-[260px]">
        <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${stage.color}`}>
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{stage.label}</h3>
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-full font-bold">
                    {stage.deals.length}
                </span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{stage.total}</span>
        </div>
        <div className="flex flex-col gap-3">
            {stage.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
            ))}
        </div>
    </div>
);

export default function DealsPage() {
    const [view, setView] = useState('kanban');
    const [activeFilter, setActiveFilter] = useState('All Deals');

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
                        <span className="text-blue-400 font-semibold">Deals</span>
                        <Link to="/leads" className="hover:text-white transition-colors">Leads</Link>
                        <Link to="/tasks" className="hover:text-white transition-colors">Tasks</Link>
                        <Link to="/reports" className="hover:text-white transition-colors">Reports</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:relative lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="bg-[#151921] border border-white/5 rounded-xl py-2 pl-9 pr-4 w-56 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                        />
                    </div>
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
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-blue-400" />
                            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sales Pipeline</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight mb-1">Deals Pipeline</h1>
                        <p className="text-slate-400 text-sm">Track and manage your high-value opportunities across stages.</p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95">
                            <Plus className="w-4 h-4" />
                            Create Deal
                        </button>
                        <button className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 transition-colors">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* View Toggle & Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-1 bg-[#151921] p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setView('kanban')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${view === 'kanban' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <LayoutGrid size={14} />
                            Kanban
                        </button>
                        <button
                            onClick={() => setView('table')}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${view === 'table' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <List size={14} />
                            Table
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        {['All Deals (19)', 'My Deals', 'High Value', 'Closing Soon'].map((f, i) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${i === 0 ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {Object.values(dealsData).map((stage) => (
                        <DealColumn key={stage.label} stage={stage} />
                    ))}
                </div>
            </main>

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
            </div>
        </div>
    );
}
