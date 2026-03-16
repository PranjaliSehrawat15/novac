import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MoreVertical, Calendar, LayoutGrid, List, Zap, Plus,
  X, ChevronDown, Pencil, Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getDeals, createDeal, updateDeal, deleteDeal, getLeads, getAllUsers } from '../services/api';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';

const STAGES = ['Prospect', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const STAGE_CFG = {
  'Prospect':    { accentVar: '--accent-blue',    dimVar: '--accent-blue-dim',    badgeCls: 'badge-blue'   },
  'Proposal':    { accentVar: '--accent-violet',  dimVar: '--accent-violet-dim',  badgeCls: 'badge-violet' },
  'Negotiation': { accentVar: '--accent-amber',   dimVar: '--accent-amber-dim',   badgeCls: 'badge-amber'  },
  'Closed Won':  { accentVar: '--accent-emerald', dimVar: '--accent-emerald-dim', badgeCls: 'badge-green'  },
  'Closed Lost': { accentVar: '--accent-rose',    dimVar: '--accent-rose-dim',    badgeCls: 'badge-rose'   },
};

const EMPTY_FORM = {
  title: '', value: '', stage: 'Prospect', status: 'open',
  lead: '', assignedTo: '', expectedClosedDate: '',
};

/* ─── Deal Card ─────────────────────────────────────────── */
function DealCard({ deal, currentUserRole, onEdit, onDelete }) {
  const cfg = STAGE_CFG[deal.stage] || STAGE_CFG['Prospect'];
  const [menuOpen, setMenuOpen] = useState(false);
  const canEdit = currentUserRole === 'admin' || currentUserRole === 'manager';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="nova-card p-4 cursor-pointer group transition-all relative"
      style={{
        opacity: deal.stage === 'Closed Lost' ? 0.65 : 1,
        borderLeft: `3px solid var(${cfg.accentVar})`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = `0 4px 20px var(${cfg.dimVar})`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-semibold leading-snug pr-2" style={{ color: 'var(--text-primary)' }}>
          {deal.title}
        </h4>
        {canEdit && (
          <div className="relative">
            <button
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: 'var(--text-tertiary)' }}
              onClick={() => setMenuOpen(o => !o)}
            >
              <MoreVertical size={14} />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="absolute right-0 top-6 z-20 nova-card py-1 min-w-[130px] shadow-xl"
                  style={{ border: '1px solid var(--border-subtle)' }}
                >
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onClick={() => { setMenuOpen(false); onEdit(deal); }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  {currentUserRole === 'admin' && (
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium transition-colors"
                      style={{ color: 'var(--accent-rose)' }}
                      onClick={() => { setMenuOpen(false); onDelete(deal); }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <p className="text-xl font-bold mb-3" style={{ color: `var(${cfg.accentVar})` }}>
        ${(Number(deal.value) || 0).toLocaleString()}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
            style={{ background: `var(${cfg.dimVar})`, color: `var(${cfg.accentVar})` }}
          >
            {(deal.title || '?').charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {deal.status || 'open'}
          </span>
        </div>
        {deal.expectedClosedDate && (
          <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
            <Calendar size={9} />
            {new Date(deal.expectedClosedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Deal Form Modal ───────────────────────────────────── */
function DealModal({ isOpen, onClose, onSave, initialData, leads, users, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        value: initialData.value || '',
        stage: initialData.stage || 'Prospect',
        status: initialData.status || 'open',
        lead: (initialData.lead || '').replace('LEAD#', ''),
        assignedTo: (initialData.assignedTo || '').replace('USER#', ''),
        expectedClosedDate: initialData.expectedClosedDate
          ? initialData.expectedClosedDate.split('T')[0]
          : '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError('');
  }, [initialData, isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError('Title is required');
    if (!form.value || isNaN(Number(form.value))) return setError('Enter a valid deal value');
    if (!form.lead) return setError('Please select a lead');
    setError('');
    await onSave(form);
  };

  const inputStyle = {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    borderRadius: 10,
    padding: '9px 12px',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  };
  const labelStyle = { color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5, display: 'block' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="nova-card w-full max-w-lg p-6 relative overflow-y-auto"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {initialData ? 'Edit Deal' : 'Create New Deal'}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  {initialData ? 'Update deal details' : 'Add a new deal to your pipeline'}
                </p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2"
                style={{ background: 'var(--accent-rose-dim)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)30' }}>
                <AlertTriangle size={13} /> {error}
              </div>
            )}

            {/* Form */}
            <div className="flex flex-col gap-4">
              <div>
                <label style={labelStyle}>Deal Title *</label>
                <input style={inputStyle} placeholder="e.g. Enterprise License Q4" value={form.title}
                  onChange={e => set('title', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Value ($) *</label>
                  <input style={inputStyle} type="number" min="0" placeholder="e.g. 25000"
                    value={form.value} onChange={e => set('value', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="open">Open</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Pipeline Stage *</label>
                <select style={inputStyle} value={form.stage} onChange={e => set('stage', e.target.value)}>
                  {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Lead *</label>
                <select style={inputStyle} value={form.lead} onChange={e => set('lead', e.target.value)}>
                  <option value="">— Select Lead —</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name}{l.company ? ` (${l.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Assigned To</label>
                <select style={inputStyle} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                  <option value="">— Unassigned —</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Expected Close Date</label>
                <input style={inputStyle} type="date" value={form.expectedClosedDate}
                  onChange={e => set('expectedClosedDate', e.target.value)} />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'var(--accent-blue)', color: '#fff', boxShadow: 'var(--shadow-blue)', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Saving…' : (initialData ? 'Save Changes' : 'Create Deal')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Delete Confirm Modal ──────────────────────────────── */
function DeleteModal({ deal, onClose, onConfirm, loading }) {
  return (
    <AnimatePresence>
      {deal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="nova-card w-full max-w-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--accent-rose-dim)' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--accent-rose)' }} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Delete Deal</h3>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{deal.title}"</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={loading}
                className="flex-1 py-2 rounded-xl text-sm font-bold"
                style={{ background: 'var(--accent-rose)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */
export default function DealsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [deletingDeal, setDeletingDeal] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canCreate = currentUser.role === 'admin' || currentUser.role === 'manager';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dealsRes, leadsRes] = await Promise.all([
        getDeals(),
        getLeads(),
      ]);
      setDeals(dealsRes.data || []);
      setLeads(Array.isArray(leadsRes) ? leadsRes : leadsRes.data || []);

      // Only admin/manager can list users for assignment
      if (canCreate) {
        try {
          const usersRes = await getAllUsers();
          setUsers(usersRes.data || []);
        } catch (_) { /* employees won't have access, that's fine */ }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [canCreate]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    fetchData();
  }, [navigate, fetchData]);

  const handleOpenCreate = () => { setEditDeal(null); setModalOpen(true); };
  const handleOpenEdit = (deal) => { setEditDeal(deal); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditDeal(null); };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        value: Number(form.value),
        stage: form.stage,
        status: form.status,
        expectedClosedDate: form.expectedClosedDate || null,
        lead: form.lead,
        assignedTo: form.assignedTo || null,
      };
      if (editDeal) {
        await updateDeal(editDeal.id, payload);
      } else {
        await createDeal(payload);
      }
      handleCloseModal();
      await fetchData();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDeal) return;
    setSaving(true);
    try {
      await deleteDeal(deletingDeal.id);
      setDeletingDeal(null);
      await fetchData();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = deals.filter(d =>
    !search ||
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.status?.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = STAGES.reduce((acc, s) => {
    acc[s] = filtered.filter(d => d.stage === s);
    return acc;
  }, {});

  const thStyle = {
    color: 'var(--text-tertiary)',
    borderBottom: '1px solid var(--border-subtle)',
    padding: '12px 20px',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const totalValue = deals.reduce((s, d) => s + (Number(d.value) || 0), 0);

  return (
    <div className="glow-bg min-h-screen" style={{ background: 'var(--bg-canvas)', color: 'var(--text-primary)' }}>
      <SharedHeader />
      <main className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5" style={{ color: 'var(--accent-blue)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent-blue)' }}>Sales Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Deals</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {loading ? 'Loading…' : `${deals.length} deals · $${totalValue.toLocaleString()} total pipeline`}
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <input placeholder="Search deals…" value={search} onChange={e => setSearch(e.target.value)}
              className="nova-input !py-2 w-44 text-sm" />
            <div className="flex items-center gap-1 p-1 rounded-xl"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
              {[['kanban', <LayoutGrid size={13} />, 'Kanban'], ['table', <List size={13} />, 'Table']].map(([v, icon, label]) => (
                <button key={v} onClick={() => setView(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={view === v
                    ? { background: 'var(--accent-blue)', color: '#fff', boxShadow: 'var(--shadow-blue)' }
                    : { color: 'var(--text-secondary)' }}>
                  {icon}{label}
                </button>
              ))}
            </div>
            {canCreate && (
              <button onClick={handleOpenCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'var(--accent-blue)', color: '#fff', boxShadow: 'var(--shadow-blue)' }}>
                <Plus size={15} /> New Deal
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
            style={{ background: 'var(--accent-rose-dim)', color: 'var(--accent-rose)', border: '1px solid var(--accent-rose)30' }}>
            <AlertTriangle size={13} /> {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }} />
          </div>
        ) : view === 'kanban' ? (
          /* Kanban Board */
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const cfg = STAGE_CFG[stage];
              const stageDeals = grouped[stage];
              const total = stageDeals.reduce((s, d) => s + (Number(d.value) || 0), 0);
              return (
                <div key={stage} className="flex-1 min-w-[220px]">
                  <div className="flex items-center justify-between mb-4 pb-3"
                    style={{ borderBottom: `2px solid var(${cfg.accentVar})` }}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{stage}</h3>
                      <span className="badge" style={{
                        background: `var(${cfg.dimVar})`,
                        color: `var(${cfg.accentVar})`,
                        border: `1px solid var(${cfg.accentVar})30`,
                        padding: '1px 7px',
                        fontSize: 10,
                      }}>
                        {stageDeals.length}
                      </span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                      ${total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {stageDeals.length === 0 ? (
                      <div className="text-center py-8 text-xs border-2 border-dashed rounded-xl"
                        style={{ color: 'var(--text-disabled)', borderColor: 'var(--border-subtle)' }}>
                        No deals
                      </div>
                    ) : stageDeals.map(d => (
                      <DealCard
                        key={d.id || d.PK}
                        deal={d}
                        currentUserRole={currentUser.role}
                        onEdit={handleOpenEdit}
                        onDelete={setDeletingDeal}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="nova-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {['Deal', 'Stage', 'Value', 'Status', 'Close Date', ...(canCreate ? ['Actions'] : [])].map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={canCreate ? 6 : 5} className="text-center py-12 text-sm"
                      style={{ color: 'var(--text-disabled)' }}>
                      No deals found
                    </td>
                  </tr>
                ) : filtered.map((deal, i) => {
                  const cfg = STAGE_CFG[deal.stage] || STAGE_CFG['Prospect'];
                  return (
                    <motion.tr key={deal.id || deal.PK}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="transition-colors"
                      style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {deal.title}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${cfg.badgeCls}`}>{deal.stage}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold" style={{ color: `var(${cfg.accentVar})` }}>
                        ${(Number(deal.value) || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>
                        {deal.status || 'open'}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {deal.expectedClosedDate
                          ? new Date(deal.expectedClosedDate).toLocaleDateString()
                          : '—'}
                      </td>
                      {canCreate && (
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenEdit(deal)}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: 'var(--accent-blue)' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-blue-dim)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                              title="Edit">
                              <Pencil size={13} />
                            </button>
                            {currentUser.role === 'admin' && (
                              <button onClick={() => setDeletingDeal(deal)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: 'var(--accent-rose)' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-rose-dim)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                title="Delete">
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modals */}
      <DealModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editDeal}
        leads={leads}
        users={users}
        loading={saving}
      />
      <DeleteModal
        deal={deletingDeal}
        onClose={() => setDeletingDeal(null)}
        onConfirm={handleDeleteConfirm}
        loading={saving}
      />
    </div>
  );
}
