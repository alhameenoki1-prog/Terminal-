// ─── Market / Price ──────────────────────────────────────────────────────────

export interface Ticker {
  symbol: string
  name: string
  price: number
  change24h: number
  changePct24h: number
  volume24h?: number
  high24h?: number
  low24h?: number
  marketCap?: number
  type: 'crypto' | 'stock' | 'forex' | 'commodity' | 'index' | 'bond' | 'futures'
  tvSymbol?: string
  category?: WatchlistCategory
}

export interface WatchlistItem {
  symbol: string
  tvSymbol: string
  name: string
  type: Ticker['type']
  category: WatchlistCategory
}

export type WatchlistCategory = 'crypto' | 'indices' | 'forex' | 'bonds' | 'commodities' | 'stocks'

export interface Candle {
  time: number
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
  publishedAt: string
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
  lastChange: string
  nextMeeting?: string
  trend: 'hiking' | 'cutting' | 'hold'
  stance?: 'HAWK' | 'NEUTRAL' | 'DOVE'
  impliedCuts?: number
}

export interface EconomicIndicator {
  name: string
  value: string
  change?: string
  positive?: boolean
}

export interface YieldPoint {
  tenor: string
  rate: number
  symbol: string
}

// ─── Map ─────────────────────────────────────────────────────────────────────

export type MapLayerType =
  | 'exchanges'
  | 'financial'
  | 'centralbanks'
  | 'commodities'
  | 'gcc'
  | 'traderoutes'
  | 'cables'
  | 'pipelines'
  | 'outages'
  | 'weather'
  | 'economic'
  | 'waterways'
  | 'natural'
  | 'cyber'
  | 'daynight'
  | 'oil'
  | 'conflicts'
  | 'chokepoints'

export interface MapMarker {
  id: string
  lat: number
  lon: number
  type: MapLayerType
  label: string
  detail?: string
  severity?: 'low' | 'medium' | 'high' | 'critical'
  url?: string
  magnitude?: number
  depth?: number
  value?: number
}

export interface TradeRoute {
  id: string
  name: string
  coordinates: [number, number][]
  volume?: string
  risk?: 'low' | 'medium' | 'high' | 'critical'
}

// ─── Country Profiles ────────────────────────────────────────────────────────

export interface CountryProfile {
  code: string
  name: string
  flag: string
  region: string
  tvIndex: string
  tvCurrency: string
  tvBond: string
  yahooIndex: string
  yahooCurrency: string
  yahooBond: string
  mainStocks: { name: string; symbol: string }[]
  centralBank: string
  cbRate: number
  nextMeeting?: string
  rssKeywords: string[]
  instabilityScore: number
  instabilityBreakdown?: { conflict: number; economy: number; political: number }
  fxBias?: string
  bondFxRule?: string
}

// ─── App State ───────────────────────────────────────────────────────────────

export interface ChartConfig {
  symbol: string
  tvSymbol: string
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  type: 'candlestick' | 'line' | 'area'
}

export type MarketSession = 'pre' | 'open' | 'closed' | 'after'

export interface MarketStatus {
  nyse: MarketSession
  london: MarketSession
  tokyo: MarketSession
  crypto: 'open'
}

// ─── NEXUS Regime ────────────────────────────────────────────────────────────

export type RegimeType = 'risk-on' | 'transition' | 'risk-off' | 'crisis'

export interface RegimeScores {
  regime: RegimeType
  clarity: number
  edge: number
  risk: number
  actionability: number
  posture: string
  vix?: number
  move?: number
  spxTrend?: 'up' | 'flat' | 'down'
}

// ─── Monte Carlo ─────────────────────────────────────────────────────────────

export interface MonteCarloParams {
  symbol: string
  currentPrice: number
  mu: number
  sigma: number
  horizon: number
  nPaths: number
  entryPrice: number
  targetPrice: number
  stopPrice: number
  studentT: boolean
  regimeAdj: boolean
}

export interface MonteCarloResult {
  percentiles: { p5: number[]; p25: number[]; p50: number[]; p75: number[]; p95: number[] }
  pProfit: number
  pTarget: number
  pStop: number
  var95: number
  var99: number
  cvar95: number
  cvar99: number
  maxDdP50: number
  maxDdP95: number
  sharpe: number
  skewness: number
  kurtosis: number
  theme?: string
  edge?: string
}

// ─── Volatility ──────────────────────────────────────────────────────────────

export interface VolSpreadPair {
  id: string
  assetA: string
  assetB: string
  label: string
  spread: number
  ratio: number
  zScore: number
  regime: 'NORMAL' | 'ELEVATED' | 'EXTREME'
  history: number[]
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertType =
  | 'price_above'
  | 'price_below'
  | 'pct_change'
  | 'regime_shift'
  | 'instability_jump'
  | 'vol_spread_extreme'
  | 'rate_divergence'
  | 'yield_curve_signal'

export interface AlertRule {
  id: string
  type: AlertType
  label: string
  asset?: string
  threshold?: number
  direction?: 'above' | 'below'
  active: boolean
  triggered: boolean
  triggeredAt?: string
  cooldownMinutes: number
  lastTriggeredAt?: string
  telegram: boolean
}

// ─── Chat / RAG ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ─── Research ────────────────────────────────────────────────────────────────

export type ResearchType = 'macro-forecast' | 'trade-idea' | 'model' | 'risk-framework' | 'general'

export interface ResearchItem {
  id: string
  title: string
  content: string
  source: string
  tier: 1 | 2 | 3 | 4 | 5
  type: ResearchType
  qualityScore: number
  addedAt: string
  flagged: boolean
}

// ─── Daily Log ───────────────────────────────────────────────────────────────

export type RegimeForLog = RegimeType

export interface DailyLog {
  date: string
  theme: string
  regime: RegimeForLog
  regimeClarity: number
  regimeEdge: number
  regimeRisk: number
  regimeActionability: number
  posture: string
  keyDrivers: string[]
  yieldSignal: string
  tierOneEvidence: string
  macroEvents: string
  mcSummary: string
  volAlerts: string
  bestEdge: string
  altScenario: string
  researchNotes: string
  alerts: string
  checklistStatus: 'PASS' | 'FAIL' | 'PARTIAL' | ''
  whatWouldChange: string
}

// ─── Edge Playbook ───────────────────────────────────────────────────────────

export type SetupType = 'trend' | 'mean-revert' | 'liquidity-event' | 'macro-transition'

export interface EdgeScenario {
  id: string
  asset: string
  direction: 'LONG' | 'SHORT'
  setupType: SetupType
  bondConfirmation: string
  triggers: string
  targets: string
  invalidation: string
  riskPlan: string
  pProfit?: number
  pTarget?: number
  createdAt: string
}

// ─── Earthquake / Natural ────────────────────────────────────────────────────

export interface EarthquakeEvent {
  id: string
  lat: number
  lon: number
  magnitude: number
  depth: number
  place: string
  time: number
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface AppSettings {
  groqApiKey: string
  ollamaHost: string
  telegramBotToken: string
  telegramChatId: string
  emailjsServiceId: string
  emailjsTemplateId: string
  emailjsPublicKey: string
  digestEmail: string
  digestFrequency: 'hourly' | '2h' | '6h' | 'daily' | 'weekly' | 'off'
  digestIncludeAI: boolean
  digestIncludeHeadlines: boolean
  digestIncludeSnapshot: boolean
}
