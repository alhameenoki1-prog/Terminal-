import type { Candle, Ticker } from '../types'

const BASE = 'https://api.binance.com/api/v3'

// Binance allows CORS from browsers for public endpoints
export async function fetchKlines(
  symbol: string,
  interval: string,
  limit = 200,
): Promise<Candle[]> {
  const res = await fetch(
    `${BASE}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`,
  )
  if (!res.ok) throw new Error(`Binance klines failed: ${res.status}`)
  const raw: [number, string, string, string, string, string, number][] = await res.json()
  return raw.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open:   parseFloat(k[1]),
    high:   parseFloat(k[2]),
    low:    parseFloat(k[3]),
    close:  parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }))
}

export async function fetch24hrTickers(symbols: string[]): Promise<Ticker[]> {
  // Batch request
  const params = symbols.length === 1
    ? `?symbol=${symbols[0].toUpperCase()}`
    : `?symbols=${JSON.stringify(symbols.map((s) => s.toUpperCase()))}`

  const res = await fetch(`${BASE}/ticker/24hr${params}`)
  if (!res.ok) throw new Error(`Binance ticker failed: ${res.status}`)
  const data = await res.json()
  const arr = Array.isArray(data) ? data : [data]

  return arr.map((t) => ({
    symbol:      t.symbol,
    name:        symbolToName(t.symbol),
    price:       parseFloat(t.lastPrice),
    change24h:   parseFloat(t.priceChange),
    changePct24h: parseFloat(t.priceChangePercent),
    volume24h:   parseFloat(t.quoteVolume),
    high24h:     parseFloat(t.highPrice),
    low24h:      parseFloat(t.lowPrice),
    type:        'crypto',
  }))
}

function symbolToName(symbol: string): string {
  const map: Record<string, string> = {
    BTCUSDT:  'Bitcoin',
    ETHUSDT:  'Ethereum',
    SOLUSDT:  'Solana',
    BNBUSDT:  'BNB',
    XRPUSDT:  'XRP',
    ADAUSDT:  'Cardano',
    DOGEUSDT: 'Dogecoin',
    AVAXUSDT: 'Avalanche',
    DOTUSDT:  'Polkadot',
    MATICUSDT:'Polygon',
    LINKUSDT: 'Chainlink',
    LTCUSDT:  'Litecoin',
  }
  return map[symbol] ?? symbol.replace('USDT', '').replace('BTC', '')
}

// WebSocket stream URL for all mini-tickers
export const WS_ALL_TICKERS = 'wss://stream.binance.com:9443/ws/!miniTicker@arr'

export function wsKlineUrl(symbol: string, interval: string) {
  return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
}
