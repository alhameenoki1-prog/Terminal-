// NEXUS Volatility Engine — Section 3
// Computes cross-asset vol spreads using REAL 60-day rolling price history
// from Yahoo Finance v8/finance/chart (no fake random data).
//
// Vol alerts per Section 3.6:
//  • VOL_SPIKE    — asset 1D realized vol > 2× its 20D average
//  • VOL_CRUSH    — VIX drops >15% in 24h (post-event opportunity)
//  • SPREAD_EXTREME — vol spread z-score > ±2.0
//  • TERM_INVERSION — near-term IV > longer-term IV (VIX backwardation)
//  • GAMMA_FLIP   — VIX term structure flips (contango→backwrd or vice versa)

import { fetchDailyCloses, rollingVolSeries } from './yahooHistService'
import type { VolSpreadPair } from '../types'

export interface VolAlert {
  id: string
  type: 'VOL_SPIKE' | 'VOL_CRUSH' | 'SPREAD_EXTREME' | 'TERM_INVERSION' | 'GAMMA_FLIP' | 'VOL_ANOMALY'
  asset: string
  message: string
  severity: 'HIGH' | 'MEDIUM'
  ts: number
}

export function computeZScore(value: number, history: number[]): number {
  if (history.length < 3) return 0
  const mean = history.reduce((a, b) => a + b, 0) / history.length
  const std = Math.sqrt(history.reduce((a, b) => a + (b - mean) ** 2, 0) / (history.length - 1))
  if (std < 0.0001) return 0
  return (value - mean) / std
}

export function computeRealizedVol(prices: number[], windowDays: number): number {
  if (prices.length < windowDays + 1) return 0
  const slice = prices.slice(-(windowDays + 1))
  const returns: number[] = []
  for (let i = 1; i < slice.length; i++) {
    if (slice[i - 1] > 0) returns.push(Math.log(slice[i] / slice[i - 1]))
  }
  const mean = returns.reduce((a, b) => a + b, 0) / (returns.length || 1)
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1 || 1)
  return Math.sqrt(variance * 252) * 100
}

// Pairs config — asset symbol → Yahoo history symbol (some need remapping)
const PAIR_DEFS: { id: string; label: string; a: string; b: string; aHist?: string; bHist?: string }[] = [
  { id: 'gold-btc',    label: 'Gold / BTC',          a: 'GC=F',     b: 'BTCUSDT',   bHist: 'BTC-USD'   },
  { id: 'jpy-us10y',  label: 'USDJPY / US10Y',      a: 'USDJPY=X', b: '^TNX'                           },
  { id: 'wti-usd',    label: 'WTI / DXY',            a: 'CL=F',     b: 'EURUSD=X'                       },
  { id: 'vix-move',   label: 'VIX / MOVE (proxy)',   a: '^VIX',     b: '^TNX'                           },
  { id: 'btc-nq',     label: 'BTC / Nasdaq',         a: 'BTCUSDT',  b: '^IXIC',     aHist: 'BTC-USD'   },
  { id: 'gold-us10y', label: 'Gold / US10Y',         a: 'GC=F',     b: '^TNX'                           },
  { id: 'eur-spread', label: 'EURUSD / US10Y',       a: 'EURUSD=X', b: '^TNX'                           },
  { id: 'aud-copper', label: 'AUD / Copper',         a: 'AUDUSD=X', b: 'HG=F'                           },
  { id: 'spx-credit', label: 'SPX / VIX (proxy)',   a: '^GSPC',    b: '^VIX'                            },
  { id: 'jpy-gold',   label: 'JPY / Gold',           a: 'USDJPY=X', b: 'GC=F'                           },
]

export interface VolSpreadResult {
  pairs: VolSpreadPair[]
  alerts: VolAlert[]
}

export async function buildVolSpreadPairs(
  tickers: Record<string, { price: number; changePct24h: number }>,
): Promise<VolSpreadResult> {
  // Collect unique history symbols to minimise fetches
  const histSymbols = new Set<string>()
  for (const p of PAIR_DEFS) {
    histSymbols.add(p.aHist ?? p.a)
    histSymbols.add(p.bHist ?? p.b)
  }

  // Fetch 63 days of daily closes for each unique symbol
  const histMap = new Map<string, number[]>()
  await Promise.allSettled(
    Array.from(histSymbols).map(async (sym) => {
      const closes = await fetchDailyCloses(sym, 63)
      histMap.set(sym, closes)
    })
  )

  const pairs: VolSpreadPair[] = []
  const alerts: VolAlert[] = []

  for (const p of PAIR_DEFS) {
    const closesA = histMap.get(p.aHist ?? p.a) ?? []
    const closesB = histMap.get(p.bHist ?? p.b) ?? []

    // Compute 20D realized vols (annualised %)
    const volA20 = computeRealizedVol(closesA, 20)
    const volB20 = computeRealizedVol(closesB, 20)

    // Current spread = vol_A - vol_B in %
    const spread = volA20 - volB20
    const ratio  = volB20 > 0 ? volA20 / volB20 : 1

    // Build 60-day rolling spread history for z-score
    const rollA = rollingVolSeries(closesA, 20)
    const rollB = rollingVolSeries(closesB, 20)
    const minLen = Math.min(rollA.length, rollB.length)
    const spreadHistory = Array.from({ length: minLen }, (_, i) => rollA[i] - rollB[i])

    const zScore = computeZScore(spread, spreadHistory.length >= 5 ? spreadHistory : [0])
    const absZ = Math.abs(zScore)
    const regime: VolSpreadPair['regime'] =
      absZ >= 2 ? 'EXTREME' : absZ >= 1 ? 'ELEVATED' : 'NORMAL'

    // SPREAD_EXTREME alert
    if (absZ >= 2) {
      alerts.push({
        id:       `spread-${p.id}-${Date.now()}`,
        type:     'SPREAD_EXTREME',
        asset:    p.label,
        message:  `${p.label} vol spread z-score ${zScore > 0 ? '+' : ''}${zScore.toFixed(1)}σ — dislocation signal`,
        severity: 'HIGH',
        ts:       Date.now(),
      })
    }

    // VOL_SPIKE: if asset A's 1D vol > 2× its 20D average
    if (closesA.length >= 2) {
      const vol1D  = Math.abs(Math.log(closesA[closesA.length - 1] / closesA[closesA.length - 2])) * Math.sqrt(252) * 100
      const vol20D = volA20
      if (vol20D > 0 && vol1D > 2 * vol20D) {
        alerts.push({
          id:       `spike-${p.a}-${Date.now()}`,
          type:     'VOL_SPIKE',
          asset:    p.a,
          message:  `${p.a} 1D vol (${vol1D.toFixed(0)}%) > 2× 20D avg (${vol20D.toFixed(0)}%) — vol spike`,
          severity: 'HIGH',
          ts:       Date.now(),
        })
      }
    }

    pairs.push({
      id: p.id,
      assetA: p.a,
      assetB: p.b,
      label: p.label,
      spread: Math.round(spread * 10) / 10,
      ratio:  Math.round(ratio * 100) / 100,
      zScore: Math.round(zScore * 10) / 10,
      regime,
      history: spreadHistory.slice(-60),
    })
  }

  // VOL_CRUSH alert: VIX drops >15% in 24h
  const vix = tickers['^VIX']
  if (vix && vix.changePct24h < -15) {
    alerts.push({
      id:       `crush-vix-${Date.now()}`,
      type:     'VOL_CRUSH',
      asset:    'VIX',
      message:  `VIX fell ${vix.changePct24h.toFixed(1)}% — post-event vol crush, consider mean-reversion entry`,
      severity: 'MEDIUM',
      ts:       Date.now(),
    })
  }

  // GAMMA_FLIP: VIX > VIX3M = backwardation (stress)
  const vix3m = tickers['^VIX3M']
  if (vix && vix3m) {
    if (vix.price > vix3m.price && vix.price > 20) {
      alerts.push({
        id:       `term-inv-${Date.now()}`,
        type:     'TERM_INVERSION',
        asset:    'VIX',
        message:  `VIX term structure INVERTED: spot ${vix.price.toFixed(1)} > 3M ${vix3m.price.toFixed(1)} — near-term fear elevated`,
        severity: 'HIGH',
        ts:       Date.now(),
      })
    }
  }

  // Deduplicate alerts by type+asset (keep only one per type per pair in a session)
  const seen = new Set<string>()
  const dedupedAlerts = alerts.filter((a) => {
    const key = `${a.type}-${a.asset}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return { pairs, alerts: dedupedAlerts }
}

// Compute MOVE proxy from 10Y yield daily changes (no FRED key needed)
// MOVE ≈ std of daily 10Y yield changes (in bps) × sqrt(252)
export async function computeMoveProxy(): Promise<number | null> {
  const tnxCloses = await fetchDailyCloses('^TNX', 25)
  if (tnxCloses.length < 5) return null

  // Daily changes in basis points (yield × 100 = bps value from Yahoo, already in %)
  const changes: number[] = []
  for (let i = 1; i < tnxCloses.length; i++) {
    changes.push((tnxCloses[i] - tnxCloses[i - 1]) * 100) // ∆bps
  }
  const slice = changes.slice(-20)
  const mean  = slice.reduce((a, b) => a + b, 0) / slice.length
  const std   = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / (slice.length - 1))
  return Math.round(std * Math.sqrt(252) * 10) / 10
}
