import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Search, RefreshCw, UserPlus, ToggleLeft, ToggleRight, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getTeamMembers, getAllUsers, toggleUserStatus } from '../services/api';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';

const roleColors = {
  admin:    { bg: 'var(--accent-violet-dim)', text: 'var(--accent-violet)' },
  manager:  { bg: 'var(--accent-blue-dim)',   text: 'var(--accent-blue)'   },
  employee: { bg: 'var(--accent-emerald-dim)', text: 'var(--accent-emerald)' },
};
const roleAvatarColors = {
  admin:    'var(--accent-violet)',
  manager:  'var(--accent-blue)',
  employee: 'var(--accent-emerald)',
};

/* ─── Confirm Status Modal ──────────────────────────────── */
function ConfirmStatusModal({ user, action, onClose, onConfirm, loading }) {
  const activating = action === 'activate';
  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="nova-card w-full max-w-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: activating ? 'var(--accent-emerald-dim)' : 'var(--accent-rose-dim)' }}>
                  {activating
                    ? <ToggleRight className="w-5 h-5" style={{ color: 'var(--accent-emerald)' }} />
                    : <ToggleLeft className="w-5 h-5" style={{ color: 'var(--accent-rose)' }} />
                  }
                </div>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {activating ? 'Activate User' : 'Deactivate User'}
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {activating ? 'Restore access' : 'Suspend access'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg"
                style={{ color: 'var(--text-tertiary)' }}>
                <X size={16} />
              </button>
            </div>

            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              {activating ? 'Activate' : 'Deactivate'}{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong>?{' '}
              {activating
                ? 'They will regain access to NovaCRM.'
                : 'They will lose access to NovaCRM immediately.'}
            </p>

            <div className="flex gap-3">
              <button onClick={onClose} disabled={loading}
                className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="flex-1 py-2 rounded-xl text-sm font-bold"
                style={{
                  background: activating ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                  color: '#fff',
                  opacity: loading ? 0.7 : 1,
                }}>
                {loading ? 'Updating…' : (activating ? 'Activate' : 'Deactivate')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function TeamsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusTarget, setStatusTarget] = useState(null); // { user, action: 'activate'|'deactivate' }
  const [toast, setToast] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 'admin';
  const isManager = currentUser.role === 'manager';
  const canToggle = isAdmin || isManager;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Admin uses /users (all), manager uses /users/team (employees + self)
      const data = isAdmin ? await getAllUsers() : await getTeamMembers();
      setUsers(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    fetchUsers();
  }, [navigate, fetchUsers]);

  const handleToggleStatus = (user) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    setStatusTarget({ user, action });
  };

  const confirmToggle = async () => {
    if (!statusTarget) return;
    setActionLoading(true);
    try {
      const newStatus = statusTarget.action === 'activate';
      await toggleUserStatus(statusTarget.user.id, newStatus);
      showToast(`${statusTarget.user.name} ${newStatus ? 'activated' : 'deactivated'} successfully`);
      setStatusTarget(null);
      await fetchUsers();
    } catch (err) {
      setError(err.message);
      setStatusTarget(null);
    } finally {
      setActionLoading(false);
    }
  };

  // Can this user perform a toggle on target?
  const canToggleTarget = (target) => {
    if (!canToggle) return false;
    if (target.id === currentUser.id) return false; // can't toggle yourself
    if (isAdmin) return true; // admin can toggle manager + employee
    if (isManager && target.role === 'employee') return true; // manager only toggles employees
    return false;
  };

  const filtered = users.filter(
    u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: 'Total Members', value: users.length, color: 'var(--text-primary)' },
    { label: 'Managers', value: users.filter(u => u.role === 'manager').length, color: 'var(--accent-blue)' },
    { label: 'Employees', value: users.filter(u => u.role === 'employee').length, color: 'var(--accent-emerald)' },
    { label: 'Active', value: users.filter(u => u.isActive).length, color: 'var(--accent-emerald)' },
    { label: 'Inactive', value: users.filter(u => !u.isActive).length, color: 'var(--accent-rose)' },
  ];

  return (
    <div className="glow-bg min-h-screen" style={{ background: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <SharedHeader />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-xl"
            style={{ background: 'var(--accent-emerald)', color: '#fff' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-blue)' }}>
                  Team Members
                </span>
              </div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Your Team</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {isAdmin ? 'All users registered in NovaCRM' : 'Employees you manage'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-disabled)' }} />
                <input
                  type="text"
                  placeholder="Search members…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="nova-input !pl-9 w-52 text-sm"
                />
              </div>
              <button onClick={fetchUsers} disabled={loading}
                className="p-2.5 rounded-xl transition-colors"
                style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {stats.map(stat => (
              <div key={stat.label} className="nova-card p-4 text-center">
                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Role hint */}
          {canToggle && (
            <div className="mb-5 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)' }}>
              <Shield size={12} style={{ color: 'var(--accent-blue)' }} />
              {isAdmin
                ? 'As Admin you can activate/deactivate managers and employees.'
                : 'As Manager you can activate/deactivate employees.'}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              style={{ background: 'var(--accent-rose-dim)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)30' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }} />
            </div>
          ) : (
            <div className="nova-card overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {['Member', 'Email', 'Role', 'Status', 'Joined', ...(canToggle ? ['Actions'] : [])].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={canToggle ? 6 : 5} className="px-6 py-12 text-center text-sm"
                        style={{ color: 'var(--text-disabled)' }}>
                        No team members found.
                      </td>
                    </tr>
                  ) : filtered.map((user, i) => {
                    const rColors = roleColors[user.role] || roleColors.employee;
                    const avatarColor = roleAvatarColors[user.role] || 'var(--accent-blue)';
                    const toggleAllowed = canToggleTarget(user);

                    return (
                      <motion.tr key={user.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="transition-colors"
                        style={{ borderBottom: '1px solid var(--border-subtle)', opacity: user.isActive ? 1 : 0.6 }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                        {/* Member */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                              style={{ background: avatarColor }}>
                              {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {user.name}
                              </div>
                              {user.id === currentUser.id && (
                                <div className="text-[10px] font-semibold" style={{ color: 'var(--accent-blue)' }}>You</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {user.email}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 w-fit"
                            style={{ background: rColors.bg, color: rColors.text }}>
                            <Shield className="w-3 h-3" />
                            {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full"
                            style={user.isActive
                              ? { background: 'var(--accent-emerald-dim)', color: 'var(--accent-emerald)' }
                              : { background: 'var(--accent-rose-dim)', color: 'var(--accent-rose)' }}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </td>

                        {/* Actions */}
                        {canToggle && (
                          <td className="px-6 py-4">
                            {toggleAllowed ? (
                              <button
                                onClick={() => handleToggleStatus(user)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                style={user.isActive
                                  ? { background: 'var(--accent-rose-dim)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)20' }
                                  : { background: 'var(--accent-emerald-dim)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald)20' }}>
                                {user.isActive
                                  ? <><ToggleLeft size={13} /> Deactivate</>
                                  : <><ToggleRight size={13} /> Activate</>
                                }
                              </button>
                            ) : (
                              <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>—</span>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Confirm Modal */}
      <ConfirmStatusModal
        user={statusTarget?.user}
        action={statusTarget?.action}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmToggle}
        loading={actionLoading}
      />
    </div>
  );
}
