import { CENTRAL_BANK_RATES, KEY_INDICATORS } from '../services/ratesData'
import type { CentralBankRate } from '../types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const FLAG: Record<string, string> = {
  US: '🇺🇸', EU: '🇪🇺', GB: '🇬🇧', JP: '🇯🇵',
  CN: '🇨🇳', AU: '🇦🇺', CA: '🇨🇦', CH: '🇨🇭',
}

function TrendIcon({ trend }: { trend: CentralBankRate['trend'] }) {
  if (trend === 'hiking')  return <TrendingUp  className="w-3 h-3 text-terminal-down" />
  if (trend === 'cutting') return <TrendingDown className="w-3 h-3 text-terminal-up"  />
  return <Minus className="w-3 h-3 text-terminal-faint" />
}

function trendClass(trend: CentralBankRate['trend']): string {
  if (trend === 'hiking')  return 'text-terminal-down'
  if (trend === 'cutting') return 'text-terminal-up'
  return 'text-terminal-faint'
}

export function RatesPanel() {
  return (
    <div className="flex flex-col h-full bg-terminal-surface overflow-hidden">
      {/* ── Central Bank Rates ─────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <div className="px-3 py-2 border-b border-terminal-border">
          <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase">
            Central Bank Rates
          </span>
        </div>

        <div className="border-b border-terminal-border">
          {CENTRAL_BANK_RATES.map((r) => (
            <div
              key={r.bank}
              className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border/30 hover:bg-terminal-panel transition-colors"
            >
              {/* Flag + bank */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm flex-shrink-0">{FLAG[r.countryCode] ?? '🌐'}</span>
                <div className="min-w-0">
                  <div className="font-mono text-2xs text-terminal-text truncate">{r.countryCode}</div>
                  <div className="font-mono text-2xs text-terminal-faint truncate">{shortBankName(r.bank)}</div>
                </div>
              </div>

              {/* Rate + trend */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-terminal-text">
                    {r.rate.toFixed(2)}%
                  </div>
                  <div className={`font-mono text-2xs ${trendClass(r.trend)}`}>
                    {r.trend === 'cutting' && `▼ prev ${r.previousRate.toFixed(2)}%`}
                    {r.trend === 'hiking'  && `▲ prev ${r.previousRate.toFixed(2)}%`}
                    {r.trend === 'hold'    && 'hold'}
                  </div>
                </div>
                <TrendIcon trend={r.trend} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Key Economic Indicators ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 border-b border-terminal-border sticky top-0 bg-terminal-surface z-10">
          <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase">
            Key Indicators
          </span>
        </div>

        <div className="grid grid-cols-2">
          {KEY_INDICATORS.map((ind) => (
            <div
              key={ind.name}
              className="flex flex-col p-2.5 border-b border-r border-terminal-border/30 hover:bg-terminal-panel transition-colors"
            >
              <span className="font-mono text-2xs text-terminal-faint truncate">{ind.name}</span>
              <span className="font-mono text-xs font-semibold text-terminal-text mt-0.5">{ind.value}</span>
              {ind.change && ind.change !== '—' && (
                <span className={`font-mono text-2xs mt-0.5 ${ind.positive ? 'text-terminal-up' : 'text-terminal-down'}`}>
                  {ind.change}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Rate Cycle Summary ─────────────────────────────────────────── */}
      <div className="border-t border-terminal-border p-3 flex-shrink-0 bg-terminal-panel">
        <div className="font-mono text-2xs text-terminal-faint mb-1.5 uppercase tracking-wider">Rate Cycle</div>
        <div className="flex gap-3 text-2xs font-mono">
          <div className="flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-terminal-up" />
            <span className="text-terminal-up">
              {CENTRAL_BANK_RATES.filter((r) => r.trend === 'cutting').length} cutting
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-terminal-down" />
            <span className="text-terminal-down">
              {CENTRAL_BANK_RATES.filter((r) => r.trend === 'hiking').length} hiking
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Minus className="w-3 h-3 text-terminal-faint" />
            <span className="text-terminal-faint">
              {CENTRAL_BANK_RATES.filter((r) => r.trend === 'hold').length} hold
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function shortBankName(name: string): string {
  const map: Record<string, string> = {
    'Federal Reserve':          'Fed',
    'European Central Bank':    'ECB',
    'Bank of England':          'BoE',
    'Bank of Japan':            'BoJ',
    "People's Bank of China":   'PBoC',
    'Reserve Bank of Australia':'RBA',
    'Bank of Canada':           'BoC',
    'Swiss National Bank':      'SNB',
  }
  return map[name] ?? name
}
