import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { fetchYahooQuotes } from '../services/yahooService'
import { fmt, pctClass, pctSign } from '../utils/format'

export function CountryPanel() {
  const selectedCountry    = useStore((s) => s.selectedCountry)
  const setSelectedCountry = useStore((s) => s.setSelectedCountry)
  const tickers            = useStore((s) => s.tickers)
  const setTickers         = useStore((s) => s.setTickers)
  const setChartSymbol     = useStore((s) => s.setChartSymbol)
  const filteredNews       = useStore((s) => {
    const filter = s.newsCountryFilter
    if (!filter) return s.news.slice(0, 5)
    const profile = selectedCountry
    if (!profile) return []
    const kws = profile.rssKeywords
    return s.news
      .filter((n) => kws.some((kw) => `${n.title} ${n.description}`.toLowerCase().includes(kw)))
      .slice(0, 5)
  })

  useEffect(() => {
    if (!selectedCountry) return
    const syms = [
      selectedCountry.yahooIndex,
      selectedCountry.yahooCurrency,
      selectedCountry.yahooBond,
      ...selectedCountry.mainStocks.map((s) => s.symbol),
    ].filter(Boolean)
    fetchYahooQuotes(syms).then(setTickers).catch(() => {})
  }, [selectedCountry, setTickers])

  if (!selectedCountry) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🌐</div>
          <div className="font-mono text-xs text-terminal-faint">Click a country on the map</div>
          <div className="font-mono text-2xs text-terminal-faint/50 mt-1">to view intelligence</div>
        </div>
      </div>
    )
  }

  const cp = selectedCountry
  const indexTicker  = tickers[cp.yahooIndex]
  const fxTicker     = tickers[cp.yahooCurrency]
  const bondTicker   = tickers[cp.yahooBond]

  const instColor =
    cp.instabilityScore >= 70 ? 'text-terminal-down' :
    cp.instabilityScore >= 40 ? 'text-yellow-400' : 'text-terminal-up'

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Header */}
      <div className="sticky top-0 bg-terminal-surface border-b border-terminal-border px-3 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{cp.flag}</span>
          <span className="font-mono text-sm font-bold text-terminal-text">{cp.name}</span>
        </div>
        <button
          onClick={() => setSelectedCountry(null)}
          className="font-mono text-xs text-terminal-faint hover:text-terminal-down transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Market data */}
        <div className="flex flex-col gap-1">
          {indexTicker && (
            <MarketRow
              label={indexTicker.name || cp.yahooIndex}
              price={indexTicker.price}
              change={indexTicker.changePct24h}
              onChart={() => setChartSymbol(cp.yahooIndex, cp.tvIndex)}
            />
          )}
          {fxTicker && (
            <MarketRow
              label={fxTicker.name || cp.yahooCurrency}
              price={fxTicker.price}
              change={fxTicker.changePct24h}
            />
          )}
          {bondTicker && (
            <MarketRow
              label={`10Y Bond`}
              price={bondTicker.price}
              change={bondTicker.changePct24h}
              unit="%"
            />
          )}
        </div>

        {/* Central bank */}
        <div className="bg-terminal-panel rounded border border-terminal-border/50 p-2">
          <div className="font-mono text-2xs text-terminal-faint mb-1">{cp.centralBank}</div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-terminal-text">{cp.cbRate.toFixed(2)}%</span>
            {cp.nextMeeting && (
              <span className="font-mono text-2xs text-terminal-faint">Next: {cp.nextMeeting}</span>
            )}
          </div>
        </div>

        {/* NEXUS Bond-FX Bias */}
        {cp.bondFxRule && (
          <div className="bg-blue-950/30 rounded border border-blue-800/30 p-2">
            <div className="font-mono text-2xs text-terminal-accent mb-1">NEXUS Bond-FX Rule</div>
            <div className="font-mono text-2xs text-terminal-dim">{cp.bondFxRule}</div>
            {cp.fxBias && (
              <div className="font-mono text-2xs text-terminal-blue mt-1">{cp.fxBias}</div>
            )}
          </div>
        )}

        {/* Instability score */}
        <div className="bg-terminal-panel rounded border border-terminal-border/50 p-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-2xs text-terminal-faint">Instability Score</span>
            <span className={`font-mono text-sm font-bold ${instColor}`}>{cp.instabilityScore}/100</span>
          </div>
          <div className="w-full bg-terminal-bg rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${cp.instabilityScore}%`,
                backgroundColor: cp.instabilityScore >= 70 ? '#EF4444' : cp.instabilityScore >= 40 ? '#F59E0B' : '#10B981',
              }}
            />
          </div>
          {cp.instabilityBreakdown && (
            <div className="grid grid-cols-3 gap-1 mt-2">
              {Object.entries(cp.instabilityBreakdown).map(([k, v]) => (
                <div key={k} className="text-center">
                  <div className="font-mono text-2xs text-terminal-faint capitalize">{k}</div>
                  <div className="font-mono text-xs text-terminal-dim">{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top stocks */}
        {cp.mainStocks.length > 0 && (
          <div>
            <div className="font-mono text-2xs text-terminal-faint mb-1">Top Stocks</div>
            {cp.mainStocks.map((s) => {
              const t = tickers[s.symbol]
              return (
                <div key={s.symbol} className="flex items-center justify-between py-1 border-b border-terminal-border/20 last:border-0">
                  <span className="font-mono text-2xs text-terminal-dim">{s.name}</span>
                  {t ? (
                    <span className={`font-mono text-2xs ${pctClass(t.changePct24h)}`}>
                      {fmt(t.price)} {pctSign(t.changePct24h)}
                    </span>
                  ) : (
                    <span className="font-mono text-2xs text-terminal-faint/40">—</span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Country news */}
        {filteredNews.length > 0 && (
          <div>
            <div className="font-mono text-2xs text-terminal-faint mb-1">Country News</div>
            {filteredNews.map((n) => (
              <a
                key={n.id}
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="block py-1.5 border-b border-terminal-border/20 last:border-0 hover:bg-terminal-panel transition-colors rounded px-1"
              >
                <div className="font-mono text-2xs text-terminal-dim line-clamp-2">{n.title}</div>
                <div className="font-mono text-2xs text-terminal-faint/50 mt-0.5">{n.source}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MarketRow({
  label, price, change, unit = '', onChart,
}: { label: string; price: number; change: number; unit?: string; onChart?: () => void }) {
  return (
    <div className="flex items-center justify-between bg-terminal-panel rounded px-2 py-1.5 border border-terminal-border/30">
      <span className="font-mono text-2xs text-terminal-dim truncate flex-1">{label}</span>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-mono text-xs text-terminal-text">{fmt(price)}{unit}</span>
        <span className={`font-mono text-2xs ${pctClass(change)}`}>
          {pctSign(change)}
        </span>
        {onChart && (
          <button
            onClick={onChart}
            className="font-mono text-2xs text-terminal-accent hover:underline ml-1"
            title="Open in chart"
          >
            →
          </button>
        )}
      </div>
    </div>
  )
}
