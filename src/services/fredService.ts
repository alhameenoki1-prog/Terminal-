// FRED (Federal Reserve Economic Data) service
// Uses the /api/fred Vite proxy → fred.stlouisfed.org
// API key is optional for low-volume dev usage but required for production.

export interface FredObservation {
  date: string
  value: number | null
}

export interface FredSeries {
  id: string
  label: string
  value: number | null
  prev: number | null
  change: number | null
  changePct: number | null
  unit: string
  lastUpdated: string
}

// Key FRED series we care about
export const FRED_SERIES: { id: string; label: string; unit: string }[] = [
  { id: 'CPIAUCSL',  label: 'US CPI YoY',         unit: '%'   },
  { id: 'CPILFESL',  label: 'Core CPI YoY',        unit: '%'   },
  { id: 'PCEPI',     label: 'PCE Inflation',        unit: '%'   },
  { id: 'GDP',       label: 'US GDP Growth',        unit: '%'   },
  { id: 'UNRATE',    label: 'Unemployment',         unit: '%'   },
  { id: 'FEDFUNDS',  label: 'Fed Funds Rate',       unit: '%'   },
  { id: 'DGS10',     label: 'US 10Y Yield',         unit: '%'   },
  { id: 'DGS2',      label: 'US 2Y Yield',          unit: '%'   },
  { id: 'DGS30',     label: 'US 30Y Yield',         unit: '%'   },
  { id: 'T10Y2Y',    label: '2s10s Spread',         unit: 'bps' },
  { id: 'DEXUSEU',   label: 'EUR/USD',              unit: ''    },
  { id: 'DEXJPUS',   label: 'USD/JPY',              unit: ''    },
  { id: 'VIXCLS',    label: 'VIX (Close)',          unit: ''    },
  { id: 'DCOILWTICO',label: 'WTI Oil',              unit: '$'   },
  { id: 'GOLDAMGBD228NLBM', label: 'Gold (PM Fix)', unit: '$'   },
  { id: 'MORTGAGE30US',    label: '30Y Mortgage',  unit: '%'   },
  { id: 'M2SL',            label: 'M2 Money Supply',unit: '$T' },
]

async function fetchLatest(seriesId: string, apiKey: string): Promise<{ latest: number | null; prev: number | null; lastUpdated: string }> {
  const base = apiKey
    ? `/api/fred/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=2`
    : `/api/fred/fred/series/observations?series_id=${seriesId}&api_key=abcdefghijklmnop1234567890123456&file_type=json&sort_order=desc&limit=2`

  const res = await fetch(base, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) return { latest: null, prev: null, lastUpdated: '' }

  const json = await res.json()
  const obs: { date: string; value: string }[] = json.observations ?? []

  const parse = (v: string) => (v === '.' ? null : parseFloat(v))
  const latest = obs[0] ? parse(obs[0].value) : null
  const prev   = obs[1] ? parse(obs[1].value) : null
  const lastUpdated = obs[0]?.date ?? ''
  return { latest, prev, lastUpdated }
}

export async function fetchFredSeries(apiKey: string, seriesIds?: string[]): Promise<FredSeries[]> {
  const targets = seriesIds
    ? FRED_SERIES.filter((s) => seriesIds.includes(s.id))
    : FRED_SERIES

  const results = await Promise.allSettled(
    targets.map(async (s) => {
      const { latest, prev, lastUpdated } = await fetchLatest(s.id, apiKey)
      const change    = latest != null && prev != null ? latest - prev : null
      const changePct = prev != null && prev !== 0 && change != null
        ? (change / Math.abs(prev)) * 100
        : null
      return {
        id: s.id,
        label: s.label,
        value: latest,
        prev,
        change,
        changePct,
        unit: s.unit,
        lastUpdated,
      } satisfies FredSeries
    })
  )

  return results
    .filter((r): r is PromiseFulfilledResult<FredSeries> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((s) => s.value != null)
}

// Format a FRED value for display
export function formatFredValue(s: FredSeries): string {
  if (s.value == null) return '—'
  if (s.unit === '$T') return `$${(s.value / 1000).toFixed(1)}T`
  if (s.unit === '$')  return `$${s.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  if (s.unit === '%')  return `${s.value.toFixed(2)}%`
  if (s.id === 'T10Y2Y') return `${(s.value * 100).toFixed(0)}bps`
  return s.value.toFixed(4)
}

export function formatFredChange(s: FredSeries): { text: string; positive: boolean } | null {
  if (s.change == null) return null
  const pct = s.changePct != null ? ` (${s.changePct > 0 ? '+' : ''}${s.changePct.toFixed(2)}%)` : ''
  const sign = s.change > 0 ? '+' : ''
  // Positive = good depends on the series — unemployment down is good, yields lower is good for bonds
  const positiveIsGood = ['UNRATE', 'CPIAUCSL', 'CPILFESL', 'PCEPI', 'VIXCLS', 'DGS10', 'DGS2', 'T10Y2Y'].includes(s.id)
  const positive = positiveIsGood ? s.change < 0 : s.change > 0
  return {
    text: `${sign}${s.unit === '$' ? '$' : ''}${s.change.toFixed(s.unit === '%' ? 2 : 4)}${s.unit === '%' ? '%' : ''}${pct}`,
    positive,
  }
}
