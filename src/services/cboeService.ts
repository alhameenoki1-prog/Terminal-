// CBOE daily put/call ratio data
// Source: CBOE public CDN JSON endpoint — no API key required
// Proxied via /api/cboe (see vite.config.ts)
//
// The total put/call ratio covers all CBOE-listed options.
// >1.0 = more puts than calls → bearish hedging demand
// <0.7 = more calls → bullish positioning / complacency

export interface CboePcData {
  date: string
  pcTotal: number | null    // Total put/call ratio
  pcIndex: number | null    // Index options P/C
  pcEquity: number | null   // Equity options P/C
  signal: string
  signalColor: string
}

let pcCache: { data: CboePcData; ts: number } | null = null
const TTL = 15 * 60 * 1000

function interpretPcRatio(pc: number | null): { signal: string; color: string } {
  if (pc == null) return { signal: '—', color: '#9CA3AF' }
  if (pc > 1.2)  return { signal: 'EXTREME FEAR — Heavy put buying',   color: '#EF4444' }
  if (pc > 1.0)  return { signal: 'BEARISH — Put demand elevated',      color: '#F97316' }
  if (pc > 0.8)  return { signal: 'NEUTRAL — Normal hedging activity',  color: '#F59E0B' }
  if (pc > 0.6)  return { signal: 'BULLISH — Call demand dominant',     color: '#10B981' }
  return            { signal: 'EXTREME GREED — Minimal hedging',        color: '#6366F1' }
}

async function loadCboeData(): Promise<CboePcData> {
  // CBOE CDN endpoint for historical total put/call ratios
  const url = `/api/cboe/api/global/us_options_data/pc_ratio/total_pc_ratios.json`
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`CBOE ${res.status}`)

  const json = await res.json()

  // Handle multiple possible response shapes from CBOE CDN
  let rows: Record<string, unknown>[] = []
  if (Array.isArray(json)) {
    rows = json as Record<string, unknown>[]
  } else if (Array.isArray(json?.data)) {
    rows = json.data as Record<string, unknown>[]
  } else if (typeof json === 'object' && json !== null) {
    // Shape: { dates: [...], pc_ratio: [...], index_pc: [...], equity_pc: [...] }
    const rec       = json as Record<string, unknown[]>
    const dates     = (rec.dates     ?? []).map(String)
    const totals    = (rec.pc_ratio  ?? []).map(String)
    const indexes   = (rec.index_pc  ?? []).map(String)
    const equities  = (rec.equity_pc ?? []).map(String)
    const idx = dates.length - 1
    if (idx >= 0) {
      const pc = parseFloat(totals[idx])
      const { signal, color } = interpretPcRatio(isNaN(pc) ? null : pc)
      return {
        date: String(dates[idx]),
        pcTotal:  isNaN(pc)                             ? null : pc,
        pcIndex:  isNaN(parseFloat(indexes[idx]))       ? null : parseFloat(indexes[idx]),
        pcEquity: isNaN(parseFloat(equities[idx]))      ? null : parseFloat(equities[idx]),
        signal, signalColor: color,
      }
    }
    throw new Error('Unexpected CBOE shape')
  }

  if (rows.length === 0) throw new Error('Empty CBOE response')

  const latest = rows[rows.length - 1]
  const pc = parseFloat(String(
    latest.pc_ratio ?? latest.pcRatio ?? latest.total_pc ?? latest.put_call_ratio ?? ''
  ))
  const pcIndex  = parseFloat(String(latest.index_pc  ?? latest.indexPc  ?? ''))
  const pcEquity = parseFloat(String(latest.equity_pc ?? latest.equityPc ?? ''))
  const date     = String(latest.trade_date ?? latest.date ?? latest.Date ?? '')

  const { signal, color } = interpretPcRatio(isNaN(pc) ? null : pc)
  return {
    date,
    pcTotal:  isNaN(pc)       ? null : pc,
    pcIndex:  isNaN(pcIndex)  ? null : pcIndex,
    pcEquity: isNaN(pcEquity) ? null : pcEquity,
    signal, signalColor: color,
  }
}

export async function fetchCboePcRatio(): Promise<CboePcData | null> {
  if (pcCache && Date.now() - pcCache.ts < TTL) return pcCache.data
  try {
    const data = await loadCboeData()
    pcCache = { data, ts: Date.now() }
    return data
  } catch {
    return pcCache?.data ?? null
  }
}
