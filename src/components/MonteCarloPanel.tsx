import { useState, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'

interface MCResult {
  pProfit: number; pTarget: number; pStop: number
  var95: number; var99: number; cvar95: number; cvar99: number
  maxDdP50: number; maxDdP95: number; sharpe: number; skewness: number; kurtosis: number
  finalPrices: number[]
  p5: number; p25: number; p50: number; p75: number; p95: number
}

const HORIZONS = [
  { label: '1D',  days: 1   },
  { label: '5D',  days: 5   },
  { label: '21D', days: 21  },
  { label: '63D', days: 63  },
  { label: '1Y',  days: 252 },
]

// Simple in-thread GBM (not a web worker to keep complexity manageable)
function runMonteCarlo(
  price: number, mu: number, sigma: number, horizon: number, entry: number, target: number, stop: number, N = 5000
): MCResult {
  const dt = 1 / 252
  const sqrtDt = Math.sqrt(dt)
  const finals: number[] = []

  let profitCount = 0, targetCount = 0, stopCount = 0
  const maxDrawdowns: number[] = []

  for (let i = 0; i < N; i++) {
    let S = price
    let peak = price
    let maxDd = 0
    let hitTarget = false, hitStop = false

    for (let t = 0; t < horizon; t++) {
      const z = gaussianRandom()
      S = S * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * sqrtDt * z)
      if (S > peak) peak = S
      const dd = (peak - S) / peak
      if (dd > maxDd) maxDd = dd
      if (!hitTarget && S >= target && target > entry) hitTarget = true
      if (!hitStop && S <= stop && stop < entry) hitStop = true
    }

    finals.push(S)
    maxDrawdowns.push(maxDd)
    if (S > entry) profitCount++
    if (hitTarget) targetCount++
    if (hitStop) stopCount++
  }

  finals.sort((a, b) => a - b)
  maxDrawdowns.sort((a, b) => a - b)

  const q = (arr: number[], pct: number) => arr[Math.floor(arr.length * pct)]
  const mean = finals.reduce((a, b) => a + b, 0) / N
  const returns = finals.map((f) => (f - price) / price)
  const retMean = returns.reduce((a, b) => a + b, 0) / N
  const retStd = Math.sqrt(returns.reduce((a, b) => a + (b - retMean) ** 2, 0) / N)
  const sharpe = retStd > 0 ? (retMean / retStd) * Math.sqrt(252 / horizon) : 0
  const skew = returns.reduce((a, b) => a + ((b - retMean) / retStd) ** 3, 0) / N
  const kurt = returns.reduce((a, b) => a + ((b - retMean) / retStd) ** 4, 0) / N - 3

  const var95idx  = Math.floor(N * 0.05)
  const var99idx  = Math.floor(N * 0.01)
  const cvar95 = finals.slice(0, var95idx).reduce((a, b) => a + b, 0) / var95idx
  const cvar99 = finals.slice(0, var99idx).reduce((a, b) => a + b, 0) / var99idx

  return {
    pProfit:   profitCount / N,
    pTarget:   targetCount / N,
    pStop:     stopCount / N,
    var95:     price - q(finals, 0.05),
    var99:     price - q(finals, 0.01),
    cvar95:    price - cvar95,
    cvar99:    price - cvar99,
    maxDdP50:  q(maxDrawdowns, 0.5),
    maxDdP95:  q(maxDrawdowns, 0.95),
    sharpe,
    skewness:  skew,
    kurtosis:  kurt,
    finalPrices: finals,
    p5:  q(finals, 0.05),
    p25: q(finals, 0.25),
    p50: q(finals, 0.50),
    p75: q(finals, 0.75),
    p95: q(finals, 0.95),
  }
}

function gaussianRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function MonteCarloPanel() {
  const tickers  = useStore((s) => s.tickers)
  const watchlist = useStore((s) => s.watchlist)

  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [horizon, setHorizon]   = useState(5)
  const [entry, setEntry]       = useState('')
  const [target, setTarget]     = useState('')
  const [stop, setStop]         = useState('')
  const [annualVol, setAnnualVol] = useState('0.6')
  const [result, setResult]     = useState<MCResult | null>(null)
  const [running, setRunning]   = useState(false)

  const currentPrice = tickers[selectedSymbol]?.price ?? 0

  const run = useCallback(() => {
    if (!currentPrice) return
    setRunning(true)
    setTimeout(() => {
      const sigma = parseFloat(annualVol) || 0.6
      const mu = 0.05  // 5% annual drift default
      const e = parseFloat(entry) || currentPrice
      const t = parseFloat(target) || currentPrice * 1.1
      const s = parseFloat(stop) || currentPrice * 0.9
      const r = runMonteCarlo(currentPrice, mu, sigma, horizon, e, t, s, 5000)
      setResult(r)
      setRunning(false)
    }, 50)
  }, [currentPrice, annualVol, horizon, entry, target, stop])

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Monte Carlo Simulator (GBM)
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Asset</label>
          <select
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          >
            {watchlist.map((w) => (
              <option key={w.symbol} value={w.symbol}>{w.symbol.replace('USDT','').replace('=X','').replace('^','')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Annual Vol</label>
          <input
            type="number"
            step="0.05"
            value={annualVol}
            onChange={(e) => setAnnualVol(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Entry Price</label>
          <input
            type="number"
            placeholder={fmt(currentPrice)}
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Target</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Stop</label>
          <input
            type="number"
            value={stop}
            onChange={(e) => setStop(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Horizon</label>
          <div className="flex gap-1 flex-wrap">
            {HORIZONS.map((h) => (
              <button
                key={h.days}
                onClick={() => setHorizon(h.days)}
                className={`px-1.5 py-0.5 font-mono text-2xs rounded transition-colors ${
                  horizon === h.days ? 'bg-terminal-accent text-terminal-bg' : 'bg-terminal-panel text-terminal-faint'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="font-mono text-2xs text-terminal-faint mr-2">
          Current: {fmt(currentPrice)}
        </span>
      </div>

      <button
        onClick={run}
        disabled={running || !currentPrice}
        className="w-full py-1.5 font-mono text-xs bg-terminal-accent text-terminal-bg rounded font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {running ? 'Running 5,000 paths...' : 'Run Simulation'}
      </button>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-2">
          {/* Fan chart (simplified bar-based) */}
          <div className="bg-terminal-panel rounded p-2 border border-terminal-border/50">
            <div className="font-mono text-2xs text-terminal-faint mb-2">Price Distribution at {horizon}D</div>
            <div className="flex items-end gap-1 h-12">
              {[result.p5, result.p25, result.p50, result.p75, result.p95].map((val, i) => {
                const heights = [30, 50, 80, 55, 35]
                const colors  = ['#EF4444','#F97316','#10B981','#3B82F6','#6366F1']
                const labels  = ['P5','P25','P50','P75','P95']
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="font-mono text-2xs text-terminal-faint" style={{ fontSize: '8px' }}>{fmt(val)}</div>
                    <div style={{ height: `${heights[i]}%`, backgroundColor: colors[i], opacity: 0.7, width: '100%', borderRadius: '2px 2px 0 0' }} />
                    <div className="font-mono text-terminal-faint" style={{ fontSize: '8px' }}>{labels[i]}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Metrics table */}
          <div className="grid grid-cols-2 gap-1">
            {[
              { label: 'P(Profit)',  value: pct(result.pProfit),  color: result.pProfit > 0.5 ? 'text-terminal-up' : 'text-terminal-down' },
              { label: 'P(Target)',  value: pct(result.pTarget),  color: result.pTarget > 0.3 ? 'text-terminal-up' : 'text-terminal-faint' },
              { label: 'P(Stop)',    value: pct(result.pStop),    color: result.pStop > 0.3 ? 'text-terminal-down' : 'text-terminal-faint' },
              { label: 'VaR 95%',   value: fmt(result.var95),    color: 'text-terminal-down' },
              { label: 'VaR 99%',   value: fmt(result.var99),    color: 'text-terminal-down' },
              { label: 'CVaR 95%',  value: fmt(result.cvar95),   color: 'text-terminal-down' },
              { label: 'Max DD P50',value: pct(result.maxDdP50), color: 'text-yellow-400' },
              { label: 'Max DD P95',value: pct(result.maxDdP95), color: 'text-terminal-down' },
              { label: 'Sharpe',    value: result.sharpe.toFixed(2), color: result.sharpe > 0.5 ? 'text-terminal-up' : 'text-terminal-faint' },
              { label: 'Skewness',  value: result.skewness.toFixed(2), color: 'text-terminal-dim' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between bg-terminal-panel rounded px-2 py-1 border border-terminal-border/30">
                <span className="font-mono text-2xs text-terminal-faint">{row.label}</span>
                <span className={`font-mono text-2xs font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
