/**
 * Campus Commit — Tailwind preset
 *
 * Drop-in theme extension that mirrors `tokens/colors_and_type.css`.
 * Use alongside the CSS variable file (so dark mode + raw `var(--…)` work)
 * — this preset just gives you ergonomic utility names.
 *
 *   // tailwind.config.js
 *   const ccPreset = require('./handoff/tailwind.preset.js');
 *   module.exports = {
 *     presets: [ccPreset],
 *     content: [/* … *\/],
 *   };
 */

module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand
        'cc-navy':        '#0D1B3D',
        'cc-navy-700':    '#0A2447',
        'cc-navy-600':    '#143057',
        'cc-navy-500':    '#1E3A8A',
        'cc-gold':        '#D4AF37',
        'cc-gold-soft':   '#E8C766',
        'cc-gold-deep':   '#B8941F',

        // Semantic (light) — also drive these via CSS vars in dark mode
        'cc-bg':          'var(--bg)',
        'cc-surface':     'var(--surface)',
        'cc-surface-alt': 'var(--surface-alt)',
        'cc-border':      'var(--border)',
        'cc-border-strong': 'var(--border-strong)',
        'cc-fg':          'var(--fg)',
        'cc-muted':       'var(--fg-muted)',
        'cc-subtle':      'var(--fg-subtle)',
        'cc-faint':       'var(--fg-faint)',
        'cc-accent':      'var(--accent)',
        'cc-accent-soft': 'var(--accent-soft)',

        // Tagging accents
        'cc-forest':      '#167A4E',
        'cc-maroon':      '#8B1E32',
        'cc-purple':      '#5E33A1',
        'cc-orange':      '#F07216',
        'cc-light-blue':  '#2E92F5',

        // States
        'cc-success':     '#16A34A',
        'cc-warning':     '#D97706',
        'cc-danger':      '#DC2626',
      },

      fontFamily: {
        display: ['Oswald', 'Barlow Condensed', 'Trade Gothic', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      fontSize: {
        'cc-h1':   ['48px', { lineHeight: '52px', fontWeight: '700', letterSpacing: '-0.01em' }],
        'cc-h2':   ['36px', { lineHeight: '42px', fontWeight: '700' }],
        'cc-h3':   ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'cc-h4':   ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'cc-h5':   ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'cc-h6':   ['14px', { lineHeight: '20px', fontWeight: '700', letterSpacing: '0.08em' }],
        'cc-body-lg': ['17px', '26px'],
        'cc-body':    ['15px', '22px'],
        'cc-body-sm': ['13px', '19px'],
        'cc-caption': ['11px', '16px'],
        'cc-button':  ['13px', '16px'],
      },

      letterSpacing: {
        'cc-tight':   '-0.01em',
        'cc-wide':    '0.04em',
        'cc-wider':   '0.06em',
        'cc-widest':  '0.08em',
      },

      borderRadius: {
        'cc-xs':  '4px',
        'cc-sm':  '6px',   // buttons, badges
        'cc-md':  '12px',  // inputs, tags
        'cc-lg':  '16px',  // cards
        'cc-xl':  '24px',  // hero cards
      },

      boxShadow: {
        'cc-card':    '0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)',
        'cc-hover':   '0 1px 2px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 27 61 / 0.10)',
        'cc-popover': '0 12px 32px rgb(0 27 61 / 0.16)',
      },

      ringColor: {
        'cc-focus': '#0D1B3D',
      },

      backgroundImage: {
        'cc-grad-navy': 'linear-gradient(135deg, #1E3A8A 0%, #0D1B3D 100%)',
        'cc-grad-gold': 'linear-gradient(135deg, #E8C766 0%, #D4AF37 100%)',
      },

      transitionTimingFunction: {
        'cc': 'cubic-bezier(.2, .7, .2, 1)',
      },

      transitionDuration: {
        'cc-fast': '120ms',
        'cc-base': '180ms',
        'cc-slow': '280ms',
      },

      spacing: {
        'cc-1': '4px',  'cc-2': '8px',  'cc-3': '12px', 'cc-4': '16px',
        'cc-5': '20px', 'cc-6': '24px', 'cc-8': '32px', 'cc-10': '40px',
        'cc-12': '48px','cc-16': '64px','cc-20': '80px','cc-24': '96px',
      },
    },
  },
};
