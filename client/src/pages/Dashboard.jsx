import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Settings,
  Plus,
  ChevronDown,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Rocket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { cn } from '../utils';

const chartData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const notifications = [
  {
    id: 1,
    title: 'New Lead Created',
    description: 'Sarah Jenkins added a new high-value lead: Global Tech Corp',
    time: '2m ago',
    type: 'lead',
    unread: true,
    icon: <Users className="w-4 h-4 text-blue-400" />,
    iconBg: 'bg-blue-500/20'
  },
  {
    id: 2,
    title: 'Deal Closed Successfully',
    description: 'The contract for Apollo Systems ($120k) has been signed.',
    time: '45m ago',
    type: 'deal',
    unread: true,
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    iconBg: 'bg-emerald-500/20'
  },
  {
    id: 3,
    title: 'Follow-up Reminder',
    description: 'Reminder to call Michael Chen regarding the Q4 proposal.',
    time: '2h ago',
    type: 'reminder',
    unread: false,
    icon: <Clock className="w-4 h-4 text-amber-400" />,
    iconBg: 'bg-amber-500/20'
  },
  {
    id: 4,
    title: 'System Maintenance',
    description: 'Scheduled maintenance will occur on Sunday at 2:00 AM UTC.',
    time: '5h ago',
    type: 'system',
    unread: false,
    icon: <AlertCircle className="w-4 h-4 text-slate-400" />,
    iconBg: 'bg-slate-500/20'
  }
];

const StatCard = ({ title, value, growth, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#151921] border border-white/5 p-6 rounded-2xl flex flex-col justify-between h-44 relative overflow-hidden group hover:border-white/10 transition-all"
  >
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/5 transition-colors" />
    <div className="flex justify-between items-start relative z-10">
      <div className="p-3 rounded-xl bg-white/5">
        <Icon className={cn('w-6 h-6', color)} />
      </div>
      {growth && (
        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-lg">
          <TrendingUp className="w-3 h-3" />
          {growth}
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

const NotificationItem = ({ item }) => (
  <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer group border-b border-white/5 last:border-0">
    <div className="flex gap-4">
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', item.iconBg)}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-sm font-semibold text-white truncate pr-4">{item.title}</h4>
          <span className="text-[10px] text-slate-500 whitespace-nowrap">{item.time}</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.description}</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-lg transition-colors">
            View Details
          </button>
          <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-semibold rounded-lg transition-colors">
            Dismiss
          </button>
        </div>
      </div>
      {item.unread && (
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      )}
    </div>
  </div>
);

export default function DashboardPage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="h-16 border-b border-white/5 px-6 flex items-center justify-between sticky top-0 bg-[#0B0E14]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="text-lg font-bold tracking-tight">NovaCRM</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link to="/leads" className="hover:text-white transition-colors">
              Leads
            </Link>
            <Link to="/deals" className="hover:text-white transition-colors">
              Deals
            </Link>
            <Link to="/customers" className="hover:text-white transition-colors">
              Contacts
            </Link>
            <Link to="/reports" className="hover:text-white transition-colors">
              Reports
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads, deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#151921] border border-white/5 rounded-xl py-2 pl-9 pr-4 w-64 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500/20 transition-all placeholder:text-slate-600"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95">
            <Plus className="w-4 h-4" />
            Create New
          </button>

          <div className="flex items-center gap-2 border-l border-white/10 pl-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                'p-2 rounded-xl transition-colors relative',
                showNotifications ? 'bg-blue-500/10 text-blue-400' : 'hover:bg-white/5 text-slate-400'
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B0E14]" />
            </button>
            <Link to="/settings" className="p-2 rounded-xl hover:bg-white/5 text-slate-400 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <Link to="/settings" className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 cursor-pointer hover:border-white/20 transition-colors ml-1">
              <img
                src="https://picsum.photos/seed/alex/100/100"
                alt="Profile"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>
        </div>
      </nav>

      <main className="p-6 max-w-[1400px] mx-auto relative">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Welcome back, Alex. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Active Leads"
            value="1,284"
            icon={Users}
            color="text-blue-400"
          />
          <StatCard
            title="Deals in Pipeline"
            value="42"
            icon={Briefcase}
            color="text-purple-400"
          />
          <StatCard
            title="Total Revenue"
            value="$242,500"
            growth="+8.2%"
            icon={DollarSign}
            color="text-emerald-400"
          />
          <StatCard
            title="Growth Rate"
            value="+12.4%"
            growth="+2.1%"
            icon={TrendingUp}
            color="text-rose-400"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#151921] border border-white/5 rounded-2xl p-6 min-h-[400px] relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold mb-0.5">Pipeline Velocity</h2>
                <p className="text-xs text-slate-400">Monthly performance tracking</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">Week</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors">Month</button>
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors">Year</button>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Notifications Dropdown Overlay */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-0 right-6 w-[400px] bg-[#1A1F29] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-[60] overflow-hidden"
            >
              <div className="p-5 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold">Notifications</h3>
                  <p className="text-xs text-slate-400">You have 3 unread updates</p>
                </div>
                <button className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                  Mark all as read
                </button>
              </div>

              <div className="flex px-5 border-b border-white/5">
                <button className="py-2.5 px-2 text-xs font-semibold text-white border-b-2 border-blue-500">All</button>
                <button className="py-2.5 px-3 text-xs font-semibold text-slate-500 hover:text-slate-300">Unread</button>
                <button className="py-2.5 px-3 text-xs font-semibold text-slate-500 hover:text-slate-300">Mentions</button>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map(item => (
                  <NotificationItem key={item.id} item={item} />
                ))}
              </div>

              <button className="w-full p-3 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 border-t border-white/5">
                View All Notifications
                <ChevronDown className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
