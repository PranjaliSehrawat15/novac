import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Rocket, Search, Bell, Mail, LayoutDashboard, Users, Handshake,
    BarChart3, Settings, Plus, Phone, Building2, MapPin,
    FileText, ExternalLink, CheckCircle2, AtSign, Tag
} from 'lucide-react';
import { motion } from 'motion/react';

const activities = [
    {
        id: 1,
        type: 'deal',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        dotColor: 'bg-emerald-500',
        title: 'Deal Closed: Enterprise Expansion Q3',
        description: 'Project "Aurora" successfully finalized. Added 50 additional seats to the core platform and integrated AI modules.',
        value: '+$45,000',
        valueLabel: 'RECURRING',
        date: 'YESTERDAY, 4:12 PM',
        link: 'View Deal Details →',
    },
    {
        id: 2,
        type: 'email',
        icon: <Mail className="w-4 h-4 text-blue-400" />,
        dotColor: 'bg-blue-500',
        title: 'Email Sent: Contract Addendum',
        description: 'Sent the updated terms of service regarding data privacy compliance. Waiting for legal approval from Acme side.',
        date: 'Oct 14, 2023',
        attachment: 'addendum_v2.pdf',
    },
    {
        id: 3,
        type: 'call',
        icon: <Phone className="w-4 h-4 text-purple-400" />,
        dotColor: 'bg-purple-500',
        title: 'Outbound Call (14 mins)',
        description: 'Monthly sync with John. Discussed upcoming product roadmap and their interest in the Beta API.',
        date: 'Oct 12, 2023',
        tags: ['PRODUCT FEEDBACK', 'API ACCESS'],
    },
    {
        id: 4,
        type: 'note',
        icon: <FileText className="w-4 h-4 text-amber-400" />,
        dotColor: 'bg-amber-500',
        title: 'Internal Note',
        description: '"Company is planning a major move to Azure next quarter. Need to prepare migration toolkit documentation for their team ASAP." - Sarah J.',
        date: 'Oct 05, 2023',
        isNote: true,
    },
];

const sidebarNav = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Users, label: 'Customers', to: '/customers', active: true },
    { icon: Search, label: 'Leads', to: '/leads' },
    { icon: Handshake, label: 'Deals', to: '/deals' },
    { icon: BarChart3, label: 'Analytics', to: '/reports' },
];

export default function CustomerDetailPage() {
    const [activeFilter, setActiveFilter] = useState('All Activities');

    return (
        <div className="flex h-screen overflow-hidden bg-[#0B0E14] text-white font-sans">
            {/* Sidebar */}
            <aside className="w-56 border-r border-white/5 flex flex-col p-5 bg-[#0f1117] shrink-0">
                <Link to="/dashboard" className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-sm font-bold">NovaCRM</span>
                        <p className="text-[10px] text-slate-500">Premium SaaS</p>
                    </div>
                </Link>

                <nav className="flex flex-col gap-1 mt-6">
                    {sidebarNav.map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${item.active
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold px-3 mb-3">Preferences</p>
                    <Link
                        to="/settings"
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Link>
                </div>

                <div className="mt-auto">
                    <Link
                        to="/leads"
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all w-full justify-center shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        New Lead
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B0E14]/80 backdrop-blur-md shrink-0">
                    <h1 className="text-lg font-bold">Customer 360 Profile</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search interactions..."
                                className="bg-[#151921] border border-white/5 rounded-xl py-1.5 pl-9 pr-4 w-48 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 placeholder:text-slate-600"
                            />
                        </div>
                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors relative">
                            <Bell className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                            <Mail className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 ml-2">
                            <div className="text-right">
                                <p className="text-xs font-semibold">Alex Rivera</p>
                                <p className="text-[10px] text-slate-500">Account Manager</p>
                            </div>
                            <Link to="/settings" className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                <img src="https://picsum.photos/seed/alex/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Customer Header Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#151921] border border-white/5 rounded-2xl p-6"
                    >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                                    AC
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-bold">Acme Corp - Tech Solutions</h2>
                                        <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase">Enterprise</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <span>Customer since Jan 2022</span>
                                        <span>•</span>
                                        <span>Active Contract</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold transition-all">
                                    Edit Profile
                                </button>
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5">
                                    <Plus className="w-3 h-3" />
                                    Add Note
                                </button>
                            </div>

                            <div className="flex gap-6 ml-auto">
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Lifetime Value</p>
                                    <p className="text-2xl font-bold">$128,500</p>
                                    <p className="text-[10px] text-emerald-400 font-bold">↗ +12% vs LY</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Deals</p>
                                    <p className="text-2xl font-bold">04</p>
                                    <p className="text-[10px] text-slate-500">— No change</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Contact Details */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#151921] border border-white/5 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-5">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Contact Details</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Primary Contact</p>
                                        <p className="text-sm font-semibold">Johnathan Doe</p>
                                        <p className="text-xs text-slate-400">Chief Technology Officer</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Email Address</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm">j.doe@acmecorp.com</p>
                                            <button className="text-slate-500 hover:text-blue-400 transition-colors">
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Phone Number</p>
                                        <p className="text-sm">+1 (555) 234-8902</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Industry</p>
                                        <p className="text-sm">Cloud Infrastructure & AI</p>
                                    </div>
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Size</p>
                                            <p className="text-sm">500-1k</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Score</p>
                                            <p className="text-sm"><span className="text-emerald-400 font-bold">98</span> /100</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Headquarters */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-[#151921] border border-white/5 rounded-2xl p-6"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Headquarters</h3>
                                </div>
                                <div className="aspect-video bg-[#0B0E14] border border-white/5 rounded-xl mb-4 flex items-center justify-center">
                                    <div className="text-center text-slate-600">
                                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-xs">Map View</p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-300 leading-relaxed">
                                    <p>1200 Market Street, Suite 400</p>
                                    <p>San Francisco, CA 94103</p>
                                    <p>United States</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Lifecycle Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="lg:col-span-2 bg-[#151921] border border-white/5 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-blue-400" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Lifecycle Timeline</h3>
                                </div>
                                <div className="flex items-center gap-1 text-xs">
                                    {['All Activities', 'Calls', 'Emails', 'Deals'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilter(f)}
                                            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activeFilter === f
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative">
                                <div className="absolute left-3 top-0 bottom-0 w-px bg-white/5" />

                                <div className="space-y-6">
                                    {activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-4 relative">
                                            <div className={`w-2.5 h-2.5 rounded-full ${activity.dotColor} mt-2 relative z-10 ring-4 ring-[#151921]`} />
                                            <div className={`flex-1 ${activity.isNote ? 'bg-[#0B0E14] border border-white/5 rounded-xl p-4' : ''}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-2">
                                                        {activity.icon}
                                                        <h4 className="text-sm font-semibold">{activity.title}</h4>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 uppercase">{activity.date}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed mb-2">{activity.description}</p>

                                                {activity.value && (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-bold text-emerald-400">{activity.value}</span>
                                                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">{activity.valueLabel}</span>
                                                    </div>
                                                )}

                                                {activity.link && (
                                                    <button className="text-xs text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                                                        {activity.link}
                                                    </button>
                                                )}

                                                {activity.attachment && (
                                                    <div className="inline-flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 mt-1">
                                                        <FileText className="w-3 h-3" />
                                                        {activity.attachment}
                                                    </div>
                                                )}

                                                {activity.tags && (
                                                    <div className="flex gap-2 mt-1">
                                                        {activity.tags.map((tag) => (
                                                            <span key={tag} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-bold">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-6 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 ml-7">
                                    View older activities ↓
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
