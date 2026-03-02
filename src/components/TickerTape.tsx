import { useEffect, useRef, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { WS_ALL_TICKERS } from '../services/binanceService'
import { fetchCoinPrices } from '../services/coinGeckoService'
import { fmt, pctClass } from '../utils/format'

// Binance mini-ticker stream message
interface MiniTicker {
  s: string  // symbol
  c: string  // close price
  P: string  // price change percent
  p: string  // price change
  v: string  // base volume
  q: string  // quote volume
}

const TAPE_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
  'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT', 'ADAUSDT', 'MATICUSDT',
]

export function TickerTape() {
  const setTicker = useStore((s) => s.setTicker)
  const setTickers = useStore((s) => s.setTickers)
  const tickers = useStore((s) => s.tickers)
  const setWsConnected = useStore((s) => s.setWsConnected)

  // Seed with CoinGecko on mount for instant display
  useEffect(() => {
    fetchCoinPrices().then(setTickers).catch(() => {})
  }, [setTickers])

  const handleMessage = useCallback(
    (data: unknown) => {
      const arr = data as MiniTicker[]
      if (!Array.isArray(arr)) return
      for (const t of arr) {
        if (!TAPE_SYMBOLS.includes(t.s)) continue
        setTicker({
          symbol:      t.s,
          name:        symbolShort(t.s),
          price:       parseFloat(t.c),
          change24h:   parseFloat(t.p),
          changePct24h: parseFloat(t.P),
          volume24h:   parseFloat(t.q),
          type:        'crypto',
        })
      }
    },
    [setTicker],
  )

  useWebSocket(WS_ALL_TICKERS, {
    onMessage:  handleMessage,
    onOpen:     () => setWsConnected(true),
    onClose:    () => setWsConnected(false),
  })

  const items = TAPE_SYMBOLS.map((sym) => tickers[sym]).filter(Boolean)

  return (
    <div className="ticker-tape-wrapper h-full flex items-center overflow-hidden bg-terminal-surface border-b border-terminal-border">
      {/* Static label */}
      <div className="flex-shrink-0 px-3 font-mono text-xs font-semibold text-terminal-accent tracking-widest border-r border-terminal-border h-full flex items-center">
        TERMINAL
      </div>

      {/* Scrolling tape */}
      <div className="relative flex-1 overflow-hidden h-full">
        <div className="ticker-scroll flex items-center h-full whitespace-nowrap">
          {[...items, ...items].map((t, i) => (
            <TickerItem key={`${t.symbol}-${i}`} ticker={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TickerItem({ ticker }: { ticker: NonNullable<ReturnType<typeof useStore.getState>['tickers'][string]> }) {
  const positive = ticker.changePct24h >= 0
  return (
    <span className="inline-flex items-center gap-2 px-4 border-r border-terminal-border/40 h-full">
      <span className="font-mono text-xs font-semibold text-terminal-dim">
        {ticker.symbol.replace('USDT', '')}
      </span>
      <span className="font-mono text-xs font-semibold text-terminal-text">
        {fmt(ticker.price)}
      </span>
      <span className={`font-mono text-2xs ${pctClass(ticker.changePct24h)}`}>
        {positive ? '+' : ''}{ticker.changePct24h.toFixed(2)}%
      </span>
    </span>
  )
}

function symbolShort(sym: string) {
  return sym.replace('USDT', '')
}
