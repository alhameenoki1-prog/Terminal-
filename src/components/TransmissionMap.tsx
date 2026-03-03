import { useStore } from '../store/useStore'

interface Node {
  id: string
  label: string
  symbol: string
  unit?: string
}

const NODES: Node[] = [
  { id: 'us10y',   label: 'US 10Y',   symbol: '^TNX',     unit: '%' },
  { id: 'jp10y',   label: 'JP 10Y',   symbol: '^JN10Y',   unit: '%' },
  { id: 'spread',  label: 'US-JP Spd',symbol: '_computed', unit: 'bp' },
  { id: 'usdjpy',  label: 'USD/JPY',  symbol: 'USDJPY=X'  },
  { id: 'spx',     label: 'S&P 500',  symbol: '^GSPC'     },
  { id: 'vix',     label: 'VIX',      symbol: '^VIX'      },
  { id: 'gold',    label: 'Gold',     symbol: 'GC=F',     unit: '$' },
  { id: 'btc',     label: 'Bitcoin',  symbol: 'BTCUSDT',  unit: '$' },
]

function arrowDir(chg: number): string {
  if (chg > 0.1) return '↑'
  if (chg < -0.1) return '↓'
  return '→'
}

function chgColor(chg: number): string {
  if (chg > 0) return '#10B981'
  if (chg < 0) return '#EF4444'
  return '#9CA3AF'
}

export function TransmissionMap() {
  const tickers = useStore((s) => s.tickers)

  function getVal(symbol: string): { price: number; change: number } | null {
    if (symbol === '_computed') {
      const us10y = tickers['^TNX']?.price
      const jp10y = tickers['^JN10Y']?.price
      if (us10y && jp10y) {
        return { price: (us10y - jp10y) * 100, change: 0 }
      }
      return null
    }
    const t = tickers[symbol]
    if (!t) return null
    return { price: t.price, change: t.changePct24h }
  }

  return (
    <div className="p-3">
      <div className="font-mono text-2xs text-terminal-accent mb-3 tracking-widest uppercase">
        Rate Transmission Map
      </div>

      <div className="flex flex-col gap-1">
        {NODES.map((node, i) => {
          const val = getVal(node.symbol)
          const isLast = i === NODES.length - 1

          return (
            <div key={node.id}>
              <div className="flex items-center justify-between bg-terminal-panel rounded px-3 py-2 border border-terminal-border/50">
                <span className="font-mono text-xs text-terminal-dim">{node.label}</span>
                {val ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-terminal-text">
                      {node.unit === '%' ? `${val.price.toFixed(2)}%`
                       : node.unit === 'bp' ? `${val.price.toFixed(0)}bp`
                       : node.unit === '$' ? `$${val.price.toFixed(0)}`
                       : val.price.toFixed(2)}
                    </span>
                    <span className="font-mono text-xs font-bold" style={{ color: chgColor(val.change) }}>
                      {arrowDir(val.change)} {Math.abs(val.change).toFixed(1)}%
                    </span>
                  </div>
                ) : (
                  <span className="font-mono text-2xs text-terminal-faint/40">—</span>
                )}
              </div>
              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <span className="font-mono text-xs text-terminal-border">↓</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-3 font-mono text-2xs text-terminal-faint bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <span className="text-terminal-accent">NEXUS Rule:</span> JP10Y↑ → USDJPY falls (JPY strengthens) → ES pressure → Gold bid
      </div>
    </div>
  )
}
