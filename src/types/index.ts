// ─── Market / Price ──────────────────────────────────────────────────────────

export interface Ticker {
  symbol: string       // e.g. "BTCUSDT", "AAPL"
  name: string         // e.g. "Bitcoin", "Apple"
  price: number
  change24h: number    // absolute
  changePct24h: number // percent
  volume24h?: number
  high24h?: number
  low24h?: number
  marketCap?: number
  type: 'crypto' | 'stock' | 'forex' | 'commodity' | 'index'
}

export interface Candle {
  time: number   // Unix seconds
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string   // ISO string
  category: NewsCategory
  sentiment?: 'bullish' | 'bearish' | 'neutral'
  tags?: string[]
}

export type NewsCategory =
  | 'markets'
  | 'macro'
  | 'crypto'
  | 'geopolitical'
  | 'commodities'
  | 'tech'
  | 'general'

// ─── Economic / Rates ────────────────────────────────────────────────────────

export interface CentralBankRate {
  bank: string
  country: string
  countryCode: string
  rate: number
  previousRate: number
  lastChange: string      // date string
  nextMeeting?: string
  trend: 'hiking' | 'cutting' | 'hold'
}

export interface EconomicIndicator {
  name: string
  value: string
  change?: string
  positive?: boolean
}

// ─── Map ─────────────────────────────────────────────────────────────────────

export type MapLayerType =
  | 'exchanges'
  | 'oil'
  | 'conflicts'
  | 'cables'
  | 'centralbanks'
  | 'chokepoints'

export interface MapMarker {
  id: string
  lat: number
  lon: number
  type: MapLayerType
  label: string
  detail?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface ChartConfig {
  symbol: string
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  type: 'candlestick' | 'line' | 'area'
}

export type MarketSession = 'pre' | 'open' | 'closed' | 'after'

export interface MarketStatus {
  nyse: MarketSession
  london: MarketSession
  tokyo: MarketSession
  crypto: 'open'  // always open
}
