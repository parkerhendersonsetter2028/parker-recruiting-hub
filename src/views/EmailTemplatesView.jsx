import React, { useState } from 'react';
import { ArrowLeft, Calendar, Check, CheckCircle2, ClipboardList, Copy, FileText, Inbox, Mail, Phone, ShieldCheck, Target, Trophy, Video } from 'lucide-react';
import { FontStyle } from '../components/FontStyle.jsx';
import { buildTemplate, COLOR_MAP } from '../data/emailTemplates.js';

export const EmailTemplatesView = ({ school, onBack }) => {
  const [activeTab, setActiveTab] = useState('intro');
  const [copied, setCopied] = useState('');
  const [editedSubjects, setEditedSubjects] = useState({});
  const [editedBodies, setEditedBodies] = useState({});
  const tIds = ['intro', 'tournament', 'video'];

  const getSubject = (id) => editedSubjects[id] ?? buildTemplate(id, school).subject;
  const getBody    = (id) => editedBodies[id]   ?? buildTemplate(id, school).body;

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(key); setTimeout(() => setCopied(''), 2000); });
  };

  const tpl = buildTemplate(activeTab, school);
  const colors = COLOR_MAP[tpl.color];

  return (
    <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
      <FontStyle />
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)" }} className="px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <ShieldCheck className="text-blue-400 w-4 h-4" />
              <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Parker Henderson · Outreach Templates{school ? ` · ${school.name}` : ''}</span>
            </div>
            <h1 className="font-black text-white text-3xl tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>COACH OUTREACH <span className="text-blue-400">EMAIL TEMPLATES</span></h1>
          </div>
          <button onClick={onBack} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wide transition-all">
            <ArrowLeft className="w-4 h-4" /> {school ? school.name : 'Dashboard'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 pt-8">
        {/* STRATEGY BANNER */}
        <div className="rounded-2xl mb-8 p-6 border border-blue-200" style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-black text-blue-900 text-lg mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>3-PHASE OUTREACH STRATEGY</div>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                Coaches receive hundreds of emails. Consistent, personalized outreach across all three phases dramatically increases visibility.
                {school ? ` These templates are pre-filled for ${school.name}${school.coaches?.[0]?.name ? ` — Coach ${school.coaches[0].name.split(' ').slice(-1)[0]}` : ''}.` : ' Select a school from the dashboard to auto-fill coach names.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { Icon: Mail, text: 'Phase 1: Introduce → get on radar' },
                  { Icon: Trophy, text: 'Phase 2: Tournament invite → live eval' },
                  { Icon: Video, text: 'Phase 3: New video → show growth' },
                ].map(({ Icon, text }, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 text-blue-800 text-xs font-semibold rounded-full border border-blue-200"><Icon className="w-3.5 h-3.5" /> {text}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex gap-3 mb-6">
          {tIds.map(id => {
            const t = buildTemplate(id, school);
            const c = COLOR_MAP[t.color];
            const isActive = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border ${isActive ? `${c.badge} text-white border-transparent shadow-lg` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                <div className="text-[10px] opacity-70 mb-0.5">{t.phase}</div>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* ACTIVE TEMPLATE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className={`px-6 py-3 flex items-center gap-2 text-sm font-semibold border-b border-slate-100 ${colors.light}`}>
            <span className="inline-flex items-center">{tpl.icon === 'mail' ? <Mail className="w-5 h-5" /> : tpl.icon === 'send' ? <Trophy className="w-5 h-5" /> : <Video className="w-5 h-5" />}</span>
            <span>{tpl.tip}</span>
            {school?.coaches?.[0]?.email && (
              <span className="ml-auto text-xs font-normal opacity-75">Send to: <strong>{school.coaches[0].email}</strong></span>
            )}
          </div>
          <div className="p-6 space-y-5">
            {/* SUBJECT */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</label>
                <button onClick={() => copy(getSubject(activeTab), `subj-${activeTab}`)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  {copied === `subj-${activeTab}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied === `subj-${activeTab}` ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
                value={getSubject(activeTab)} onChange={e => setEditedSubjects(prev => ({ ...prev, [activeTab]: e.target.value }))} />
            </div>
            {/* BODY */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Body</label>
                <button onClick={() => copy(getBody(activeTab), `body-${activeTab}`)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                  {copied === `body-${activeTab}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied === `body-${activeTab}` ? 'Copied!' : 'Copy Body'}
                </button>
              </div>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none leading-relaxed"
                style={{ minHeight: '420px', fontFamily: 'ui-monospace, monospace' }}
                value={getBody(activeTab)} onChange={e => setEditedBodies(prev => ({ ...prev, [activeTab]: e.target.value }))} />
            </div>
            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100">
              <button onClick={() => copy(`Subject: ${getSubject(activeTab)}\n\n${getBody(activeTab)}`, `all-${activeTab}`)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${colors.btn}`}>
                {copied === `all-${activeTab}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === `all-${activeTab}` ? 'Copied!' : 'Copy Full Email'}
              </button>
              {school?.coaches?.[0]?.email && (
                <a href={`mailto:${school.coaches[0].email}?subject=${encodeURIComponent(getSubject(activeTab))}&body=${encodeURIComponent(getBody(activeTab))}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide bg-slate-800 hover:bg-slate-700 text-white transition-all">
                  <Mail className="w-4 h-4" /> Open in Mail App
                </a>
              )}
              <button onClick={() => { setEditedSubjects(p => { const n={...p}; delete n[activeTab]; return n; }); setEditedBodies(p => { const n={...p}; delete n[activeTab]; return n; }); }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all">
                Reset to Default
              </button>
            </div>
          </div>
        </div>

        {/* QUICK REF */}
        <div className="mt-8">
          <h3 className="font-black text-slate-700 text-base uppercase tracking-widest mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Quick Reference — All 3 Phases</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tIds.map(id => {
              const t = buildTemplate(id, school);
              const c = COLOR_MAP[t.color];
              return (
                <div key={id} className={`rounded-2xl border p-5 ${c.light}`}>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${c.badge} inline-block mb-2`}>{t.phase}</span>
                  <div className="font-black text-slate-800 text-sm mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{t.label.toUpperCase()}</div>
                  <div className="text-xs text-slate-600 leading-relaxed mb-3">{t.tip}</div>
                  <button onClick={() => setActiveTab(id)} className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wide border ${activeTab === id ? `${c.badge} text-white border-transparent` : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                    {activeTab === id ? (<span className="inline-flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Currently Viewing</span>) : 'View Template'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* PRO TIPS */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 font-black text-white text-lg mb-4 uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}><ClipboardList className="w-5 h-5" /> Outreach Pro Tips</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 leading-relaxed">
            {[
              { Icon: Inbox, tip: 'Always fill in ALL bracketed fields before sending. Sending a template with "[INSERT]" still in it is worse than not sending at all.' },
              { Icon: Target, tip: "Personalize Phase 1 with one specific fact about the program — a recent win, a coach's style, or a specific major you researched." },
              { Icon: Calendar, tip: 'Send Phase 2 exactly 7–10 days before the tournament, not the night before. Coaches plan travel in advance.' },
              { Icon: Video, tip: 'For Phase 3, mention one specific skill you have improved. Vague follow-ups get ignored. Specific growth stories get responses.' },
              { Icon: CheckCircle2, tip: 'Log every email in the Interaction Log on each school detail page to keep your pipeline status current.' },
              { Icon: Phone, tip: 'If a coach responds, move immediately to a phone/video call. Rapid responsiveness signals high character.' },
            ].map(({ Icon, tip }, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                <Icon className="w-5 h-5 flex-shrink-0 text-slate-200 mt-0.5" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
