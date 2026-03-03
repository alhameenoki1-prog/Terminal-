import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'
import { REGIME_COLOR, REGIME_LABEL } from '../services/regimeService'

function getMarketSession(): string {
  const now = new Date()
  const utcHour = now.getUTCHours()
  const utcMin  = now.getUTCMinutes()
  const utcTime = utcHour * 60 + utcMin

  // NYSE: pre 13:30, open 14:30–21:00, after 21:00–22:00
  if (utcTime >= 870 && utcTime < 1260)  return 'NYSE OPEN'   // 14:30–21:00
  if (utcTime >= 810 && utcTime < 870)   return 'NYSE PRE'    // 13:30–14:30
  if (utcTime >= 1260 && utcTime < 1320) return 'NYSE AFTER'  // 21:00–22:00
  // LSE: 08:00–16:30 UTC
  if (utcTime >= 480 && utcTime < 990)   return 'LSE OPEN'    // 08:00–16:30
  // TSE: 00:00–06:00 UTC
  if (utcTime < 360)                     return 'TSE OPEN'    // 00:00–06:00

  return 'CLOSED'
}

function sessionColor(label: string): string {
  if (label.includes('OPEN'))  return 'text-terminal-up'
  if (label.includes('PRE') || label.includes('AFTER')) return 'text-terminal-accent'
  return 'text-terminal-down'
}

export function StatusBar() {
  const wsConnected  = useStore((s) => s.wsConnected)
  const btc          = useStore((s) => s.tickers['BTCUSDT'])
  const eth          = useStore((s) => s.tickers['ETHUSDT'])
  const regime       = useStore((s) => s.regime)
  const alertRules   = useStore((s) => s.alertRules)
  const session      = getMarketSession()
  const triggered    = alertRules.filter((r) => r.triggered).length

  const [utcClock, setUtcClock] = useState(() => new Date().toUTCString().slice(0, 25))
  useEffect(() => {
    const id = setInterval(() => setUtcClock(new Date().toUTCString().slice(0, 25)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-full flex items-center justify-between px-3 bg-terminal-surface border-t border-terminal-border">
      {/* Left */}
      <div className="flex items-center gap-4">
        <StatusChip label="CRYPTO" value="24/7" color="text-terminal-up" />
        <StatusChip label="EQUITIES" value={session} color={sessionColor(session)} />
        {btc && <StatusChip label="BTC" value={`$${fmt(btc.price)}`} color="text-terminal-accent" />}
        {eth && <StatusChip label="ETH" value={`$${fmt(eth.price)}`} color="text-terminal-blue" />}

        {/* Regime badge */}
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded border font-mono text-2xs font-semibold"
          style={{ borderColor: REGIME_COLOR[regime.regime], color: REGIME_COLOR[regime.regime] }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: REGIME_COLOR[regime.regime] }} />
          {REGIME_LABEL[regime.regime]}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {triggered > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-terminal-accent animate-pulse" />
            <span className="font-mono text-2xs text-terminal-accent font-semibold">
              {triggered} ALERT{triggered > 1 ? 'S' : ''}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-terminal-up animate-pulse' : 'bg-terminal-down'}`} />
          <span className={`font-mono text-2xs ${wsConnected ? 'text-terminal-up' : 'text-terminal-down'}`}>
            {wsConnected ? 'LIVE' : 'RECONNECTING'}
          </span>
        </div>
        <span className="font-mono text-2xs text-terminal-faint">
          {utcClock} UTC
        </span>
      </div>
    </div>
  )
}

function StatusChip({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-2xs text-terminal-faint">{label}</span>
      <span className={`font-mono text-2xs font-semibold ${color}`}>{value}</span>
    </div>
  )
}
