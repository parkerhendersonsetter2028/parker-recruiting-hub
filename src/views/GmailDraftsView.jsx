import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Loader2, Mail, PartyPopper, X } from 'lucide-react';
import { SchoolLogo } from '../components/SchoolLogo.jsx';
import { buildTemplate } from '../data/emailTemplates.js';
import { gmailAuthStatus, gmailDisconnect, createGmailDrafts } from '../lib/api.js';

// ─── GMAIL DRAFTS VIEW ───────────────────────────────────────────────────────
// Auth is server-side: a refresh_token stored in Netlify Blobs mints fresh
// access tokens on every draft run, so Parker only sees Google's consent
// screen once (then again only if Google invalidates the refresh token —
// every ~7 days while the OAuth app is in Testing mode).

const readAuthResultFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const result = params.get('gmail_auth');
  if (!result) return null;
  const reason = params.get('reason');
  // Strip the params so a refresh doesn't re-trigger the message
  params.delete('gmail_auth');
  params.delete('reason');
  const newSearch = params.toString();
  const url = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
  window.history.replaceState({}, '', url);
  return { result, reason };
};

export const GmailDraftsView = ({ allSchools, onBack }) => {
  const [status, setStatus] = useState({ loading: true, connected: false, connectedAt: null });
  const [draftPhase, setDraftPhase] = useState('intro');
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [authMessage, setAuthMessage] = useState(null); // { kind: 'success'|'error', text }

  const schoolsWithEmail = allSchools.filter(
    s => (s.coaches?.[0]?.email && s.coaches[0].email !== 'recruit@jessup.edu') || s.coaches?.[0]?.email
  );

  useEffect(() => {
    const authResult = readAuthResultFromUrl();
    if (authResult?.result === 'success') {
      setAuthMessage({ kind: 'success', text: 'Gmail connected. You won\'t need to do this again.' });
    } else if (authResult?.result === 'error') {
      setAuthMessage({ kind: 'error', text: `Couldn't connect Gmail (${authResult.reason || 'unknown'}). Try again.` });
    }
    (async () => {
      const s = await gmailAuthStatus();
      setStatus({ loading: false, connected: !!s.connected, connectedAt: s.connectedAt || null });
    })();
  }, []);

  const connect = () => {
    window.location.href = '/.netlify/functions/gmail-auth-start';
  };

  const disconnect = async () => {
    if (!confirm('Disconnect Gmail? You\'ll have to reconnect next time.')) return;
    await gmailDisconnect();
    setStatus({ loading: false, connected: false, connectedAt: null });
    setResults({});
  };

  const buildDraft = (school) => {
    const tpl = buildTemplate(draftPhase, school);
    return {
      schoolId: school.id,
      to: school.coaches?.[0]?.email || '',
      subject: tpl.subject,
      body: tpl.body,
    };
  };

  const runAllDrafts = async () => {
    setIsRunning(true);
    const pending = Object.fromEntries(schoolsWithEmail.map(s => [s.id, 'pending']));
    setResults(pending);
    try {
      const payload = schoolsWithEmail.map(buildDraft);
      const { results: serverResults } = await createGmailDrafts(payload);
      const next = {};
      for (const r of serverResults) next[r.schoolId] = r.status;
      setResults(next);
    } catch (e) {
      if (e.code === 'not_connected' || e.code === 'invalid_grant') {
        setStatus({ loading: false, connected: false, connectedAt: null });
        setAuthMessage({ kind: 'error', text: 'Gmail connection expired. Please reconnect.' });
      } else {
        setAuthMessage({ kind: 'error', text: `Error creating drafts: ${e.message}` });
      }
      setResults({});
    }
    setIsRunning(false);
  };

  const doneCount = Object.values(results).filter(v => v === 'done').length;
  const errorCount = Object.values(results).filter(v => v === 'error').length;
  const phaseLabels = { intro: 'Phase 1 — Introductory', tournament: 'Phase 2 — Tournament Invite', video: 'Phase 3 — Highlight Video' };
  const phaseColors = { intro: 'bg-blue-600', tournament: 'bg-emerald-600', video: 'bg-purple-600' };

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-4xl">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Outreach Automation
          </div>
          <h1
            className="font-black text-slate-900 tracking-tight leading-none mt-1"
            style={{ fontSize: '2rem', fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            GMAIL <span className="text-emerald-600">DRAFT CREATOR</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create personalized drafts for every coach on your list in one click.</p>
        </div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-xs font-bold uppercase tracking-wide transition-all self-start"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* AUTH MESSAGE BANNER (from OAuth redirect) */}
      {authMessage && (
        <div className={`mb-4 px-5 py-3 rounded-2xl border text-sm font-semibold flex items-center gap-2 ${
          authMessage.kind === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {authMessage.kind === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          <span>{authMessage.text}</span>
          <button onClick={() => setAuthMessage(null)} className="ml-auto text-xs uppercase tracking-wide opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}

      <div className="space-y-6">
        {/* LOADING */}
        {status.loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-3 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" /> Checking Gmail connection…
          </div>
        )}

        {/* NOT CONNECTED */}
        {!status.loading && !status.connected && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">1</div>
              <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Connect Gmail</h2>
            </div>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              One click to link your Gmail account. Google will ask you to grant permission to create drafts — you only need to do this once.
            </p>
            <button
              onClick={connect}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all"
            >
              <Mail className="w-4 h-4" /> Connect Gmail Account
            </button>
          </div>
        )}

        {/* CONNECTED */}
        {!status.loading && status.connected && (
          <>
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3">
              <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="text-emerald-800 font-bold text-sm">
                Gmail connected{status.connectedAt ? ` · ${new Date(status.connectedAt).toLocaleDateString()}` : ''}
              </span>
              <button onClick={disconnect} className="ml-auto text-xs text-slate-500 hover:text-slate-700 font-bold uppercase tracking-wide">
                Disconnect
              </button>
            </div>

            {/* PHASE SELECTOR */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">1</div>
                <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Choose Email Phase</h2>
              </div>
              <div className="flex gap-3">
                {Object.entries(phaseLabels).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setDraftPhase(id)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border ${
                      draftPhase === id
                        ? `${phaseColors[id]} text-white border-transparent shadow-lg`
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCHOOL LIST + LAUNCH */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm">2</div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Create Drafts</h2>
                    <p className="text-xs text-slate-500 mt-0.5">{schoolsWithEmail.length} schools with coach emails · {phaseLabels[draftPhase]}</p>
                  </div>
                </div>
                <button
                  onClick={runAllDrafts}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all"
                >
                  {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isRunning ? 'Creating drafts…' : `Create All ${schoolsWithEmail.length} Drafts`}
                </button>
              </div>

              {Object.keys(results).length > 0 && (
                <div className="flex gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm"><Check className="w-4 h-4" /> {doneCount} created</span>
                  {errorCount > 0 && <span className="inline-flex items-center gap-1.5 text-red-500 font-bold text-sm"><X className="w-4 h-4" /> {errorCount} failed</span>}
                  <span className="text-slate-500 text-sm">{Object.keys(results).length} / {schoolsWithEmail.length} processed</span>
                  {!isRunning && doneCount > 0 && (
                    <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                      className="ml-auto text-blue-600 font-bold text-xs hover:underline">
                      Open Gmail Drafts ↗
                    </a>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {schoolsWithEmail.map(school => {
                  const s = results[school.id];
                  const to = school.coaches?.[0]?.email || '';
                  return (
                    <div key={school.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      s === 'done'    ? 'bg-emerald-50 border-emerald-200' :
                      s === 'error'   ? 'bg-red-50 border-red-200' :
                      s === 'pending' ? 'bg-blue-50 border-blue-200' :
                      s === 'skipped' ? 'bg-slate-50 border-slate-200 opacity-50' :
                      'bg-white border-slate-100'
                    }`}>
                      <SchoolLogo school={school} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm">{school.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">To: {to || 'No email on file'}</div>
                      </div>
                      <div className="text-[11px] font-bold px-2 py-1 rounded-full flex-shrink-0 uppercase tracking-wide">
                        {s === 'done'    && <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full"><Check className="w-3 h-3" /> Draft Created</span>}
                        {s === 'error'   && <span className="inline-flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full"><X className="w-3 h-3" /> Error — Retry</span>}
                        {s === 'pending' && <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin inline" /> Creating…</span>}
                        {s === 'skipped' && <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-full">No Email</span>}
                        {!s && <span className="text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">Queued</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!isRunning && doneCount === schoolsWithEmail.length && doneCount > 0 && (
              <div className="bg-emerald-600 rounded-2xl p-6 text-white text-center">
                <div className="flex justify-center mb-2"><PartyPopper className="w-10 h-10" /></div>
                <div className="font-black text-2xl mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>ALL {doneCount} DRAFTS CREATED!</div>
                <p className="text-emerald-100 text-sm mb-4">Head to Gmail Drafts, personalize the [INSERT] fields in each email, then send when ready.</p>
                <a href="https://mail.google.com/mail/u/0/#drafts" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-50 transition-all">
                  <Mail className="w-4 h-4" /> Open Gmail Drafts ↗
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
