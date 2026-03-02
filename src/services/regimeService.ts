import type { RegimeScores, RegimeType } from '../types'

export function computeRegime(
  vix: number,
  move: number,
  spxChangePct: number,
): RegimeScores {
  const spxTrend: 'up' | 'flat' | 'down' =
    spxChangePct > 0.5 ? 'up' : spxChangePct < -0.5 ? 'down' : 'flat'

  let regime: RegimeType
  let clarity: number
  let edge: number
  let risk: number
  let actionability: number
  let posture: string

  if (vix > 30 || move > 140) {
    regime = 'crisis'
    clarity = 8
    edge = 4
    risk = 9
    actionability = 3
    posture = 'Defensive only — flatten risk, hedge tail exposure'
  } else if (vix < 18 && spxTrend === 'up') {
    regime = 'risk-on'
    clarity = 8
    edge = 7
    risk = 3
    actionability = 8
    posture = 'Full size — trend trades, momentum entries'
  } else if (vix > 22 && spxTrend === 'down') {
    regime = 'risk-off'
    clarity = 7
    edge = 6
    risk = 7
    actionability = 6
    posture = 'Half size — defensive posture, safe-haven bias'
  } else {
    regime = 'transition'
    clarity = 5
    edge = 5
    risk = 5
    actionability = 5
    posture = 'Half size — wait for regime confirmation before full commitment'
  }

  // Adjust scores for MOVE (bond vol)
  if (move > 120) {
    risk = Math.min(10, risk + 1)
    actionability = Math.max(1, actionability - 1)
  }

  return { regime, clarity, edge, risk, actionability, posture, vix, move, spxTrend }
}

export const REGIME_COLOR: Record<RegimeType, string> = {
  'risk-on':   '#10B981',  // green
  'transition': '#F59E0B', // amber
  'risk-off':  '#EF4444',  // red
  'crisis':    '#7C3AED',  // purple
}

export const REGIME_LABEL: Record<RegimeType, string> = {
  'risk-on':   'RISK-ON',
  'transition': 'TRANSITION',
  'risk-off':  'RISK-OFF',
  'crisis':    'CRISIS',
}
