import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fetchYahooQuotes } from '../services/yahooService'

const YIELD_SYMBOLS = [
  { symbol: '^IRX', tenor: '3M',  label: '3M'  },
  { symbol: '^FVX', tenor: '5Y',  label: '5Y'  },
  { symbol: '^TNX', tenor: '10Y', label: '10Y' },
  { symbol: '^TYX', tenor: '30Y', label: '30Y' },
]

export function YieldCurvePanel() {
  const tickers    = useStore((s) => s.tickers)
  const setTickers = useStore((s) => s.setTickers)

  useEffect(() => {
    const syms = YIELD_SYMBOLS.map((s) => s.symbol)
    const poll = () => fetchYahooQuotes(syms).then(setTickers).catch(() => {})
    poll()
    const id = setInterval(poll, 60_000)
    return () => clearInterval(id)
  }, [setTickers])

  const points = YIELD_SYMBOLS.map((y) => ({
    ...y,
    rate: tickers[y.symbol]?.price ?? null,
    change: tickers[y.symbol]?.changePct24h ?? 0,
  })).filter((p) => p.rate !== null) as { symbol: string; tenor: string; label: string; rate: number; change: number }[]

  const rates = points.map((p) => p.rate)
  const maxRate = Math.max(...rates, 0.01)
  const minRate = Math.min(...rates, 0)

  // 2s10s spread
  const us2y = tickers['^IRX']?.price  // approximate with 3M as proxy
  const us10y = tickers['^TNX']?.price
  const spread2s10s = (us10y && us2y) ? (us10y - us2y).toFixed(2) : '—'
  const inverted = us10y && us2y && us10y < us2y

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        US Yield Curve
      </div>

      {/* SVG yield curve */}
      {points.length > 1 ? (
        <div className="relative">
          <svg width="100%" viewBox="0 0 260 80" className="overflow-visible">
            <defs>
              <linearGradient id="yc-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75].map((y) => (
              <line key={y} x1="0" y1={y} x2="260" y2={y} stroke="#1e293b" strokeWidth="0.5" />
            ))}

            {/* Curve */}
            {points.length > 1 && (() => {
              const xs = points.map((_, i) => (i / (points.length - 1)) * 240 + 10)
              const ys = points.map((p) => 70 - ((p.rate - minRate) / (maxRate - minRate || 1)) * 60)
              const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x},${ys[i]}`).join(' ')
              const areaD = `${pathD} L ${xs[xs.length-1]},80 L ${xs[0]},80 Z`

              return (
                <>
                  <path d={areaD} fill="url(#yc-grad)" />
                  <path d={pathD} stroke="#3B82F6" strokeWidth="1.5" fill="none" />
                  {xs.map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy={ys[i]} r="3" fill="#3B82F6" />
                      <text x={x} y={76} textAnchor="middle" fontSize="8" fill="#9CA3AF" fontFamily="monospace">
                        {points[i].label}
                      </text>
                      <text x={x} y={ys[i] - 6} textAnchor="middle" fontSize="8" fill="#E2E8F0" fontFamily="monospace">
                        {points[i].rate.toFixed(2)}
                      </text>
                    </g>
                  ))}
                </>
              )
            })()}
          </svg>
        </div>
      ) : (
        <div className="font-mono text-2xs text-terminal-faint text-center py-4">Loading yields...</div>
      )}

      {/* 2s10s spread */}
      <div className={`font-mono text-xs p-2 rounded border ${inverted ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-terminal-border/50 bg-terminal-panel text-terminal-dim'}`}>
        <span className="font-semibold">3M/10Y Spread: </span>
        <span>{spread2s10s}%</span>
        {inverted && <span className="ml-2 text-red-400 font-bold">⚠ INVERTED</span>}
      </div>

      {/* NEXUS 2Y signal */}
      {us10y && (
        <div className="font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
          <span className="text-terminal-accent">NEXUS Signal:</span>{' '}
          US 10Y at {us10y.toFixed(2)}% — {us10y > 4.5 ? 'Tight financial conditions → USD support, risk-off pressure' : us10y < 3.5 ? 'Easy conditions → Risk-On, USD weakness, EM support' : 'Neutral zone — monitor Fed guidance'}
        </div>
      )}
    </div>
  )
}
