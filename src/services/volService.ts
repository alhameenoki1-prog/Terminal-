import type { VolSpreadPair } from '../types'

export function computeRealizedVol(prices: number[], windowDays: number): number {
  if (prices.length < windowDays + 1) return 0
  const slice = prices.slice(-(windowDays + 1))
  const returns: number[] = []
  for (let i = 1; i < slice.length; i++) {
    returns.push(Math.log(slice[i] / slice[i - 1]))
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / (returns.length - 1)
  return Math.sqrt(variance * 252) * 100  // annualized %
}

export function computeZScore(value: number, history: number[]): number {
  if (history.length < 2) return 0
  const mean = history.reduce((a, b) => a + b, 0) / history.length
  const std = Math.sqrt(history.reduce((a, b) => a + (b - mean) ** 2, 0) / (history.length - 1))
  if (std === 0) return 0
  return (value - mean) / std
}

export function buildVolSpreadPairs(
  tickers: Record<string, { price: number; changePct24h: number }>,
): VolSpreadPair[] {
  const PAIRS: { id: string; label: string; a: string; b: string }[] = [
    { id: 'gold-btc',    label: 'Gold / BTC',         a: 'GC=F',     b: 'BTCUSDT' },
    { id: 'jpy-us10y',  label: 'USDJPY / US10Y',     a: 'USDJPY=X', b: '^TNX'    },
    { id: 'wti-usd',    label: 'WTI / DXY',           a: 'CL=F',     b: 'EURUSD=X'},
    { id: 'vix-move',   label: 'VIX / MOVE',          a: '^VIX',     b: '^VIX'    },
    { id: 'btc-nq',     label: 'BTC / Nasdaq',        a: 'BTCUSDT',  b: '^IXIC'   },
    { id: 'gold-us10y', label: 'Gold / US10Y',        a: 'GC=F',     b: '^TNX'    },
    { id: 'eur-spread', label: 'EURUSD / DE-US Sprd', a: 'EURUSD=X', b: '^TNX'    },
    { id: 'aud-copper', label: 'AUD / Copper',        a: 'AUDUSD=X', b: 'HG=F'    },
    { id: 'spx-credit', label: 'SPX / Credit',       a: '^GSPC',    b: '^VIX'    },
    { id: 'jpy-gold',   label: 'JPY / Gold',          a: 'USDJPY=X', b: 'GC=F'    },
  ]

  return PAIRS.map((p): VolSpreadPair => {
    const a = tickers[p.a]
    const b = tickers[p.b]
    const aChange = a?.changePct24h ?? 0
    const bChange = b?.changePct24h ?? 0
    const spread = aChange - bChange
    const ratio = b?.changePct24h ? aChange / bChange : 1
    // Fake history for z-score (in production this would be real historical data)
    const history = Array.from({ length: 60 }, () => (Math.random() - 0.5) * 4)
    const zScore = computeZScore(spread, history)
    const absZ = Math.abs(zScore)
    const regime: VolSpreadPair['regime'] =
      absZ > 2 ? 'EXTREME' : absZ > 1 ? 'ELEVATED' : 'NORMAL'

    return { id: p.id, assetA: p.a, assetB: p.b, label: p.label, spread, ratio, zScore, regime, history }
  })
}
