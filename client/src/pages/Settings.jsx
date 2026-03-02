import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Rocket, Search, Bell, Settings as SettingsIcon, User, Shield, BellRing,
    Puzzle, CreditCard, LogOut, Camera, Monitor, Smartphone, ChevronDown,
    ExternalLink, Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

const sidebarItems = [
    { icon: User, label: 'Personal Information', id: 'personal' },
    { icon: Shield, label: 'Security & Privacy', id: 'security' },
    { icon: BellRing, label: 'Notifications', id: 'notifications' },
    { icon: Puzzle, label: 'Connected Apps', id: 'apps' },
    { icon: CreditCard, label: 'Billing & Plan', id: 'billing' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('personal');
    const navigate = useNavigate();

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
                        <Link to="/reports" className="hover:text-white transition-colors">Reports</Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:relative lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search leads, deals..."
                            className="bg-[#151921] border border-white/5 rounded-xl py-2 pl-9 pr-4 w-56 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors relative">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-xl bg-white/5 text-blue-400 transition-colors">
                        <SettingsIcon className="w-5 h-5" />
                    </button>
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10">
                        <img src="https://picsum.photos/seed/alex/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                </div>
            </nav>

            <div className="max-w-[1200px] mx-auto px-6 py-8 flex gap-8">
                {/* Sidebar */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-64 shrink-0"
                >
                    {/* Profile Card */}
                    <div className="text-center mb-8">
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <img
                                src="https://picsum.photos/seed/alex/200/200"
                                alt="Alex Rivera"
                                className="w-full h-full rounded-full object-cover border-2 border-white/10"
                                referrerPolicy="no-referrer"
                            />
                            <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#0B0E14] hover:bg-blue-500 transition-colors">
                                <Camera className="w-3 h-3" />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold">Alex Rivera</h3>
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">System Administrator</p>
                        <p className="text-xs text-slate-500 mt-2">Last login: 2 hours ago • New York, US</p>
                    </div>

                    {/* Nav Items */}
                    <div className="flex flex-col gap-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left ${activeTab === item.id
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all w-full"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 space-y-6"
                >
                    {/* Personal Details */}
                    <div className="bg-[#151921] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Personal Details</h3>
                                    <p className="text-xs text-slate-400">Manage your public information</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold transition-colors border border-white/10">
                                Save Changes
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Alex Rivera"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    defaultValue="alex.rivera@novacrm.com"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                                <input
                                    type="tel"
                                    defaultValue="+1 (555) 000-1234"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Timezone</label>
                                <div className="relative">
                                    <select className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all">
                                        <option>Eastern Time (US & Canada)</option>
                                        <option>Pacific Time (US & Canada)</option>
                                        <option>Central Time (US & Canada)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Short Bio</label>
                            <textarea
                                rows={3}
                                defaultValue="Administrator at NovaCRM focused on scaling sales operations and lead generation workflows."
                                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-[#151921] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Security Settings</h3>
                                <p className="text-xs text-slate-400">Update password and security preferences</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    defaultValue="12345678"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">New Password</label>
                                <input
                                    type="password"
                                    defaultValue="12345678"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Confirm Password</label>
                                <input
                                    type="password"
                                    defaultValue="12345678"
                                    className="w-full bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                            </div>
                        </div>

                        {/* 2FA */}
                        <div className="bg-[#0B0E14] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold">Two-Factor Authentication</h4>
                                    <p className="text-xs text-slate-400">Recommended for extra account security</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20">
                                Enable 2FA
                            </button>
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="bg-[#151921] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <Monitor className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Active Sessions</h3>
                                <p className="text-xs text-slate-400">Manage devices currently logged into your account</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 bg-[#0B0E14] border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">Chrome on macOS Monterey</p>
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">Current</span>
                                        </div>
                                        <p className="text-xs text-slate-500">New York, USA • 192.168.1.1</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-white transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-[#0B0E14] border border-white/5 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="text-sm font-semibold">NovaCRM App on iPhone 15 Pro</p>
                                        <p className="text-xs text-slate-500">London, UK • 172.16.254.1 • Active 15m ago</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-white transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <button className="w-full text-center text-xs font-bold text-red-400 hover:text-red-300 mt-4 transition-colors">
                            Log out of all other sessions
                        </button>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-[#151921] border border-red-500/20 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-red-400">Delete Account</h3>
                                <p className="text-xs text-slate-400">Permanently remove your account and all CRM data. This cannot be undone.</p>
                            </div>
                            <button className="px-4 py-2 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-bold transition-all">
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
