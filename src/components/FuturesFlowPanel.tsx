// NEXUS Futures Flow Monitor — Section 7.1
// Price data: Yahoo Finance (existing store)
// COT positioning: CFTC public Socrata API (free, no key)
// Shows: price, % change, COT net speculative positioning, price-direction signal

import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { fetchCotPositions, type CotContract } from '../services/cftcCotService'
import { fmt } from '../utils/format'

const FUTURES = [
  { name: 'Gold (GC)',      symbol: 'GC=F'     },
  { name: 'WTI (CL)',       symbol: 'CL=F'     },
  { name: 'S&P 500 (ES)',   symbol: 'ES=F'     },
  { name: 'Nasdaq (NQ)',    symbol: 'NQ=F'     },
  { name: '10Y Note (ZN)',  symbol: 'ZN=F'     },
  { name: 'USD/JPY proxy',  symbol: 'USDJPY=X' },
]

function getPriceSignal(changePct: number): { signal: string; color: string } {
  if (changePct > 0.8)  return { signal: '↑P strong',  color: '#10B981' }
  if (changePct > 0.3)  return { signal: '↑P mild',    color: '#34D399' }
  if (changePct < -0.8) return { signal: '↓P strong',  color: '#EF4444' }
  if (changePct < -0.3) return { signal: '↓P mild',    color: '#F87171' }
  return { signal: '→ Neutral', color: '#9CA3AF' }
}

function CotBar({ netPct }: { netPct: number | null }) {
  if (netPct == null) return null
  const pct    = Math.max(-100, Math.min(100, netPct))
  const isPos  = pct >= 0
  const barPct = Math.abs(pct)
  return (
    <div className="flex items-center gap-1">
      <div className="w-12 flex justify-end">
        {!isPos && (
          <div className="h-1.5 rounded-l bg-terminal-down"
            style={{ width: `${barPct}%` }} />
        )}
      </div>
      <div className="w-px h-3 bg-terminal-border/60" />
      <div className="w-12">
        {isPos && (
          <div className="h-1.5 rounded-r bg-terminal-up"
            style={{ width: `${barPct}%` }} />
        )}
      </div>
      <span className="font-mono text-2xs text-terminal-faint">
        {netPct > 0 ? '+' : ''}{netPct.toFixed(0)}%
      </span>
    </div>
  )
}

export function FuturesFlowPanel() {
  const tickers = useStore((s) => s.tickers)
  const [cot, setCot]           = useState<CotContract[]>([])
  const [cotLoading, setCotLoading] = useState(true)
  const [cotDate, setCotDate]   = useState<string>('')

  useEffect(() => {
    const load = () => {
      fetchCotPositions()
        .then((data) => {
          setCot(data)
          const date = data.find((d) => d.reportDate)?.reportDate ?? ''
          setCotDate(date)
        })
        .catch(() => {})
        .finally(() => setCotLoading(false))
    }
    load()
    const id = setInterval(load, 60 * 60 * 1000) // COT is weekly, refresh hourly
    return () => clearInterval(id)
  }, [])

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
          Futures Flow Monitor
        </span>
        {cotDate && (
          <span className="font-mono text-2xs text-terminal-faint/50">COT: {cotDate}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {FUTURES.map((f) => {
          const t      = tickers[f.symbol]
          const { signal, color } = getPriceSignal(t?.changePct24h ?? 0)
          const cotRow = cot.find((c) => c.symbol === f.symbol)

          return (
            <div key={f.symbol}
              className="bg-terminal-panel rounded px-3 py-2 border border-terminal-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-terminal-text">{f.name}</span>
                  <div className="font-mono text-2xs" style={{ color }}>{signal}</div>
                </div>
                <div className="text-right">
                  {t ? (
                    <>
                      <div className="font-mono text-xs text-terminal-text">{fmt(t.price)}</div>
                      <div className={`font-mono text-2xs ${t.changePct24h >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                        {t.changePct24h > 0 ? '+' : ''}{t.changePct24h.toFixed(2)}%
                      </div>
                    </>
                  ) : (
                    <span className="font-mono text-2xs text-terminal-faint/40">—</span>
                  )}
                </div>
              </div>

              {/* COT positioning row */}
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-mono text-2xs text-terminal-faint mr-2">COT:</span>
                {cotLoading ? (
                  <span className="font-mono text-2xs text-terminal-faint/40">Loading…</span>
                ) : cotRow ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xs font-bold" style={{ color: cotRow.signalColor }}>
                      {cotRow.signal}
                    </span>
                    <CotBar netPct={cotRow.noncommNetPct} />
                  </div>
                ) : (
                  <span className="font-mono text-2xs text-terminal-faint/40">n/a</span>
                )}
              </div>

              {/* Price vs COT interpretation */}
              {t && cotRow?.noncommNetPct != null && (
                <div className="mt-0.5 font-mono text-2xs text-terminal-faint/60">
                  {t.changePct24h > 0.3 && cotRow.noncommNetPct > 10
                    ? '↑P + long bias → New longs entering'
                    : t.changePct24h < -0.3 && cotRow.noncommNetPct < -10
                    ? '↓P + short bias → New shorts entering'
                    : t.changePct24h > 0.3 && cotRow.noncommNetPct < -5
                    ? '↑P + short bias → Short squeeze / covering'
                    : t.changePct24h < -0.3 && cotRow.noncommNetPct > 10
                    ? '↓P + long bias → Long liquidation'
                    : 'Mixed signal — confirm with session volume'}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <div className="text-terminal-accent mb-0.5">NEXUS Section 7.1 — COT Net = (Long − Short) / OI</div>
        <div className="text-terminal-faint/70">Source: CFTC Socrata public API · Weekly (prior Tuesday)</div>
      </div>
    </div>
  )
}
