// NEXUS Regime Classification Engine — Section 8
//
// Edge Quality Score rubric (Section 8.2):
//   Macro Catalyst Clarity  25%
//   Futures / OI Confirm    25%
//   Options / Vol Confirm   20%
//   Cross-Asset Alignment   15%
//   Levels / Structure      15%
//
// Each category scored 0–5; weighted sum converted to 0–10 scale.
// Additional: Regime Clarity, Risk Level, Actionability (0–10 each).

import type { RegimeScores, RegimeType } from '../types'

// ─── Component-level inputs ───────────────────────────────────────────────────

export interface RegimeInputs {
  vix:         number          // VIX level
  move:        number          // MOVE index (or proxy)
  spxChangePct: number         // S&P 500 % change
  us10y?:      number          // US 10Y yield
  us2y?:       number          // US 2Y yield (or null)
  jp10y?:      number          // JP 10Y yield
  usJpSpread?: number          // US–JP 10Y spread (bps)
  vix3m?:      number          // VIX3M for term structure
  cotNetPct?:  number          // COT non-comm net long % (ES or NQ)
  deribitRR?:  number          // BTC 25Δ risk reversal (sign = skew direction)
}

// ─── Weighted scoring ─────────────────────────────────────────────────────────

function clamp(v: number, lo = 0, hi = 5) { return Math.max(lo, Math.min(hi, v)) }

function macroScore(inputs: RegimeInputs): number {
  // Clarity of macro catalyst: yield curve signal + fed/rate regime
  let s = 3 // baseline moderate
  const { vix, move, us10y, us2y } = inputs

  if (vix < 15 && move < 90) s += 1.5           // suppressed vol = clear risk-on
  if (vix > 25 || move > 130) s -= 1            // elevated vol = noisy regime
  if (us10y && us2y) {
    const spread2s10s = (us10y - us2y) * 100
    if (Math.abs(spread2s10s) > 30) s += 0.5    // strong curve signal
    if (spread2s10s < -20) s -= 0.5             // inversion = regime uncertainty
  }
  return clamp(s)
}

function futuresOiScore(inputs: RegimeInputs): number {
  // Uses COT net positioning if available
  const { cotNetPct } = inputs
  if (cotNetPct == null) return 2.5 // neutral when data absent

  const abs = Math.abs(cotNetPct)
  if (abs > 40) return 4.5           // strong directional signal
  if (abs > 25) return 3.5           // moderate signal
  if (abs > 10) return 2.5           // mild bias
  return 1.5                          // flat / no signal
}

function optionsVolScore(inputs: RegimeInputs): number {
  // VIX regime + term structure + BTC skew
  const { vix, vix3m, deribitRR } = inputs
  let s = 3

  if (vix < 15) s += 1               // suppressed vol = signal clarity
  if (vix > 25) s -= 1               // elevated vol = uncertainty

  // Term structure inversion = near-term stress
  if (vix3m && vix > vix3m) s -= 0.5

  // BTC skew alignment
  if (deribitRR != null) {
    if (Math.abs(deribitRR) > 0.05) s += 0.5   // strong directional skew
  }

  return clamp(s)
}

function crossAssetScore(inputs: RegimeInputs): number {
  // Transmission map coherence: if yield, FX, equity all aligned
  const { vix, usJpSpread, spxChangePct } = inputs
  let s = 3

  // Strong coherence: VIX and SPX agree on direction
  if (vix < 18 && spxChangePct > 0.3) s += 1.5
  if (vix > 22 && spxChangePct < -0.3) s += 1

  // US-JP spread alignment with risk regime
  if (usJpSpread != null) {
    if (usJpSpread > 200 && vix < 20) s += 0.5  // wide spread = JPY carry = risk-on
    if (usJpSpread < 100) s -= 0.5               // narrow = carry unwind = stress
  }

  return clamp(s)
}

function levelsScore(_inputs: RegimeInputs): number {
  // Without real-time SMC engine, use vol regime as proxy for structure clarity
  // Suppressed vol = clean levels; elevated vol = messy/breaking structure
  const { vix } = _inputs
  if (vix < 14) return 4
  if (vix < 18) return 3.5
  if (vix < 22) return 3
  if (vix < 28) return 2
  return 1.5
}

// Convert 0–5 component score + weight to 0–10 contribution
function weightedContrib(score: number, weightPct: number): number {
  return (score / 5) * (weightPct / 100) * 10
}

function computeEdgeScore(inputs: RegimeInputs): number {
  const macro    = weightedContrib(macroScore(inputs),       25)
  const futures  = weightedContrib(futuresOiScore(inputs),   25)
  const options  = weightedContrib(optionsVolScore(inputs),  20)
  const crossAst = weightedContrib(crossAssetScore(inputs),  15)
  const levels   = weightedContrib(levelsScore(inputs),      15)
  return Math.min(10, Math.max(0, Math.round((macro + futures + options + crossAst + levels) * 10) / 10))
}

// ─── Regime classification ────────────────────────────────────────────────────

export function computeRegime(
  vix: number,
  move: number,
  spxChangePct: number,
  extra?: Partial<RegimeInputs>,
): RegimeScores {
  const inputs: RegimeInputs = {
    vix, move, spxChangePct,
    us10y:      extra?.us10y,
    us2y:       extra?.us2y,
    jp10y:      extra?.jp10y,
    usJpSpread: extra?.usJpSpread,
    vix3m:      extra?.vix3m,
    cotNetPct:  extra?.cotNetPct,
    deribitRR:  extra?.deribitRR,
  }

  const spxTrend: 'up' | 'flat' | 'down' =
    spxChangePct > 0.5 ? 'up' : spxChangePct < -0.5 ? 'down' : 'flat'

  // Primary regime classification
  let regime: RegimeType
  if (vix > 30 || move > 140) {
    regime = 'crisis'
  } else if (vix < 18 && spxTrend === 'up') {
    regime = 'risk-on'
  } else if (vix > 22 && spxTrend === 'down') {
    regime = 'risk-off'
  } else {
    regime = 'transition'
  }

  // Weighted edge quality score (0–10)
  const edge = computeEdgeScore(inputs)

  // Regime clarity: how cleanly regime signals agree
  let clarity: number
  switch (regime) {
    case 'risk-on':   clarity = vix < 15 ? 9 : 7; break
    case 'risk-off':  clarity = vix > 25 ? 8 : 7; break
    case 'crisis':    clarity = 8; break
    default:          clarity = 5
  }
  // Penalise if MOVE conflicts with VIX
  if (move > 120 && regime === 'risk-on') clarity = Math.max(3, clarity - 2)

  // Risk level (higher = more dangerous)
  let risk: number
  if (regime === 'crisis')     risk = 9
  else if (regime === 'risk-off') risk = 7 + (vix > 25 ? 1 : 0)
  else if (regime === 'transition') risk = 5
  else risk = Math.max(2, 3 - Math.floor((18 - Math.min(vix, 18)) / 3))

  if (move > 120) risk = Math.min(10, risk + 1)

  // Actionability
  let actionability: number
  if (regime === 'risk-on' && edge >= 7) actionability = 8
  else if (regime === 'crisis') actionability = 3
  else if (regime === 'risk-off') actionability = 6
  else actionability = 5
  if (risk > 7) actionability = Math.max(2, actionability - 1)

  // Posture
  let posture: string
  if (regime === 'risk-on' && edge >= 7) posture = 'Full size — trend trades, momentum entries'
  else if (regime === 'risk-on') posture = 'Full size — but confirm at each trigger'
  else if (regime === 'risk-off' && risk < 8) posture = 'Half size — defensive posture, safe-haven bias'
  else if (regime === 'crisis') posture = 'Defensive only — flatten risk, hedge tail exposure'
  else posture = 'Half size — wait for regime confirmation before full commitment'

  return {
    regime, clarity, edge, risk, actionability, posture,
    vix, move, spxTrend,
  }
}

export const REGIME_COLOR: Record<RegimeType, string> = {
  'risk-on':    '#10B981',
  'transition': '#F59E0B',
  'risk-off':   '#EF4444',
  'crisis':     '#7C3AED',
}

export const REGIME_LABEL: Record<RegimeType, string> = {
  'risk-on':    'RISK-ON',
  'transition': 'TRANSITION',
  'risk-off':   'RISK-OFF',
  'crisis':     'CRISIS',
}

// Score component labels for UI breakdown
export const SCORE_COMPONENTS = [
  { label: 'Macro Catalyst',   weight: 25, fn: macroScore      },
  { label: 'Futures / OI',     weight: 25, fn: futuresOiScore  },
  { label: 'Options / Vol',    weight: 20, fn: optionsVolScore  },
  { label: 'Cross-Asset',      weight: 15, fn: crossAssetScore },
  { label: 'Levels / SMC',     weight: 15, fn: levelsScore     },
]

export function getComponentScores(inputs: RegimeInputs): { label: string; weight: number; score: number }[] {
  return SCORE_COMPONENTS.map((c) => ({
    label:  c.label,
    weight: c.weight,
    score:  Math.round(c.fn(inputs) * 10) / 10,
  }))
}
