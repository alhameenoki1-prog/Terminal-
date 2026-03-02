import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'

interface FuturesRow {
  name: string
  symbol: string
  signal: string
  signalColor: string
}

function getFuturesSignal(changePct: number): { signal: string; color: string } {
  // Simplified without OI data (Yahoo doesn't provide OI in free tier)
  // Use price change direction as proxy
  if (changePct > 0.5)  return { signal: '↑P — Bullish momentum',    color: '#10B981' }
  if (changePct < -0.5) return { signal: '↓P — Bearish momentum',    color: '#EF4444' }
  return { signal: '→ Neutral / consolidation', color: '#9CA3AF' }
}

const FUTURES = [
  { name: 'Gold (GC)',   symbol: 'GC=F'    },
  { name: 'WTI (CL)',    symbol: 'CL=F'    },
  { name: 'S&P (ES)',    symbol: 'ES=F'    },
  { name: 'Nasdaq (NQ)', symbol: 'NQ=F'    },
  { name: '10Y Note (ZN)', symbol: 'ZN=F'  },
]

export function FuturesFlowPanel() {
  const tickers = useStore((s) => s.tickers)

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Futures Flow Monitor
      </div>

      <div className="flex flex-col gap-1">
        {FUTURES.map((f) => {
          const t = tickers[f.symbol]
          const { signal, color } = getFuturesSignal(t?.changePct24h ?? 0)

          return (
            <div key={f.symbol} className="flex items-center justify-between bg-terminal-panel rounded px-3 py-2 border border-terminal-border/30">
              <div className="flex flex-col">
                <span className="font-mono text-xs text-terminal-text">{f.name}</span>
                <span className="font-mono text-2xs" style={{ color }}>{signal}</span>
              </div>
              <div className="text-right">
                {t ? (
                  <>
                    <div className="font-mono text-xs text-terminal-text">{fmt(t.price)}</div>
                    <div className={`font-mono text-2xs ${t.changePct24h > 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                      {t.changePct24h > 0 ? '+' : ''}{t.changePct24h.toFixed(2)}%
                    </div>
                  </>
                ) : (
                  <span className="font-mono text-2xs text-terminal-faint/40">—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <div className="text-terminal-accent mb-1">NEXUS Section 7.1 — Price-OI Rules:</div>
        <div>↑P+↑OI → New Longs · ↓P+↑OI → New Shorts</div>
        <div>↑P+↓OI → Short Cover · ↓P+↓OI → Long Liquidation</div>
      </div>
    </div>
  )
}
