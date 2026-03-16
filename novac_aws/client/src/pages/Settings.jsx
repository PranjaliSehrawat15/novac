import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, BellRing, LogOut, Monitor,
  Save, Eye, EyeOff, Check, X, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import SharedHeader from '../components/SharedHeader';
import { getMe, updateProfile, changePassword, deactivateSelf, getLeads, getDeals } from '../services/api';
import { Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const SIDEBAR = [
  { icon: User,    label: 'Personal',      id: 'personal'      },
  { icon: Shield,  label: 'Security',      id: 'security'      },
  { icon: BellRing,label: 'Notifications', id: 'notifications' },
];

const NOTIF_CFG = {
  lead:     { icon: <Users        className="w-3.5 h-3.5" />, cls:'badge-blue'    },
  deal:     { icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls:'badge-green'   },
  reminder: { icon: <Clock        className="w-3.5 h-3.5" />, cls:'badge-amber'   },
  system:   { icon: <AlertCircle  className="w-3.5 h-3.5" />, cls:'badge-neutral' },
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName]   = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
  const [showPw, setShowPw] = useState({ current:false, new:false, confirm:false });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    Promise.all([
      getMe().catch(() => null),
      // ✅ FIXED: getLeads returns { success, data: [...] } not a raw array
      getLeads().catch(() => ({ data: [] })),
      getDeals().catch(() => ({ data: [] })),
    ]).then(([me, leadsRes, dealsRes]) => {
      const u = me?.user || JSON.parse(localStorage.getItem('user') || '{}');
      setUser(u);
      setName(u.name || '');
      setLeads(leadsRes?.data || []);
      setDeals(dealsRes?.data || []);
      setLoading(false);
    });
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setSavingProfile(true); setProfileMsg(null);
    try {
      await updateProfile({ name: name.trim() });
      const s = JSON.parse(localStorage.getItem('user')||'{}');
      localStorage.setItem('user', JSON.stringify({...s, name: name.trim()}));
      setUser(p=>({...p, name: name.trim()}));
      setProfileMsg({ ok:true, text:'Name updated!' });
    } catch(e) { setProfileMsg({ ok:false, text: e.message||'Failed' }); }
    finally { setSavingProfile(false); setTimeout(()=>setProfileMsg(null),3000); }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ok:false,text:'Passwords do not match'}); return; }
    if (pwForm.newPassword.length < 6) { setPwMsg({ok:false,text:'Password must be at least 6 characters'}); return; }
    setSavingPw(true); setPwMsg(null);
    try {
      await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg({ok:true,text:'Password changed!'}); setPwForm({currentPassword:'',newPassword:'',confirmPassword:''});
    } catch(e) { setPwMsg({ok:false,text:e.message||'Failed'}); }
    finally { setSavingPw(false); setTimeout(()=>setPwMsg(null),4000); }
  };

  const handleDeactivate = async () => {
    setDeactivating(true);
    try { await deactivateSelf(); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
    catch(e) { setDeactivating(false); setShowDeactivate(false); }
  };

  const notifications = [
    ...leads.slice(0,4).map(l=>({ id:`l-${l.id}`, type:'lead',     title:'Lead Added',      msg:`${l.name}${l.company?' · '+l.company:''}`, time: l.createdAt?new Date(l.createdAt).toLocaleDateString():'Recently' })),
    ...deals.filter(d=>d.stage==='Closed Won').slice(0,3).map(d=>({ id:`dw-${d.id}`, type:'deal', title:'Deal Closed Won', msg:`${d.title||d.name} · $${(d.value||0).toLocaleString()}`, time: d.updatedAt?new Date(d.updatedAt).toLocaleDateString():'Recently' })),
    ...deals.filter(d=>d.stage==='Negotiation').slice(0,2).map(d=>({ id:`dn-${d.id}`, type:'reminder', title:'Follow-up Needed', msg:`"${d.title||d.name}" in Negotiation`, time: d.updatedAt?new Date(d.updatedAt).toLocaleDateString():'Recently' })),
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--bg-canvas)' }}>
      <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--accent-blue)', borderTopColor:'transparent' }} />
    </div>
  );

  const MsgBanner = ({ msg }) => msg ? (
    <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
      className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm badge ${msg.ok?'badge-green':'badge-rose'} !w-full`}>
      {msg.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}{msg.text}
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
      <SharedHeader />
      <div className="max-w-[1100px] mx-auto px-6 py-8 flex gap-6">

        {/* ── Sidebar ── */}
        <motion.aside initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} className="w-56 shrink-0 space-y-2">
          {/* Avatar card */}
          <div className="nova-card p-5 text-center mb-4">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="w-full h-full rounded-xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background:'linear-gradient(135deg, var(--accent-blue) 0%, #6366f1 100%)', boxShadow:'var(--shadow-blue)' }}>
                {user?.name?.charAt(0)?.toUpperCase()||'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center"
                style={{ background:'var(--accent-emerald)', border:'2px solid var(--bg-canvas)' }}>
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>{user?.name||'User'}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color:'var(--accent-blue)' }}>{user?.role}</p>
            <p className="text-xs mt-1 truncate" style={{ color:'var(--text-tertiary)' }}>{user?.email}</p>
          </div>

          {/* Nav items */}
          {SIDEBAR.map(item => (
            <button key={item.id} onClick={()=>setActiveTab(item.id)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
              style={activeTab===item.id ? {
                background: 'var(--accent-blue)', color:'#fff', boxShadow:'var(--shadow-blue)'
              } : { color:'var(--text-secondary)' }}
              onMouseEnter={e=>{ if(activeTab!==item.id){ e.currentTarget.style.background='var(--bg-elevated)'; e.currentTarget.style.color='var(--text-primary)'; }}}
              onMouseLeave={e=>{ if(activeTab!==item.id){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-secondary)'; }}}>
              <item.icon className="w-4 h-4" />{item.label}
            </button>
          ))}

          <div style={{ borderTop:'1px solid var(--border-subtle)', marginTop:16, paddingTop:12 }}>
            <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
              style={{ color:'var(--accent-rose)' }}
              onMouseEnter={e=>{ e.currentTarget.style.background='var(--accent-rose-dim)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}>
              <LogOut className="w-4 h-4" />Sign Out
            </button>
          </div>
        </motion.aside>

        {/* ── Main panel ── */}
        <motion.div key={activeTab} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.2 }} className="flex-1 space-y-4">

          {/* PERSONAL */}
          {activeTab==='personal' && (
            <>
              <div className="nova-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-blue-dim)' }}>
                      <User className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-blue)' }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Personal Details</h3>
                      <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>Update your display name</p>
                    </div>
                  </div>
                  <button onClick={handleSaveProfile} disabled={savingProfile}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95"
                    style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)', opacity: savingProfile?0.6:1 }}>
                    <Save className="w-3.5 h-3.5" />{savingProfile?'Saving…':'Save'}
                  </button>
                </div>
                <AnimatePresence><MsgBanner msg={profileMsg} /></AnimatePresence>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Full Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)} className="nova-input text-sm" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Email</label>
                    <input value={user?.email||''} readOnly className="nova-input text-sm" style={{ opacity:0.5, cursor:'not-allowed' }} />
                    <p className="text-[10px] mt-1" style={{ color:'var(--text-tertiary)' }}>Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Role</label>
                    <input value={user?.role ? user.role.charAt(0).toUpperCase()+user.role.slice(1) : ''} readOnly className="nova-input text-sm" style={{ opacity:0.5, cursor:'not-allowed' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Status</label>
                    <div className="nova-input text-sm flex items-center gap-2" style={{ cursor:'default' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background:'var(--accent-emerald)' }} />
                      <span style={{ color:'var(--accent-emerald)' }}>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="nova-card p-6" style={{ borderColor:'rgba(244,63,94,0.2)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color:'var(--accent-rose)' }}>Danger Zone</h3>
                    <p className="text-xs mt-0.5 max-w-sm" style={{ color:'var(--text-tertiary)' }}>
                      Deactivating your account will prevent login. An admin can reactivate it later.
                    </p>
                  </div>
                  <button onClick={()=>setShowDeactivate(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all"
                    style={{ color:'var(--accent-rose)', border:'1px solid rgba(244,63,94,0.25)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--accent-rose-dim)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <AlertTriangle className="w-3.5 h-3.5" />Deactivate Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* SECURITY */}
          {activeTab==='security' && (
            <>
              <div className="nova-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-rose-dim)' }}>
                    <Shield className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-rose)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Change Password</h3>
                    <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>Keep your account secure</p>
                  </div>
                </div>
                <AnimatePresence><MsgBanner msg={pwMsg} /></AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  {[['currentPassword','Current Password','current'],['newPassword','New Password','new'],['confirmPassword','Confirm Password','confirm']].map(([key,label,field])=>(
                    <div key={key}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>{label}</label>
                      <div className="relative">
                        <input type={showPw[field]?'text':'password'} value={pwForm[key]}
                          onChange={e=>setPwForm({...pwForm,[key]:e.target.value})}
                          className="nova-input text-sm !pr-10" placeholder="••••••••" />
                        <button type="button" onClick={()=>setShowPw(p=>({...p,[field]:!p[field]}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color:'var(--text-tertiary)' }}>
                          {showPw[field]?<EyeOff className="w-3.5 h-3.5" />:<Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={handleChangePassword} disabled={savingPw||!pwForm.currentPassword||!pwForm.newPassword||!pwForm.confirmPassword}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
                  style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)', opacity:(savingPw||!pwForm.currentPassword)?0.5:1 }}>
                  <Shield className="w-4 h-4" />{savingPw?'Updating…':'Update Password'}
                </button>
              </div>

              <div className="nova-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-emerald-dim)' }}>
                    <Monitor className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-emerald)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Active Sessions</h3>
                    <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>Your current sessions</p>
                  </div>
                </div>
                <div className="nova-card-inner flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-4 h-4" style={{ color:'var(--text-secondary)' }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>Current Browser</p>
                        <span className="badge badge-green">Active</span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color:'var(--text-tertiary)' }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeTab==='notifications' && (
            <div className="nova-card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-blue-dim)' }}>
                    <BellRing className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-blue)' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Recent Activity</h3>
                    <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>All CRM notifications</p>
                  </div>
                </div>
                {notifications.length>0 && <span className="badge badge-blue">{notifications.length}</span>}
              </div>
              {notifications.length===0 ? (
                <div className="py-16 text-center" style={{ color:'var(--text-tertiary)' }}>
                  <BellRing className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">No notifications</p>
                  <p className="text-xs mt-1 opacity-60">CRM activity will appear here</p>
                </div>
              ) : notifications.map(n=>{
                const cfg = NOTIF_CFG[n.type]||NOTIF_CFG.system;
                return (
                  <div key={n.id} className="flex items-start gap-4 px-6 py-4 transition-colors"
                    style={{ borderBottom:'1px solid var(--border-subtle)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <div className={`badge ${cfg.cls} !px-2 !py-2 flex-shrink-0 mt-0.5`}>{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-sm mt-0.5 truncate" style={{ color:'var(--text-secondary)' }}>{n.msg}</p>
                      <p className="text-xs mt-1" style={{ color:'var(--accent-blue)' }}>{n.time}</p>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background:'var(--accent-blue)' }} />
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Deactivate modal */}
      <AnimatePresence>
        {showDeactivate && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)' }}>
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}
              className="nova-card p-6 w-full max-w-sm text-center" style={{ boxShadow:'var(--shadow-elevated)' }}>
              <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background:'var(--accent-rose-dim)' }}>
                <AlertTriangle className="w-6 h-6" style={{ color:'var(--accent-rose)' }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color:'var(--text-primary)' }}>Deactivate Account?</h3>
              <p className="text-sm mb-6" style={{ color:'var(--text-secondary)' }}>
                You'll be logged out and won't be able to sign in. An admin can reactivate your account.
              </p>
              <div className="flex gap-3">
                <button onClick={()=>setShowDeactivate(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all"
                  style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', color:'var(--text-primary)' }}>
                  Cancel
                </button>
                <button onClick={handleDeactivate} disabled={deactivating}
                  className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
                  style={{ background:'var(--accent-rose)', opacity:deactivating?0.6:1 }}>
                  {deactivating?'Deactivating…':'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   User, Shield, BellRing, LogOut, Monitor,
//   Save, Eye, EyeOff, Check, X, AlertTriangle
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';
// import { useTheme } from '../context/ThemeContext';
// import SharedHeader from '../components/SharedHeader';
// import { getMe, updateProfile, changePassword, deactivateSelf, getLeads, getDeals } from '../services/api';
// import { Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

// const SIDEBAR = [
//   { icon: User,    label: 'Personal',      id: 'personal'      },
//   { icon: Shield,  label: 'Security',      id: 'security'      },
//   { icon: BellRing,label: 'Notifications', id: 'notifications' },
// ];

// const NOTIF_CFG = {
//   lead:     { icon: <Users        className="w-3.5 h-3.5" />, cls:'badge-blue'    },
//   deal:     { icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls:'badge-green'   },
//   reminder: { icon: <Clock        className="w-3.5 h-3.5" />, cls:'badge-amber'   },
//   system:   { icon: <AlertCircle  className="w-3.5 h-3.5" />, cls:'badge-neutral' },
// };

// export default function SettingsPage() {
//   const navigate = useNavigate();
//   const { isDark } = useTheme();
//   const [activeTab, setActiveTab] = useState('personal');
//   const [user, setUser]   = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [name, setName]   = useState('');
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [profileMsg, setProfileMsg] = useState(null);
//   const [pwForm, setPwForm] = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
//   const [showPw, setShowPw] = useState({ current:false, new:false, confirm:false });
//   const [savingPw, setSavingPw] = useState(false);
//   const [pwMsg, setPwMsg] = useState(null);
//   const [showDeactivate, setShowDeactivate] = useState(false);
//   const [deactivating, setDeactivating] = useState(false);
//   const [leads, setLeads] = useState([]);
//   const [deals, setDeals] = useState([]);

//   useEffect(() => {
//     if (!localStorage.getItem('token')) { navigate('/login'); return; }
//     Promise.all([getMe().catch(()=>null), getLeads().catch(()=>[]), getDeals().catch(()=>({data:[]}))])
//       .then(([me, leadsData, dealsData]) => {
//         const u = me?.user || JSON.parse(localStorage.getItem('user')||'{}');
//         setUser(u); setName(u.name||'');
//         setLeads(Array.isArray(leadsData)?leadsData:[]);
//         setDeals(dealsData?.data||[]);
//         setLoading(false);
//       });
//   }, [navigate]);

//   const handleSaveProfile = async () => {
//     if (!name.trim()) return;
//     setSavingProfile(true); setProfileMsg(null);
//     try {
//       await updateProfile({ name: name.trim() });
//       const s = JSON.parse(localStorage.getItem('user')||'{}');
//       localStorage.setItem('user', JSON.stringify({...s, name: name.trim()}));
//       setUser(p=>({...p, name: name.trim()}));
//       setProfileMsg({ ok:true, text:'Name updated!' });
//     } catch(e) { setProfileMsg({ ok:false, text: e.message||'Failed' }); }
//     finally { setSavingProfile(false); setTimeout(()=>setProfileMsg(null),3000); }
//   };

//   const handleChangePassword = async () => {
//     if (pwForm.newPassword !== pwForm.confirmPassword) { setPwMsg({ok:false,text:'Passwords do not match'}); return; }
//     if (pwForm.newPassword.length < 6) { setPwMsg({ok:false,text:'Password must be at least 6 characters'}); return; }
//     setSavingPw(true); setPwMsg(null);
//     try {
//       await changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
//       setPwMsg({ok:true,text:'Password changed!'}); setPwForm({currentPassword:'',newPassword:'',confirmPassword:''});
//     } catch(e) { setPwMsg({ok:false,text:e.message||'Failed'}); }
//     finally { setSavingPw(false); setTimeout(()=>setPwMsg(null),4000); }
//   };

//   const handleDeactivate = async () => {
//     setDeactivating(true);
//     try { await deactivateSelf(); localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }
//     catch(e) { setDeactivating(false); setShowDeactivate(false); }
//   };

//   const notifications = [
//     ...leads.slice(0,4).map(l=>({ id:`l-${l.id}`, type:'lead',     title:'Lead Added',      msg:`${l.name}${l.company?' · '+l.company:''}`, time: l.createdAt?new Date(l.createdAt).toLocaleDateString():'Recently' })),
//     ...deals.filter(d=>d.stage==='Closed Won').slice(0,3).map(d=>({ id:`dw-${d.id}`, type:'deal', title:'Deal Closed Won', msg:`${d.title||d.name} · $${(d.value||0).toLocaleString()}`, time: d.updatedAt?new Date(d.updatedAt).toLocaleDateString():'Recently' })),
//     ...deals.filter(d=>d.stage==='Negotiation').slice(0,2).map(d=>({ id:`dn-${d.id}`, type:'reminder', title:'Follow-up Needed', msg:`"${d.title||d.name}" in Negotiation`, time: d.updatedAt?new Date(d.updatedAt).toLocaleDateString():'Recently' })),
//   ];

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center" style={{ background:'var(--bg-canvas)' }}>
//       <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--accent-blue)', borderTopColor:'transparent' }} />
//     </div>
//   );

//   const MsgBanner = ({ msg }) => msg ? (
//     <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
//       className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl text-sm badge ${msg.ok?'badge-green':'badge-rose'} !w-full`}>
//       {msg.ok ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}{msg.text}
//     </motion.div>
//   ) : null;

//   return (
//     <div className="min-h-screen" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
//       <SharedHeader />
//       <div className="max-w-[1100px] mx-auto px-6 py-8 flex gap-6">

//         {/* ── Sidebar ── */}
//         <motion.aside initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} className="w-56 shrink-0 space-y-2">
//           {/* Avatar card */}
//           <div className="nova-card p-5 text-center mb-4">
//             <div className="relative w-16 h-16 mx-auto mb-3">
//               <div className="w-full h-full rounded-xl flex items-center justify-center text-xl font-bold text-white"
//                 style={{ background:'linear-gradient(135deg, var(--accent-blue) 0%, #6366f1 100%)', boxShadow:'var(--shadow-blue)' }}>
//                 {user?.name?.charAt(0)?.toUpperCase()||'U'}
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg flex items-center justify-center"
//                 style={{ background:'var(--accent-emerald)', border:'2px solid var(--bg-canvas)' }}>
//                 <Check className="w-3 h-3 text-white" />
//               </div>
//             </div>
//             <p className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>{user?.name||'User'}</p>
//             <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color:'var(--accent-blue)' }}>{user?.role}</p>
//             <p className="text-xs mt-1 truncate" style={{ color:'var(--text-tertiary)' }}>{user?.email}</p>
//           </div>

//           {/* Nav items */}
//           {SIDEBAR.map(item => (
//             <button key={item.id} onClick={()=>setActiveTab(item.id)}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
//               style={activeTab===item.id ? {
//                 background: 'var(--accent-blue)', color:'#fff', boxShadow:'var(--shadow-blue)'
//               } : { color:'var(--text-secondary)' }}
//               onMouseEnter={e=>{ if(activeTab!==item.id){ e.currentTarget.style.background='var(--bg-elevated)'; e.currentTarget.style.color='var(--text-primary)'; }}}
//               onMouseLeave={e=>{ if(activeTab!==item.id){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-secondary)'; }}}>
//               <item.icon className="w-4 h-4" />{item.label}
//             </button>
//           ))}

//           <div style={{ borderTop:'1px solid var(--border-subtle)', marginTop:16, paddingTop:12 }}>
//             <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
//               className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
//               style={{ color:'var(--accent-rose)' }}
//               onMouseEnter={e=>{ e.currentTarget.style.background='var(--accent-rose-dim)'; }}
//               onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}>
//               <LogOut className="w-4 h-4" />Sign Out
//             </button>
//           </div>
//         </motion.aside>

//         {/* ── Main panel ── */}
//         <motion.div key={activeTab} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.2 }} className="flex-1 space-y-4">

//           {/* PERSONAL */}
//           {activeTab==='personal' && (
//             <>
//               <div className="nova-card p-6">
//                 <div className="flex items-center justify-between mb-5">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-blue-dim)' }}>
//                       <User className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-blue)' }} />
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Personal Details</h3>
//                       <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>Update your display name</p>
//                     </div>
//                   </div>
//                   <button onClick={handleSaveProfile} disabled={savingProfile}
//                     className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all active:scale-95"
//                     style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)', opacity: savingProfile?0.6:1 }}>
//                     <Save className="w-3.5 h-3.5" />{savingProfile?'Saving…':'Save'}
//                   </button>
//                 </div>
//                 <AnimatePresence><MsgBanner msg={profileMsg} /></AnimatePresence>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Full Name</label>
//                     <input value={name} onChange={e=>setName(e.target.value)} className="nova-input text-sm" placeholder="Your full name" />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Email</label>
//                     <input value={user?.email||''} readOnly className="nova-input text-sm" style={{ opacity:0.5, cursor:'not-allowed' }} />
//                     <p className="text-[10px] mt-1" style={{ color:'var(--text-tertiary)' }}>Email cannot be changed</p>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Role</label>
//                     <input value={user?.role ? user.role.charAt(0).toUpperCase()+user.role.slice(1) : ''} readOnly className="nova-input text-sm" style={{ opacity:0.5, cursor:'not-allowed' }} />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>Status</label>
//                     <div className="nova-input text-sm flex items-center gap-2" style={{ cursor:'default' }}>
//                       <span className="w-2 h-2 rounded-full" style={{ background:'var(--accent-emerald)' }} />
//                       <span style={{ color:'var(--accent-emerald)' }}>Active</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="nova-card p-6" style={{ borderColor:'rgba(244,63,94,0.2)' }}>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-sm font-bold" style={{ color:'var(--accent-rose)' }}>Danger Zone</h3>
//                     <p className="text-xs mt-0.5 max-w-sm" style={{ color:'var(--text-tertiary)' }}>
//                       Deactivating your account will prevent login. An admin can reactivate it later.
//                     </p>
//                   </div>
//                   <button onClick={()=>setShowDeactivate(true)}
//                     className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all"
//                     style={{ color:'var(--accent-rose)', border:'1px solid rgba(244,63,94,0.25)' }}
//                     onMouseEnter={e=>e.currentTarget.style.background='var(--accent-rose-dim)'}
//                     onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
//                     <AlertTriangle className="w-3.5 h-3.5" />Deactivate Account
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* SECURITY */}
//           {activeTab==='security' && (
//             <>
//               <div className="nova-card p-6">
//                 <div className="flex items-center gap-3 mb-5">
//                   <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-rose-dim)' }}>
//                     <Shield className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-rose)' }} />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Change Password</h3>
//                     <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>Keep your account secure</p>
//                   </div>
//                 </div>
//                 <AnimatePresence><MsgBanner msg={pwMsg} /></AnimatePresence>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
//                   {[['currentPassword','Current Password','current'],['newPassword','New Password','new'],['confirmPassword','Confirm Password','confirm']].map(([key,label,field])=>(
//                     <div key={key}>
//                       <label className="block text-xs font-semibold mb-1.5" style={{ color:'var(--text-secondary)' }}>{label}</label>
//                       <div className="relative">
//                         <input type={showPw[field]?'text':'password'} value={pwForm[key]}
//                           onChange={e=>setPwForm({...pwForm,[key]:e.target.value})}
//                           className="nova-input text-sm !pr-10" placeholder="••••••••" />
//                         <button type="button" onClick={()=>setShowPw(p=>({...p,[field]:!p[field]}))}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
//                           style={{ color:'var(--text-tertiary)' }}>
//                           {showPw[field]?<EyeOff className="w-3.5 h-3.5" />:<Eye className="w-3.5 h-3.5" />}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <button onClick={handleChangePassword} disabled={savingPw||!pwForm.currentPassword||!pwForm.newPassword||!pwForm.confirmPassword}
//                   className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all"
//                   style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)', opacity:(savingPw||!pwForm.currentPassword)?0.5:1 }}>
//                   <Shield className="w-4 h-4" />{savingPw?'Updating…':'Update Password'}
//                 </button>
//               </div>

//               <div className="nova-card p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-emerald-dim)' }}>
//                     <Monitor className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-emerald)' }} />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Active Sessions</h3>
//                     <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>Your current sessions</p>
//                   </div>
//                 </div>
//                 <div className="nova-card-inner flex items-center justify-between p-4">
//                   <div className="flex items-center gap-3">
//                     <Monitor className="w-4 h-4" style={{ color:'var(--text-secondary)' }} />
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>Current Browser</p>
//                         <span className="badge badge-green">Active</span>
//                       </div>
//                       <p className="text-xs mt-0.5" style={{ color:'var(--text-tertiary)' }}>{user?.email}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* NOTIFICATIONS */}
//           {activeTab==='notifications' && (
//             <div className="nova-card overflow-hidden">
//               <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom:'1px solid var(--border-subtle)' }}>
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'var(--accent-blue-dim)' }}>
//                     <BellRing className="w-4.5 h-4.5" size={18} style={{ color:'var(--accent-blue)' }} />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-bold" style={{ color:'var(--text-primary)' }}>Recent Activity</h3>
//                     <p className="text-xs" style={{ color:'var(--text-tertiary)' }}>All CRM notifications</p>
//                   </div>
//                 </div>
//                 {notifications.length>0 && <span className="badge badge-blue">{notifications.length}</span>}
//               </div>
//               {notifications.length===0 ? (
//                 <div className="py-16 text-center" style={{ color:'var(--text-tertiary)' }}>
//                   <BellRing className="w-8 h-8 mx-auto mb-3 opacity-20" />
//                   <p className="text-sm font-medium">No notifications</p>
//                   <p className="text-xs mt-1 opacity-60">CRM activity will appear here</p>
//                 </div>
//               ) : notifications.map(n=>{
//                 const cfg = NOTIF_CFG[n.type]||NOTIF_CFG.system;
//                 return (
//                   <div key={n.id} className="flex items-start gap-4 px-6 py-4 transition-colors"
//                     style={{ borderBottom:'1px solid var(--border-subtle)' }}
//                     onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
//                     onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
//                     <div className={`badge ${cfg.cls} !px-2 !py-2 flex-shrink-0 mt-0.5`}>{cfg.icon}</div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>{n.title}</p>
//                       <p className="text-sm mt-0.5 truncate" style={{ color:'var(--text-secondary)' }}>{n.msg}</p>
//                       <p className="text-xs mt-1" style={{ color:'var(--accent-blue)' }}>{n.time}</p>
//                     </div>
//                     <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background:'var(--accent-blue)' }} />
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Deactivate modal */}
//       <AnimatePresence>
//         {showDeactivate && (
//           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
//             className="fixed inset-0 z-[300] flex items-center justify-center p-4"
//             style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)' }}>
//             <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}
//               className="nova-card p-6 w-full max-w-sm text-center" style={{ boxShadow:'var(--shadow-elevated)' }}>
//               <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background:'var(--accent-rose-dim)' }}>
//                 <AlertTriangle className="w-6 h-6" style={{ color:'var(--accent-rose)' }} />
//               </div>
//               <h3 className="text-base font-bold mb-2" style={{ color:'var(--text-primary)' }}>Deactivate Account?</h3>
//               <p className="text-sm mb-6" style={{ color:'var(--text-secondary)' }}>
//                 You'll be logged out and won't be able to sign in. An admin can reactivate your account.
//               </p>
//               <div className="flex gap-3">
//                 <button onClick={()=>setShowDeactivate(false)}
//                   className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all"
//                   style={{ background:'var(--bg-surface)', border:'1px solid var(--border-default)', color:'var(--text-primary)' }}>
//                   Cancel
//                 </button>
//                 <button onClick={handleDeactivate} disabled={deactivating}
//                   className="flex-1 py-2.5 text-sm font-bold text-white rounded-xl transition-all"
//                   style={{ background:'var(--accent-rose)', opacity:deactivating?0.6:1 }}>
//                   {deactivating?'Deactivating…':'Confirm'}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
