// NEXUS Yield Curve Monitor — Section 6
// US curve from Yahoo Finance (existing store)
// JP 2Y/10Y, DE 10Y, UK 10Y from Stooq.com (internationalYieldsService)
// US 2Y from FRED store (DGS2) or fall back to FRED FEDFUNDS
// Fed Funds vs 2Y: "pricing X cuts/hikes"

import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { fetchIntlYields, type IntlYield } from '../services/internationalYieldsService'
import { CENTRAL_BANK_RATES } from '../services/ratesData'

const US_SYMBOLS = [
  { symbol: '^IRX', tenor: '3M',  label: '3M'  },
  { symbol: '^FVX', tenor: '5Y',  label: '5Y'  },
  { symbol: '^TNX', tenor: '10Y', label: '10Y' },
  { symbol: '^TYX', tenor: '30Y', label: '30Y' },
]

function changeBadge(chgBps: number | null) {
  if (chgBps == null) return null
  const color = chgBps > 0 ? 'text-terminal-down' : chgBps < 0 ? 'text-terminal-up' : 'text-terminal-faint'
  const sign  = chgBps > 0 ? '+' : ''
  return <span className={`font-mono text-2xs ${color}`}>{sign}{chgBps.toFixed(1)}bp</span>
}

function rateCell(rate: number | null, change?: number | null, warn?: boolean) {
  if (rate == null) return <span className="font-mono text-2xs text-terminal-faint/40">—</span>
  return (
    <div className="text-right">
      <span className={`font-mono text-xs font-bold ${warn ? 'text-terminal-down' : 'text-terminal-text'}`}>
        {rate.toFixed(2)}%
      </span>
      {change != null && <div>{changeBadge(change)}</div>}
    </div>
  )
}

export function YieldCurvePanel() {
  const tickers  = useStore((s) => s.tickers)
  const fredData = useStore((s) => s.fredData)

  const [intlYields, setIntlYields] = useState<IntlYield[]>([])
  const [loadingIntl, setLoadingIntl] = useState(true)

  useEffect(() => {
    const load = () => {
      fetchIntlYields()
        .then(setIntlYields)
        .catch(() => {})
        .finally(() => setLoadingIntl(false))
    }
    load()
    const id = setInterval(load, 10 * 60 * 1000) // refresh every 10 min
    return () => clearInterval(id)
  }, [])

  // US yields from Yahoo store
  const us3m  = tickers['^IRX']?.price ?? null
  const us5y  = tickers['^FVX']?.price ?? null
  const us10y = tickers['^TNX']?.price ?? null
  const us30y = tickers['^TYX']?.price ?? null

  // US 2Y from FRED if available
  const fred2y    = fredData.find((f) => f.id === 'DGS2')?.value ?? null
  const fedFundsL = fredData.find((f) => f.id === 'DFEDTARL')?.value ?? null
  const fedFundsU = fredData.find((f) => f.id === 'DFEDTARU')?.value ?? null
  const fedFundsMid = fedFundsL && fedFundsU ? (fedFundsL + fedFundsU) / 2 : null

  // Fall back to central bank rates static data for Fed Funds
  const staticFed = CENTRAL_BANK_RATES.find((r) => r.countryCode === 'US')
  const fedFunds  = fedFundsMid ?? staticFed?.rate ?? 4.33

  // 2Y yield — FRED preferred, then use 3M as rough proxy
  const us2y = fred2y ?? us3m

  // NEXUS Section 6.2: 2Y pricing X cuts/hikes
  const impliedMoves = us2y != null ? Math.round((fedFunds - us2y) / 0.25) : null
  const nexus2ySignal = impliedMoves != null
    ? impliedMoves > 0
      ? `US 2Y at ${us2y!.toFixed(2)}% is pricing ${impliedMoves} cut${impliedMoves !== 1 ? 's' : ''} vs Fed ${fedFunds.toFixed(2)}% → DOVISH bias`
      : impliedMoves < 0
        ? `US 2Y at ${us2y!.toFixed(2)}% is pricing ${Math.abs(impliedMoves)} hike${Math.abs(impliedMoves) !== 1 ? 's' : ''} vs Fed ${fedFunds.toFixed(2)}% → HAWKISH bias`
        : `US 2Y at ${us2y!.toFixed(2)}% — neutral, no moves priced vs Fed ${fedFunds.toFixed(2)}%`
    : null

  // 2s10s spread
  const spread2s10s = us2y && us10y ? (us10y - us2y) : null
  const inverted    = spread2s10s != null && spread2s10s < 0

  // International yields mapped by country
  const jp2y  = intlYields.find((y) => y.symbol === '2yjp.b')
  const jp10y = intlYields.find((y) => y.symbol === '10yjp.b') ?? { rate: tickers['^JN10Y']?.price ?? null, change: null }
  const de10y = intlYields.find((y) => y.symbol === '10yde.b')
  const uk10y = intlYields.find((y) => y.symbol === '10ygb.b')

  // US–JP 10Y spread (in bps)
  const usJpSpread = us10y && jp10y?.rate != null ? ((us10y - jp10y.rate) * 100) : null

  // SVG curve data — US curve
  const usCurvePoints = US_SYMBOLS.map((y) => ({
    ...y,
    rate: tickers[y.symbol]?.price ?? null,
  })).filter((p): p is typeof p & { rate: number } => p.rate != null)

  const rates   = usCurvePoints.map((p) => p.rate)
  const maxRate = Math.max(...rates, 0.01)
  const minRate = Math.min(...rates, 0)

  return (
    <div className="p-3 flex flex-col gap-3 overflow-y-auto">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Yield Curve Monitor
      </div>

      {/* ── US Yield Curve SVG ─────────────────────────────────────────── */}
      {usCurvePoints.length > 1 && (
        <div className="relative">
          <div className="font-mono text-2xs text-terminal-faint mb-1">🇺🇸 US Treasury Curve</div>
          <svg width="100%" viewBox="0 0 260 80" className="overflow-visible">
            <defs>
              <linearGradient id="yc-grad-us" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 25, 50, 75].map((y) => (
              <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="#1e293b" strokeWidth="0.5" />
            ))}
            {(() => {
              const xs = usCurvePoints.map((_, i) => (i / (usCurvePoints.length - 1)) * 240 + 10)
              const ys = usCurvePoints.map((p) => 70 - ((p.rate - minRate) / (maxRate - minRate || 1)) * 60)
              const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x},${ys[i]}`).join(' ')
              const areaD = `${pathD} L ${xs[xs.length - 1]},80 L ${xs[0]},80 Z`
              return (
                <>
                  <path d={areaD} fill="url(#yc-grad-us)" />
                  <path d={pathD} stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                  {xs.map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy={ys[i]} r="3" fill="#3B82F6" />
                      <text x={x} y={76} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="monospace">{usCurvePoints[i].label}</text>
                      <text x={x} y={ys[i] - 6} textAnchor="middle" fontSize="8" fill="#E2E8F0" fontFamily="monospace">{usCurvePoints[i].rate.toFixed(2)}</text>
                    </g>
                  ))}
                </>
              )
            })()}
          </svg>
        </div>
      )}

      {/* ── 2s10s + US–JP Spread ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`font-mono text-xs p-2 rounded border ${inverted ? 'border-red-500/50 bg-red-500/10' : 'border-terminal-border/50 bg-terminal-panel'}`}>
          <div className="text-2xs text-terminal-faint mb-0.5">2s10s Spread</div>
          <div className={`font-bold ${inverted ? 'text-red-400' : 'text-terminal-text'}`}>
            {spread2s10s != null ? `${(spread2s10s * 100).toFixed(0)}bp` : '—'}
            {inverted && <span className="ml-1 text-red-400 text-2xs">⚠ INV</span>}
          </div>
          <div className="text-2xs text-terminal-faint/60 mt-0.5">
            {fred2y ? 'FRED DGS2' : us3m ? '3M proxy' : ''}
          </div>
        </div>
        <div className="font-mono text-xs p-2 rounded border border-terminal-border/50 bg-terminal-panel">
          <div className="text-2xs text-terminal-faint mb-0.5">US–JP 10Y Spd</div>
          <div className="font-bold text-terminal-text">
            {usJpSpread != null ? `${usJpSpread.toFixed(0)}bp` : '—'}
          </div>
          <div className={`text-2xs mt-0.5 ${usJpSpread != null && usJpSpread > 200 ? 'text-terminal-up' : 'text-terminal-faint/60'}`}>
            {usJpSpread != null ? (usJpSpread > 200 ? '→ JPY carry active' : usJpSpread < 100 ? '→ Carry unwind risk' : '→ Moderate spread') : ''}
          </div>
        </div>
      </div>

      {/* ── NEXUS 2Y Policy Signal ────────────────────────────────────── */}
      {nexus2ySignal && (
        <div className="font-mono text-2xs bg-terminal-panel rounded p-2 border border-terminal-accent/30">
          <span className="text-terminal-accent font-bold">NEXUS 2Y Signal: </span>
          <span className="text-terminal-dim">{nexus2ySignal}</span>
          {!fred2y && (
            <div className="text-terminal-faint/50 mt-0.5">
              Note: Add FRED API key in Settings for precise DGS2 data
            </div>
          )}
        </div>
      )}

      {/* ── International Yields ──────────────────────────────────────── */}
      <div>
        <div className="font-mono text-2xs text-terminal-faint mb-2">International Sovereign Yields (Stooq)</div>
        {loadingIntl ? (
          <div className="font-mono text-2xs text-terminal-faint/50">Loading…</div>
        ) : (
          <div className="flex flex-col gap-1">
            {/* JP */}
            <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
              <div className="font-mono text-2xs text-terminal-accent mb-1">🇯🇵 Japan JGB</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">2Y</div>
                  {rateCell(jp2y?.rate ?? null, jp2y?.change ?? null)}
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">10Y</div>
                  {rateCell(
                    jp10y?.rate ?? null,
                    'change' in jp10y ? (jp10y as IntlYield).change : (tickers['^JN10Y']?.changePct24h ?? null),
                  )}
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">Trend</div>
                  {jp10y?.rate != null && (
                    <span className={`font-mono text-2xs ${(jp10y.rate) > 1.0 ? 'text-terminal-down' : 'text-terminal-up'}`}>
                      {jp10y.rate > 1.5 ? '↑ Hawkish BOJ signal' : jp10y.rate > 1.0 ? '↑ Rising' : '→ Low rate'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* DE */}
            <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
              <div className="font-mono text-2xs text-terminal-accent mb-1">🇩🇪 Germany Bund</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">10Y</div>
                  {rateCell(de10y?.rate ?? null, de10y?.change ?? null)}
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">US–DE Spread</div>
                  {us10y && de10y?.rate != null
                    ? rateCell((us10y - de10y.rate), null)
                    : <span className="font-mono text-2xs text-terminal-faint/40">—</span>}
                </div>
              </div>
            </div>

            {/* UK */}
            <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
              <div className="font-mono text-2xs text-terminal-accent mb-1">🇬🇧 UK Gilt</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">10Y</div>
                  {rateCell(uk10y?.rate ?? null, uk10y?.change ?? null)}
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">US–UK Spread</div>
                  {us10y && uk10y?.rate != null
                    ? rateCell((us10y - uk10y.rate), null)
                    : <span className="font-mono text-2xs text-terminal-faint/40">—</span>}
                </div>
              </div>
            </div>

            {intlYields.length === 0 && (
              <div className="font-mono text-2xs text-terminal-faint/50 text-center py-2">
                Stooq data unavailable — check proxy configuration
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOJ Signal from JP 10Y ────────────────────────────────────── */}
      {jp10y?.rate != null && (
        <div className="font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
          <div className="text-terminal-accent mb-0.5">NEXUS JP10Y Rule:</div>
          {jp10y.rate > 1.5
            ? 'JP10Y trending HIGH → Structural JPY strength → Favor USDJPY shorts, JPY cross shorts'
            : jp10y.rate > 1.0
              ? 'JP10Y rising → JPY strength signal building → Monitor USDJPY for short entries'
              : 'JP10Y low/stable → JPY relief rallies possible → Range-trade USDJPY'}
        </div>
      )}
    </div>
  )
}
