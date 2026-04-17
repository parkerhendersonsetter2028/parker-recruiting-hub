// netlify/functions/claude-discovery.js
// Server-side Anthropic API call for the Discovery Engine.
// Requires ANTHROPIC_API_KEY env var in Netlify (Site settings → Environment variables).

// Fetches the school's own volleyball coaches page and extracts the head
// coach's email from the first mailto anchor whose surrounding HTML mentions
// "Head Coach" (and NOT Associate/Assistant/Interim/Former/etc.). Falls back
// to the first mailto on the page — on Sidearm athletics sites the head
// coach is typically listed first, per Tim's rule-of-thumb.
// Returns { name, role, email, phone, _verified, _sourceUrl, _titleConfirmed }
// or null if no coaches page could be fetched.
async function verifyHeadCoachFromCoachesPage(vbUrl) {
  if (!vbUrl || typeof vbUrl !== "string") return null;
  const base = vbUrl.replace(/\/+$/, "");

  // Sidearm-style candidate paths for a coaches listing, tried in order.
  const candidates = [
    `${base}/coaches`,
    `${base}/roster/coaches`,
    `${base}/staff`,
    base,
  ];

  const UA =
    "Mozilla/5.0 (compatible; ParkerRecruitingHub/1.0; +https://parker-henderson-vb.netlify.app)";

  for (const url of candidates) {
    let html;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "text/html,*/*" },
        redirect: "follow",
      });
      if (!res.ok) continue;
      html = await res.text();
    } catch {
      continue;
    }

    // Find every mailto anchor with a ~2000-char window around it for context.
    const mailtoRe = /mailto:([A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,})/gi;
    const hits = [];
    let m;
    while ((m = mailtoRe.exec(html)) !== null) {
      const idx = m.index;
      const ctxStart = Math.max(0, idx - 2000);
      const ctxEnd = Math.min(html.length, idx + 500);
      hits.push({ email: m[1], context: html.slice(ctxStart, ctxEnd) });
    }
    if (hits.length === 0) continue;

    const DISQ =
      /(Associate|Assistant|Interim|Former|Emeritus|Volunteer|Director\s+of\s+Operations)\s+Head\s+Coach/i;
    const HEAD = /Head\s+Coach/i;
    const qualifying = hits.find(h => HEAD.test(h.context) && !DISQ.test(h.context));
    const pick = qualifying || hits[0];

    // Best-effort name extraction: strip tags in the context window, then look
    // for a capitalized-words sequence immediately preceding "Head Coach".
    const plain = pick.context
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, " ")
      .trim();

    let name = "";
    const nameBeforeTitle =
      /([A-Z][A-Za-z.'\-]+(?:\s+[A-Z][A-Za-z.'\-]+){1,3})\s*[-\u2013\u2014|,]?\s*Head\s+Coach/;
    const nmatch = nameBeforeTitle.exec(plain);
    if (nmatch) name = nmatch[1].trim();

    return {
      name,
      role: "Head Coach",
      email: pick.email,
      phone: "",
      _verified: true,
      _sourceUrl: url,
      _titleConfirmed: !!qualifying,
    };
  }

  return null;
}

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({
      error: "ANTHROPIC_API_KEY is not set in Netlify environment variables. Add it under Site settings → Environment variables and redeploy.",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { schoolName } = await req.json();
    if (!schoolName || typeof schoolName !== "string") {
      return new Response(JSON.stringify({ error: "schoolName (string) is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `You are a college volleyball recruiting expert. Provide comprehensive data for "${schoolName}" men's volleyball program for a recruit named Parker Henderson (setter, born 5/10/09, Brophy College Prep Phoenix AZ, club: AZ Fear 17s, interests: business, aviation, theology).
Return ONLY valid JSON (no markdown, no backticks):
{
  "id": "short_id", "name": "Full Name", "city": "City", "state": "ST", "mascot": "Mascot",
  "divLevel": "DI|DII|DIII|NAIA|JUCO", "conference": "Conference name",
  "acceptance": "XX%", "tuitionIn": "$XX,XXX", "tuitionOut": "$XX,XXX",
  "programRank": "#XX or NR", "setterNeed": "High|Med|Low", "priority": "Reach|Target|Safety",
  "url": "https://school.edu", "logoUrl": "https://school.edu", "vbUrl": "https://...", "programIG": "@handle", "questionnaireUrl": "https://...",
  "academic": { "top10": ["Major1","Major2"], "business": "description", "theology": "description", "aviation": "description", "avgGPA": "3.X", "gradRate": "XX%" },
  "parkerFit": { "business": true, "aviation": false, "theology": true, "notes": "2-3 sentence explanation of why this school fits Parker specifically" },
  "coaches": [{ "name": "Name", "role": "Head Coach", "email": "email@school.edu", "phone": "" }],
  "setters": [{ "name": "Name", "grad": "20XX", "class": "JR" }],
  "azRadar": [], "winHistory": [{ "yr": "2025", "w": 0, "l": 0, "p": ".000" }],
  "schedule26": [], "news": [], "notes": "", "section": "discovery", "isVolleyballSchool": true
}
If no men's volleyball program, return: {"isVolleyballSchool": false}`;

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("Anthropic API error:", upstream.status, errText);
      return new Response(JSON.stringify({
        error: `Anthropic API returned ${upstream.status}: ${errText.slice(0, 300)}`,
      }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await upstream.json();
    const text = data.content?.find(b => b.type === "text")?.text || "";

    // Strip markdown code fences if Claude wrapped the response. The previous
    // regex ate the content between fences; this one strips only the markers.
    let cleaned = text
      .replace(/^\s*```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    // Fallback: if there's prose before/after the JSON, extract the outermost
    // {...} block. Always run when braces exist so a trailing note doesn't
    // break JSON.parse.
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      cleaned = cleaned.slice(first, last + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Claude response as JSON. Raw text:", text.slice(0, 1000));
      return new Response(JSON.stringify({
        error: "Claude returned non-JSON. Try a more specific school name.",
        raw: text.slice(0, 500),
      }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Harden the coaches field: Claude's general-knowledge coach output is
    // unreliable (e.g. Concordia Wisconsin came back with the wrong head
    // coach). Instead, fetch the school's own volleyball page and extract
    // the head coach's mailto directly. If verification succeeds, replace
    // parsed.coaches with the verified entry; otherwise leave Claude's
    // answer in place but flag it so the UI can warn the user.
    if (parsed && parsed.isVolleyballSchool !== false && parsed.vbUrl) {
      try {
        const verified = await verifyHeadCoachFromCoachesPage(parsed.vbUrl);
        if (verified && verified.email) {
          const claudeCoach =
            Array.isArray(parsed.coaches) && parsed.coaches[0] ? parsed.coaches[0] : null;
          parsed.coaches = [
            {
              name: verified.name || (claudeCoach && claudeCoach.name) || "",
              role: "Head Coach",
              email: verified.email,
              phone: (claudeCoach && claudeCoach.phone) || "",
            },
          ];
          parsed._coachVerified = true;
          parsed._coachVerifiedFrom = verified._sourceUrl;
          parsed._coachTitleConfirmed = verified._titleConfirmed;
        } else {
          parsed._coachVerified = false;
        }
      } catch (verifyErr) {
        console.error("coach verification error:", verifyErr);
        parsed._coachVerified = false;
      }
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("claude-discovery error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
