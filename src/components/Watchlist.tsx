import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fmt, pctClass, pctSign, fmtCompact } from '../utils/format'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { WatchlistCategory, WatchlistItem } from '../types'
import { fetchYahooQuotes, GLOBAL_YAHOO_SYMBOLS } from '../services/yahooService'

const CATEGORY_TABS: { key: WatchlistCategory | 'all'; label: string }[] = [
  { key: 'all',         label: 'All'    },
  { key: 'crypto',      label: 'Crypto' },
  { key: 'indices',     label: 'Index'  },
  { key: 'forex',       label: 'FX'     },
  { key: 'bonds',       label: 'Bonds'  },
  { key: 'commodities', label: 'Comm.'  },
  { key: 'stocks',      label: 'Stocks' },
]

export function Watchlist() {
  const tickers           = useStore((s) => s.tickers)
  const watchlist         = useStore((s) => s.watchlist)
  const setTickers        = useStore((s) => s.setTickers)
  const setChartSymbol    = useStore((s) => s.setChartSymbol)
  const chartConfig       = useStore((s) => s.chartConfig)
  const activeCategory    = useStore((s) => s.activeWatchlistCategory)
  const setActiveCategory = useStore((s) => s.setActiveWatchlistCategory)

  // Poll Yahoo Finance for non-crypto prices every 30s
  useEffect(() => {
    const poll = () => {
      fetchYahooQuotes(GLOBAL_YAHOO_SYMBOLS).then(setTickers).catch(() => {})
    }
    poll()
    const id = setInterval(poll, 30_000)
    return () => clearInterval(id)
  }, [setTickers])

  const filtered: WatchlistItem[] =
    activeCategory === 'all'
      ? watchlist
      : watchlist.filter((w) => w.category === activeCategory)

  return (
    <div className="flex flex-col h-full bg-terminal-surface border-r border-terminal-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase">
          Watchlist
        </span>
        <span className="font-mono text-2xs text-terminal-faint">{filtered.length}</span>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto border-b border-terminal-border flex-shrink-0 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`flex-shrink-0 px-2 py-1.5 font-mono text-2xs transition-colors whitespace-nowrap ${
              activeCategory === tab.key
                ? 'text-terminal-accent border-b-2 border-terminal-accent'
                : 'text-terminal-faint hover:text-terminal-dim'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-3 py-1 border-b border-terminal-border/50 flex-shrink-0">
        <span className="font-mono text-2xs text-terminal-faint">Asset</span>
        <span className="font-mono text-2xs text-terminal-faint text-right">Price</span>
        <span className="font-mono text-2xs text-terminal-faint text-right">24h</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.map((item) => {
          const t = tickers[item.symbol]
          const active = chartConfig.symbol === item.symbol
          const positive = (t?.changePct24h ?? 0) > 0
          const negative = (t?.changePct24h ?? 0) < 0

          return (
            <button
              key={item.symbol}
              onClick={() => setChartSymbol(item.symbol, item.tvSymbol)}
              className={`
                w-full grid grid-cols-3 items-center px-3 py-2
                border-b border-terminal-border/30
                hover:bg-terminal-panel transition-colors text-left
                ${active ? 'bg-terminal-panel border-l-2 border-l-terminal-accent' : ''}
              `}
            >
              <div className="flex flex-col min-w-0">
                <span className={`font-mono text-xs font-semibold truncate ${active ? 'text-terminal-accent' : 'text-terminal-text'}`}>
                  {shortLabel(item)}
                </span>
                <span className="font-mono text-2xs text-terminal-faint truncate">{item.name}</span>
              </div>

              <div className="text-right">
                {t ? (
                  <span className="font-mono text-xs text-terminal-text">{fmt(t.price)}</span>
                ) : (
                  <span className="font-mono text-2xs text-terminal-faint/40">—</span>
                )}
              </div>

              <div className="flex items-center justify-end gap-1">
                {t && (
                  <>
                    {positive && <TrendingUp className="w-3 h-3 text-terminal-up flex-shrink-0" />}
                    {negative && <TrendingDown className="w-3 h-3 text-terminal-down flex-shrink-0" />}
                    {!positive && !negative && <Minus className="w-3 h-3 text-terminal-dim flex-shrink-0" />}
                    <span className={`font-mono text-2xs font-semibold ${pctClass(t.changePct24h)}`}>
                      {pctSign(t.changePct24h)}
                    </span>
                  </>
                )}
              </div>
            </button>
          )
        })}

        {filtered.length === 0 && (
          <div className="p-4 text-center">
            <span className="font-mono text-xs text-terminal-faint">No assets</span>
          </div>
        )}
      </div>

      {/* Selected asset detail */}
      {tickers[chartConfig.symbol] && (
        <AssetDetail ticker={tickers[chartConfig.symbol]!} />
      )}
    </div>
  )
}

function shortLabel(item: WatchlistItem): string {
  if (item.category === 'crypto') return item.symbol.replace('USDT', '')
  if (item.category === 'forex')  return item.symbol.replace('=X', '')
  return item.symbol.replace('^', '').replace('=F', 'F')
}

function AssetDetail({ ticker }: { ticker: NonNullable<ReturnType<typeof useStore.getState>['tickers'][string]> }) {
  return (
    <div className="border-t border-terminal-border p-3 flex-shrink-0 bg-terminal-panel">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-semibold text-terminal-accent">
          {ticker.symbol}
        </span>
        <span className={`font-mono text-xs font-bold ${pctClass(ticker.changePct24h)}`}>
          {pctSign(ticker.changePct24h)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {ticker.high24h != null && (
          <>
            <StatRow label="24H High" value={fmt(ticker.high24h)} />
            <StatRow label="24H Low"  value={fmt(ticker.low24h ?? 0)} />
          </>
        )}
        {ticker.volume24h != null && (
          <StatRow label="Volume" value={fmtCompact(ticker.volume24h)} />
        )}
        {ticker.marketCap != null && (
          <StatRow label="Mkt Cap" value={fmtCompact(ticker.marketCap)} />
        )}
      </div>
    </div>
  )
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-2xs text-terminal-faint">{label}</span>
      <span className="font-mono text-2xs text-terminal-dim">{value}</span>
    </div>
  )
}
