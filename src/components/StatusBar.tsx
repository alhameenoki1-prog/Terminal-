import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'

function getMarketSession(): string {
  const now = new Date()
  const utcHour = now.getUTCHours()
  const utcMin  = now.getUTCMinutes()
  const utcTime = utcHour * 60 + utcMin

  // NYSE: 14:30–21:00 UTC
  if (utcTime >= 870 && utcTime < 1260) return 'NYSE OPEN'
  if (utcTime >= 810 && utcTime < 870)  return 'NYSE PRE'
  if (utcTime >= 1260 && utcTime < 1440) return 'NYSE AFTER'

  // LSE: 08:00–16:30 UTC
  if (utcTime >= 480 && utcTime < 990)  return 'LSE OPEN'

  // TSE: 00:00–06:00 UTC
  if (utcTime >= 0 && utcTime < 360)    return 'TSE OPEN'

  return 'CLOSED'
}

function sessionColor(label: string): string {
  if (label.includes('OPEN'))  return 'text-terminal-up'
  if (label.includes('PRE') || label.includes('AFTER')) return 'text-terminal-accent'
  return 'text-terminal-down'
}

export function StatusBar() {
  const wsConnected   = useStore((s) => s.wsConnected)
  const btc           = useStore((s) => s.tickers['BTCUSDT'])
  const eth           = useStore((s) => s.tickers['ETHUSDT'])
  const session       = getMarketSession()

  return (
    <div className="h-full flex items-center justify-between px-3 bg-terminal-surface border-t border-terminal-border">
      {/* Left */}
      <div className="flex items-center gap-4">
        <StatusChip label="CRYPTO" value="24/7" color="text-terminal-up" />
        <StatusChip
          label="EQUITIES"
          value={session}
          color={sessionColor(session)}
        />
        {btc && (
          <StatusChip label="BTC" value={`$${fmt(btc.price)}`} color="text-terminal-accent" />
        )}
        {eth && (
          <StatusChip label="ETH" value={`$${fmt(eth.price)}`} color="text-terminal-blue" />
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-terminal-up animate-pulse' : 'bg-terminal-down'}`}
          />
          <span className={`font-mono text-2xs ${wsConnected ? 'text-terminal-up' : 'text-terminal-down'}`}>
            {wsConnected ? 'LIVE' : 'RECONNECTING'}
          </span>
        </div>
        <span className="font-mono text-2xs text-terminal-faint">
          {new Date().toUTCString().slice(0, 25)} UTC
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
