// International sovereign yields via Stooq.com free CSV API
// Proxied through /api/stooq (see vite.config.ts).
// No API key required.
//
// Stooq symbols used:
//   2yjp.b  → JP  2Y JGB
//   10yjp.b → JP 10Y JGB
//   10yde.b → DE 10Y Bund
//   10ygb.b → UK 10Y Gilt

export interface IntlYield {
  symbol: string
  label: string
  country: 'JP' | 'DE' | 'UK'
  tenor: string
  rate: number | null
  prevRate: number | null
  change: number | null      // rate change in bps (×100)
  updatedAt: string
}

const SYMBOLS: { symbol: string; label: string; country: IntlYield['country']; tenor: string }[] = [
  { symbol: '2yjp.b',  label: 'JP 2Y',   country: 'JP', tenor: '2Y'  },
  { symbol: '10yjp.b', label: 'JP 10Y',  country: 'JP', tenor: '10Y' },
  { symbol: '10yde.b', label: 'DE 10Y',  country: 'DE', tenor: '10Y' },
  { symbol: '10ygb.b', label: 'UK 10Y',  country: 'UK', tenor: '10Y' },
]

const cache = new Map<string, { data: IntlYield; ts: number }>()
const TTL = 10 * 60 * 1000 // 10 minutes

async function fetchStooqYield(
  symbol: string,
  label: string,
  country: IntlYield['country'],
  tenor: string,
): Promise<IntlYield> {
  const cached = cache.get(symbol)
  if (cached && Date.now() - cached.ts < TTL) return cached.data

  const base: IntlYield = { symbol, label, country, tenor, rate: null, prevRate: null, change: null, updatedAt: '' }

  try {
    // Fetch last 5 trading days of daily data
    const today = new Date()
    const from  = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
    const d2 = today.toISOString().slice(0, 10).replace(/-/g, '')
    const d1 = from.toISOString().slice(0, 10).replace(/-/g, '')
    const url = `/api/stooq/q/d/l/?s=${symbol}&d1=${d1}&d2=${d2}&i=d`

    const res = await fetch(url, { signal: AbortSignal.timeout(7000) })
    if (!res.ok) {
      cache.set(symbol, { data: base, ts: Date.now() })
      return base
    }

    const text = await res.text()
    const lines = text.trim().split('\n').filter((l) => l && !l.startsWith('Date') && !l.startsWith('Symbol'))
    if (lines.length === 0) {
      cache.set(symbol, { data: base, ts: Date.now() })
      return base
    }

    // Sort ascending by date (stooq returns descending sometimes)
    const parsed = lines.map((l) => {
      const cols = l.split(',')
      return { date: cols[0]?.trim() ?? '', close: parseFloat(cols[4] ?? '') }
    }).filter((r) => !isNaN(r.close)).sort((a, b) => a.date.localeCompare(b.date))

    const latest = parsed[parsed.length - 1]
    const prev   = parsed[parsed.length - 2]

    const result: IntlYield = {
      symbol, label, country, tenor,
      rate:     latest?.close ?? null,
      prevRate: prev?.close ?? null,
      change:   latest && prev ? (latest.close - prev.close) * 100 : null, // in bps
      updatedAt: latest?.date ?? '',
    }

    cache.set(symbol, { data: result, ts: Date.now() })
    return result
  } catch {
    cache.set(symbol, { data: base, ts: Date.now() })
    return base
  }
}

export async function fetchIntlYields(): Promise<IntlYield[]> {
  const results = await Promise.allSettled(
    SYMBOLS.map((s) => fetchStooqYield(s.symbol, s.label, s.country, s.tenor))
  )
  return results
    .filter((r): r is PromiseFulfilledResult<IntlYield> => r.status === 'fulfilled')
    .map((r) => r.value)
}

// Clear cache (call when forcing refresh)
export function clearIntlYieldsCache() {
  cache.clear()
}
