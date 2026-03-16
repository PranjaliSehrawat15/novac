/**
 * NovaCRM Design Tokens
 * Single source of truth for all colors, surfaces, and styles.
 * Import `t` from this file and call t(isDark) to get all tokens.
 */

export function t(isDark) {
  return isDark ? dark : light;
}

// ─── DARK PALETTE ────────────────────────────────────────────────────────────
const dark = {
  // Backgrounds — 3-level depth system
  pageBg:    'bg-[#080B11]',          // page canvas — deepest
  navBg:     'bg-[#0D1117]/90',       // sticky nav
  cardBg:    'bg-[#111827]',          // primary card
  cardBg2:   'bg-[#0F1623]',          // inner / nested card
  hoverBg:   'hover:bg-white/[0.04]', // row / item hover
  activeBg:  'bg-white/[0.07]',       // selected item

  // Borders
  border:    'border-white/[0.07]',
  borderHover:'hover:border-white/[0.14]',
  divider:   'divide-white/[0.06]',

  // Text
  textPrimary: 'text-white',
  textSecondary:'text-slate-400',
  textTertiary: 'text-slate-500',
  textHint:     'text-slate-600',

  // Inputs
  inputBg:   'bg-[#0F1623] border-white/[0.08] text-white placeholder:text-slate-600 focus:border-blue-500/40 focus:ring-blue-500/20',

  // Badge backgrounds (semantic)
  badgeBlue:   'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
  badgeGreen:  'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
  badgeAmber:  'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
  badgePurple: 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20',
  badgeRed:    'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20',
  badgeSlate:  'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20',

  // Icon bg tints
  iconBlue:   'bg-blue-500/10',
  iconGreen:  'bg-emerald-500/10',
  iconAmber:  'bg-amber-500/10',
  iconPurple: 'bg-violet-500/10',
  iconRed:    'bg-rose-500/10',

  // Chart colors (CSS values, not class names)
  chartGrid:  '#ffffff06',
  chartTick:  '#475569',
  chartTooltipBg: '#1e293b',
  chartTooltipText: '#f1f5f9',

  // Stat card glow orb
  glowOrb: 'bg-white/[0.015]',

  // Sidebar / settings active
  sidebarActive: 'bg-blue-600 text-white shadow-lg shadow-blue-900/40',
  sidebarInactive:'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]',

  // Table header
  tableHead: 'text-slate-500',

  // Scrollbar
  scrollThumb: 'rgba(255,255,255,0.08)',
  scrollThumbHover: 'rgba(255,255,255,0.16)',
};

// ─── LIGHT PALETTE ────────────────────────────────────────────────────────────
const light = {
  pageBg:    'bg-[#F0F4FA]',
  navBg:     'bg-white/90',
  cardBg:    'bg-white',
  cardBg2:   'bg-[#F7F9FC]',
  hoverBg:   'hover:bg-slate-50',
  activeBg:  'bg-blue-50',

  border:    'border-slate-200',
  borderHover:'hover:border-slate-300',
  divider:   'divide-slate-100',

  textPrimary:  'text-slate-900',
  textSecondary:'text-slate-500',
  textTertiary: 'text-slate-400',
  textHint:     'text-slate-300',

  inputBg:   'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20',

  badgeBlue:   'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
  badgeGreen:  'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
  badgeAmber:  'bg-amber-50 text-amber-600 ring-1 ring-amber-200',
  badgePurple: 'bg-violet-50 text-violet-600 ring-1 ring-violet-200',
  badgeRed:    'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
  badgeSlate:  'bg-slate-100 text-slate-600 ring-1 ring-slate-200',

  iconBlue:   'bg-blue-50',
  iconGreen:  'bg-emerald-50',
  iconAmber:  'bg-amber-50',
  iconPurple: 'bg-violet-50',
  iconRed:    'bg-rose-50',

  chartGrid:  '#e2e8f0',
  chartTick:  '#94a3b8',
  chartTooltipBg: '#ffffff',
  chartTooltipText: '#0f172a',

  glowOrb: 'bg-blue-500/[0.03]',

  sidebarActive: 'bg-blue-600 text-white shadow-lg shadow-blue-300/30',
  sidebarInactive:'text-slate-500 hover:text-slate-900 hover:bg-slate-100',

  tableHead: 'text-slate-400',

  scrollThumb: 'rgba(0,0,0,0.1)',
  scrollThumbHover: 'rgba(0,0,0,0.18)',
};
