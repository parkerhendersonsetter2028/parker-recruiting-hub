import React from 'react';
import { ShieldCheck, Mail, Send, Sparkles, PlusCircle, Loader2, Search, Target, Compass, Calendar, EyeOff, Eye, ChevronDown, Inbox, Phone, PenLine, Trophy } from 'lucide-react';
import { FontStyle } from '../components/FontStyle.jsx';
import { SchoolLogo } from '../components/SchoolLogo.jsx';
import { SchoolRow } from '../components/SchoolRow.jsx';
import { DivBadge, PriorityBadge } from '../components/Badges.jsx';
import { DIV_CONFIG } from '../data/constants.js';
import { useApp } from '../context/AppContext.jsx';

export function MasterView() {
  const {
    allSchools, divCounts, contacted,
    newSchoolName, setNewSchoolName, isSearching, handleAddSchool,
    extraSchools, setExtraSchools,
    divFilter, setDivFilter, search, setSearch,
    filteredPrimary, filteredDiscovery,
    hiddenSchools, showHidden, setShowHidden, unhideSchool,
    goEmail, goGmail,
  } = useApp();

  return (
    <div className="min-h-screen" style={{ background: "#f1f4f9" }}>
      <FontStyle />

      {/* TOP HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2044 100%)" }} className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <ShieldCheck className="text-blue-400 w-5 h-5" />
                <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Brophy College Prep · AZ Fear 17s · Class of 2028</span>
              </div>
              <h1 className="font-black text-white tracking-tight leading-none" style={{ fontSize: "2.8rem", fontFamily: "'Barlow Condensed', sans-serif" }}>
                PARKER HENDERSON <span className="text-blue-400">RECRUITING HUB</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">Men's Volleyball · Setter · {allSchools.length} programs tracked · Business / Aviation / Theology</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Total Programs", value: allSchools.length, color: "text-white" },
                { label: "D-I Programs", value: divCounts["DI"] || 0, color: "text-blue-400" },
                { label: "D-II / NAIA", value: (divCounts["DII"] || 0) + (divCounts["NAIA"] || 0), color: "text-violet-400" },
                { label: "Contacted", value: contacted, color: "text-emerald-400" },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center min-w-20">
                  <div className={`font-black text-2xl leading-none ${stat.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{stat.value}</div>
                  <div className="text-slate-500 text-[10px] uppercase tracking-wide mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => goEmail(null)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-5 py-3 text-white text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0">
              <Mail className="w-4 h-4 text-blue-300" />
              Email Templates
            </button>
            <button onClick={goGmail}
              className="flex items-center gap-2 bg-emerald-600/80 hover:bg-emerald-500 border border-emerald-400/40 rounded-2xl px-5 py-3 text-white text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0">
              <Send className="w-4 h-4" />
              Gmail Drafts
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pb-20 pt-8 space-y-8">

        {/* DISCOVERY ENGINE */}
        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #1e3a8a, #1e40af)" }}>
          <div className="p-8">
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="text-blue-200 w-5 h-5" />
              <h2 className="font-black text-white text-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Discovery Engine</h2>
            </div>
            <p className="text-blue-300 text-sm mb-6">Research any college's men's volleyball program instantly — powered by Claude AI. Results include Parker-specific fit analysis.</p>
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" placeholder="Enter college name (e.g. 'Stanford', 'Ohio State')…"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3.5 text-white font-semibold placeholder:text-white/30 focus:bg-white/20 outline-none text-sm"
                value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSchool()} />
              <button onClick={handleAddSchool} disabled={isSearching}
                className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all disabled:opacity-60 flex-shrink-0">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                Add Program
              </button>
              {extraSchools.length > 0 && (
                <button onClick={() => { if (window.confirm(`Remove all ${extraSchools.length} added school(s)?`)) setExtraSchools([]); }}
                  className="bg-white/10 border border-white/20 text-white/60 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-white/20 hover:text-white transition-all flex-shrink-0">
                  Clear Added ({extraSchools.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["All", "DI", "DII", "DIII", "NAIA", "JUCO"].map(d => (
              <button key={d} onClick={() => setDivFilter(d)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${divFilter === d ? 'bg-slate-800 text-white shadow' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}>
                {d === "All" ? `All (${allSchools.length})` : `${DIV_CONFIG[d]?.label || d} (${divCounts[d] || 0})`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 md:max-w-xs ml-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search programs, conferences…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium outline-none focus:border-blue-400 shadow-sm"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>


        {/* PRIMARY TARGETS TABLE */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-blue-600 w-5 h-5" />
            <h2 className="font-black text-slate-800 text-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Primary Targets <span className="text-slate-400 font-normal">({filteredPrimary.length})</span>
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100" style={{ background: "#f8fafc" }}>
                    {["Institution / Head Coach", "Division", "Conference", "Location", "Acceptance / Tuition", "Setter Need", "Status", ""].map((h, i) => (
                      <th key={i} className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPrimary.map(s => <SchoolRow key={s.id} s={s} />)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DISCOVERY PHASE TABLE */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Compass className="text-indigo-500 w-5 h-5" />
            <h2 className="font-black text-slate-700 text-xl uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Discovery Phase <span className="text-slate-400 font-normal">({filteredDiscovery.length})</span>
            </h2>
            <span className="text-[10px] bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full px-3 py-0.5 font-bold uppercase">Under Evaluation</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100" style={{ background: "#f8fafc" }}>
                    {["Institution / Head Coach", "Division", "Conference", "Location", "Acceptance / Tuition", "Setter Need", "Status", ""].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredDiscovery.map(s => <SchoolRow key={s.id} s={s} compact />)}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RECRUITING CALENDAR */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="text-blue-500 w-5 h-5" />
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Recruiting Calendar — Class of 2028</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { when: "Now — 2027", what: "Contact coaches, fill questionnaires, attend camps/clinics. AZ Fear 17s visibility is key.", color: "border-blue-400 bg-blue-50", iconColor: "text-blue-600", Icon: Inbox },
              { when: "June 15, 2026", what: "D-I coaches may now initiate contact with Parker (Sophomore year — critical window)", color: "border-amber-400 bg-amber-50", iconColor: "text-amber-600", Icon: Phone },
              { when: "Nov 2028", what: "Early National Signing Period (D-I only) opens — target offer by this date", color: "border-purple-400 bg-purple-50", iconColor: "text-purple-600", Icon: PenLine },
              { when: "Feb 2028", what: "National Signing Day — final letters of intent due", color: "border-emerald-400 bg-emerald-50", iconColor: "text-emerald-600", Icon: Trophy },
            ].map((item, i) => {
              const Icon = item.Icon;
              return (
                <div key={i} className={`rounded-xl border-l-4 p-4 ${item.color}`}>
                  <Icon className={`w-6 h-6 mb-1 ${item.iconColor}`} />
                  <div className="font-bold text-slate-800 text-sm mb-1">{item.when}</div>
                  <div className="text-slate-600 text-xs leading-relaxed">{item.what}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HIDDEN SCHOOLS */}
        {hiddenSchools.length > 0 && (
          <section>
            <button
              onClick={() => setShowHidden(!showHidden)}
              className="w-full flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors group"
            >
              <EyeOff className="w-4 h-4 text-slate-400" />
              <h2 className="font-black text-slate-500 text-sm uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Hidden Schools <span className="text-slate-400 font-normal">({hiddenSchools.length})</span>
              </h2>
              <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 rounded-full px-2.5 py-0.5 font-bold uppercase">Archived</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform ${showHidden ? 'rotate-180' : ''}`} />
            </button>
            {showHidden && (
              <div className="mt-3 bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <tbody className="divide-y divide-slate-50">
                      {hiddenSchools.map(s => (
                        <tr key={s.id} className="opacity-70 hover:opacity-100 transition-opacity">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <SchoolLogo school={s} size="sm" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-600 text-xs">{s.name}</span>
                                  <PriorityBadge priority={s.priority} />
                                  <DivBadge divLevel={s.divLevel} />
                                </div>
                                <div className="text-[11px] text-slate-400">{s.city}, {s.state} · {s.conference || "—"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => unhideSchool(s.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Restore
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </div>
  );
}
