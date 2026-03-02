import { create } from 'zustand'
import type { Ticker, NewsItem, ChartConfig, MapLayerType } from '../types'

interface TerminalStore {
  // Tickers
  tickers: Record<string, Ticker>
  setTicker: (t: Ticker) => void
  setTickers: (ts: Ticker[]) => void

  // Chart
  chartConfig: ChartConfig
  setChartSymbol: (symbol: string) => void
  setChartInterval: (interval: ChartConfig['interval']) => void
  setChartType: (type: ChartConfig['type']) => void

  // News
  news: NewsItem[]
  setNews: (items: NewsItem[]) => void
  newsLoading: boolean
  setNewsLoading: (v: boolean) => void

  // Map layers
  activeLayers: Set<MapLayerType>
  toggleLayer: (layer: MapLayerType) => void

  // Watchlist
  watchlist: string[]
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void

  // WS connection status
  wsConnected: boolean
  setWsConnected: (v: boolean) => void
}

export const useStore = create<TerminalStore>((set) => ({
  tickers: {},
  setTicker: (t) =>
    set((s) => ({ tickers: { ...s.tickers, [t.symbol]: t } })),
  setTickers: (ts) =>
    set((s) => {
      const next = { ...s.tickers }
      for (const t of ts) next[t.symbol] = t
      return { tickers: next }
    }),

  chartConfig: { symbol: 'BTCUSDT', interval: '15m', type: 'candlestick' },
  setChartSymbol:   (symbol)   => set((s) => ({ chartConfig: { ...s.chartConfig, symbol } })),
  setChartInterval: (interval) => set((s) => ({ chartConfig: { ...s.chartConfig, interval } })),
  setChartType:     (type)     => set((s) => ({ chartConfig: { ...s.chartConfig, type } })),

  news: [],
  setNews: (items) => set({ news: items }),
  newsLoading: false,
  setNewsLoading: (v) => set({ newsLoading: v }),

  activeLayers: new Set<MapLayerType>(['exchanges', 'chokepoints', 'conflicts', 'oil']),
  toggleLayer: (layer) =>
    set((s) => {
      const next = new Set(s.activeLayers)
      next.has(layer) ? next.delete(layer) : next.add(layer)
      return { activeLayers: next }
    }),

  watchlist: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT', 'AVAXUSDT', 'LINKUSDT'],
  addToWatchlist: (symbol) =>
    set((s) => ({
      watchlist: s.watchlist.includes(symbol) ? s.watchlist : [...s.watchlist, symbol],
    })),
  removeFromWatchlist: (symbol) =>
    set((s) => ({ watchlist: s.watchlist.filter((x) => x !== symbol) })),

  wsConnected: false,
  setWsConnected: (v) => set({ wsConnected: v }),
}))
