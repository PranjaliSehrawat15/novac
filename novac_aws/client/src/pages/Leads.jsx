import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, TrendingUp, Clock, X, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLeads, createLead, getAllUsers, assignLead, updateLeadStatus } from '../services/api';
import SharedHeader from '../components/SharedHeader';
import NovaLeadAIModal from '../components/NovaLeadAIModal';
import { useTheme } from '../context/ThemeContext';

const STATUS_BADGE = {
  new:          'badge badge-blue',
  qualified:    'badge badge-green',
  'in-progress':'badge badge-amber',
  lost:         'badge badge-rose',
  converted:    'badge badge-violet',
};
const STATUS_LABEL = { new:'New', qualified:'Qualified', 'in-progress':'In Progress', lost:'Lost', converted:'Converted' };

const AVATAR_COLORS = [
  '#3B82F6','#8B5CF6','#10B981','#F59E0B','#F43F5E','#06B6D4','#6366F1','#84CC16',
];
const avatarColor = str => AVATAR_COLORS[(str?.charCodeAt(0)||0) % AVATAR_COLORS.length];

function AddLeadModal({ onClose, onCreated, currentUser }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', status:'new', notes:'', assignedTo:'', manager:'' });
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    if (currentUser?.role === 'admin') getAllUsers().then(d=>setUsers(d.data||[])).catch(()=>{});
  }, [currentUser]);

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await createLead(form); onCreated(); }
    catch (err) { setError(err.message||'Failed to create lead'); }
    finally { setLoading(false); }
  };

  const inputCls = "nova-input text-sm";
  const labelCls = "block text-xs font-semibold mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)' }}>
      <motion.div initial={{ opacity:0, scale:0.96, y:10 }} animate={{ opacity:1, scale:1, y:0 }}
        className="nova-card w-full max-w-lg" style={{ boxShadow:'var(--shadow-elevated)', maxHeight:'90vh', display:'flex', flexDirection:'column' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom:'1px solid var(--border-subtle)' }}>
          <h2 className="text-base font-bold" style={{ color:'var(--text-primary)' }}>Add New Lead</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color:'var(--text-secondary)' }}
            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {error && <div className="badge badge-rose px-3 py-2 text-xs !rounded-lg w-full">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            {[['name','Full Name *','John Smith',true,'text'],['email','Email *','john@company.com',true,'email'],
              ['phone','Phone','+1 234 567',false,'text'],['company','Company','Acme Corp',false,'text']].map(([name,label,ph,req,type])=>(
              <div key={name}>
                <label className={labelCls} style={{ color:'var(--text-secondary)' }}>{label}</label>
                <input name={name} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})}
                  required={req} placeholder={ph} type={type} className={inputCls} />
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls} style={{ color:'var(--text-secondary)' }}>Status</label>
            <select name="status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className={inputCls}>
              {Object.entries(STATUS_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {currentUser?.role==='admin' && users.length>0 && (
            <div className="grid grid-cols-2 gap-3">
              {[['assignedTo','Assign To',users],['manager','Manager',users.filter(u=>u.role==='manager'||u.role==='admin')]].map(([name,label,list])=>(
                <div key={name}>
                  <label className={labelCls} style={{ color:'var(--text-secondary)' }}>{label}</label>
                  <select name={name} value={form[name]} onChange={e=>setForm({...form,[name]:e.target.value})} className={inputCls}>
                    <option value="">— Select —</option>
                    {list.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
          <div>
            <label className={labelCls} style={{ color:'var(--text-secondary)' }}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}
              placeholder="Any notes…" rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all"
              style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', color:'var(--text-primary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all active:scale-95"
              style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)', opacity: loading?0.6:1 }}>
              {loading ? 'Creating…' : 'Create Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function LeadsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [leads,       setLeads]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [activeTab,   setActiveTab]   = useState('All');
  const [search,      setSearch]      = useState('');
  const [showModal,   setShowModal]   = useState(false);
  const [successMsg,  setSuccessMsg]  = useState('');
  const [activeAiLead, setActiveAiLead] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchLeads = async () => {
    setLoading(true); setError('');
    try {
      // ✅ FIXED: getLeads returns { success, data: [...] }, not a raw array
      const res = await getLeads();
      setLeads(res.data || []);
    }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleAssign = async (leadId) => {
    try {
      const employeeId = currentUser.id;
      await assignLead(leadId, employeeId);
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (leadId, status) => {
    try {
      await updateLeadStatus(leadId, status);
      fetchLeads();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    fetchLeads();
  }, [navigate]);

  const handleCreated = () => {
    setShowModal(false); setSuccessMsg('Lead created!'); fetchLeads();
    setTimeout(()=>setSuccessMsg(''), 3000);
  };

  const tabs = ['All', 'New', 'Qualified', 'In Progress', 'Converted', 'Lost'];
  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q);
    const matchTab = activeTab==='All' ||
      (activeTab==='New' && l.status==='new') ||
      (activeTab==='Qualified' && l.status==='qualified') ||
      (activeTab==='In Progress' && l.status==='in-progress') ||
      (activeTab==='Converted' && l.status==='converted') ||
      (activeTab==='Lost' && l.status==='lost');
    return matchSearch && matchTab;
  });

  return (
    <div className="glow-bg min-h-screen" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
      {showModal && <AddLeadModal onClose={()=>setShowModal(false)} onCreated={handleCreated} currentUser={currentUser} />}
      {activeAiLead && <NovaLeadAIModal lead={activeAiLead} onClose={() => setActiveAiLead(null)} />}
      <SharedHeader />

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {successMsg && (
          <motion.div initial={{ opacity:0,y:-8 }} animate={{ opacity:1,y:0 }}
            className="mb-5 flex items-center gap-2 px-4 py-3 text-sm rounded-xl"
            style={{ background:'var(--accent-emerald-dim)', border:'1px solid rgba(16,185,129,0.2)', color:'var(--accent-emerald)' }}>
            <CheckCircle className="w-4 h-4" />{successMsg}
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'var(--text-tertiary)' }}>CRM</p>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Leads</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>
              {loading ? 'Loading…' : `${leads.length} leads in your pipeline`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input placeholder="Search leads…" value={search} onChange={e=>setSearch(e.target.value)}
              className="nova-input !py-2 w-48 text-sm" />
            {currentUser.role==='admin' && (
              <button onClick={()=>setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95"
                style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)' }}>
                <Plus className="w-4 h-4" />Add Lead
              </button>
            )}
          </div>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl mb-6 w-fit"
          style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={activeTab===tab ? {
                background: 'var(--accent-blue)', color:'#fff', boxShadow:'var(--shadow-blue)'
              } : { color:'var(--text-secondary)' }}
              onMouseEnter={e=>{ if(activeTab!==tab) e.currentTarget.style.color='var(--text-primary)'; }}
              onMouseLeave={e=>{ if(activeTab!==tab) e.currentTarget.style.color='var(--text-secondary)'; }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="nova-card overflow-hidden mb-6">
          {error ? (
            <div className="p-8 text-center text-sm" style={{ color:'var(--accent-rose)' }}>{error}</div>
          ) : loading ? (
            <div className="p-14 flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--accent-blue)', borderTopColor:'transparent' }} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                    {['Name','Email','Company','Status','Phone','Created'].map(h=>(
                      <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest" style={{ color:'var(--text-tertiary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color:'var(--text-tertiary)' }}>
                        {search ? 'No leads match your search.' : 'No leads found.'}
                      </td></tr>
                    ) : filtered.map((lead, i) => (
                      <motion.tr key={lead.id||lead.PK}
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.03 }}
                        className="group transition-colors"
                        style={{ borderBottom:'1px solid var(--border-subtle)' }}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: avatarColor(lead.name) }}>
                              {lead.name?.charAt(0)?.toUpperCase()||'?'}
                            </div>
                            <div>
                              <div
                                className="text-sm font-semibold transition-colors group-hover:text-[var(--accent-blue)]"
                                style={{ color:'var(--text-primary)' }}
                              >
                                {lead.name}
                              </div>
                              <div className="text-xs" style={{ color:'var(--text-tertiary)' }}>
                                {lead.company || '—'}
                              </div>
                              <button
                                onClick={() => handleAssign(lead.id)}
                                className="text-xs text-blue-500 hover:underline mt-1"
                              >
                                Assign to Me
                              </button>
                              <button
                                onClick={() => setActiveAiLead(lead)}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
                                style={{ color:'var(--accent-blue)' }}
                              >
                                <Sparkles className="w-3 h-3" /> Nova AI
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color:'var(--text-secondary)' }}>{lead.email}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color:'var(--text-secondary)' }}>{lead.company||'—'}</td>
                        <td className="px-5 py-3.5">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                            className="nova-input text-xs"
                          >
                            <option value="new">New</option>
                            <option value="qualified">Qualified</option>
                            <option value="in-progress">In Progress</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color:'var(--text-secondary)' }}>{lead.phone||'—'}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color:'var(--text-tertiary)' }}>
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          <div className="px-5 py-3 text-sm flex items-center justify-between" style={{ borderTop:'1px solid var(--border-subtle)' }}>
            <span style={{ color:'var(--text-tertiary)' }}>
              Showing <strong style={{ color:'var(--text-primary)' }}>{filtered.length}</strong> of <strong style={{ color:'var(--text-primary)' }}>{leads.length}</strong>
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label:'Total Leads',  val: leads.length,                              accentVar:'--accent-blue',    dimVar:'--accent-blue-dim',    icon: Users },
            { label:'Qualified',    val: leads.filter(l=>l.status==='qualified').length, accentVar:'--accent-emerald', dimVar:'--accent-emerald-dim', icon: TrendingUp },
            { label:'In Progress',  val: leads.filter(l=>l.status==='in-progress').length, accentVar:'--accent-amber', dimVar:'--accent-amber-dim',  icon: Clock },
          ].map((s,i)=>(
            <motion.div key={s.label} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
              className="nova-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:`var(${s.dimVar})` }}>
                <s.icon size={18} style={{ color:`var(${s.accentVar})` }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>{loading?'…':s.val}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color:'var(--text-tertiary)' }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
