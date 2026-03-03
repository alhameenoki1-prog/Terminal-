import type { Ticker } from '../types'

interface YahooQuote {
  symbol: string
  shortName?: string
  longName?: string
  regularMarketPrice?: number
  regularMarketChange?: number
  regularMarketChangePercent?: number
  regularMarketVolume?: number
  regularMarketDayHigh?: number
  regularMarketDayLow?: number
  marketCap?: number
  quoteType?: string
}

interface YahooResponse {
  quoteResponse: {
    result: YahooQuote[]
    error: null | object
  }
}

const SYMBOL_TYPE_MAP: Record<string, Ticker['type']> = {
  EQUITY:    'stock',
  ETF:       'stock',
  INDEX:     'index',
  CURRENCY:  'forex',
  FUTURE:    'futures',
  BOND:      'bond',
}

export async function fetchYahooQuotes(symbols: string[]): Promise<Ticker[]> {
  if (!symbols.length) return []
  const joined = symbols.join(',')
  const url = `/api/yahoo/v7/finance/quote?symbols=${encodeURIComponent(joined)}&fields=shortName,longName,regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,regularMarketDayHigh,regularMarketDayLow,marketCap,quoteType`

  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data: YahooResponse = await res.json()
    const quotes = data?.quoteResponse?.result ?? []

    return quotes
      .filter((q) => q.regularMarketPrice != null)
      .map((q): Ticker => ({
        symbol:       q.symbol,
        name:         q.shortName ?? q.longName ?? q.symbol,
        price:        q.regularMarketPrice ?? 0,
        change24h:    q.regularMarketChange ?? 0,
        changePct24h: q.regularMarketChangePercent ?? 0,
        volume24h:    q.regularMarketVolume,
        high24h:      q.regularMarketDayHigh,
        low24h:       q.regularMarketDayLow,
        marketCap:    q.marketCap,
        type:         SYMBOL_TYPE_MAP[q.quoteType ?? ''] ?? 'stock',
      }))
  } catch {
    return []
  }
}

// Symbols for the global indices / FX / bonds / futures we want to track
export const GLOBAL_YAHOO_SYMBOLS = [
  // US indices
  '^GSPC', '^IXIC', '^DJI', '^VIX',
  // Global indices
  '^FTSE', '^N225', '^GDAXI', '^FCHI', '^HSI', '^AXJO', '^BSESN', '^KS11', '^BVSP', '^GSPTSE',
  // Forex majors
  'EURUSD=X', 'USDJPY=X', 'GBPUSD=X', 'AUDUSD=X', 'USDCHF=X', 'USDCAD=X', 'NZDUSD=X',
  'USDCNH=X', 'USDKRW=X', 'USDINR=X',
  // US Yields + Japan 10Y
  '^TNX', '^FVX', '^IRX', '^TYX', '^JN10Y',
  // Commodities
  'GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F',
  // Futures (CME)
  'ES=F', 'NQ=F', 'ZN=F',
]
