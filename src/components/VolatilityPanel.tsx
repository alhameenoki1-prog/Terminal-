import { useStore } from '../store/useStore'
import { buildVolSpreadPairs } from '../services/volService'
import { useMemo } from 'react'

const REGIME_COLOR = { NORMAL: '#9CA3AF', ELEVATED: '#F59E0B', EXTREME: '#EF4444' }

export function VolatilityPanel() {
  const tickers = useStore((s) => s.tickers)

  const pairs = useMemo(() => {
    const simplified: Record<string, { price: number; changePct24h: number }> = {}
    Object.entries(tickers).forEach(([k, v]) => {
      simplified[k] = { price: v.price, changePct24h: v.changePct24h }
    })
    return buildVolSpreadPairs(simplified)
  }, [tickers])

  const vix    = tickers['^VIX']?.price
  const vix3m  = tickers['^VIX3M']?.price

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
              <div>
                <div className="font-mono text-2xs text-terminal-faint">3M VIX</div>
                <div className="font-mono text-sm font-bold text-terminal-dim">{vix3m.toFixed(1)}</div>
              </div>
            )}
            {vix3m && (
              <div>
                <div className="font-mono text-2xs text-terminal-faint">Slope</div>
                <div className={`font-mono text-sm font-bold ${vix3m > vix ? 'text-terminal-up' : 'text-terminal-down'}`}>
                  {vix3m > vix ? 'Contango' : 'Backwardation'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vol Spread Matrix */}
      <div>
        <div className="font-mono text-2xs text-terminal-faint mb-2">NEXUS Vol Spread Matrix</div>
        <div className="grid grid-cols-4 gap-0.5 mb-1 px-1">
          {['Pair', 'Spread', 'Z-Score', 'Regime'].map((h) => (
            <span key={h} className="font-mono text-2xs text-terminal-faint/60">{h}</span>
          ))}
        </div>
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className={`grid grid-cols-4 gap-0.5 px-1 py-1 rounded mb-0.5 ${
              pair.regime === 'EXTREME' ? 'bg-red-950/30 border border-red-800/30' :
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

      {pairs.some((p) => p.regime === 'EXTREME') && (
        <div className="font-mono text-2xs text-red-400 bg-red-950/20 rounded p-2 border border-red-800/30">
          ⚠ EXTREME vol spread detected — potential dislocation signal
        </div>
      )}
    </div>
  )
}
