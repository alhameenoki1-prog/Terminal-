import { useEffect, useRef, useCallback, useState } from 'react'
import { createChart, CrosshairMode, IChartApi, ISeriesApi, CandlestickData, LineData, Time } from 'lightweight-charts'
import { useStore } from '../store/useStore'
import { fetchKlines, wsKlineUrl } from '../services/binanceService'
import { useWebSocket } from '../hooks/useWebSocket'
import { fmt, pctClass, pctSign } from '../utils/format'
import type { ChartConfig } from '../types'

const INTERVALS: { label: string; value: string }[] = [
  { label: '1m',  value: '1m'  },
  { label: '5m',  value: '5m'  },
  { label: '15m', value: '15m' },
  { label: '1H',  value: '1h'  },
  { label: '4H',  value: '4h'  },
  { label: '1D',  value: '1d'  },
]

interface KlineWsMsg {
  k: {
    t: number  // kline start time
    o: string
    h: string
    l: string
    c: string
    v: string
    x: boolean // is kline closed?
  }
}

export function TradingChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef     = useRef<IChartApi | null>(null)
  const candleRef    = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const lineRef      = useRef<ISeriesApi<'Line'> | null>(null)

  const { symbol, interval, type } = useStore((s) => s.chartConfig)
  const setChartInterval = useStore((s) => s.setChartInterval)
  const setChartType     = useStore((s) => s.setChartType)
  const ticker           = useStore((s) => s.tickers[symbol])

  const [ohlc, setOhlc] = useState({ o: 0, h: 0, l: 0, c: 0, v: 0 })

  // ── Create / destroy chart ────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: '#050A14' },
        textColor:  '#9CA3AF',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize:   11,
      },
      grid: {
        vertLines: { color: '#1F2937' },
        horzLines: { color: '#1F2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#F59E0B', labelBackgroundColor: '#F59E0B' },
        horzLine: { color: '#F59E0B', labelBackgroundColor: '#F59E0B' },
      },
      rightPriceScale: {
        borderColor: '#1F2937',
        scaleMargins: { top: 0.08, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#1F2937',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll:  { mouseWheel: true, pressedMouseMove: true },
      handleScale:   { mouseWheel: true, axisPressedMouseMove: true },
    })

    chartRef.current = chart

    // Resize observer
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        chart.applyOptions({
          width:  containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current   = null
      candleRef.current  = null
      lineRef.current    = null
    }
  }, [])

  // ── Add / switch series when type changes ────────────────────────────────
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    // Remove existing series
    if (candleRef.current) { chart.removeSeries(candleRef.current); candleRef.current = null }
    if (lineRef.current)   { chart.removeSeries(lineRef.current);   lineRef.current   = null }

    if (type === 'candlestick') {
      candleRef.current = chart.addCandlestickSeries({
        upColor:        '#10B981',
        downColor:      '#EF4444',
        borderUpColor:  '#10B981',
        borderDownColor:'#EF4444',
        wickUpColor:    '#10B981',
        wickDownColor:  '#EF4444',
      })
    } else {
      lineRef.current = chart.addLineSeries({
        color:      '#3B82F6',
        lineWidth:  2,
      })
    }
  }, [type])

  // ── Fetch historical data ────────────────────────────────────────────────
  useEffect(() => {
    const series = type === 'candlestick' ? candleRef.current : lineRef.current
    if (!series) return

    fetchKlines(symbol, interval, 300)
      .then((candles) => {
        if (type === 'candlestick') {
          ;(candleRef.current as ISeriesApi<'Candlestick'>)?.setData(
            candles.map((c) => ({
              time:  c.time as Time,
              open:  c.open,
              high:  c.high,
              low:   c.low,
              close: c.close,
            })),
          )
        } else {
          ;(lineRef.current as ISeriesApi<'Line'>)?.setData(
            candles.map((c) => ({ time: c.time as Time, value: c.close })),
          )
        }
        if (candles.length) {
          const last = candles[candles.length - 1]
          setOhlc({ o: last.open, h: last.high, l: last.low, c: last.close, v: last.volume })
        }
        chartRef.current?.timeScale().fitContent()
      })
      .catch(() => {})
  }, [symbol, interval, type])

  // ── Live kline WebSocket ──────────────────────────────────────────────────
  const handleKlineMsg = useCallback(
    (data: unknown) => {
      const msg = data as KlineWsMsg
      if (!msg?.k) return
      const k = msg.k
      const bar = {
        time:  Math.floor(k.t / 1000) as Time,
        open:  parseFloat(k.o),
        high:  parseFloat(k.h),
        low:   parseFloat(k.l),
        close: parseFloat(k.c),
      }
      setOhlc({
        o: bar.open, h: bar.high, l: bar.low, c: bar.close,
        v: parseFloat(k.v),
      })
      if (type === 'candlestick') {
        candleRef.current?.update(bar as CandlestickData)
      } else {
        lineRef.current?.update({ time: bar.time, value: bar.close } as LineData)
      }
    },
    [type],
  )

  useWebSocket(wsKlineUrl(symbol, interval), { onMessage: handleKlineMsg })

  const lastTick = ticker
  const priceColor = lastTick
    ? pctClass(lastTick.changePct24h)
    : 'text-terminal-text'

  return (
    <div className="flex flex-col h-full bg-terminal-bg">
      {/* Chart toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-surface flex-shrink-0">
        {/* Left: symbol + OHLC */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm font-bold text-terminal-accent">
            {symbol.replace('USDT', '')}/USDT
          </span>
          {lastTick && (
            <span className={`font-mono text-sm font-bold ${priceColor}`}>
              {fmt(lastTick.price)}
            </span>
          )}
          {lastTick && (
            <span className={`font-mono text-xs ${priceColor}`}>
              {pctSign(lastTick.changePct24h)}
            </span>
          )}
          <div className="hidden md:flex items-center gap-3">
            {ohlc.o > 0 && (
              <>
                <OhlcLabel label="O" value={fmt(ohlc.o)} />
                <OhlcLabel label="H" value={fmt(ohlc.h)} color="text-terminal-up" />
                <OhlcLabel label="L" value={fmt(ohlc.l)} color="text-terminal-down" />
                <OhlcLabel label="C" value={fmt(ohlc.c)} />
              </>
            )}
          </div>
        </div>

        {/* Right: interval + type selectors */}
        <div className="flex items-center gap-1">
          {/* Chart type toggle */}
          <button
            onClick={() => setChartType(type === 'candlestick' ? 'line' : 'candlestick')}
            className="px-2 py-0.5 font-mono text-2xs rounded border border-terminal-border text-terminal-dim hover:text-terminal-text hover:border-terminal-muted transition-colors"
          >
            {type === 'candlestick' ? '⬛ Candles' : '— Line'}
          </button>

          <div className="w-px h-4 bg-terminal-border mx-1" />

          {/* Intervals */}
          {INTERVALS.map((iv) => (
            <button
              key={iv.value}
              onClick={() => setChartInterval(iv.value as ChartConfig['interval'])}
              className={`
                px-2 py-0.5 font-mono text-2xs rounded transition-colors
                ${interval === iv.value
                  ? 'bg-terminal-accent text-terminal-bg font-bold'
                  : 'text-terminal-dim hover:text-terminal-text'}
              `}
            >
              {iv.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart canvas */}
      <div ref={containerRef} className="flex-1 w-full" />
    </div>
  )
}

function OhlcLabel({ label, value, color = 'text-terminal-dim' }: { label: string; value: string; color?: string }) {
  return (
    <span className="font-mono text-2xs">
      <span className="text-terminal-faint">{label} </span>
      <span className={color}>{value}</span>
    </span>
  )
}


