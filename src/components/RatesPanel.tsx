import { useState } from 'react'
import { CENTRAL_BANK_RATES, KEY_INDICATORS } from '../services/ratesData'
import type { CentralBankRate } from '../types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { YieldCurvePanel } from './YieldCurvePanel'

const FLAG: Record<string, string> = {
  US: '🇺🇸', EU: '🇪🇺', GB: '🇬🇧', JP: '🇯🇵',
  CN: '🇨🇳', AU: '🇦🇺', CA: '🇨🇦', CH: '🇨🇭',
}

const BANK_SHORT: Record<string, string> = {
  'Federal Reserve': 'Fed', 'European Central Bank': 'ECB',
  'Bank of England': 'BoE', 'Bank of Japan': 'BoJ',
  "People's Bank of China": 'PBoC', 'Reserve Bank of Australia': 'RBA',
  'Bank of Canada': 'BoC', 'Swiss National Bank': 'SNB',
}

const STANCE_STYLE: Record<NonNullable<CentralBankRate['stance']>, string> = {
  HAWK:    'bg-red-900/40 text-red-400 border-red-800',
  NEUTRAL: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
  DOVE:    'bg-green-900/30 text-green-400 border-green-800',
}

function deriveStance(r: CentralBankRate): NonNullable<CentralBankRate['stance']> {
  if (r.stance) return r.stance
  if (r.trend === 'hiking') return 'HAWK'
  if (r.trend === 'cutting' && r.rate < 2.0) return 'DOVE'
  if (r.trend === 'cutting') return 'NEUTRAL'
  return r.rate >= 4.0 ? 'HAWK' : 'NEUTRAL'
}

function TrendIcon({ trend }: { trend: CentralBankRate['trend'] }) {
  if (trend === 'hiking')  return <TrendingUp  className="w-3 h-3 text-terminal-down" />
  if (trend === 'cutting') return <TrendingDown className="w-3 h-3 text-terminal-up"  />
  return <Minus className="w-3 h-3 text-terminal-faint" />
}

export function RatesPanel() {
  const [tab, setTab] = useState<'cb' | 'yields'>('cb')
  const tickers = useStore((s) => s.tickers)

  // Live yields from Yahoo Finance store
  const tnx  = tickers['^TNX']   // US 10Y
  const fvx  = tickers['^FVX']   // US 5Y
  const irx  = tickers['^IRX']   // US 3M
  const tyx  = tickers['^TYX']   // US 30Y
  const fed  = CENTRAL_BANK_RATES.find((r) => r.countryCode === 'US')

  // NEXUS Section 6.2 — implied cuts from 2Y yield
  // Approximate 2Y from interpolation or use 5Y as proxy
  const us2y = tickers['2YY=F'] ?? fvx
  const fedRate = fed?.rate ?? 4.25
  const twoYYield = us2y?.price ?? 4.0
  const impliedCuts = Math.round((fedRate - twoYYield) / 0.25)

  const nexus2ySignal = impliedCuts > 0
    ? `2Y at ${twoYYield.toFixed(2)}% → pricing ${impliedCuts} cut${impliedCuts !== 1 ? 's' : ''} vs Fed ${fedRate.toFixed(2)}% → DOVISH bias`
    : impliedCuts < 0
      ? `2Y at ${twoYYield.toFixed(2)}% → pricing ${Math.abs(impliedCuts)} hike${Math.abs(impliedCuts) !== 1 ? 's' : ''} vs Fed ${fedRate.toFixed(2)}% → HAWKISH bias`
      : `2Y at ${twoYYield.toFixed(2)}% → neutral, no cuts priced vs Fed ${fedRate.toFixed(2)}%`

  return (
    <div className="flex flex-col h-full bg-terminal-surface overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-terminal-border flex-shrink-0">
        <button
          onClick={() => setTab('cb')}
          className={`flex-1 py-1.5 font-mono text-2xs font-semibold tracking-wider transition-colors ${
            tab === 'cb' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-terminal-faint hover:text-terminal-dim'
          }`}
        >
          CENTRAL BANKS
        </button>
        <button
          onClick={() => setTab('yields')}
          className={`flex-1 py-1.5 font-mono text-2xs font-semibold tracking-wider transition-colors ${
            tab === 'yields' ? 'text-terminal-accent border-b-2 border-terminal-accent' : 'text-terminal-faint hover:text-terminal-dim'
          }`}
        >
          YIELD CURVE
        </button>
      </div>

      {tab === 'yields' ? (
        <div className="flex-1 overflow-hidden">
          <YieldCurvePanel />
        </div>
      ) : (
        <>
          {/* ── Central Bank Cards ─────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {CENTRAL_BANK_RATES.map((r) => {
              const stance = deriveStance(r)
              return (
                <div
                  key={r.bank}
                  className="px-3 py-2 border-b border-terminal-border/30 hover:bg-terminal-panel transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    {/* Flag + bank name */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{FLAG[r.countryCode] ?? '🌐'}</span>
                      <div>
                        <span className="font-mono text-2xs font-bold text-terminal-text">{BANK_SHORT[r.bank] ?? r.bank}</span>
                        <span className="font-mono text-2xs text-terminal-faint ml-1.5">{r.countryCode}</span>
                      </div>
                    </div>
                    {/* Stance badge */}
                    <span className={`font-mono text-2xs font-bold px-1.5 py-0.5 rounded border ${STANCE_STYLE[stance]}`}>
                      {stance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Rate */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm font-bold text-terminal-text">{r.rate.toFixed(2)}%</span>
                      <TrendIcon trend={r.trend} />
                      {r.trend !== 'hold' && (
                        <span className={`font-mono text-2xs ${r.trend === 'hiking' ? 'text-terminal-down' : 'text-terminal-up'}`}>
                          {r.trend === 'hiking' ? '▲' : '▼'} {r.previousRate.toFixed(2)}%
                        </span>
                      )}
                    </div>
                    {/* Next meeting */}
                    {r.nextMeeting && (
                      <span className="font-mono text-2xs text-terminal-faint">
                        Next: {r.nextMeeting.slice(5)}
                      </span>
                    )}
                  </div>

                  {/* Implied path */}
                  {r.impliedCuts !== undefined && (
                    <div className="mt-0.5 font-mono text-2xs text-terminal-faint">
                      {r.impliedCuts > 0 ? `${r.impliedCuts} cut${r.impliedCuts !== 1 ? 's' : ''} priced` :
                       r.impliedCuts < 0 ? `${Math.abs(r.impliedCuts)} hike${Math.abs(r.impliedCuts) !== 1 ? 's' : ''} priced` :
                       'no moves priced'}
                    </div>
                  )}
                </div>
              )
            })}

            {/* ── Key Indicators ─────────────────────────────────────────── */}
            <div className="px-3 py-1.5 bg-terminal-panel/50 border-b border-terminal-border">
              <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest">KEY INDICATORS</span>
            </div>
            <div className="grid grid-cols-2">
              {KEY_INDICATORS.map((ind) => (
                <div
                  key={ind.name}
                  className="flex flex-col p-2 border-b border-r border-terminal-border/30 hover:bg-terminal-panel transition-colors"
                >
                  <span className="font-mono text-2xs text-terminal-faint truncate">{ind.name}</span>
                  <span className="font-mono text-xs font-semibold text-terminal-text mt-0.5">
                    {/* Show live value if available */}
                    {ind.name === 'US 10Y Yield' && tnx ? `${tnx.price.toFixed(2)}%` :
                     ind.name === 'VIX' && tickers['^VIX'] ? tickers['^VIX']!.price.toFixed(1) :
                     ind.value}
                  </span>
                  {ind.change && ind.change !== '—' && (
                    <span className={`font-mono text-2xs mt-0.5 ${ind.positive ? 'text-terminal-up' : 'text-terminal-down'}`}>
                      {ind.change}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── NEXUS 2Y Signal Footer ─────────────────────────────────────── */}
          <div className="border-t border-terminal-border p-2.5 flex-shrink-0 bg-terminal-panel">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent" />
              <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-wider">NEXUS 2Y SIGNAL</span>
            </div>
            <p className="font-mono text-2xs text-terminal-dim leading-relaxed">{nexus2ySignal}</p>
            <div className="mt-1.5 flex gap-3">
              <span className={`font-mono text-2xs ${
                CENTRAL_BANK_RATES.filter(r => r.trend === 'cutting').length > CENTRAL_BANK_RATES.filter(r => r.trend === 'hiking').length
                  ? 'text-terminal-up' : 'text-terminal-faint'
              }`}>
                ▼ {CENTRAL_BANK_RATES.filter(r => r.trend === 'cutting').length} cutting
              </span>
              <span className={`font-mono text-2xs ${
                CENTRAL_BANK_RATES.filter(r => r.trend === 'hiking').length > 0 ? 'text-terminal-down' : 'text-terminal-faint'
              }`}>
                ▲ {CENTRAL_BANK_RATES.filter(r => r.trend === 'hiking').length} hiking
              </span>
              <span className="font-mono text-2xs text-terminal-faint">
                — {CENTRAL_BANK_RATES.filter(r => r.trend === 'hold').length} hold
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
