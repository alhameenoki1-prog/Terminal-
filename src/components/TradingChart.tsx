import { useEffect, useRef } from 'react'
import type { ChartConfig } from '../types'
import { useStore } from '../store/useStore'
import { fmt, pctClass, pctSign } from '../utils/format'

declare global {
  interface Window {
    TradingView: { widget: new (config: object) => void }
  }
}

const TV_INTERVAL: Record<string, string> = {
  '1m': '1', '5m': '5', '15m': '15', '1h': '60', '4h': '240', '1d': 'D',
}

const TV_STYLE: Record<string, string> = {
  candlestick: '1',
  line: '2',
}

const INTERVALS: { label: string; value: string }[] = [
  { label: '1m',  value: '1m'  },
  { label: '5m',  value: '5m'  },
  { label: '15m', value: '15m' },
  { label: '1H',  value: '1h'  },
  { label: '4H',  value: '4h'  },
  { label: '1D',  value: '1d'  },
]

export function TradingChart() {
  const containerRef     = useRef<HTMLDivElement>(null)
  const { symbol, interval, type } = useStore((s) => s.chartConfig)
  const setChartInterval = useStore((s) => s.setChartInterval)
  const setChartType     = useStore((s) => s.setChartType)
  const ticker           = useStore((s) => s.tickers[symbol])

  useEffect(() => {
    if (!containerRef.current) return

    const containerId = 'tv_chart_container'
    containerRef.current.innerHTML =
      `<div id="${containerId}" style="height:100%;width:100%;"></div>`

    const initWidget = () => {
      if (!window.TradingView) return
      new window.TradingView.widget({
        container_id:       containerId,
        symbol:             `BINANCE:${symbol}`,
        interval:           TV_INTERVAL[interval] ?? '15',
        timezone:           'Etc/UTC',
        theme:              'dark',
        style:              TV_STYLE[type] ?? '1',
        locale:             'en',
        enable_publishing:  false,
        allow_symbol_change: false,
        save_image:         false,
        height:             '100%',
        width:              '100%',
        hide_top_toolbar:   false,
        hide_side_toolbar:  false,
        backgroundColor:    '#050A14',
      })
    }

    if (window.TradingView) {
      initWidget()
    } else {
      const existing = document.querySelector('script[src*="tradingview.com/tv.js"]')
      if (existing) {
        existing.addEventListener('load', initWidget)
      } else {
        const script = document.createElement('script')
        script.src   = 'https://s3.tradingview.com/tv.js'
        script.async = true
        script.onload = initWidget
        document.head.appendChild(script)
      }
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [symbol, interval, type])

  const priceColor = ticker ? pctClass(ticker.changePct24h) : 'text-terminal-text'

  return (
    <div className="flex flex-col h-full bg-terminal-bg">
      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-surface flex-shrink-0">
        {/* Left: symbol + price */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-terminal-accent">
            {symbol.replace('USDT', '')}/USDT
          </span>
          {ticker && (
            <>
              <span className={`font-mono text-sm font-bold ${priceColor}`}>
                {fmt(ticker.price)}
              </span>
              <span className={`font-mono text-xs ${priceColor}`}>
                {pctSign(ticker.changePct24h)}
              </span>
            </>
          )}
        </div>

        {/* Right: chart type + intervals */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setChartType(type === 'candlestick' ? 'line' : 'candlestick')}
            className="px-2 py-0.5 font-mono text-2xs rounded border border-terminal-border text-terminal-dim hover:text-terminal-text hover:border-terminal-muted transition-colors"
          >
            {type === 'candlestick' ? '⬛ Candles' : '— Line'}
          </button>

          <div className="w-px h-4 bg-terminal-border mx-1" />

          {INTERVALS.map((iv) => (
            <button
              key={iv.value}
              onClick={() => setChartInterval(iv.value as ChartConfig['interval'])}
              className={`px-2 py-0.5 font-mono text-2xs rounded transition-colors ${
                interval === iv.value
                  ? 'bg-terminal-accent text-terminal-bg font-bold'
                  : 'text-terminal-dim hover:text-terminal-text'
              }`}
            >
              {iv.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TradingView widget ─────────────────────────────────────────── */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  )
}
