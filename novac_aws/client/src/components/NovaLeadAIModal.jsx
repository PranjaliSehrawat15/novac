import React, { useMemo, useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import { analyzeLeadAI, generateEmailAI, summarizeNotesAI } from '../services/api';

const TABS = [
  { key: 'analysis', label: 'Lead Analysis' },
  { key: 'email', label: 'Generate Email' },
  { key: 'notes', label: 'Summarize Notes' },
];

export default function NovaLeadAIModal({ lead, onClose }) {
  const [activeTab, setActiveTab] = useState('analysis');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [emailDraft, setEmailDraft] = useState(null);
  const [notesSummary, setNotesSummary] = useState(null);
  const [goal, setGoal] = useState('schedule a product demo');
  const [tone, setTone] = useState('professional and warm');
  const [notesInput, setNotesInput] = useState(lead?.notes || '');

  const leadContext = useMemo(() => ({
    leadId: lead?.id,
    lead: {
      name: lead?.name,
      company: lead?.company,
      email: lead?.email,
      phone: lead?.phone,
      status: lead?.status,
      notes: lead?.notes,
    },
  }), [lead]);

  const runAction = async (tabKey) => {
    setActiveTab(tabKey);
    setLoading(true);
    setError('');
    try {
      if (tabKey === 'analysis') {
        const res = await analyzeLeadAI({ leadId: lead.id });
        setAnalysis(res.data);
      }
      if (tabKey === 'email') {
        const res = await generateEmailAI({
          leadId: lead.id,
          goal,
          tone,
          context: lead.notes || '',
        });
        setEmailDraft(res.data);
      }
      if (tabKey === 'notes') {
        const res = await summarizeNotesAI({
          leadId: lead.id,
          rawNotes: notesInput,
        });
        setNotesSummary(res.data);
      }
    } catch (err) {
      setError(err.message || 'Nova request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)' }}>
      <div className="nova-card w-full max-w-3xl max-h-[90vh] overflow-hidden" style={{ boxShadow:'var(--shadow-elevated)' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom:'1px solid var(--border-subtle)' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color:'var(--text-tertiary)' }}>Amazon Nova</p>
            <h2 className="text-lg font-bold" style={{ color:'var(--text-primary)' }}>{lead?.name || 'Lead'} AI Workspace</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color:'var(--text-secondary)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-[240px,1fr] gap-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4">
            <div className="nova-card-inner p-4" style={{ background:'var(--bg-surface)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-tertiary)' }}>Lead</p>
              <div className="space-y-1.5 text-sm">
                <div style={{ color:'var(--text-primary)' }}>{lead?.name}</div>
                <div style={{ color:'var(--text-secondary)' }}>{lead?.company || '—'}</div>
                <div style={{ color:'var(--text-secondary)' }}>{lead?.email || '—'}</div>
                <div style={{ color:'var(--text-secondary)' }}>Status: {lead?.status || '—'}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => runAction(tab.key)}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all"
                  style={activeTab === tab.key
                    ? { background:'var(--accent-blue)', color:'#fff', boxShadow:'var(--shadow-blue)' }
                    : { background:'var(--bg-surface)', color:'var(--text-primary)', border:'1px solid var(--border-subtle)' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="badge badge-rose px-3 py-2 text-xs !rounded-lg w-full">{error}</div>
            )}

            {loading && (
              <div className="nova-card-inner p-8 flex items-center justify-center gap-2" style={{ background:'var(--bg-surface)' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm" style={{ color:'var(--text-secondary)' }}>Nova is generating...</span>
              </div>
            )}

            {activeTab === 'analysis' && !loading && (
              <div className="nova-card-inner p-5 space-y-4" style={{ background:'var(--bg-surface)' }}>
                {!analysis ? (
                  <EmptyState text="Run lead analysis to get score, priority, and next action." />
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Stat label="Score" value={analysis.analysis?.score ?? '—'} />
                      <Stat label="Priority" value={analysis.analysis?.priority ?? '—'} />
                      <Stat label="Action" value={analysis.analysis?.recommendedAction ?? '—'} />
                    </div>
                    <Block title="Reasoning" content={analysis.analysis?.reasoning} />
                    <Block title="Suggested follow-up" content={analysis.analysis?.followUpMessage} />
                  </>
                )}
              </div>
            )}

            {activeTab === 'email' && !loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="text-xs font-semibold" style={{ color:'var(--text-secondary)' }}>
                    Goal
                    <input value={goal} onChange={e => setGoal(e.target.value)} className="nova-input mt-1.5 text-sm" />
                  </label>
                  <label className="text-xs font-semibold" style={{ color:'var(--text-secondary)' }}>
                    Tone
                    <input value={tone} onChange={e => setTone(e.target.value)} className="nova-input mt-1.5 text-sm" />
                  </label>
                </div>
                <div className="nova-card-inner p-5 space-y-4" style={{ background:'var(--bg-surface)' }}>
                  {!emailDraft ? (
                    <EmptyState text="Run email generation to create a personalized draft." />
                  ) : (
                    <>
                      <Block title="Subject" content={emailDraft.emailDraft?.subject} />
                      <Block title="Email body" content={emailDraft.emailDraft?.body} multiline />
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notes' && !loading && (
              <div className="space-y-4">
                <label className="text-xs font-semibold block" style={{ color:'var(--text-secondary)' }}>
                  Notes to summarize
                  <textarea
                    rows={6}
                    value={notesInput}
                    onChange={e => setNotesInput(e.target.value)}
                    className="nova-input mt-1.5 text-sm resize-none"
                    placeholder="Paste meeting or lead notes here"
                  />
                </label>
                <div className="nova-card-inner p-5 space-y-4" style={{ background:'var(--bg-surface)' }}>
                  {!notesSummary ? (
                    <EmptyState text="Run note summarization to extract summary, action items, and risks." />
                  ) : (
                    <>
                      <Block title="Summary" content={notesSummary.summary} multiline />
                      <ListBlock title="Action items" items={notesSummary.actionItems} />
                      <ListBlock title="Concerns" items={notesSummary.concerns} />
                      <Block title="Next step" content={notesSummary.nextStep} />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center" style={{ color:'var(--text-tertiary)' }}>
      <Sparkles className="w-5 h-5" />
      <p className="text-sm max-w-md">{text}</p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl p-4" style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-subtle)' }}>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color:'var(--text-tertiary)' }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

function Block({ title, content, multiline }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-tertiary)' }}>{title}</p>
      <div className={`rounded-xl p-4 text-sm ${multiline ? 'whitespace-pre-wrap' : ''}`} style={{ background:'var(--bg-elevated)', color:'var(--text-primary)', border:'1px solid var(--border-subtle)' }}>
        {content || '—'}
      </div>
    </div>
  );
}

function ListBlock({ title, items = [] }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-tertiary)' }}>{title}</p>
      <div className="rounded-xl p-4 text-sm" style={{ background:'var(--bg-elevated)', color:'var(--text-primary)', border:'1px solid var(--border-subtle)' }}>
        {items.length === 0 ? '—' : (
          <ul className="space-y-2 list-disc pl-5">
            {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
