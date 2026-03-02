import { useCallback, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { WS_ALL_TICKERS } from '../services/binanceService'
import { fetchCoinPrices } from '../services/coinGeckoService'
import { fmt, pctClass } from '../utils/format'

interface MiniTicker {
  s: string; c: string; P: string; p: string; v: string; q: string
}

const TAPE_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT',
  'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT', 'ADAUSDT', 'MATICUSDT',
]

// Global symbols polled every 30s by Watchlist — tap the same store values
const GLOBAL_SECTIONS: { label: string; symbols: string[]; display: (s: string) => string }[] = [
  {
    label: 'INDICES',
    symbols: ['^GSPC', '^IXIC', '^FTSE', '^N225', '^GDAXI', '^HSI'],
    display: (s) => (({ '^GSPC': 'SPX', '^IXIC': 'NDX', '^FTSE': 'FTSE', '^N225': 'NIK', '^GDAXI': 'DAX', '^HSI': 'HSI' } as Record<string, string>)[s] ?? s.replace('^', '')),
  },
  {
    label: 'FX',
    symbols: ['EURUSD=X', 'USDJPY=X', 'GBPUSD=X', 'AUDUSD=X'],
    display: (s) => (({ 'EURUSD=X': 'EUR/USD', 'USDJPY=X': 'USD/JPY', 'GBPUSD=X': 'GBP/USD', 'AUDUSD=X': 'AUD/USD' } as Record<string, string>)[s] ?? s.replace('=X', '')),
  },
  {
    label: 'COMMODITIES',
    symbols: ['GC=F', 'CL=F', 'SI=F'],
    display: (s) => (({ 'GC=F': 'GOLD', 'CL=F': 'WTI', 'SI=F': 'SILVER' } as Record<string, string>)[s] ?? s),
  },
]

type TapeItem = { symbol: string; label: string; price: number; changePct: number; section: string }

export function TickerTape() {
  const setTicker      = useStore((s) => s.setTicker)
  const setTickers     = useStore((s) => s.setTickers)
  const tickers        = useStore((s) => s.tickers)
  const setWsConnected = useStore((s) => s.setWsConnected)

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
          symbol:       t.s,
          name:         t.s.replace('USDT', ''),
          price:        parseFloat(t.c),
          change24h:    parseFloat(t.p),
          changePct24h: parseFloat(t.P),
          volume24h:    parseFloat(t.q),
          type:         'crypto',
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

  const cryptoItems: TapeItem[] = TAPE_SYMBOLS
    .map((sym) => tickers[sym])
    .filter(Boolean)
    .map((t) => ({ symbol: t!.symbol, label: t!.symbol.replace('USDT', ''), price: t!.price, changePct: t!.changePct24h, section: 'CRYPTO' }))

  const globalItems: TapeItem[] = GLOBAL_SECTIONS.flatMap((sec) =>
    sec.symbols
      .map((sym) => {
        const t = tickers[sym]
        return t ? { symbol: sym, label: sec.display(sym), price: t.price, changePct: t.changePct24h, section: sec.label } : null
      })
      .filter(Boolean) as TapeItem[]
  )

  const allItems = [...cryptoItems, ...globalItems]

  return (
    <div className="ticker-tape-wrapper h-full flex items-center overflow-hidden bg-terminal-surface border-b border-terminal-border">
      <div className="flex-shrink-0 px-3 font-mono text-xs font-semibold text-terminal-accent tracking-widest border-r border-terminal-border h-full flex items-center select-none">
        NEXUS
      </div>
      <div className="relative flex-1 overflow-hidden h-full">
        <div className="ticker-scroll flex items-center h-full whitespace-nowrap">
          {[...allItems, ...allItems].map((item, i) => (
            <TapeItem key={`${item.symbol}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TapeItem({ item }: { item: TapeItem }) {
  const labelColor =
    item.section === 'CRYPTO'      ? 'text-terminal-accent' :
    item.section === 'INDICES'     ? 'text-blue-400'        :
    item.section === 'FX'          ? 'text-purple-400'      :
    'text-yellow-500'
  return (
    <span className="inline-flex items-center gap-2 px-3 border-r border-terminal-border/40 h-full">
      <span className={`font-mono text-2xs font-bold ${labelColor}`}>{item.label}</span>
      <span className="font-mono text-xs text-terminal-text">{fmt(item.price)}</span>
      <span className={`font-mono text-2xs ${pctClass(item.changePct)}`}>
        {item.changePct >= 0 ? '+' : ''}{item.changePct.toFixed(2)}%
      </span>
    </span>
  )
}
