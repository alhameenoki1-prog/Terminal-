import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Ticker,
  NewsItem,
  ChartConfig,
  MapLayerType,
  WatchlistItem,
  CountryProfile,
  AlertRule,
  ChatMessage,
  AppSettings,
  RegimeScores,
  MonteCarloResult,
  EdgeScenario,
  ResearchItem,
  DailyLog,
  EarthquakeEvent,
  YieldPoint,
  Position,
} from '../types'
import type { FredSeries } from '../services/fredService'
type FredData = FredSeries[]

const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: 'BTCUSDT',  tvSymbol: 'BINANCE:BTCUSDT',  name: 'Bitcoin',    type: 'crypto',    category: 'crypto'      },
  { symbol: 'ETHUSDT',  tvSymbol: 'BINANCE:ETHUSDT',  name: 'Ethereum',   type: 'crypto',    category: 'crypto'      },
  { symbol: 'SOLUSDT',  tvSymbol: 'BINANCE:SOLUSDT',  name: 'Solana',     type: 'crypto',    category: 'crypto'      },
  { symbol: 'BNBUSDT',  tvSymbol: 'BINANCE:BNBUSDT',  name: 'BNB',        type: 'crypto',    category: 'crypto'      },
  { symbol: 'XRPUSDT',  tvSymbol: 'BINANCE:XRPUSDT',  name: 'XRP',        type: 'crypto',    category: 'crypto'      },
  { symbol: 'DOGEUSDT', tvSymbol: 'BINANCE:DOGEUSDT', name: 'Dogecoin',   type: 'crypto',    category: 'crypto'      },
  { symbol: '^GSPC',    tvSymbol: 'SP:SPX',           name: 'S&P 500',    type: 'index',     category: 'indices'     },
  { symbol: '^IXIC',    tvSymbol: 'NASDAQ:NDX',       name: 'Nasdaq 100', type: 'index',     category: 'indices'     },
  { symbol: '^FTSE',    tvSymbol: 'TVC:UKX',          name: 'FTSE 100',   type: 'index',     category: 'indices'     },
  { symbol: '^N225',    tvSymbol: 'TVC:NI225',        name: 'Nikkei 225', type: 'index',     category: 'indices'     },
  { symbol: '^GDAXI',   tvSymbol: 'TVC:DAX',          name: 'DAX',        type: 'index',     category: 'indices'     },
  { symbol: '^HSI',     tvSymbol: 'TVC:HSI',          name: 'Hang Seng',  type: 'index',     category: 'indices'     },
  { symbol: 'EURUSD=X', tvSymbol: 'FX:EURUSD',        name: 'EUR/USD',    type: 'forex',     category: 'forex'       },
  { symbol: 'USDJPY=X', tvSymbol: 'FX:USDJPY',        name: 'USD/JPY',    type: 'forex',     category: 'forex'       },
  { symbol: 'GBPUSD=X', tvSymbol: 'FX:GBPUSD',        name: 'GBP/USD',    type: 'forex',     category: 'forex'       },
  { symbol: 'AUDUSD=X', tvSymbol: 'FX:AUDUSD',        name: 'AUD/USD',    type: 'forex',     category: 'forex'       },
  { symbol: '^TNX',     tvSymbol: 'TVC:US10Y',        name: 'US 10Y',     type: 'bond',      category: 'bonds'       },
  { symbol: '^FVX',     tvSymbol: 'TVC:US05Y',        name: 'US 5Y',      type: 'bond',      category: 'bonds'       },
  { symbol: '^IRX',     tvSymbol: 'TVC:US03MY',       name: 'US 3M',      type: 'bond',      category: 'bonds'       },
  { symbol: 'GC=F',     tvSymbol: 'TVC:GOLD',         name: 'Gold',       type: 'commodity', category: 'commodities' },
  { symbol: 'CL=F',     tvSymbol: 'NYMEX:CL1!',       name: 'WTI Crude',  type: 'commodity', category: 'commodities' },
  { symbol: 'SI=F',     tvSymbol: 'TVC:SILVER',       name: 'Silver',     type: 'commodity', category: 'commodities' },
]

const DEFAULT_SETTINGS: AppSettings = {
  groqApiKey: '',
  ollamaHost: 'http://localhost:11434',
  telegramBotToken: '',
  telegramChatId: '',
  emailjsServiceId: '',
  emailjsTemplateId: '',
  emailjsPublicKey: '',
  digestEmail: '',
  digestFrequency: 'off',
  digestIncludeAI: true,
  digestIncludeHeadlines: true,
  digestIncludeSnapshot: true,
  fredApiKey: '',
}

const DEFAULT_REGIME: RegimeScores = {
  regime: 'transition',
  clarity: 5,
  edge: 5,
  risk: 5,
  actionability: 5,
  posture: 'Half size — selectivity required',
  vix: 20,
  move: 100,
  spxTrend: 'flat',
}

interface TerminalStore {
  tickers: Record<string, Ticker>
  setTicker: (t: Ticker) => void
  setTickers: (ts: Ticker[]) => void

  chartConfig: ChartConfig
  setChartSymbol: (symbol: string, tvSymbol?: string) => void
  setChartInterval: (interval: ChartConfig['interval']) => void
  setChartType: (type: ChartConfig['type']) => void

  news: NewsItem[]
  setNews: (items: NewsItem[]) => void
  newsLoading: boolean
  setNewsLoading: (v: boolean) => void
  newsCountryFilter: string | null
  setNewsCountryFilter: (code: string | null) => void

  activeLayers: Set<MapLayerType>
  toggleLayer: (layer: MapLayerType) => void

  watchlist: WatchlistItem[]
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (symbol: string) => void
  activeWatchlistCategory: WatchlistItem['category'] | 'all'
  setActiveWatchlistCategory: (c: WatchlistItem['category'] | 'all') => void

  wsConnected: boolean
  setWsConnected: (v: boolean) => void

  selectedCountry: CountryProfile | null
  setSelectedCountry: (c: CountryProfile | null) => void

  yieldCurve: YieldPoint[]
  setYieldCurve: (pts: YieldPoint[]) => void

  earthquakes: EarthquakeEvent[]
  setEarthquakes: (eq: EarthquakeEvent[]) => void

  regime: RegimeScores
  setRegime: (r: RegimeScores) => void

  mcResult: MonteCarloResult | null
  setMcResult: (r: MonteCarloResult | null) => void

  alertRules: AlertRule[]
  addAlertRule: (rule: AlertRule) => void
  removeAlertRule: (id: string) => void
  updateAlertRule: (id: string, patch: Partial<AlertRule>) => void

  chatMessages: ChatMessage[]
  addChatMessage: (msg: ChatMessage) => void
  clearChat: () => void

  settings: AppSettings
  updateSettings: (patch: Partial<AppSettings>) => void

  edgeScenarios: EdgeScenario[]
  addEdgeScenario: (s: EdgeScenario) => void
  removeEdgeScenario: (id: string) => void
  updateEdgeScenario: (id: string, patch: Partial<EdgeScenario>) => void

  researchItems: ResearchItem[]
  addResearchItem: (r: ResearchItem) => void
  removeResearchItem: (id: string) => void

  dailyLogs: Record<string, DailyLog>
  saveDailyLog: (log: DailyLog) => void

  // Portfolio positions
  positions: Position[]
  addPosition: (p: Position) => void
  removePosition: (id: string) => void
  closePosition: (id: string, closePrice: number) => void
  updatePosition: (id: string, patch: Partial<Position>) => void

  // FRED live economic data
  fredData: FredData
  setFredData: (data: FredData) => void

  rightPanelTab: 'news' | 'country' | 'nexus' | 'chat' | 'alerts'
  setRightPanelTab: (tab: TerminalStore['rightPanelTab']) => void
  nexusSubTab: string
  setNexusSubTab: (tab: string) => void
  showGlobe: boolean
  setShowGlobe: (v: boolean) => void
}

export const useStore = create<TerminalStore>()(
  persist(
    (set) => ({
      tickers: {},
      setTicker: (t) =>
        set((s) => ({ tickers: { ...s.tickers, [t.symbol]: t } })),
      setTickers: (ts) =>
        set((s) => {
          const next = { ...s.tickers }
          for (const t of ts) next[t.symbol] = t
          return { tickers: next }
        }),

      chartConfig: { symbol: 'BTCUSDT', tvSymbol: 'BINANCE:BTCUSDT', interval: '15m', type: 'candlestick' },
      setChartSymbol: (symbol, tvSymbol) =>
        set((s) => ({ chartConfig: { ...s.chartConfig, symbol, tvSymbol: tvSymbol ?? symbol } })),
      setChartInterval: (interval) =>
        set((s) => ({ chartConfig: { ...s.chartConfig, interval } })),
      setChartType: (type) =>
        set((s) => ({ chartConfig: { ...s.chartConfig, type } })),

      news: [],
      setNews: (items) => set({ news: items }),
      newsLoading: false,
      setNewsLoading: (v) => set({ newsLoading: v }),
      newsCountryFilter: null,
      setNewsCountryFilter: (code) => set({ newsCountryFilter: code }),

      activeLayers: new Set<MapLayerType>(['exchanges', 'waterways', 'conflicts', 'centralbanks']),
      toggleLayer: (layer) =>
        set((s) => {
          const next = new Set(s.activeLayers)
          next.has(layer) ? next.delete(layer) : next.add(layer)
          return { activeLayers: next }
        }),

      watchlist: DEFAULT_WATCHLIST,
      addToWatchlist: (item) =>
        set((s) => ({
          watchlist: s.watchlist.some((w) => w.symbol === item.symbol)
            ? s.watchlist
            : [...s.watchlist, item],
        })),
      removeFromWatchlist: (symbol) =>
        set((s) => ({ watchlist: s.watchlist.filter((w) => w.symbol !== symbol) })),
      activeWatchlistCategory: 'all',
      setActiveWatchlistCategory: (c) => set({ activeWatchlistCategory: c }),

      wsConnected: false,
      setWsConnected: (v) => set({ wsConnected: v }),

      selectedCountry: null,
      setSelectedCountry: (c) =>
        set({ selectedCountry: c, rightPanelTab: c ? 'country' : 'news', newsCountryFilter: c ? c.code : null }),

      yieldCurve: [],
      setYieldCurve: (pts) => set({ yieldCurve: pts }),

      earthquakes: [],
      setEarthquakes: (eq) => set({ earthquakes: eq }),

      regime: DEFAULT_REGIME,
      setRegime: (r) => set({ regime: r }),

      mcResult: null,
      setMcResult: (r) => set({ mcResult: r }),

      alertRules: [],
      addAlertRule: (rule) =>
        set((s) => ({ alertRules: [...s.alertRules, rule] })),
      removeAlertRule: (id) =>
        set((s) => ({ alertRules: s.alertRules.filter((r) => r.id !== id) })),
      updateAlertRule: (id, patch) =>
        set((s) => ({
          alertRules: s.alertRules.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      chatMessages: [],
      addChatMessage: (msg) =>
        set((s) => ({ chatMessages: [...s.chatMessages.slice(-99), msg] })),
      clearChat: () => set({ chatMessages: [] }),

      settings: DEFAULT_SETTINGS,
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      edgeScenarios: [],
      addEdgeScenario: (scenario) =>
        set((s) => ({ edgeScenarios: [...s.edgeScenarios, scenario] })),
      removeEdgeScenario: (id) =>
        set((s) => ({ edgeScenarios: s.edgeScenarios.filter((e) => e.id !== id) })),
      updateEdgeScenario: (id, patch) =>
        set((s) => ({
          edgeScenarios: s.edgeScenarios.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      researchItems: [],
      addResearchItem: (r) =>
        set((s) => ({ researchItems: [r, ...s.researchItems] })),
      removeResearchItem: (id) =>
        set((s) => ({ researchItems: s.researchItems.filter((r) => r.id !== id) })),

      dailyLogs: {},
      saveDailyLog: (log) =>
        set((s) => ({ dailyLogs: { ...s.dailyLogs, [log.date]: log } })),

      // Portfolio
      positions: [],
      addPosition: (p) =>
        set((s) => ({ positions: [p, ...s.positions] })),
      removePosition: (id) =>
        set((s) => ({ positions: s.positions.filter((p) => p.id !== id) })),
      closePosition: (id, closePrice) =>
        set((s) => ({
          positions: s.positions.map((p) =>
            p.id === id ? { ...p, closedAt: new Date().toISOString(), closePrice } : p
          ),
        })),
      updatePosition: (id, patch) =>
        set((s) => ({
          positions: s.positions.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),

      // FRED
      fredData: [],
      setFredData: (data) => set({ fredData: data }),

      rightPanelTab: 'news',
      setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
      nexusSubTab: 'regime',
      setNexusSubTab: (tab) => set({ nexusSubTab: tab }),
      showGlobe: false,
      setShowGlobe: (v) => set({ showGlobe: v }),
    }),
    {
      name: 'nexus-terminal-v6',
      partialize: (s) => ({
        settings: s.settings,
        alertRules: s.alertRules,
        watchlist: s.watchlist,
        edgeScenarios: s.edgeScenarios,
        researchItems: s.researchItems,
        dailyLogs: s.dailyLogs,
        positions: s.positions,
        activeWatchlistCategory: s.activeWatchlistCategory,
        nexusSubTab: s.nexusSubTab,
        chartConfig: s.chartConfig,
      }),
    },
  ),
)
