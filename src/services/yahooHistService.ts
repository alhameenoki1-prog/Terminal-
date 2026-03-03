// Yahoo Finance v8/finance/chart — fetches N days of daily close prices
// Used for real realized-volatility computation throughout NEXUS.
// Leverages the existing /api/yahoo vite proxy (no additional config needed).

const cache = new Map<string, { closes: number[]; ts: number }>()
const TTL = 15 * 60 * 1000 // 15-minute cache

// Yahoo symbol overrides: Binance USDT pairs → Yahoo equivalents for history
const SYMBOL_MAP: Record<string, string> = {
  BTCUSDT:  'BTC-USD',
  ETHUSDT:  'ETH-USD',
  SOLUSDT:  'SOL-USD',
  BNBUSDT:  'BNB-USD',
  XRPUSDT:  'XRP-USD',
  DOGEUSDT: 'DOGE-USD',
}

export async function fetchDailyCloses(rawSymbol: string, days = 63): Promise<number[]> {
  const symbol = SYMBOL_MAP[rawSymbol] ?? rawSymbol
  const cached = cache.get(symbol)
  if (cached && Date.now() - cached.ts < TTL) return cached.closes

  try {
    const url = `/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=3mo`
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const data = await res.json()
    const raw: (number | null)[] =
      data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close ?? []
    const closes = raw
      .filter((c): c is number => c != null && !isNaN(c))
      .slice(-days)
    cache.set(symbol, { closes, ts: Date.now() })
    return closes
  } catch {
    return cached?.closes ?? []
  }
}

// Annualised realized vol from a price series (% annualised)
export function realizedVol(closes: number[], window = 20): number {
  if (closes.length < window + 1) return 0
  const slice = closes.slice(-(window + 1))
  const rets: number[] = []
  for (let i = 1; i < slice.length; i++) {
    if (slice[i - 1] > 0) rets.push(Math.log(slice[i] / slice[i - 1]))
  }
  if (rets.length < 2) return 0
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1)
  return Math.sqrt(variance * 252) * 100
}

// Rolling daily vol series — returns an array of annualised vols, one per day
export function rollingVolSeries(closes: number[], window = 20): number[] {
  const result: number[] = []
  for (let i = window; i <= closes.length; i++) {
    result.push(realizedVol(closes.slice(0, i), window))
  }
  return result
}
