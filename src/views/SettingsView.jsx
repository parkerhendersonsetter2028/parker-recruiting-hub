import React from 'react';
import { User, Download, Shield } from 'lucide-react';
import { PARKER } from '../data/constants.js';

export function SettingsView() {
  return (
    <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-8 max-w-4xl">
      <div className="mb-6">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
          Account
        </div>
        <h1
          className="font-black text-slate-900 tracking-tight leading-none mt-1"
          style={{ fontSize: '2rem', fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          SETTINGS
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your athlete profile and preferences.</p>
      </div>

      <div className="space-y-5">
        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-blue-600" />
            <h2
              className="font-black text-slate-800 text-base uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Athlete Profile
            </h2>
          </div>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {[
              ['Name',               PARKER.name],
              ['Position',           PARKER.pos],
              ['Graduation Year',    PARKER.grad],
              ['High School',        PARKER.hs],
              ['Club Team',          PARKER.club],
              ['Academic Interests', PARKER.interests.join(', ')],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</dt>
                <dd className="text-slate-800 font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 text-xs text-slate-500 italic">
            Profile editing coming soon — values are currently set in <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">src/data/constants.js</code>.
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-5 h-5 text-emerald-600" />
            <h2
              className="font-black text-slate-800 text-base uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Data Export
            </h2>
          </div>
          <div className="text-sm text-slate-600">
            CSV / PDF export of your school pipeline and interaction logs — coming soon.
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-slate-600" />
            <h2
              className="font-black text-slate-800 text-base uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Privacy & Data
            </h2>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed">
            Your pipeline, notes, and interaction logs are stored in Netlify Blobs, linked to this workspace.
            No data is shared with third parties.
          </div>
        </section>
      </div>
    </div>
  );
}
