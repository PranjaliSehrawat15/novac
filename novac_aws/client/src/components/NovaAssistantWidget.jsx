import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { askAIAssistant } from '../services/api';

const QUICK_QUESTIONS = [
  'Which leads should I contact today?',
  'Which deals look at risk this week?',
  'What is my most important next sales action?',
];

export default function NovaAssistantWidget() {
  const [question, setQuestion] = useState(QUICK_QUESTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const ask = async (text) => {
    setLoading(true);
    setError('');
    setQuestion(text);
    try {
      const res = await askAIAssistant({ question: text });
      setResult(res.data?.response || null);
    } catch (err) {
      setError(err.message || 'Nova request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nova-card p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'var(--text-tertiary)' }}>Amazon Nova</p>
          <h2 className="text-base font-bold" style={{ color:'var(--text-primary)' }}>CRM Assistant</h2>
        </div>
        <span className="badge badge-blue">AI</span>
      </div>

      <div className="space-y-2 mb-4">
        {QUICK_QUESTIONS.map((item) => (
          <button
            key={item}
            onClick={() => ask(item)}
            className="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
            style={{ background:'var(--bg-surface)', color:'var(--text-primary)', border:'1px solid var(--border-subtle)' }}
          >
            {item}
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="nova-input text-sm resize-none mb-3"
        placeholder="Ask Nova about your CRM data"
      />
      <button
        onClick={() => ask(question)}
        disabled={loading || !question.trim()}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background:'var(--accent-blue)', boxShadow:'var(--shadow-blue)', opacity: loading || !question.trim() ? 0.7 : 1 }}
      >
        {loading ? 'Asking Nova…' : 'Ask Nova'}
      </button>

      {error && <div className="badge badge-rose px-3 py-2 text-xs !rounded-lg w-full mt-4">{error}</div>}

      <div className="mt-4 rounded-2xl p-4" style={{ background:'var(--bg-surface)', border:'1px solid var(--border-subtle)' }}>
        {loading ? (
          <div className="flex items-center gap-2 text-sm" style={{ color:'var(--text-secondary)' }}>
            <Loader2 className="w-4 h-4 animate-spin" /> Generating answer...
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-tertiary)' }}>Answer</p>
              <p className="text-sm whitespace-pre-wrap" style={{ color:'var(--text-primary)' }}>{result.answer}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color:'var(--text-tertiary)' }}>Recommended actions</p>
              {result.recommendedActions?.length ? (
                <ul className="list-disc pl-5 space-y-2 text-sm" style={{ color:'var(--text-primary)' }}>
                  {result.recommendedActions.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p className="text-sm" style={{ color:'var(--text-secondary)' }}>No actions returned.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm" style={{ color:'var(--text-tertiary)' }}>
            <Sparkles className="w-4 h-4" /> Ask a question to get AI recommendations.
          </div>
        )}
      </div>
    </div>
  );
}
