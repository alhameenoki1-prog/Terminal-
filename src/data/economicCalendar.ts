import type { EconomicEvent } from '../types'

// Static macro calendar — key events for 2026 Q1-Q2
// Dates are accurate as of March 2026. Actual/forecast fields
// will be filled in live by user or future API integration.
export const CALENDAR_EVENTS: EconomicEvent[] = [
  // ── FOMC ─────────────────────────────────────────────────────────────────────
  { id: 'fomc-mar-26',  date: '2026-03-19', time: '18:00', country: 'US', flag: '🇺🇸', title: 'FOMC Rate Decision',       category: 'central-bank', impact: 'high', previous: '4.25%' },
  { id: 'fomc-may-26',  date: '2026-05-07', time: '18:00', country: 'US', flag: '🇺🇸', title: 'FOMC Rate Decision',       category: 'central-bank', impact: 'high', previous: '4.25%' },
  { id: 'fomc-jun-26',  date: '2026-06-18', time: '18:00', country: 'US', flag: '🇺🇸', title: 'FOMC Rate Decision',       category: 'central-bank', impact: 'high', previous: '4.25%' },
  { id: 'fomc-jul-26',  date: '2026-07-30', time: '18:00', country: 'US', flag: '🇺🇸', title: 'FOMC Rate Decision',       category: 'central-bank', impact: 'high', previous: '4.25%' },
  { id: 'fomc-sep-26',  date: '2026-09-17', time: '18:00', country: 'US', flag: '🇺🇸', title: 'FOMC Rate Decision',       category: 'central-bank', impact: 'high', previous: '4.25%' },

  // ── ECB ──────────────────────────────────────────────────────────────────────
  { id: 'ecb-mar-26',   date: '2026-03-06', time: '13:15', country: 'EU', flag: '🇪🇺', title: 'ECB Rate Decision',        category: 'central-bank', impact: 'high', previous: '2.50%' },
  { id: 'ecb-apr-26',   date: '2026-04-17', time: '13:15', country: 'EU', flag: '🇪🇺', title: 'ECB Rate Decision',        category: 'central-bank', impact: 'high', previous: '2.50%' },
  { id: 'ecb-jun-26',   date: '2026-06-05', time: '13:15', country: 'EU', flag: '🇪🇺', title: 'ECB Rate Decision',        category: 'central-bank', impact: 'high', previous: '2.50%' },
  { id: 'ecb-jul-26',   date: '2026-07-24', time: '13:15', country: 'EU', flag: '🇪🇺', title: 'ECB Rate Decision',        category: 'central-bank', impact: 'high' },

  // ── BoJ ──────────────────────────────────────────────────────────────────────
  { id: 'boj-mar-26',   date: '2026-03-19', time: '03:00', country: 'JP', flag: '🇯🇵', title: 'BoJ Rate Decision',        category: 'central-bank', impact: 'high', previous: '0.50%' },
  { id: 'boj-may-26',   date: '2026-05-01', time: '03:00', country: 'JP', flag: '🇯🇵', title: 'BoJ Rate Decision',        category: 'central-bank', impact: 'high', previous: '0.50%' },
  { id: 'boj-jun-26',   date: '2026-06-17', time: '03:00', country: 'JP', flag: '🇯🇵', title: 'BoJ Rate Decision',        category: 'central-bank', impact: 'high' },

  // ── BoE ──────────────────────────────────────────────────────────────────────
  { id: 'boe-mar-26',   date: '2026-03-20', time: '12:00', country: 'GB', flag: '🇬🇧', title: 'BoE Rate Decision',        category: 'central-bank', impact: 'high', previous: '4.50%' },
  { id: 'boe-may-26',   date: '2026-05-08', time: '12:00', country: 'GB', flag: '🇬🇧', title: 'BoE Rate Decision',        category: 'central-bank', impact: 'high', previous: '4.50%' },
  { id: 'boe-jun-26',   date: '2026-06-19', time: '12:00', country: 'GB', flag: '🇬🇧', title: 'BoE Rate Decision',        category: 'central-bank', impact: 'high' },

  // ── BoC ──────────────────────────────────────────────────────────────────────
  { id: 'boc-mar-26',   date: '2026-03-12', time: '14:45', country: 'CA', flag: '🇨🇦', title: 'BoC Rate Decision',        category: 'central-bank', impact: 'high', previous: '3.00%' },
  { id: 'boc-apr-26',   date: '2026-04-16', time: '14:45', country: 'CA', flag: '🇨🇦', title: 'BoC Rate Decision',        category: 'central-bank', impact: 'high' },

  // ── SNB ──────────────────────────────────────────────────────────────────────
  { id: 'snb-mar-26',   date: '2026-03-20', time: '08:30', country: 'CH', flag: '🇨🇭', title: 'SNB Rate Decision',        category: 'central-bank', impact: 'high', previous: '0.25%' },
  { id: 'snb-jun-26',   date: '2026-06-19', time: '08:30', country: 'CH', flag: '🇨🇭', title: 'SNB Rate Decision',        category: 'central-bank', impact: 'high' },

  // ── US CPI ───────────────────────────────────────────────────────────────────
  { id: 'cpi-mar-26',   date: '2026-03-12', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US CPI (Feb)',             category: 'inflation',    impact: 'high', previous: '2.9%', forecast: '2.8%' },
  { id: 'cpi-apr-26',   date: '2026-04-10', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US CPI (Mar)',             category: 'inflation',    impact: 'high', previous: '2.9%' },
  { id: 'cpi-may-26',   date: '2026-05-13', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US CPI (Apr)',             category: 'inflation',    impact: 'high' },
  { id: 'cpi-jun-26',   date: '2026-06-11', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US CPI (May)',             category: 'inflation',    impact: 'high' },

  // ── US PCE ───────────────────────────────────────────────────────────────────
  { id: 'pce-mar-26',   date: '2026-03-28', time: '12:30', country: 'US', flag: '🇺🇸', title: 'PCE Price Index (Feb)',    category: 'inflation',    impact: 'high', previous: '2.5%' },
  { id: 'pce-apr-26',   date: '2026-04-30', time: '12:30', country: 'US', flag: '🇺🇸', title: 'PCE Price Index (Mar)',    category: 'inflation',    impact: 'high' },
  { id: 'pce-may-26',   date: '2026-05-29', time: '12:30', country: 'US', flag: '🇺🇸', title: 'PCE Price Index (Apr)',    category: 'inflation',    impact: 'high' },

  // ── Nonfarm Payrolls ─────────────────────────────────────────────────────────
  { id: 'nfp-mar-26',   date: '2026-03-06', time: '13:30', country: 'US', flag: '🇺🇸', title: 'NFP + Unemployment (Feb)',  category: 'employment',   impact: 'high', previous: '143K' },
  { id: 'nfp-apr-26',   date: '2026-04-03', time: '13:30', country: 'US', flag: '🇺🇸', title: 'NFP + Unemployment (Mar)',  category: 'employment',   impact: 'high' },
  { id: 'nfp-may-26',   date: '2026-05-01', time: '13:30', country: 'US', flag: '🇺🇸', title: 'NFP + Unemployment (Apr)',  category: 'employment',   impact: 'high' },
  { id: 'nfp-jun-26',   date: '2026-06-05', time: '13:30', country: 'US', flag: '🇺🇸', title: 'NFP + Unemployment (May)',  category: 'employment',   impact: 'high' },

  // ── US GDP ───────────────────────────────────────────────────────────────────
  { id: 'gdp-q4-adv',   date: '2026-03-26', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US GDP Q4 Final',          category: 'growth',       impact: 'high', previous: '2.3%' },
  { id: 'gdp-q1-adv',   date: '2026-04-30', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US GDP Q1 Advance',        category: 'growth',       impact: 'high' },
  { id: 'gdp-q1-2nd',   date: '2026-05-29', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US GDP Q1 Second Est.',    category: 'growth',       impact: 'medium' },

  // ── EU / UK Data ─────────────────────────────────────────────────────────────
  { id: 'eu-cpi-mar',   date: '2026-03-19', time: '10:00', country: 'EU', flag: '🇪🇺', title: 'Eurozone CPI (Feb)',       category: 'inflation',    impact: 'high', previous: '2.4%' },
  { id: 'eu-cpi-apr',   date: '2026-04-16', time: '10:00', country: 'EU', flag: '🇪🇺', title: 'Eurozone CPI (Mar)',       category: 'inflation',    impact: 'high' },
  { id: 'uk-cpi-mar',   date: '2026-03-26', time: '07:00', country: 'GB', flag: '🇬🇧', title: 'UK CPI (Feb)',             category: 'inflation',    impact: 'high', previous: '3.0%' },
  { id: 'jp-cpi-mar',   date: '2026-03-20', time: '23:30', country: 'JP', flag: '🇯🇵', title: 'Japan CPI (Feb)',          category: 'inflation',    impact: 'high', previous: '4.0%' },
  { id: 'cn-cpi-mar',   date: '2026-03-09', time: '01:30', country: 'CN', flag: '🇨🇳', title: 'China CPI (Feb)',          category: 'inflation',    impact: 'medium', previous: '-0.1%' },

  // ── Trade / ISM ──────────────────────────────────────────────────────────────
  { id: 'ism-mfg-apr',  date: '2026-04-01', time: '14:00', country: 'US', flag: '🇺🇸', title: 'ISM Manufacturing PMI',   category: 'trade',        impact: 'medium' },
  { id: 'ism-svc-apr',  date: '2026-04-03', time: '14:00', country: 'US', flag: '🇺🇸', title: 'ISM Services PMI',        category: 'trade',        impact: 'medium' },
  { id: 'ret-sales-mar',date: '2026-03-17', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US Retail Sales (Feb)',   category: 'growth',       impact: 'medium' },
  { id: 'ret-sales-apr',date: '2026-04-16', time: '12:30', country: 'US', flag: '🇺🇸', title: 'US Retail Sales (Mar)',   category: 'growth',       impact: 'medium' },
]
