// NEXUS Smart Money Concepts (SMC) Panel
// Detects: Break of Structure (BOS), Market Structure Shift (MSS),
//          Order Blocks (OB), Fair Value Gaps (FVG), Premium/Discount zones
// Data source: Binance REST API — recent OHLCV candles

import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../store/useStore'

interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface SwingPoint {
  index: number
  price: number
  type: 'high' | 'low'
  time: number
}

interface BosEvent {
  type: 'BOS' | 'MSS'
  direction: 'bullish' | 'bearish'
  price: number
  time: number
  description: string
}

interface OrderBlock {
  type: 'bullish' | 'bearish'
  high: number
  low: number
  open: number
  close: number
  time: number
  description: string
  fresh: boolean
}

interface Fvg {
  type: 'bullish' | 'bearish'
  top: number
  bottom: number
  time: number
  size: number
  filled: boolean
}

interface SmcAnalysis {
  swings: SwingPoint[]
  bosEvents: BosEvent[]
  orderBlocks: OrderBlock[]
  fvgs: Fvg[]
  premiumZone: number
  discountZone: number
  equilibrium: number
  trend: 'bullish' | 'bearish' | 'ranging'
  currentPrice: number
  priceZone: 'premium' | 'discount' | 'equilibrium'
}

const TIMEFRAMES: { label: string; tf: string; limit: number }[] = [
  { label: '15m', tf: '15m',  limit: 100 },
  { label: '1H',  tf: '1h',   limit: 100 },
  { label: '4H',  tf: '4h',   limit: 100 },
  { label: '1D',  tf: '1d',   limit: 60  },
]

// ─── SMC Algorithms ─────────────────────────────────────────────────────────

function detectSwings(candles: Candle[], lookback = 3): SwingPoint[] {
  const swings: SwingPoint[] = []
  for (let i = lookback; i < candles.length - lookback; i++) {
    const c = candles[i]
    let isHigh = true, isLow = true
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue
      if (candles[j].high >= c.high) isHigh = false
      if (candles[j].low <= c.low) isLow = false
    }
    if (isHigh) swings.push({ index: i, price: c.high, type: 'high', time: c.time })
    if (isLow)  swings.push({ index: i, price: c.low,  type: 'low',  time: c.time })
  }
  return swings
}

function detectBOS(candles: Candle[], swings: SwingPoint[]): BosEvent[] {
  const events: BosEvent[] = []
  const highs = swings.filter((s) => s.type === 'high').slice(-8)
  const lows  = swings.filter((s) => s.type === 'low').slice(-8)

  // Bearish BOS: price breaks below previous swing low
  for (let i = 1; i < lows.length; i++) {
    const prevLow = lows[i - 1]
    const currLow = lows[i]
    if (currLow.price < prevLow.price && currLow.index > prevLow.index) {
      // Check if it caused a lower-high (MSS) or just BOS
      const interveningHighs = highs.filter((h) => h.index > prevLow.index && h.index < currLow.index)
      const isMSS = interveningHighs.length > 0 && interveningHighs[interveningHighs.length - 1].price < (highs.find((h) => h.index < prevLow.index)?.price ?? Infinity)
      events.push({
        type: isMSS ? 'MSS' : 'BOS',
        direction: 'bearish',
        price: prevLow.price,
        time: currLow.time,
        description: isMSS
          ? `Bearish MSS: lower-high formed before breaking ${prevLow.price.toFixed(2)}`
          : `Bearish BOS: broke through swing low at ${prevLow.price.toFixed(2)}`,
      })
    }
  }

  // Bullish BOS: price breaks above previous swing high
  for (let i = 1; i < highs.length; i++) {
    const prevHigh = highs[i - 1]
    const currHigh = highs[i]
    if (currHigh.price > prevHigh.price && currHigh.index > prevHigh.index) {
      const interveningLows = lows.filter((l) => l.index > prevHigh.index && l.index < currHigh.index)
      const isMSS = interveningLows.length > 0 && interveningLows[interveningLows.length - 1].price > (lows.find((l) => l.index < prevHigh.index)?.price ?? -Infinity)
      events.push({
        type: isMSS ? 'MSS' : 'BOS',
        direction: 'bullish',
        price: prevHigh.price,
        time: currHigh.time,
        description: isMSS
          ? `Bullish MSS: higher-low formed before breaking ${prevHigh.price.toFixed(2)}`
          : `Bullish BOS: broke through swing high at ${prevHigh.price.toFixed(2)}`,
      })
    }
  }

  return events.slice(-6)
}

function detectOrderBlocks(candles: Candle[], bosEvents: BosEvent[]): OrderBlock[] {
  const obs: OrderBlock[] = []

  for (const bos of bosEvents) {
    const bosIdx = candles.findIndex((c) => c.time >= bos.time)
    if (bosIdx < 2) continue

    if (bos.direction === 'bullish') {
      // Bullish OB = last bearish candle before the impulsive bullish move
      for (let i = bosIdx - 1; i >= Math.max(0, bosIdx - 10); i--) {
        if (candles[i].close < candles[i].open) {  // bearish candle
          const currentPrice = candles[candles.length - 1].close
          obs.push({
            type: 'bullish',
            high:  candles[i].high,
            low:   candles[i].low,
            open:  candles[i].open,
            close: candles[i].close,
            time:  candles[i].time,
            description: `Bullish OB at ${candles[i].low.toFixed(2)}–${candles[i].high.toFixed(2)}`,
            fresh: currentPrice > candles[i].high,  // not yet tapped
          })
          break
        }
      }
    } else {
      // Bearish OB = last bullish candle before the impulsive bearish move
      for (let i = bosIdx - 1; i >= Math.max(0, bosIdx - 10); i--) {
        if (candles[i].close > candles[i].open) {  // bullish candle
          const currentPrice = candles[candles.length - 1].close
          obs.push({
            type: 'bearish',
            high:  candles[i].high,
            low:   candles[i].low,
            open:  candles[i].open,
            close: candles[i].close,
            time:  candles[i].time,
            description: `Bearish OB at ${candles[i].low.toFixed(2)}–${candles[i].high.toFixed(2)}`,
            fresh: currentPrice < candles[i].low,  // not yet tapped
          })
          break
        }
      }
    }
  }

  return obs.slice(-5)
}

function detectFVG(candles: Candle[]): Fvg[] {
  const fvgs: Fvg[] = []
  const currentPrice = candles[candles.length - 1].close

  for (let i = 2; i < candles.length; i++) {
    const prev = candles[i - 2]
    const curr = candles[i]

    // Bullish FVG: gap between prev.high and curr.low (no overlap)
    if (curr.low > prev.high) {
      fvgs.push({
        type: 'bullish',
        top:    curr.low,
        bottom: prev.high,
        time:   candles[i - 1].time,
        size:   ((curr.low - prev.high) / prev.high) * 100,
        filled: currentPrice <= prev.high,
      })
    }

    // Bearish FVG: gap between curr.high and prev.low (no overlap)
    if (curr.high < prev.low) {
      fvgs.push({
        type: 'bearish',
        top:    prev.low,
        bottom: curr.high,
        time:   candles[i - 1].time,
        size:   ((prev.low - curr.high) / curr.high) * 100,
        filled: currentPrice >= prev.low,
      })
    }
  }

  // Return last 8 FVGs
  return fvgs.slice(-8)
}

function analyzePremiumDiscount(candles: Candle[]): { premium: number; discount: number; eq: number } {
  const recentHigh = Math.max(...candles.slice(-50).map((c) => c.high))
  const recentLow  = Math.min(...candles.slice(-50).map((c) => c.low))
  const eq         = (recentHigh + recentLow) / 2
  return {
    premium:  eq + (recentHigh - eq) * 0.5,  // top 50% of range
    discount: recentLow  + (eq - recentLow)  * 0.5,  // bottom 50% of range
    eq,
  }
}

function detectTrend(swings: SwingPoint[]): 'bullish' | 'bearish' | 'ranging' {
  const highs = swings.filter((s) => s.type === 'high').slice(-4)
  const lows  = swings.filter((s) => s.type === 'low').slice(-4)
  if (highs.length < 2 || lows.length < 2) return 'ranging'

  const hh = highs[highs.length - 1].price > highs[highs.length - 2].price  // higher high
  const hl = lows[lows.length - 1].price  > lows[lows.length - 2].price     // higher low
  const lh = highs[highs.length - 1].price < highs[highs.length - 2].price  // lower high
  const ll = lows[lows.length - 1].price  < lows[lows.length - 2].price     // lower low

  if (hh && hl) return 'bullish'
  if (lh && ll) return 'bearish'
  return 'ranging'
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SmcPanel() {
  const tickers  = useStore((s) => s.tickers)
  const watchlist = useStore((s) => s.watchlist)

  const [symbol,   setSymbol]   = useState('BTCUSDT')
  const [tfIdx,    setTfIdx]    = useState(1)  // default 1H
  const [candles,  setCandles]  = useState<Candle[]>([])
  const [analysis, setAnalysis] = useState<SmcAnalysis | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  const tf = TIMEFRAMES[tfIdx]

  // Only show symbols available on Binance (crypto + spot pairs)
  const cryptoSymbols = watchlist.filter((w) => w.category === 'crypto')
  const allSymbols = [
    ...cryptoSymbols,
    ...watchlist.filter((w) => w.category === 'indices').slice(0, 4),
  ]

  const fetchAndAnalyze = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch from Binance for crypto, Yahoo history for others
      let data: Candle[] = []
      const isBinance = symbol.endsWith('USDT') || symbol.endsWith('BTC')

      if (isBinance) {
        const url = `/api/binance/api/v3/klines?symbol=${symbol}&interval=${tf.tf}&limit=${tf.limit}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Binance HTTP ${res.status}`)
        const raw: [number, string, string, string, string, string][] = await res.json()
        data = raw.map(([t, o, h, l, c, v]) => ({
          time: t / 1000,
          open: parseFloat(o), high: parseFloat(h),
          low: parseFloat(l), close: parseFloat(c),
          volume: parseFloat(v),
        }))
      } else {
        // Fallback: build pseudo-candles from ticker data
        const t = tickers[symbol]
        if (!t) throw new Error('No data for symbol')
        // Cannot do SMC without OHLCV history — show message
        setError(`Full OHLCV history not available for ${symbol}. Use a crypto pair for SMC analysis.`)
        setLoading(false)
        return
      }

      if (data.length < 20) throw new Error('Insufficient candle data')

      const swings      = detectSwings(data, 3)
      const bosEvents   = detectBOS(data, swings)
      const orderBlocks = detectOrderBlocks(data, bosEvents)
      const fvgs        = detectFVG(data.slice(-50))
      const { premium, discount, eq } = analyzePremiumDiscount(data)
      const trend       = detectTrend(swings)
      const currentPrice = data[data.length - 1].close

      setCandles(data)
      setAnalysis({
        swings,
        bosEvents,
        orderBlocks,
        fvgs,
        premiumZone: premium,
        discountZone: discount,
        equilibrium: eq,
        trend,
        currentPrice,
        priceZone:
          currentPrice >= premium  ? 'premium' :
          currentPrice <= discount ? 'discount' : 'equilibrium',
      })
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [symbol, tf, tickers])

  useEffect(() => {
    fetchAndAnalyze()
    const id = setInterval(fetchAndAnalyze, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [fetchAndAnalyze])

  const fmtP = (p: number) => p >= 1000 ? p.toFixed(0) : p >= 10 ? p.toFixed(2) : p.toFixed(4)
  const fmtTime = (ts: number) => new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Smart Money Concepts (SMC)
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap items-center">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
        >
          {allSymbols.map((w) => (
            <option key={w.symbol} value={w.symbol}>{w.name}</option>
          ))}
        </select>
        <div className="flex gap-1">
          {TIMEFRAMES.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTfIdx(i)}
              className={`px-2 py-0.5 font-mono text-2xs rounded ${i === tfIdx ? 'bg-terminal-accent text-terminal-bg' : 'bg-terminal-panel text-terminal-faint'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={fetchAndAnalyze}
          disabled={loading}
          className="px-2 py-0.5 font-mono text-2xs bg-terminal-panel text-terminal-faint border border-terminal-border rounded hover:text-terminal-dim disabled:opacity-50"
        >
          {loading ? '…' : '↻'}
        </button>
      </div>

      {error && (
        <div className="font-mono text-2xs text-yellow-400 bg-yellow-950/30 rounded p-2 border border-yellow-700/30">
          {error}
        </div>
      )}

      {analysis && (
        <>
          {/* Market Structure */}
          <div className="bg-terminal-panel rounded p-2 border border-terminal-border/50">
            <div className="font-mono text-2xs text-terminal-faint mb-2">Market Structure</div>
            <div className="flex items-center gap-3 flex-wrap">
              <div>
                <div className="font-mono text-2xs text-terminal-faint">Trend</div>
                <div className={`font-mono text-sm font-bold ${
                  analysis.trend === 'bullish' ? 'text-terminal-up' :
                  analysis.trend === 'bearish' ? 'text-terminal-down' : 'text-yellow-400'
                }`}>
                  {analysis.trend.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="font-mono text-2xs text-terminal-faint">Price Zone</div>
                <div className={`font-mono text-sm font-bold ${
                  analysis.priceZone === 'premium' ? 'text-terminal-down' :
                  analysis.priceZone === 'discount' ? 'text-terminal-up' : 'text-yellow-400'
                }`}>
                  {analysis.priceZone.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="font-mono text-2xs text-terminal-faint">Current</div>
                <div className="font-mono text-sm font-bold text-terminal-text">
                  {fmtP(analysis.currentPrice)}
                </div>
              </div>
            </div>

            {/* Premium/Discount bar */}
            <div className="mt-2">
              <div className="flex justify-between font-mono text-2xs text-terminal-faint mb-0.5">
                <span>Discount: {fmtP(analysis.discountZone)}</span>
                <span>EQ: {fmtP(analysis.equilibrium)}</span>
                <span>Premium: {fmtP(analysis.premiumZone)}</span>
              </div>
              <div className="h-2 bg-terminal-panel border border-terminal-border/50 rounded overflow-hidden relative">
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-terminal-up/20" />
                  <div className="w-px bg-terminal-border" />
                  <div className="flex-1 bg-terminal-down/20" />
                </div>
                {/* Current price marker */}
                {(() => {
                  const range = analysis.premiumZone - analysis.discountZone
                  const pos   = range > 0 ? ((analysis.currentPrice - analysis.discountZone) / range) * 100 : 50
                  return (
                    <div
                      className="absolute top-0 w-0.5 h-full bg-terminal-accent"
                      style={{ left: `${Math.max(0, Math.min(100, pos))}%` }}
                    />
                  )
                })()}
              </div>
            </div>
          </div>

          {/* BOS / MSS Events */}
          {analysis.bosEvents.length > 0 && (
            <div>
              <div className="font-mono text-2xs text-terminal-faint mb-1">
                Break of Structure / Market Structure Shift (last {analysis.bosEvents.length})
              </div>
              <div className="flex flex-col gap-1">
                {analysis.bosEvents.slice(-4).reverse().map((ev, i) => (
                  <div
                    key={i}
                    className={`font-mono text-2xs rounded px-2 py-1.5 border ${
                      ev.type === 'MSS'
                        ? 'border-yellow-700/50 bg-yellow-950/20 text-yellow-400'
                        : ev.direction === 'bullish'
                        ? 'border-green-800/50 bg-green-950/20 text-terminal-up'
                        : 'border-red-800/50 bg-red-950/20 text-terminal-down'
                    }`}
                  >
                    <span className="font-bold mr-1">{ev.type}</span>
                    <span className="text-2xs opacity-80">{ev.description}</span>
                    <div className="opacity-50 mt-0.5">{fmtTime(ev.time)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Blocks */}
          {analysis.orderBlocks.length > 0 && (
            <div>
              <div className="font-mono text-2xs text-terminal-faint mb-1">Order Blocks</div>
              <div className="flex flex-col gap-1">
                {analysis.orderBlocks.slice(-4).map((ob, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded px-2 py-1 border ${
                      ob.type === 'bullish'
                        ? 'border-green-800/50 bg-green-950/10'
                        : 'border-red-800/50 bg-red-950/10'
                    }`}
                  >
                    <div>
                      <span className={`font-mono text-2xs font-bold mr-1 ${ob.type === 'bullish' ? 'text-terminal-up' : 'text-terminal-down'}`}>
                        {ob.type === 'bullish' ? '▲' : '▼'} {ob.type.toUpperCase()} OB
                      </span>
                      {ob.fresh && <span className="font-mono text-2xs text-terminal-accent">FRESH</span>}
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-2xs text-terminal-dim">
                        {fmtP(ob.low)} – {fmtP(ob.high)}
                      </div>
                      <div className="font-mono text-2xs text-terminal-faint/50">{fmtTime(ob.time)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fair Value Gaps */}
          {analysis.fvgs.filter((f) => !f.filled).length > 0 && (
            <div>
              <div className="font-mono text-2xs text-terminal-faint mb-1">
                Fair Value Gaps (unfilled)
              </div>
              <div className="flex flex-col gap-1">
                {analysis.fvgs.filter((f) => !f.filled).slice(-5).map((fvg, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded px-2 py-1 border ${
                      fvg.type === 'bullish'
                        ? 'border-blue-800/40 bg-blue-950/10'
                        : 'border-orange-800/40 bg-orange-950/10'
                    }`}
                  >
                    <span className={`font-mono text-2xs font-bold ${fvg.type === 'bullish' ? 'text-blue-400' : 'text-orange-400'}`}>
                      {fvg.type.toUpperCase()} FVG
                    </span>
                    <div className="text-right">
                      <div className="font-mono text-2xs text-terminal-dim">
                        {fmtP(fvg.bottom)} – {fmtP(fvg.top)}
                      </div>
                      <div className="font-mono text-2xs text-terminal-faint/50">
                        {fvg.size.toFixed(2)}% gap
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SMC Bias */}
          <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
            <div className="font-mono text-2xs text-terminal-accent mb-1">NEXUS SMC Bias</div>
            <div className="font-mono text-2xs text-terminal-dim leading-relaxed">
              {analysis.trend === 'bullish' && analysis.priceZone === 'discount'
                ? '✓ Bullish structure + discount zone = HIGH-PROBABILITY LONG setup. Look for bullish OB / FVG entry.'
                : analysis.trend === 'bearish' && analysis.priceZone === 'premium'
                ? '✓ Bearish structure + premium zone = HIGH-PROBABILITY SHORT setup. Look for bearish OB / FVG entry.'
                : analysis.trend === 'bullish' && analysis.priceZone === 'premium'
                ? '⚠ Bullish structure but premium zone — wait for pullback to equilibrium or OB before long.'
                : analysis.trend === 'bearish' && analysis.priceZone === 'discount'
                ? '⚠ Bearish structure but discount zone — short bias, but be cautious of reversal from demand.'
                : 'Ranging market at equilibrium — reduce size, wait for BOS confirmation before positioning.'}
            </div>
          </div>

          <div className="font-mono text-2xs text-terminal-faint/40">
            {candles.length} candles · {tf.label} TF · Refreshes every 5 min
          </div>
        </>
      )}

      {loading && !analysis && (
        <div className="font-mono text-2xs text-terminal-faint text-center py-6">Computing SMC analysis…</div>
      )}
    </div>
  )
}
