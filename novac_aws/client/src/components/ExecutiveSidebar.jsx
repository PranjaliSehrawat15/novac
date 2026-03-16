import React from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket, LayoutDashboard, UserPlus, Handshake,
  BarChart3, Users, Settings
} from 'lucide-react';
import { cn } from '../utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/executive', active: true },
  { icon: UserPlus, label: 'Leads', to: '/leads' },
  { icon: Handshake, label: 'Deals', to: '/deals' },
  { icon: BarChart3, label: 'Analytics', to: '/reports' },
  { icon: Users, label: 'Team', to: '/tasks' },
];

export function ExecutiveSidebar() {
  return (
    <aside className="w-20 h-screen flex flex-col items-center py-6 border-r border-white/5 bg-[#0B0E14] shrink-0">
      <Link to="/dashboard" className="mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">
          <Rocket className="w-5 h-5" />
        </div>
      </Link>

      <nav className="flex flex-col gap-4 flex-1">
        {navItems.map((item) => (
          <Link key={item.label} to={item.to} className="group relative">
            <button
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-xl transition-all',
                item.active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/5'
              )}
            >
              <item.icon className="w-5 h-5" />
            </button>
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <Link to="/settings" className="w-12 h-12 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-400 hover:bg-blue-500/5 transition-all">
          <Settings className="w-5 h-5" />
        </Link>
        <Link to="/settings" className="w-10 h-10 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden hover:border-blue-500 transition-colors">
          <img
            className="w-full h-full rounded-full object-cover"
            src="https://picsum.photos/seed/alex/100/100"
            alt="User avatar"
            referrerPolicy="no-referrer"
          />
        </Link>
      </div>
    </aside>
  );
}
