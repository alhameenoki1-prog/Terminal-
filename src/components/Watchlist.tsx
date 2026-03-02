import { useStore } from '../store/useStore'
import { fmt, pctClass, pctSign, fmtCompact } from '../utils/format'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function Watchlist() {
  const tickers = useStore((s) => s.tickers)
  const watchlist = useStore((s) => s.watchlist)
  const setChartSymbol = useStore((s) => s.setChartSymbol)
  const chartConfig = useStore((s) => s.chartConfig)

  const items = watchlist.map((sym) => tickers[sym]).filter(Boolean)

  return (
    <div className="flex flex-col h-full bg-terminal-surface border-r border-terminal-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase">
          Watchlist
        </span>
        <span className="font-mono text-2xs text-terminal-faint">{items.length} assets</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 px-3 py-1 border-b border-terminal-border/50 flex-shrink-0">
        <span className="font-mono text-2xs text-terminal-faint">Asset</span>
        <span className="font-mono text-2xs text-terminal-faint text-right">Price</span>
        <span className="font-mono text-2xs text-terminal-faint text-right">24h</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {items.map((t) => {
          const active = chartConfig.symbol === t.symbol
          const positive = t.changePct24h > 0
          const negative = t.changePct24h < 0
          return (
            <button
              key={t.symbol}
              onClick={() => setChartSymbol(t.symbol)}
              className={`
                w-full grid grid-cols-3 items-center px-3 py-2
                border-b border-terminal-border/30
                hover:bg-terminal-panel transition-colors text-left
                ${active ? 'bg-terminal-panel border-l-2 border-l-terminal-accent' : ''}
              `}
            >
              {/* Symbol + name */}
              <div className="flex flex-col min-w-0">
                <span className={`font-mono text-xs font-semibold truncate ${active ? 'text-terminal-accent' : 'text-terminal-text'}`}>
                  {t.symbol.replace('USDT', '')}
                </span>
                <span className="font-mono text-2xs text-terminal-faint truncate">{t.name}</span>
              </div>

              {/* Price */}
              <div className="text-right">
                <span className="font-mono text-xs text-terminal-text">{fmt(t.price)}</span>
              </div>

              {/* Change */}
              <div className="flex items-center justify-end gap-1">
                {positive && <TrendingUp className="w-3 h-3 text-terminal-up flex-shrink-0" />}
                {negative && <TrendingDown className="w-3 h-3 text-terminal-down flex-shrink-0" />}
                {!positive && !negative && <Minus className="w-3 h-3 text-terminal-dim flex-shrink-0" />}
                <span className={`font-mono text-2xs font-semibold ${pctClass(t.changePct24h)}`}>
                  {pctSign(t.changePct24h)}
                </span>
              </div>
            </button>
          )
        })}

        {items.length === 0 && (
          <div className="p-4 text-center">
            <span className="font-mono text-xs text-terminal-faint">Loading...</span>
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

function AssetDetail({ ticker }: { ticker: NonNullable<ReturnType<typeof useStore.getState>['tickers'][string]> }) {
  return (
    <div className="border-t border-terminal-border p-3 flex-shrink-0 bg-terminal-panel">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-semibold text-terminal-accent">
          {ticker.symbol.replace('USDT', '')}/USD
        </span>
        <span className={`font-mono text-xs font-bold ${pctClass(ticker.changePct24h)}`}>
          {pctSign(ticker.changePct24h)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {ticker.high24h !== undefined && (
          <>
            <StatRow label="24H High" value={fmt(ticker.high24h)} />
            <StatRow label="24H Low" value={fmt(ticker.low24h ?? 0)} />
          </>
        )}
        {ticker.volume24h !== undefined && (
          <StatRow label="Volume" value={fmtCompact(ticker.volume24h)} />
        )}
        {ticker.marketCap !== undefined && (
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
