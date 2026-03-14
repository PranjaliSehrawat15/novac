import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Calendar, LayoutGrid, List, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { getDeals } from '../services/api';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';

const STAGES = ['Prospect','Proposal','Negotiation','Closed Won','Closed Lost'];

const STAGE_CFG = {
  'Prospect':    { accentVar:'--accent-blue',    dimVar:'--accent-blue-dim',    badgeCls:'badge-blue'   },
  'Proposal':    { accentVar:'--accent-violet',  dimVar:'--accent-violet-dim',  badgeCls:'badge-violet' },
  'Negotiation': { accentVar:'--accent-amber',   dimVar:'--accent-amber-dim',   badgeCls:'badge-amber'  },
  'Closed Won':  { accentVar:'--accent-emerald', dimVar:'--accent-emerald-dim', badgeCls:'badge-green'  },
  'Closed Lost': { accentVar:'--accent-rose',    dimVar:'--accent-rose-dim',    badgeCls:'badge-rose'   },
};

function DealCard({ deal }) {
  const cfg = STAGE_CFG[deal.stage] || STAGE_CFG['Prospect'];
  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
      className="nova-card p-4 cursor-pointer group transition-all"
      style={{ opacity: deal.stage==='Closed Lost' ? 0.6 : 1, borderLeft:`3px solid var(${cfg.accentVar})` }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`var(${cfg.accentVar})`; e.currentTarget.style.boxShadow=`0 4px 20px var(${cfg.dimVar})`;}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-card)';}}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-sm font-semibold leading-snug pr-2" style={{ color:'var(--text-primary)' }}>{deal.title||deal.name}</h4>
        <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          style={{ color:'var(--text-tertiary)' }}
          onMouseEnter={e=>{ e.currentTarget.style.background='var(--bg-surface)'; e.currentTarget.style.color='var(--text-primary)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-tertiary)'; }}>
          <MoreVertical size={14} />
        </button>
      </div>
      <p className="text-xl font-bold mb-3" style={{ color:`var(${cfg.accentVar})` }}>
        ${(deal.value||0).toLocaleString()}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold"
            style={{ background:`var(${cfg.dimVar})`, color:`var(${cfg.accentVar})` }}>
            {(deal.company||deal.title||'?').charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium" style={{ color:'var(--text-secondary)' }}>{deal.company||'—'}</span>
        </div>
        {deal.closeDate && (
          <div className="flex items-center gap-1 text-[10px]" style={{ color:'var(--text-tertiary)' }}>
            <Calendar size={9} />
            {new Date(deal.closeDate).toLocaleDateString('en-US',{month:'short',day:'numeric'})}
          </div>
        )}
      </div>
      {deal.notes && <p className="mt-2.5 text-xs line-clamp-1" style={{ color:'var(--text-tertiary)' }}>{deal.notes}</p>}
    </motion.div>
  );
}

export default function DealsPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [deals,   setDeals]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [view,    setView]    = useState('kanban');
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    getDeals().then(d=>setDeals(d.data||[])).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, [navigate]);

  const grouped = STAGES.reduce((acc, s) => {
    acc[s] = deals.filter(d => d.stage===s && (!search || d.title?.toLowerCase().includes(search.toLowerCase()) || d.company?.toLowerCase().includes(search.toLowerCase())));
    return acc;
  }, {});

  const thStyle = { color:'var(--text-tertiary)', borderBottom:'1px solid var(--border-subtle)', padding:'12px 20px', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' };

  return (
    <div className="glow-bg min-h-screen" style={{ background:'var(--bg-canvas)', color:'var(--text-primary)' }}>
      <SharedHeader />
      <main className="max-w-[1400px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5" style={{ color:'var(--accent-blue)' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color:'var(--accent-blue)' }}>Sales Pipeline</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Deals</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>
              {loading ? 'Loading…' : `${deals.length} deals in pipeline`}
            </p>
          </motion.div>
          <div className="flex items-center gap-3">
            <input placeholder="Search deals…" value={search} onChange={e=>setSearch(e.target.value)}
              className="nova-input !py-2 w-44 text-sm" />
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)' }}>
              {[['kanban',<LayoutGrid size={13} />,'Kanban'],['table',<List size={13} />,'Table']].map(([v,icon,label])=>(
                <button key={v} onClick={()=>setView(v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={view===v ? { background:'var(--accent-blue)', color:'#fff', boxShadow:'var(--shadow-blue)' } : { color:'var(--text-secondary)' }}>
                  {icon}{label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="mb-5 badge badge-rose px-4 py-2 text-xs !rounded-xl">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:'var(--accent-blue)', borderTopColor:'transparent' }} />
          </div>
        ) : view==='kanban' ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const cfg = STAGE_CFG[stage];
              const stageDeals = grouped[stage];
              const total = stageDeals.reduce((s,d)=>s+(d.value||0),0);
              return (
                <div key={stage} className="flex-1 min-w-[220px]">
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom:`2px solid var(${cfg.accentVar})` }}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold" style={{ color:'var(--text-primary)' }}>{stage}</h3>
                      <span className="badge" style={{ background:`var(${cfg.dimVar})`, color:`var(${cfg.accentVar})`, border:`1px solid var(${cfg.accentVar})30`, padding:'1px 7px', fontSize:10 }}>
                        {stageDeals.length}
                      </span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color:'var(--text-tertiary)' }}>${total.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {stageDeals.length===0 ? (
                      <div className="text-center py-8 text-xs" style={{ color:'var(--text-disabled)' }}>No deals</div>
                    ) : stageDeals.map(d=><DealCard key={d.id||d.PK} deal={d} />)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="nova-card overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {['Deal','Stage','Value','Company','Close Date'].map(h=>(
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deals.filter(d=>!search||d.title?.toLowerCase().includes(search.toLowerCase())).map((deal,i)=>{
                  const cfg = STAGE_CFG[deal.stage]||STAGE_CFG['Prospect'];
                  return (
                    <motion.tr key={deal.id||deal.PK} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                      className="transition-colors"
                      style={{ borderBottom:'1px solid var(--border-subtle)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='var(--bg-surface)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="px-5 py-3.5 text-sm font-medium" style={{ color:'var(--text-primary)' }}>{deal.title||deal.name}</td>
                      <td className="px-5 py-3.5"><span className={`badge ${cfg.badgeCls}`}>{deal.stage}</span></td>
                      <td className="px-5 py-3.5 text-sm font-bold" style={{ color:`var(${cfg.accentVar})` }}>${(deal.value||0).toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color:'var(--text-secondary)' }}>{deal.company||'—'}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color:'var(--text-tertiary)' }}>
                        {deal.closeDate?new Date(deal.closeDate).toLocaleDateString():'—'}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
