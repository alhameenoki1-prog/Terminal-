// NEXUS Performance Analytics — Section 15
// Tracks signal performance across closed positions:
//   - Hit rate (% winners), Profit factor, Avg R-multiple
//   - Rolling Sharpe (from closed trade returns)
//   - Max drawdown (equity curve)
//   - Edge score per setup type (trend/mean-revert/liquidity-event/macro-transition)

import { useMemo } from 'react'
import { useStore } from '../store/useStore'
import type { Position } from '../types'

interface TradeMetrics {
  totalTrades: number
  winners: number
  losers: number
  hitRate: number
  totalPnl: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  avgR: number
  sharpe: number
  maxDrawdown: number
  equityCurve: number[]
  bySetup: Record<string, { trades: number; hitRate: number; avgR: number }>
}

function computePnl(pos: Position, tickers: Record<string, { price: number }>): number {
  const closeP = pos.closePrice ?? tickers[pos.symbol]?.price ?? pos.entryPrice
  const diff   = pos.direction === 'LONG' ? closeP - pos.entryPrice : pos.entryPrice - closeP
  return diff * pos.size
}

function computeR(pos: Position, tickers: Record<string, { price: number }>): number {
  if (!pos.stopLoss) return 0
  const risk = Math.abs(pos.entryPrice - pos.stopLoss) * pos.size
  if (risk <= 0) return 0
  const pnl = computePnl(pos, tickers)
  return pnl / risk
}

function rollingStats(returns: number[], window = 20): { sharpe: number } {
  if (returns.length < 3) return { sharpe: 0 }
  const slice = returns.slice(-window)
  const mean  = slice.reduce((a, b) => a + b, 0) / slice.length
  const std   = Math.sqrt(slice.reduce((a, b) => a + (b - mean) ** 2, 0) / (slice.length - 1 || 1))
  return { sharpe: std > 0 ? (mean / std) * Math.sqrt(252) : 0 }
}

function computeEquityCurve(pnls: number[]): { curve: number[]; maxDd: number } {
  let equity = 0
  let peak   = 0
  let maxDd  = 0
  const curve: number[] = []
  for (const pnl of pnls) {
    equity += pnl
    if (equity > peak) peak = equity
    const dd = peak > 0 ? (peak - equity) / peak : 0
    if (dd > maxDd) maxDd = dd
    curve.push(equity)
  }
  return { curve, maxDd }
}

export function PerformancePanel() {
  const positions = useStore((s) => s.positions)
  const tickers   = useStore((s) => s.tickers)
  const scenarios  = useStore((s) => s.edgeScenarios)

  // Separate closed and open positions
  const closed = positions.filter((p) => p.closedAt && p.closePrice != null)
  const open   = positions.filter((p) => !p.closedAt)

  const metrics: TradeMetrics = useMemo(() => {
    if (closed.length === 0) {
      return {
        totalTrades: 0, winners: 0, losers: 0, hitRate: 0,
        totalPnl: 0, avgWin: 0, avgLoss: 0, profitFactor: 0,
        avgR: 0, sharpe: 0, maxDrawdown: 0, equityCurve: [], bySetup: {},
      }
    }

    // Sort by close date
    const sorted = [...closed].sort((a, b) =>
      new Date(a.closedAt!).getTime() - new Date(b.closedAt!).getTime()
    )

    const pnls    = sorted.map((p) => computePnl(p, tickers))
    const Rs      = sorted.map((p) => computeR(p, tickers))
    const returns = pnls.map((pnl, i) => {
      const cost = sorted[i].entryPrice * sorted[i].size
      return cost > 0 ? pnl / cost : 0
    })

    const winners = pnls.filter((p) => p > 0)
    const losers  = pnls.filter((p) => p < 0)

    const profitFactor = Math.abs(losers.reduce((a, b) => a + b, 0)) > 0
      ? winners.reduce((a, b) => a + b, 0) / Math.abs(losers.reduce((a, b) => a + b, 0))
      : winners.length > 0 ? Infinity : 0

    const { curve, maxDd } = computeEquityCurve(pnls)
    const { sharpe }       = rollingStats(returns)

    // Per-setup breakdown using tags
    const bySetup: TradeMetrics['bySetup'] = {}
    sorted.forEach((pos, i) => {
      const tag = pos.tags?.[0] ?? 'untagged'
      if (!bySetup[tag]) bySetup[tag] = { trades: 0, hitRate: 0, avgR: 0 }
      bySetup[tag].trades++
      if (pnls[i] > 0) bySetup[tag].hitRate++
      bySetup[tag].avgR += Rs[i]
    })
    Object.values(bySetup).forEach((s) => {
      s.avgR    = s.trades > 0 ? s.avgR / s.trades : 0
      s.hitRate = s.trades > 0 ? (s.hitRate / s.trades) * 100 : 0
    })

    return {
      totalTrades: sorted.length,
      winners:     winners.length,
      losers:      losers.length,
      hitRate:     (winners.length / sorted.length) * 100,
      totalPnl:    pnls.reduce((a, b) => a + b, 0),
      avgWin:      winners.length > 0 ? winners.reduce((a, b) => a + b, 0) / winners.length : 0,
      avgLoss:     losers.length  > 0 ? losers.reduce((a, b) => a + b, 0) / losers.length   : 0,
      profitFactor,
      avgR:        Rs.reduce((a, b) => a + b, 0) / Rs.length,
      sharpe,
      maxDrawdown: maxDd,
      equityCurve: curve,
      bySetup,
    }
  }, [closed, tickers])

  // Open position unrealised P&L
  const openPnl = open.reduce((sum, pos) => {
    const curr = tickers[pos.symbol]?.price ?? pos.entryPrice
    const diff = pos.direction === 'LONG' ? curr - pos.entryPrice : pos.entryPrice - curr
    return sum + diff * pos.size
  }, 0)

  const pct       = (v: number) => `${v.toFixed(1)}%`
  const money     = (v: number) => `${v >= 0 ? '+' : ''}$${Math.abs(v).toFixed(2)}`
  const scoreColor = (v: number, threshold: number) => v >= threshold ? 'text-terminal-up' : 'text-terminal-down'

  // Mini equity curve SVG
  const svgCurve = useMemo(() => {
    const curve = metrics.equityCurve
    if (curve.length < 2) return null
    const min  = Math.min(...curve)
    const max  = Math.max(...curve)
    const range = max - min || 1
    const w = 200, h = 40
    const pts = curve.map((v, i) => {
      const x = (i / (curve.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    const color = curve[curve.length - 1] >= 0 ? '#10B981' : '#EF4444'
    return { pts: pts.join(' '), color, w, h }
  }, [metrics.equityCurve])

  // Edge Playbook signal scoring
  const edgeScores = scenarios.map((s) => {
    const pProfitScore = (s.pProfit ?? 0.5) * 100
    const pTargetScore = (s.pTarget ?? 0.5) * 100
    const composite    = (pProfitScore * 0.6 + pTargetScore * 0.4)
    return { ...s, composite }
  }).sort((a, b) => b.composite - a.composite)

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Performance Analytics
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Total Trades', value: metrics.totalTrades.toString(), color: 'text-terminal-text' },
          { label: 'Hit Rate',     value: metrics.totalTrades > 0 ? pct(metrics.hitRate) : '—',     color: scoreColor(metrics.hitRate, 50) },
          { label: 'Profit Factor',value: metrics.totalTrades > 0 ? metrics.profitFactor === Infinity ? '∞' : metrics.profitFactor.toFixed(2) : '—', color: scoreColor(metrics.profitFactor, 1.5) },
          { label: 'Avg R-Multiple', value: metrics.totalTrades > 0 ? metrics.avgR.toFixed(2) + 'R' : '—', color: scoreColor(metrics.avgR, 0) },
          { label: 'Sharpe',       value: metrics.totalTrades > 0 ? metrics.sharpe.toFixed(2) : '—', color: scoreColor(metrics.sharpe, 0.5) },
          { label: 'Max Drawdown', value: metrics.totalTrades > 0 ? pct(metrics.maxDrawdown * 100) : '—', color: metrics.maxDrawdown > 0.2 ? 'text-terminal-down' : 'text-yellow-400' },
          { label: 'Total Closed PnL', value: metrics.totalTrades > 0 ? money(metrics.totalPnl) : '—', color: metrics.totalPnl >= 0 ? 'text-terminal-up' : 'text-terminal-down' },
          { label: 'Open Unrealised', value: open.length > 0 ? money(openPnl) : '—',  color: openPnl >= 0 ? 'text-terminal-up' : 'text-terminal-down' },
          { label: 'Open Positions', value: open.length.toString(), color: 'text-terminal-dim' },
        ].map((tile) => (
          <div key={tile.label} className="bg-terminal-panel rounded px-2 py-1.5 border border-terminal-border/30">
            <div className="font-mono text-2xs text-terminal-faint">{tile.label}</div>
            <div className={`font-mono text-sm font-bold ${tile.color}`}>{tile.value}</div>
          </div>
        ))}
      </div>

      {/* Equity curve */}
      {svgCurve && (
        <div className="bg-terminal-panel rounded p-2 border border-terminal-border/50">
          <div className="font-mono text-2xs text-terminal-faint mb-1">Equity Curve ({metrics.totalTrades} trades)</div>
          <svg viewBox={`0 0 ${svgCurve.w} ${svgCurve.h}`} className="w-full h-10">
            <polyline
              points={svgCurve.pts}
              fill="none"
              stroke={svgCurve.color}
              strokeWidth="1.5"
              opacity="0.8"
            />
            {/* Zero line */}
            <line x1="0" y1={svgCurve.h} x2={svgCurve.w} y2={svgCurve.h} stroke="#374151" strokeWidth="0.5" />
          </svg>
          <div className="flex justify-between font-mono text-2xs text-terminal-faint/40 mt-0.5">
            <span>Oldest</span><span>Latest</span>
          </div>
        </div>
      )}

      {/* Win/Loss breakdown */}
      {metrics.totalTrades > 0 && (
        <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
          <div className="font-mono text-2xs text-terminal-faint mb-1">Win/Loss Breakdown</div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-2 bg-terminal-up rounded-l"
              style={{ width: `${metrics.hitRate}%`, flex: 'none', maxWidth: '70%' }}
            />
            <div
              className="h-2 bg-terminal-down rounded-r"
              style={{ width: `${100 - metrics.hitRate}%`, flex: 'none', maxWidth: '70%' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-mono text-xs font-bold text-terminal-up">{metrics.winners}</div>
              <div className="font-mono text-2xs text-terminal-faint">Winners</div>
              <div className="font-mono text-2xs text-terminal-up">{money(metrics.avgWin)} avg</div>
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-terminal-faint">{metrics.totalTrades}</div>
              <div className="font-mono text-2xs text-terminal-faint">Total</div>
              <div className="font-mono text-2xs text-terminal-faint">{pct(metrics.hitRate)}</div>
            </div>
            <div>
              <div className="font-mono text-xs font-bold text-terminal-down">{metrics.losers}</div>
              <div className="font-mono text-2xs text-terminal-faint">Losers</div>
              <div className="font-mono text-2xs text-terminal-down">{money(metrics.avgLoss)} avg</div>
            </div>
          </div>
        </div>
      )}

      {/* By setup type */}
      {Object.keys(metrics.bySetup).length > 0 && (
        <div>
          <div className="font-mono text-2xs text-terminal-faint mb-1">Performance by Setup Tag</div>
          <div className="grid grid-cols-4 gap-0.5 px-1 mb-1">
            {['Setup', 'Trades', 'Hit%', 'Avg R'].map((h) => (
              <span key={h} className="font-mono text-2xs text-terminal-faint/50">{h}</span>
            ))}
          </div>
          {Object.entries(metrics.bySetup).map(([setup, data]) => (
            <div key={setup} className="grid grid-cols-4 gap-0.5 px-1 py-0.5 rounded hover:bg-terminal-panel/40">
              <span className="font-mono text-2xs text-terminal-dim truncate">{setup}</span>
              <span className="font-mono text-2xs text-terminal-faint">{data.trades}</span>
              <span className={`font-mono text-2xs ${data.hitRate >= 50 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                {data.hitRate.toFixed(0)}%
              </span>
              <span className={`font-mono text-2xs ${data.avgR >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                {data.avgR.toFixed(2)}R
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edge Playbook scored signals */}
      {edgeScores.length > 0 && (
        <div>
          <div className="font-mono text-2xs text-terminal-faint mb-1">Edge Playbook — Signal Scoring</div>
          {edgeScores.slice(0, 5).map((edge) => (
            <div key={edge.id} className="flex items-center justify-between py-0.5 border-b border-terminal-border/20">
              <div>
                <span className={`font-mono text-2xs font-bold mr-1 ${edge.direction === 'LONG' ? 'text-terminal-up' : 'text-terminal-down'}`}>
                  {edge.direction}
                </span>
                <span className="font-mono text-2xs text-terminal-dim">{edge.asset}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xs text-terminal-faint">{edge.setupType}</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 rounded" style={{
                    width: `${edge.composite * 0.6}px`,
                    backgroundColor: edge.composite > 65 ? '#10B981' : edge.composite > 50 ? '#F59E0B' : '#EF4444',
                  }} />
                  <span className={`font-mono text-2xs font-bold ${edge.composite > 65 ? 'text-terminal-up' : edge.composite > 50 ? 'text-yellow-400' : 'text-terminal-down'}`}>
                    {edge.composite.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {metrics.totalTrades === 0 && (
        <div className="font-mono text-2xs text-terminal-faint/50 text-center py-6">
          No closed positions yet. Add trades in the Portfolio tab to track performance.
        </div>
      )}

      {/* NEXUS guidance */}
      {metrics.totalTrades >= 5 && (
        <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
          <div className="font-mono text-2xs text-terminal-accent mb-1">NEXUS Performance Assessment</div>
          <div className="font-mono text-2xs text-terminal-dim leading-relaxed">
            {metrics.hitRate >= 55 && metrics.profitFactor >= 1.5
              ? '★ Strong edge: hit rate and profit factor both positive. Scale position size.'
              : metrics.hitRate < 45 && metrics.avgR > 1.5
              ? '↑ Low win rate but high R-multiple — trend-following profile. Maintain discipline.'
              : metrics.hitRate >= 50 && metrics.profitFactor < 1.0
              ? '⚠ Win rate positive but letting losers run — review stop placement.'
              : metrics.maxDrawdown > 0.3
              ? '⚠ Drawdown > 30% — consider reducing position size by 50% until recovery.'
              : 'Developing edge. Continue logging and review setup-level hit rates.'}
          </div>
        </div>
      )}
    </div>
  )
}
