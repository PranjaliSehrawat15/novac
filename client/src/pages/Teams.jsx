import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Users, Shield, Search, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { getAllUsers } from '../services/api';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';

const roleColors = {
  admin: 'bg-purple-500/20 text-purple-400',
  manager: 'bg-blue-500/20 text-blue-400',
  employee: 'bg-emerald-500/20 text-emerald-400',
};

const roleInitialColors = {
  admin: 'bg-purple-600',
  manager: 'bg-blue-600',
  employee: 'bg-emerald-600',
};

export default function TeamsPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllUsers();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen var(--bg-canvas) text-white font-sans">
      <SharedHeader />

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Team Members</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Your Team</h1>
              <p className="text-slate-400 text-sm mt-1">All users registered in NovaCRM</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="var(--bg-elevated) border border-[var(--border-subtle)] rounded-xl py-2 pl-9 pr-4 w-56 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                />
              </div>
              <button
                onClick={fetchUsers}
                className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Members', value: users.length, color: 'text-white' },
              { label: 'Managers', value: users.filter(u => u.role === 'manager').length, color: 'text-blue-400' },
              { label: 'Employees', value: users.filter(u => u.role === 'employee').length, color: 'text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="var(--bg-elevated) border border-[var(--border-subtle)] rounded-xl p-4 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 text-sm">{error}</p>
              {error.includes('Only admin') && (
                <p className="text-slate-500 text-xs mt-2">Only admins can view all team members.</p>
              )}
            </div>
          ) : (
            <div className="var(--bg-elevated) border border-[var(--border-subtle)] rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)]">
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Member</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Email</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                        No team members found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((user, i) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${roleInitialColors[user.role] || 'bg-slate-600'} flex items-center justify-center text-sm font-bold`}>
                              {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <span className="text-sm font-semibold">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit ${roleColors[user.role] || 'bg-white/10 text-slate-300'}`}>
                            <Shield className="w-3 h-3" />
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${user.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
