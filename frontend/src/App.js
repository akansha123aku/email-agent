import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const sampleEmails = [
  { name: "Order Status", from: "customer@example.com", subject: "Where is my order #12345?", body: "I ordered 5 days ago and haven't received tracking information." },
  { name: "Complaint", from: "angry@customer.com", subject: "Product arrived damaged!", body: "The item I received was broken. This is very disappointing." },
  { name: "Feedback", from: "happy@customer.com", subject: "Love my new purchase!", body: "Just wanted to say the quality is amazing. Thank you!" },
  { name: "Product Question", from: "shopper@email.com", subject: "Does this come in size large?", body: "Do you have the blue jacket in size large?" },
  { name: "Refund Request", from: "refund@customer.com", subject: "I want a refund", body: "The product doesn't work as expected. Please process my refund." },
];

const categoryConfig = {
  order_status:     { color: '#6366f1', light: '#eef2ff', border: '#c7d2fe', label: 'Order Status' },
  product_question: { color: '#0ea5e9', light: '#e0f2fe', border: '#7dd3fc', label: 'Product Question' },
  complaint:        { color: '#ef4444', light: '#fef2f2', border: '#fca5a5', label: 'Complaint' },
  feedback:         { color: '#22c55e', light: '#f0fdf4', border: '#86efac', label: 'Feedback' },
  refund_request:   { color: '#f97316', light: '#fff7ed', border: '#fdba74', label: 'Refund Request' },
  spam:             { color: '#94a3b8', light: '#f1f5f9', border: '#cbd5e1', label: 'Spam' },
  general_inquiry:  { color: '#8b5cf6', light: '#f5f3ff', border: '#c4b5fd', label: 'General Inquiry' },
};

const G = {
  bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)',
  card: 'rgba(255,255,255,0.97)',
  cardBorder: 'rgba(255,255,255,0.6)',
  inputBg: '#f8f8ff',
  inputBorder: '#e0e7ff',
  inputFocus: '#6366f1',
  purple: '#6366f1',
  purpleDark: '#4338ca',
  purpleLight: '#eef2ff',
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  html, body, #root {
    margin: 0; padding: 0;
    min-height: 100vh;
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%) !important;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  * { box-sizing: border-box; }
  input, textarea, button { font-family: 'Plus Jakarta Sans', sans-serif; }
  input:focus, textarea:focus { outline: none; }
  .sample-pill:hover { background: #e0e7ff !important; color: #4338ca !important; border-color: #a5b4fc !important; }
  .submit-btn:hover:not(:disabled) { background: #4338ca !important; transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.4) !important; }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none !important; }
  .submit-btn { transition: all 0.2s ease; }
  .arch-item:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
  .arch-item { transition: all 0.2s ease; }
`;

export default function App() {
  const [email, setEmail] = useState({ from_email: '', subject: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => setEmail({ ...email, [e.target.name]: e.target.value });
  const loadSample = (s) => setEmail({ from_email: s.from, subject: s.subject, body: s.body });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await axios.post(`${API_URL}/process`, email);
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const cat = response ? (categoryConfig[response.category] || categoryConfig.general_inquiry) : null;
  const conf = response ? Math.round((response.confidence || 0) * 100) : 0;

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', background: G.bg, padding: '0 0 3rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📧</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>Email Auto-Responder Agent</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>Multi-Agent System · 3 Specialized Agents · Groq API</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {['Classifier', 'Decision', 'Writer'].map((a, i) => (
              <span key={i} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 500 }}>{a}</span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 0' }}>

          {/* Two column grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

            {/* Compose card */}
            <div style={{ background: G.card, borderRadius: 20, border: `1px solid ${G.cardBorder}`, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: G.purpleLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✏️</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b' }}>Compose Email</span>
              </div>

              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Quick Test Samples</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.5rem' }}>
                {sampleEmails.map((s, i) => (
                  <button key={i} className="sample-pill" onClick={() => loadSample(s)}
                    style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, border: '1px solid #e0e7ff', background: G.purpleLight, color: G.purple, cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}>
                    {s.name}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                {[
                  { label: 'From Email', name: 'from_email', type: 'email', placeholder: 'sender@example.com' },
                  { label: 'Subject', name: 'subject', type: 'text', placeholder: 'Email subject line' },
                ].map(f => (
                  <div key={f.name} style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{f.label} *</label>
                    <input type={f.type} name={f.name} value={email[f.name]} onChange={handleChange} required placeholder={f.placeholder}
                      style={{ width: '100%', padding: '10px 13px', borderRadius: 10, border: `1.5px solid ${G.inputBorder}`, background: G.inputBg, color: '#111827', fontSize: 14 }}
                      onFocus={e => { e.target.style.borderColor = G.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${G.purpleLight}`; }}
                      onBlur={e => { e.target.style.borderColor = G.inputBorder; e.target.style.boxShadow = 'none'; }} />
                  </div>
                ))}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Body *</label>
                  <textarea name="body" value={email.body} onChange={handleChange} required placeholder="Write the email body here..." rows={5}
                    style={{ width: '100%', padding: '10px 13px', borderRadius: 10, border: `1.5px solid ${G.inputBorder}`, background: G.inputBg, color: '#111827', fontSize: 14, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={e => { e.target.style.borderColor = G.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${G.purpleLight}`; }}
                    onBlur={e => { e.target.style.borderColor = G.inputBorder; e.target.style.boxShadow = 'none'; }} />
                </div>
                <button type="submit" disabled={loading} className="submit-btn"
                  style={{ width: '100%', padding: '12px', background: G.purple, color: '#fff', border: 'none', borderRadius: 11, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                  {loading ? '⏳ Processing...' : '⚡ Process Email'}
                </button>
              </form>
            </div>

            {/* Response card */}
            <div style={{ background: G.card, borderRadius: 20, border: `1px solid ${G.cardBorder}`, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b' }}>Agent Response</span>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '0.9rem 1rem', color: '#b91c1c', fontSize: 13, display: 'flex', gap: 8 }}>
                  <span>⚠️</span><div><strong>Error:</strong> {error}</div>
                </div>
              )}

              {!response && !error && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 12 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>📭</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>Submit an email to see the agent response</div>
                  <div style={{ fontSize: 12, color: '#c4b5fd' }}>3 agents will process your email</div>
                </div>
              )}

              {response && cat && (
                <>
                  {/* Pipeline */}
                  <div style={{ background: '#fafafa', borderRadius: 14, border: '1px solid #f1f5f9', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Agent Pipeline</div>
                    {[
                      { num: 1, color: cat.color, label: 'Classifier', value: cat.label, extra: `${conf}%` },
                      { num: 2, color: '#10b981', label: 'Decision', value: (response.action || '').replace(/_/g, ' ') },
                      { num: 3, color: '#f59e0b', label: 'Writer', value: response.action === 'auto_reply' ? 'Response drafted' : 'Flagged for human' },
                    ].map((step, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, marginBottom: i < 2 ? 4 : 0 }}>
                          <div style={{ width: 22, height: 22, borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{step.num}</div>
                          <span style={{ color: '#94a3b8', minWidth: 65, fontSize: 12 }}>{step.label}</span>
                          <span style={{ color: '#d1d5db', fontSize: 11 }}>→</span>
                          <span style={{ fontWeight: 600, color: step.num === 1 ? step.color : '#374151', textTransform: 'capitalize' }}>{step.value}</span>
                          {step.extra && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: step.color }}>{step.extra}</span>}
                        </div>
                        {i === 0 && (
                          <div style={{ height: 3, background: '#f1f5f9', borderRadius: 2, margin: '5px 0 6px 32px' }}>
                            <div style={{ height: 3, borderRadius: 2, background: cat.color, width: `${conf}%`, transition: 'width 0.5s ease' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Response box */}
                  <div style={{ background: cat.light, borderRadius: 14, border: `1.5px solid ${cat.border}`, borderLeft: `4px solid ${cat.color}`, padding: '1rem 1.25rem', marginBottom: '0.9rem', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>📨 Response</div>
                    <div style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7 }}>{response.response}</div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    <span style={{ fontSize: 11, padding: '4px 11px', borderRadius: 20, fontWeight: 600, background: cat.light, color: cat.color, border: `1px solid ${cat.border}` }}>{cat.label}</span>
                    <span style={{ fontSize: 11, padding: '4px 11px', borderRadius: 20, fontWeight: 600, background: response.reviewed ? '#fef9c3' : '#f0fdf4', color: response.reviewed ? '#92400e' : '#166534', border: `1px solid ${response.reviewed ? '#fde68a' : '#86efac'}` }}>
                      {response.reviewed ? '👤 Needs human review' : '✅ Auto-handled'}
                    </span>
                    <span style={{ fontSize: 11, padding: '4px 11px', borderRadius: 20, fontWeight: 600, background: '#f5f3ff', color: G.purple, border: '1px solid #e0e7ff' }}>{conf}% confidence</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Architecture */}
          <div style={{ background: G.card, borderRadius: 20, border: `1px solid ${G.cardBorder}`, padding: '1.75rem', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧠</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1e1b4b' }}>Multi-Agent Architecture</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { icon: '🔍', name: 'Classifier Agent', desc: 'Reads and categorizes the incoming email into predefined types', color: '#6366f1', light: '#eef2ff', border: '#c7d2fe' },
                { icon: '⚖️', name: 'Decision Agent', desc: 'Determines whether to auto-reply or escalate to a human', color: '#10b981', light: '#f0fdf4', border: '#86efac' },
                { icon: '✍️', name: 'Writer Agent', desc: 'Drafts a professional, context-aware response email', color: '#f59e0b', light: '#fffbeb', border: '#fde68a' },
              ].map((a, i) => (
                <div key={i} className="arch-item" style={{ borderRadius: 14, padding: '1.25rem', background: a.light, border: `1.5px solid ${a.border}`, textAlign: 'center', cursor: 'default' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: a.color, marginBottom: 6 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}