# Campus Commit — Rebrand Handoff

Everything Claude Code needs to rebrand your existing app to Campus Commit.

> *Find Your Fit. Commit Your Future.*

---

## Quick start

1. **Drop this entire `handoff/` folder into the root of your app's repo.**
2. **Open Claude Code in that repo.** It will auto-detect `handoff/CLAUDE.md` (or you can paste in a prompt: *"Rebrand this app following `handoff/CLAUDE.md`. Start by detecting the stack."*)
3. **Let it sweep.** It'll detect the stack (Tailwind / CSS / UI lib), install the tokens, then go screen-by-screen restyling components.
4. **Review the checklist** at the end of `CLAUDE.md` before merging.

---

## What's in here

```
handoff/
├── CLAUDE.md                  ← THE instructions file. Claude Code reads this first.
├── README.md                  ← you are here
├── tokens/
│   └── colors_and_type.css    ← all design tokens (CSS variables, light + dark)
├── tailwind.preset.js         ← drop-in Tailwind theme extension (if you use Tailwind)
├── components/                ← reference React components — patterns to mirror, not a library to import
│   ├── _preview.html          ← open in browser to see them rendered
│   ├── Sidebar.jsx, TopBar.jsx, Dashboard.jsx, …
│   └── README.md
├── logos/                     ← varsity-collegiate brand marks (refined Apr 2026)
│   ├── cc-primary-logo.png    ← canonical horizontal banner (mark + wordmark + tagline)
│   ├── cc-monogram, cc-stacked, cc-wordmark
│   ├── cc-onecolor-navy, cc-onecolor-white
│   ├── cc-shield, cc-app-icon, cc-badge-stamp
│   ├── cc-favicon.ico + raster sizes for app icon
│   └── wave-motif.svg
└── _preview.html              ← open to view every brand mark at once
```

---

## Scope (what Claude Code will do)

✅ **Visual layer only** — colors, type, spacing, radii, shadows, casing, copy voice, brand marks.
✅ Replace hard-coded colors with CSS variables / Tailwind tokens.
✅ Restyle existing components to match Campus Commit patterns.
✅ Sweep copy for brand voice (no emoji, ALL CAPS nav/buttons, word-bank substitutions).
✅ Drop brand marks into nav, favicon, and hero areas.

🚫 **Will NOT** rewrite app logic, routing, data flow, or restructure components.
🚫 Will NOT introduce new colors, type sizes, or radii outside the tokens.
🚫 Will NOT add features.

---

## If your stack is unusual

`CLAUDE.md` covers Tailwind, CSS Modules / plain CSS / styled-components, and UI libraries (MUI / Chakra / shadcn). If yours is something else (Vue, Svelte, native, etc.), the tokens still apply — Claude Code will adapt. The CSS variables in `tokens/colors_and_type.css` work in any web stack.

---

## Brand quick-reference

| | |
|---|---|
| **Primary** | Navy `#0D1B3D` — buttons, sidebar, headings |
| **Accent** | Gold `#D4AF37` — stars & achievement only, never primary |
| **Canvas** | Cool slate `#F1F4F9` — never pure white |
| **Display font** | Oswald, ALL CAPS, +0.04em tracking |
| **Body font** | Inter, sentence case |
| **Card radius** | 16px |
| **Button radius** | 6px |
| **Icon library** | `lucide-react`, stroke 1.5–2px |
| **Emoji** | Never |
| **Voice** | Confident, declarative, athletic, family-facing |

Full details in `CLAUDE.md`.
