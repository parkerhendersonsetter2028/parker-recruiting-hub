// ─── HELPERS ─────────────────────────────────────────────────────────────────
export const getRecordTally = (sched) => {
  let w = 0, l = 0;
  (sched || []).forEach(g => { if (g.r?.startsWith('W')) w++; if (g.r?.startsWith('L')) l++; });
  return { w, l };
};

export function getTrend(wh) {
  if (!wh || wh.length < 2) return null;
  const s = [...wh].sort((a, b) => b.yr - a.yr);
  const r = parseFloat(s[0].p), o = parseFloat(s[1].p);
  if (r > o + 0.05) return "up";
  if (r < o - 0.05) return "down";
  return "flat";
}

export function domainFromUrl(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
}
