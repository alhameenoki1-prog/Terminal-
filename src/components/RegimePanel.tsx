import { useStore } from '../store/useStore'
import { useEffect } from 'react'
import { computeRegime, REGIME_COLOR, REGIME_LABEL } from '../services/regimeService'
import type { RegimeType } from '../types'

const POSTURE_COLOR: Record<RegimeType, string> = {
  'risk-on':    'text-terminal-up',
  'transition': 'text-yellow-400',
  'risk-off':   'text-terminal-down',
  'crisis':     'text-purple-400',
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-2xs text-terminal-faint w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-terminal-panel rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value * 10}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-2xs text-terminal-dim w-6 text-right">{value}/10</span>
    </div>
  )
}

export function RegimePanel() {
  const regime    = useStore((s) => s.regime)
  const tickers   = useStore((s) => s.tickers)
  const setRegime = useStore((s) => s.setRegime)

  // Recompute regime whenever VIX / SPX changes
  useEffect(() => {
    const vix = tickers['^VIX']?.price ?? tickers['VIX']?.price ?? 20
    const spxChange = tickers['^GSPC']?.changePct24h ?? tickers['SPX']?.changePct24h ?? 0
    const move = 100 // MOVE index not in Yahoo free tier — use static placeholder
    const result = computeRegime(vix, move, spxChange)
    setRegime(result)
  }, [tickers, setRegime])

  const color = REGIME_COLOR[regime.regime]
  const postureClass = POSTURE_COLOR[regime.regime]

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Regime badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {REGIME_LABEL[regime.regime]}
          </span>
        </div>
        {regime.vix && (
          <span className="font-mono text-2xs text-terminal-faint">
            VIX {regime.vix.toFixed(1)} · SPX {regime.spxTrend}
          </span>
        )}
      </div>

      {/* Score bars */}
      <div className="flex flex-col gap-2">
        <ScoreBar label="Clarity"       value={regime.clarity}       color="#3B82F6" />
        <ScoreBar label="Edge Quality"  value={regime.edge}          color="#10B981" />
        <ScoreBar label="Risk Level"    value={regime.risk}          color="#EF4444" />
        <ScoreBar label="Actionability" value={regime.actionability} color="#F59E0B" />
      </div>

      {/* Posture */}
      <div className={`font-mono text-xs ${postureClass} bg-terminal-panel rounded p-2 border border-terminal-border/50`}>
        📋 Posture: {regime.posture}
      </div>

      {/* NEXUS Bond-Driven FX signal */}
      <div className="font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <div className="text-terminal-accent mb-1">NEXUS Bond-FX Signal</div>
        {regime.regime === 'risk-on'
          ? 'Risk-On → Long EM FX, Short JPY/CHF, Long equities momentum'
          : regime.regime === 'risk-off'
          ? 'Risk-Off → Long JPY/CHF/Gold, Short EM FX, Underweight equities'
          : regime.regime === 'crisis'
          ? 'Crisis → Max defensive — JPY/CHF/Gold, T-Bills, flat risk exposure'
          : 'Transition → Wait for confirmation. Reduce size, no new trend entries.'}
      </div>
    </div>
  )
}
