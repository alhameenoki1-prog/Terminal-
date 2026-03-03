import { useStore } from '../store/useStore'
import { useEffect, useState } from 'react'
import { computeRegime, REGIME_COLOR, REGIME_LABEL, getComponentScores } from '../services/regimeService'
import { computeMoveProxy } from '../services/volService'
import type { RegimeType } from '../types'

const POSTURE_COLOR: Record<RegimeType, string> = {
  'risk-on':    'text-terminal-up',
  'transition': 'text-yellow-400',
  'risk-off':   'text-terminal-down',
  'crisis':     'text-purple-400',
}

function ScoreBar({ label, value, max = 10, color, sub }: {
  label: string; value: number; max?: number; color: string; sub?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-shrink-0 w-28">
        <span className="font-mono text-2xs text-terminal-faint">{label}</span>
        {sub && <div className="font-mono text-2xs text-terminal-faint/40" style={{ fontSize: '9px' }}>{sub}</div>}
      </div>
      <div className="flex-1 bg-terminal-panel rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${(value / max) * 100}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-2xs text-terminal-dim w-8 text-right">{value.toFixed(1)}/{max}</span>
    </div>
  )
}

export function RegimePanel() {
  const regime    = useStore((s) => s.regime)
  const tickers   = useStore((s) => s.tickers)
  const fredData  = useStore((s) => s.fredData)
  const setRegime = useStore((s) => s.setRegime)
  const [move, setMove] = useState<number | null>(null)
  const [showComponents, setShowComponents] = useState(false)

  // Compute MOVE proxy from real ^TNX history
  useEffect(() => {
    computeMoveProxy().then(setMove).catch(() => {})
  }, [])

  // Recompute regime whenever key inputs change
  useEffect(() => {
    const vix       = tickers['^VIX']?.price ?? 20
    const spxChange = tickers['^GSPC']?.changePct24h ?? 0
    const moveVal   = move ?? 100

    // Try to read from FRED store for extra context
    const fred2y    = fredData.find((f) => f.id === 'DGS2')?.value ?? undefined
    const fred10y   = fredData.find((f) => f.id === 'DGS10')?.value ?? tickers['^TNX']?.price
    const vix3m     = tickers['^VIX3M']?.price ?? undefined
    const jp10y     = tickers['^JN10Y']?.price ?? undefined
    const usJpSpread = fred10y && jp10y ? (fred10y - jp10y) * 100 : undefined

    const result = computeRegime(vix, moveVal, spxChange, {
      us10y:      fred10y,
      us2y:       fred2y,
      jp10y,
      usJpSpread,
      vix3m,
    })
    setRegime(result)
  }, [tickers, fredData, move, setRegime])

  const color = REGIME_COLOR[regime.regime]
  const postureClass = POSTURE_COLOR[regime.regime]

  // Build component breakdown inputs
  const vix       = tickers['^VIX']?.price ?? 20
  const spxChange = tickers['^GSPC']?.changePct24h ?? 0
  const fred10y   = fredData.find((f) => f.id === 'DGS10')?.value ?? tickers['^TNX']?.price
  const fred2y    = fredData.find((f) => f.id === 'DGS2')?.value ?? undefined
  const jp10y     = tickers['^JN10Y']?.price ?? undefined
  const vix3m     = tickers['^VIX3M']?.price ?? undefined
  const usJpSpread = fred10y && jp10y ? (fred10y - jp10y) * 100 : undefined

  const components = getComponentScores({
    vix, move: move ?? 100, spxChangePct: spxChange,
    us10y: fred10y, us2y: fred2y, jp10y, usJpSpread, vix3m,
  })

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
        <div className="flex items-center gap-2">
          {regime.vix && (
            <span className="font-mono text-2xs text-terminal-faint">
              VIX {regime.vix.toFixed(1)}
            </span>
          )}
          {move != null && (
            <span className="font-mono text-2xs text-terminal-faint">
              MOVE≈{move.toFixed(0)}
            </span>
          )}
        </div>
      </div>

      {/* Primary score bars */}
      <div className="flex flex-col gap-2">
        <ScoreBar label="Regime Clarity"  value={regime.clarity}       color="#3B82F6" />
        <ScoreBar label="Edge Quality"    value={regime.edge}          color="#10B981" />
        <ScoreBar label="Risk Level"      value={regime.risk}          color="#EF4444" />
        <ScoreBar label="Actionability"   value={regime.actionability} color="#F59E0B" />
      </div>

      {/* Weighted component breakdown toggle */}
      <button
        onClick={() => setShowComponents(!showComponents)}
        className="font-mono text-2xs text-terminal-faint/60 hover:text-terminal-faint text-left"
      >
        {showComponents ? '▾' : '▸'} Component Breakdown (25/25/20/15/15)
      </button>

      {showComponents && (
        <div className="flex flex-col gap-1.5 pl-2 border-l border-terminal-border/40">
          {components.map((c) => (
            <ScoreBar
              key={c.label}
              label={c.label}
              value={c.score}
              max={5}
              color="#6366F1"
              sub={`${c.weight}% weight`}
            />
          ))}
        </div>
      )}

      {/* Posture */}
      <div className={`font-mono text-xs ${postureClass} bg-terminal-panel rounded p-2 border border-terminal-border/50`}>
        📋 {regime.posture}
      </div>

      {/* MOVE source note */}
      <div className="font-mono text-2xs text-terminal-faint/50 text-right">
        {move != null
          ? `MOVE computed from ^TNX 20D vol × √252`
          : 'MOVE: computing…'}
      </div>

      {/* Bond-FX signal */}
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
