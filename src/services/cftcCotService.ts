// CFTC Commitment of Traders (COT) — Legacy Futures-Only report
// Source: CFTC public Socrata API at publicreporting.cftc.gov
// Dataset: 6dca-aqww (Legacy COT futures-only, includes all major contracts)
// No API key required. Data updates every Friday for the prior Tuesday.
//
// NEXUS Section 7.1: Dealer / Leveraged / Asset Manager positioning

export interface CotContract {
  name: string              // human label
  symbol: string            // Yahoo symbol
  reportDate: string        // YYYY-MM-DD
  noncommNetPct: number | null   // Non-commercial (speculative) net long as % of OI
  noncommLong: number | null
  noncommShort: number | null
  openInterest: number | null
  signal: 'NET LONG' | 'NET SHORT' | 'NEUTRAL' | '—'
  signalColor: string
}

const CONTRACT_FILTERS: { symbol: string; name: string; searchTerm: string }[] = [
  { symbol: 'ES=F',   name: 'S&P 500 (ES)',   searchTerm: 'E-MINI S&P 500'    },
  { symbol: 'NQ=F',   name: 'Nasdaq (NQ)',    searchTerm: 'NASDAQ-100 STOCK INDEX (MINI)' },
  { symbol: 'ZN=F',   name: '10Y Note (ZN)',  searchTerm: '10-YEAR U.S. TREASURY NOTES' },
  { symbol: 'GC=F',   name: 'Gold (GC)',      searchTerm: 'GOLD - COMMODITY EXCHANGE'    },
  { symbol: 'CL=F',   name: 'WTI Crude (CL)', searchTerm: 'CRUDE OIL, LIGHT SWEET'      },
  { symbol: 'USDJPY=X', name: 'JPY Futures',  searchTerm: 'JAPANESE YEN'                },
]

type SocrataRow = Record<string, string>

let cotCache: { data: CotContract[]; ts: number } | null = null
const TTL = 60 * 60 * 1000 // 1 hour (COT is weekly so no need to refresh often)

function deriveSignal(netPct: number | null): { signal: CotContract['signal']; color: string } {
  if (netPct == null) return { signal: '—', color: '#9CA3AF' }
  if (netPct > 20)    return { signal: 'NET LONG',  color: '#10B981' }
  if (netPct < -20)   return { signal: 'NET SHORT', color: '#EF4444' }
  return { signal: 'NEUTRAL', color: '#F59E0B' }
}

async function loadCotFromCftc(): Promise<CotContract[]> {
  // Fetch the latest 100 rows of the legacy COT report ordered by date DESC
  // Fields: market_and_exchange_names, report_date_as_yyyy_mm_dd,
  //         noncomm_positions_long_all, noncomm_positions_short_all, open_interest_all
  const params = new URLSearchParams({
    '$order': 'report_date_as_yyyy_mm_dd DESC',
    '$limit': '100',
    '$select': 'market_and_exchange_names,report_date_as_yyyy_mm_dd,noncomm_positions_long_all,noncomm_positions_short_all,open_interest_all',
  })
  const url = `/api/cftc/resource/6dca-aqww.json?${params}`

  const res = await fetch(url, { signal: AbortSignal.timeout(12000) })
  if (!res.ok) throw new Error(`CFTC API ${res.status}`)
  const rows: SocrataRow[] = await res.json()

  const results: CotContract[] = []

  for (const cf of CONTRACT_FILTERS) {
    // Find latest row matching this contract
    const row = rows.find((r) =>
      (r.market_and_exchange_names ?? '').toUpperCase().includes(cf.searchTerm.toUpperCase())
    )
    if (!row) {
      results.push({
        name: cf.name, symbol: cf.symbol, reportDate: '',
        noncommNetPct: null, noncommLong: null, noncommShort: null, openInterest: null,
        signal: '—', signalColor: '#9CA3AF',
      })
      continue
    }

    const long  = parseFloat(row.noncomm_positions_long_all  ?? '')
    const short = parseFloat(row.noncomm_positions_short_all ?? '')
    const oi    = parseFloat(row.open_interest_all            ?? '')

    const validLong  = !isNaN(long)
    const validShort = !isNaN(short)
    const validOI    = !isNaN(oi)

    const netPct = validLong && validShort && validOI && oi > 0
      ? ((long - short) / oi) * 100
      : null

    const { signal, color } = deriveSignal(netPct)

    results.push({
      name: cf.name,
      symbol: cf.symbol,
      reportDate: row.report_date_as_yyyy_mm_dd ?? '',
      noncommNetPct: netPct != null ? Math.round(netPct * 10) / 10 : null,
      noncommLong:   validLong  ? long  : null,
      noncommShort:  validShort ? short : null,
      openInterest:  validOI    ? oi    : null,
      signal,
      signalColor: color,
    })
  }

  return results
}

export async function fetchCotPositions(): Promise<CotContract[]> {
  if (cotCache && Date.now() - cotCache.ts < TTL) return cotCache.data
  try {
    const data = await loadCotFromCftc()
    cotCache = { data, ts: Date.now() }
    return data
  } catch {
    // Return stale cache if available, otherwise empty
    return cotCache?.data ?? []
  }
}
