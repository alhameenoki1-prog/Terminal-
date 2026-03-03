// NEXUS Volatility Engine — Section 3
// Vol spreads computed from REAL 60D Yahoo Finance price history (no fake data)
// Displays: vol spread matrix, z-scores, regime signals, vol alerts

import { useStore } from '../store/useStore'
import { buildVolSpreadPairs, type VolAlert } from '../services/volService'
import { useEffect, useState, useRef } from 'react'
import type { VolSpreadPair } from '../types'

const REGIME_COLOR = { NORMAL: '#9CA3AF', ELEVATED: '#F59E0B', EXTREME: '#EF4444' }

const ALERT_COLOR: Record<VolAlert['type'], string> = {
  VOL_SPIKE:       '#EF4444',
  VOL_CRUSH:       '#10B981',
  SPREAD_EXTREME:  '#F97316',
  TERM_INVERSION:  '#EF4444',
  GAMMA_FLIP:      '#F59E0B',
  VOL_ANOMALY:     '#6366F1',
}

export function VolatilityPanel() {
  const tickers = useStore((s) => s.tickers)

  const [pairs,   setPairs]   = useState<VolSpreadPair[]>([])
  const [alerts,  setAlerts]  = useState<VolAlert[]>([])
  const [loading, setLoading] = useState(true)
  const tickersRef = useRef(tickers)
  tickersRef.current = tickers

  useEffect(() => {
    let cancelled = false

    const compute = async () => {
      setLoading(true)
      const simplified: Record<string, { price: number; changePct24h: number }> = {}
      Object.entries(tickersRef.current).forEach(([k, v]) => {
        simplified[k] = { price: v.price, changePct24h: v.changePct24h }
      })
      const result = await buildVolSpreadPairs(simplified)
      if (!cancelled) {
        setPairs(result.pairs)
        setAlerts(result.alerts)
        // Persist latest vol spreads for alert evaluation in AlertsPanel
        localStorage.setItem(
          'nexus-vol-spreads',
          JSON.stringify(result.pairs.map((p) => ({ label: p.label, zScore: p.zScore })))
        )
        setLoading(false)
      }
    }

    compute()
    // Recompute every 15 minutes (price history cache TTL)
    const id = setInterval(compute, 15 * 60 * 1000)
    return () => { cancelled = true; clearInterval(id) }
  }, []) // runs once on mount; price history cached in yahooHistService

  const vix   = tickers['^VIX']?.price
  const vix3m = tickers['^VIX3M']?.price

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Volatility Engine
      </div>

      {/* VIX term structure */}
      {vix && (
        <div className="bg-terminal-panel rounded p-2 border border-terminal-border/50">
          <div className="font-mono text-2xs text-terminal-faint mb-1">VIX Term Structure</div>
          <div className="flex items-center gap-4">
            <div>
              <div className="font-mono text-2xs text-terminal-faint">Spot VIX</div>
              <div className={`font-mono text-sm font-bold ${vix > 25 ? 'text-terminal-down' : vix > 18 ? 'text-yellow-400' : 'text-terminal-up'}`}>
                {vix.toFixed(1)}
              </div>
            </div>
            {vix3m && (
              <>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">3M VIX</div>
                  <div className="font-mono text-sm font-bold text-terminal-dim">{vix3m.toFixed(1)}</div>
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">Structure</div>
                  <div className={`font-mono text-sm font-bold ${vix3m > vix ? 'text-terminal-up' : 'text-terminal-down'}`}>
                    {vix3m > vix ? 'Contango' : 'Backwrd'}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Vol Spread Matrix */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-2xs text-terminal-faint">NEXUS Vol Spread Matrix</span>
          {loading && <span className="font-mono text-2xs text-terminal-faint/50">Computing…</span>}
          {!loading && <span className="font-mono text-2xs text-terminal-faint/50">60D real history</span>}
        </div>
        <div className="grid grid-cols-4 gap-0.5 mb-1 px-1">
          {['Pair', 'Spread%', 'Z-Score', 'Regime'].map((h) => (
            <span key={h} className="font-mono text-2xs text-terminal-faint/60">{h}</span>
          ))}
        </div>
        {pairs.length === 0 && !loading && (
          <div className="font-mono text-2xs text-terminal-faint/50 text-center py-2">No data</div>
        )}
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className={`grid grid-cols-4 gap-0.5 px-1 py-1 rounded mb-0.5 ${
              pair.regime === 'EXTREME'  ? 'bg-red-950/30 border border-red-800/30' :
              pair.regime === 'ELEVATED' ? 'bg-yellow-950/20' : 'bg-terminal-panel/50'
            }`}
          >
            <span className="font-mono text-2xs text-terminal-dim truncate">{pair.label}</span>
            <span className={`font-mono text-2xs ${pair.spread > 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
              {pair.spread > 0 ? '+' : ''}{pair.spread.toFixed(1)}%
            </span>
            <span className={`font-mono text-2xs ${Math.abs(pair.zScore) > 1.5 ? 'text-yellow-400' : 'text-terminal-dim'}`}>
              {pair.zScore > 0 ? '+' : ''}{pair.zScore.toFixed(1)}σ
            </span>
            <span className="font-mono text-2xs font-bold" style={{ color: REGIME_COLOR[pair.regime] }}>
              {pair.regime}
            </span>
          </div>
        ))}
      </div>

      {/* Vol Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="font-mono text-2xs text-terminal-faint">Vol Alerts</div>
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="font-mono text-2xs rounded px-2 py-1.5 border"
              style={{
                borderColor: `${ALERT_COLOR[alert.type]}40`,
                backgroundColor: `${ALERT_COLOR[alert.type]}10`,
                color: ALERT_COLOR[alert.type],
              }}
            >
              <span className="font-bold mr-1">{alert.type}:</span>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {pairs.length > 0 && !loading && (
        <div className="font-mono text-2xs text-terminal-faint/50">
          Z-scores computed from real 60D rolling vol history via Yahoo Finance
        </div>
      )}
    </div>
  )
}
