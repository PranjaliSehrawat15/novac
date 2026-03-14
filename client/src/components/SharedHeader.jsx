import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Rocket, Search, Bell, Settings, Sun, Moon,
  Users, CheckCircle2, Clock, AlertCircle, X,
  UserPlus, Plus, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { getLeads, getDeals } from '../services/api';
import { cn } from '../utils';

const notifIconMap = {
  lead:     { icon: <Users        className="w-3.5 h-3.5" />, cls: 'badge-blue'    },
  deal:     { icon: <CheckCircle2 className="w-3.5 h-3.5" />, cls: 'badge-green'   },
  reminder: { icon: <Clock        className="w-3.5 h-3.5" />, cls: 'badge-amber'   },
  system:   { icon: <AlertCircle  className="w-3.5 h-3.5" />, cls: 'badge-neutral' },
};

function NotifPanel({ onClose, leads, deals }) {
  const notifications = [
    ...leads.slice(0, 3).map(l => ({
      id: `l-${l.id}`, type: 'lead',
      title: 'Lead added',
      msg: `${l.name}${l.company ? ' · ' + l.company : ''}`,
      time: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Recently',
    })),
    ...deals.filter(d => d.stage === 'Closed Won').slice(0, 2).map(d => ({
      id: `dw-${d.id}`, type: 'deal',
      title: 'Deal closed won',
      msg: `${d.title || d.name} · $${(d.value||0).toLocaleString()}`,
      time: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : 'Recently',
    })),
    ...deals.filter(d => d.stage === 'Negotiation').slice(0, 2).map(d => ({
      id: `dn-${d.id}`, type: 'reminder',
      title: 'Follow-up needed',
      msg: `"${d.title || d.name}" in Negotiation`,
      time: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString() : 'Recently',
    })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: [0.16,1,0.3,1] }}
      className="nova-card absolute right-0 top-full mt-2 w-[350px] z-[200] overflow-hidden"
      style={{ boxShadow: 'var(--shadow-elevated)' }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{notifications.length} recent</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <span className="badge badge-blue">{notifications.length} new</span>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => e.target.style.background='var(--bg-surface)'}
            onMouseLeave={e => e.target.style.background='transparent'}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-[340px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center" style={{ color: 'var(--text-tertiary)' }}>
            <Bell className="w-7 h-7 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">All caught up</p>
            <p className="text-xs mt-1 opacity-60">CRM activity appears here</p>
          </div>
        ) : notifications.map(n => {
          const ico = notifIconMap[n.type] || notifIconMap.system;
          return (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
              onMouseEnter={e => e.currentTarget.style.background='var(--bg-surface)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div className={`badge ${ico.cls} !px-2 !py-2 flex-shrink-0 mt-0.5`}>{ico.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>{n.msg}</p>
                <p className="text-[10px] mt-1" style={{ color: 'var(--accent-blue)' }}>{n.time}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--accent-blue)' }} />
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function SharedHeader() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const [showNotif,   setShowNotif]   = useState(false);
  const [showCreate,  setShowCreate]  = useState(false);
  const [query,       setQuery]       = useState('');
  const [results,     setResults]     = useState(null);
  const [allLeads,    setAllLeads]    = useState([]);
  const [allDeals,    setAllDeals]    = useState([]);
  const [dataReady,   setDataReady]   = useState(false);

  const notifRef  = useRef(null);
  const createRef = useRef(null);
  const searchRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([getLeads().catch(()=>[]), getDeals().catch(()=>({data:[]}))])
      .then(([leads, deals]) => {
        setAllLeads(Array.isArray(leads) ? leads : []);
        setAllDeals(deals?.data || []);
        setDataReady(true);
      });
  }, []);

  useEffect(() => {
    if (!query.trim()) { setResults(null); return; }
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      setResults({
        leads: allLeads.filter(l => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.company?.toLowerCase().includes(q)),
        deals: allDeals.filter(d => d.title?.toLowerCase().includes(q) || d.company?.toLowerCase().includes(q)),
      });
    }, 220);
    return () => clearTimeout(t);
  }, [query, allLeads, allDeals]);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') { setShowNotif(false); setShowCreate(false); setResults(null); setQuery(''); } };
    const onClick = e => {
      if (notifRef.current  && !notifRef.current.contains(e.target))  setShowNotif(false);
      if (createRef.current && !createRef.current.contains(e.target)) setShowCreate(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setResults(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, []);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/leads',     label: 'Leads'     },
    { to: '/deals',     label: 'Deals'     },
    { to: '/customers', label: 'Contacts'  },
    { to: '/reports',   label: 'Reports'   },
    { to: '/teams',     label: 'Teams'     },
  ];
  const isActive = to => location.pathname === to;

  const iconBtnStyle = {
    color: 'var(--text-secondary)', borderRadius: 10, padding: '7px',
    transition: 'background 150ms, color 150ms', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <nav className="nova-nav h-16 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* ── Left ── */}
      <div className="flex items-center gap-5">
        <Link to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-blue)', boxShadow: 'var(--shadow-blue)' }}>
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>NovaCRM</span>
        </Link>

        <div className="h-4 w-px" style={{ background: 'var(--border-strong)' }} />

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={isActive(link.to) ? {
                background: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
                color: 'var(--accent-blue)', fontWeight: 600,
              } : {
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) { e.target.style.background='var(--bg-surface)'; e.target.style.color='var(--text-primary)'; }}}
              onMouseLeave={e => { if (!isActive(link.to)) { e.target.style.background='transparent'; e.target.style.color='var(--text-secondary)'; }}}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <div className="hidden lg:flex items-center relative mr-2" ref={searchRef}>
          <Search className="absolute left-3 w-3.5 h-3.5 pointer-events-none" style={{ color: 'var(--text-tertiary)' }} />
          <input
            className="nova-input !py-1.5 !pl-9 !pr-3 w-44 text-sm"
            placeholder="Search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <AnimatePresence>
            {results && (
              <motion.div initial={{ opacity:0,y:5 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:5 }}
                transition={{ duration: 0.12 }}
                className="nova-card absolute top-full left-0 mt-1.5 w-72 z-[200] overflow-hidden"
                style={{ boxShadow:'var(--shadow-elevated)' }}>
                {results.leads.length === 0 && results.deals.length === 0 ? (
                  <div className="p-4 text-sm text-center" style={{ color:'var(--text-tertiary)' }}>No results</div>
                ) : (
                  <>
                    {results.leads.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color:'var(--text-tertiary)', borderBottom:'1px solid var(--border-subtle)' }}>Leads</div>
                        {results.leads.slice(0,4).map(l => (
                          <Link key={l.id} to="/leads" onClick={()=>{setQuery('');setResults(null);}}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <div className="badge badge-blue !px-2 !py-1.5 text-xs font-bold flex-shrink-0">{l.name?.charAt(0)?.toUpperCase()}</div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate" style={{color:'var(--text-primary)'}}>{l.name}</div>
                              <div className="text-xs truncate" style={{color:'var(--text-tertiary)'}}>{l.email}</div>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                    {results.deals.length > 0 && (
                      <>
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest" style={{ color:'var(--text-tertiary)', borderTop:'1px solid var(--border-subtle)', borderBottom:'1px solid var(--border-subtle)' }}>Deals</div>
                        {results.deals.slice(0,4).map(d => (
                          <Link key={d.id} to="/deals" onClick={()=>{setQuery('');setResults(null);}}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                            onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <div className="badge badge-violet !px-2 !py-1.5 text-xs font-bold flex-shrink-0">$</div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate" style={{color:'var(--text-primary)'}}>{d.title}</div>
                              <div className="text-xs" style={{color:'var(--text-tertiary)'}}>{d.stage}</div>
                            </div>
                          </Link>
                        ))}
                      </>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Create */}
        {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
          <div className="relative mr-1" ref={createRef}>
            <button onClick={() => setShowCreate(v=>!v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: 'var(--accent-blue)', boxShadow: 'var(--shadow-blue)' }}>
              <Plus className="w-3.5 h-3.5" />Create<ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <AnimatePresence>
              {showCreate && (
                <motion.div initial={{opacity:0,y:5,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:5,scale:0.97}}
                  transition={{duration:0.12}}
                  className="nova-card absolute right-0 top-full mt-1.5 w-44 z-[200] overflow-hidden"
                  style={{boxShadow:'var(--shadow-elevated)'}}>
                  {[
                    { to:'/register-user', icon:<UserPlus className="w-4 h-4" style={{color:'var(--accent-blue)'}} />, label:'Register User' },
                    { to:'/leads',         icon:<Users     className="w-4 h-4" style={{color:'var(--accent-emerald)'}} />, label:'Add Lead' },
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={()=>setShowCreate(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{color:'var(--text-primary)'}}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      {item.icon}{item.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={iconBtnStyle} title={isDark ? 'Light mode' : 'Dark mode'}
          onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <button onClick={()=>setShowNotif(v=>!v)} style={{
            ...iconBtnStyle,
            background: showNotif ? 'var(--accent-blue-dim)' : 'transparent',
            color: showNotif ? 'var(--accent-blue)' : 'var(--text-secondary)',
          }}>
            <Bell className="w-4 h-4" />
            {dataReady && (allLeads.length > 0 || allDeals.length > 0) && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background:'var(--accent-blue)', outline: '2px solid var(--bg-canvas)' }} />
            )}
          </button>
          <AnimatePresence>
            {showNotif && <NotifPanel onClose={()=>setShowNotif(false)} leads={allLeads} deals={allDeals} />}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Link to="/settings" style={{
          ...iconBtnStyle,
          background: isActive('/settings') ? 'var(--accent-blue-dim)' : 'transparent',
          color: isActive('/settings') ? 'var(--accent-blue)' : 'var(--text-secondary)',
        }}>
          <Settings className="w-4 h-4" />
        </Link>

        {/* Avatar */}
        <Link to="/settings" className="ml-1 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--accent-blue) 0%, #6366f1 100%)', boxShadow: 'var(--shadow-blue)' }}>
            {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </Link>
      </div>
    </nav>
  );
}
