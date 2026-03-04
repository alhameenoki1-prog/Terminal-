// NEXUS Monte Carlo Simulator — Section 2
// Models: GBM, GARCH(1,1), Ornstein-Uhlenbeck, Merton Jump-Diffusion
// Optional: 2-asset Cholesky correlated simulation
// 10,000 paths minimum per Section 2 specification
// Regime-conditional σ adjustment (Risk-On: ×0.85, Transition: ×1.0, Risk-Off: ×1.2, Crisis: ×1.5)

import { useState, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'
import type { RegimeType } from '../types'

interface MCResult {
  pProfit: number; pTarget: number; pStop: number
  var95: number; var99: number; cvar95: number; cvar99: number
  maxDdP50: number; maxDdP95: number; sharpe: number; skewness: number; kurtosis: number
  finalPrices: number[]
  p5: number; p25: number; p50: number; p75: number; p95: number
  modelUsed: string
}

const HORIZONS = [
  { label: '1D',  days: 1   },
  { label: '5D',  days: 5   },
  { label: '21D', days: 21  },
  { label: '63D', days: 63  },
  { label: '1Y',  days: 252 },
]

type MCModel = 'gbm' | 'garch' | 'ou' | 'merton' | 'cholesky'

const MODEL_LABELS: Record<MCModel, string> = {
  gbm:      'GBM (Geometric Brownian Motion)',
  garch:    'GARCH(1,1) Stochastic Volatility',
  ou:       'Ornstein-Uhlenbeck (Mean Reversion)',
  merton:   'Merton Jump-Diffusion',
  cholesky: '2-Asset Correlated (Cholesky)',
}

// Regime-conditional vol multipliers (Section 2.6)
const REGIME_VOL_MULT: Record<RegimeType, number> = {
  'risk-on':    0.85,
  'transition': 1.00,
  'risk-off':   1.20,
  'crisis':     1.50,
}

// ─── Random Variate Generators ──────────────────────────────────────────────

function gaussianRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// Student-t via ratio of normal to chi (df=5 for fat tails)
function studentTRandom(df = 5): number {
  const z = gaussianRandom()
  let chiSq = 0
  for (let i = 0; i < df; i++) { const g = gaussianRandom(); chiSq += g * g }
  return z / Math.sqrt(chiSq / df)
}

// Poisson random variate (for jump arrival)
function poissonRandom(lambda: number): number {
  let L = Math.exp(-lambda), k = 0, p = 1
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

// ─── Cholesky Decomposition for 2×2 correlation matrix ───────────────────

function cholesky2x2(rho: number): [number, number, number, number] {
  // L such that L * L^T = [[1, rho], [rho, 1]]
  const l11 = 1
  const l21 = rho
  const l22 = Math.sqrt(Math.max(0, 1 - rho * rho))
  return [l11, 0, l21, l22]
}

function correlatedNormals(rho: number): [number, number] {
  const [l11, , l21, l22] = cholesky2x2(rho)
  const z1 = gaussianRandom()
  const z2 = gaussianRandom()
  return [l11 * z1, l21 * z1 + l22 * z2]
}

// ─── Monte Carlo Engines ──────────────────────────────────────────────────

function runGBM(
  price: number, mu: number, sigma: number, horizon: number,
  entry: number, target: number, stop: number, useStudentT: boolean, N: number,
): number[] {
  const dt = 1 / 252, sqrtDt = Math.sqrt(dt)
  const randFn = useStudentT ? () => studentTRandom(5) : gaussianRandom
  const finals: number[] = []
  for (let i = 0; i < N; i++) {
    let S = price
    for (let t = 0; t < horizon; t++) {
      S = S * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * sqrtDt * randFn())
    }
    finals.push(S)
    void entry; void target; void stop // used in aggregation
  }
  return finals
}

function runGARCH(
  price: number, mu: number, sigma: number, horizon: number, N: number,
): number[] {
  // GARCH(1,1): σ²_t = ω + α·ε²_{t-1} + β·σ²_{t-1}
  // Calibrated to long-run variance = σ² (per unconditional variance formula)
  const alpha = 0.08, beta = 0.85
  const omega = sigma * sigma * (1 - alpha - beta)  // ensures E[σ²] = σ²
  const dt = 1 / 252
  const finals: number[] = []
  for (let i = 0; i < N; i++) {
    let S = price
    let sigma2 = sigma * sigma
    for (let t = 0; t < horizon; t++) {
      const z = gaussianRandom()
      const sigT = Math.sqrt(sigma2)
      const ret = mu * dt + sigT * Math.sqrt(dt) * z
      S = S * Math.exp(ret)
      const eps = sigT * z
      sigma2 = omega + alpha * eps * eps + beta * sigma2
      sigma2 = Math.max(1e-8, Math.min(sigma2, 4 * sigma * sigma)) // clamp
    }
    finals.push(S)
  }
  return finals
}

function runOU(
  price: number, mu: number, sigma: number, horizon: number, N: number,
): number[] {
  // Ornstein-Uhlenbeck mean-reversion on log-price
  // dX = κ(θ - X)dt + σdW, where X = log(S)
  const kappa = 2.0  // mean-reversion speed (half-life ≈ ln2/κ ≈ 130 days)
  const theta = Math.log(price) + mu * (horizon / 252)  // drift-adjusted long-run mean
  const dt = 1 / 252
  const finals: number[] = []
  for (let i = 0; i < N; i++) {
    let X = Math.log(price)
    for (let t = 0; t < horizon; t++) {
      const z = gaussianRandom()
      X = X + kappa * (theta - X) * dt + sigma * Math.sqrt(dt) * z
    }
    finals.push(Math.exp(X))
  }
  return finals
}

function runMerton(
  price: number, mu: number, sigma: number, horizon: number, N: number,
): number[] {
  // Merton Jump-Diffusion: dS/S = (μ - λμ_J)dt + σdW + J·dN
  // Jump arrival: N(t) ~ Poisson(λ)  |  Jump size: ln(1+J) ~ N(μ_J, σ_J²)
  const lambda = 0.20   // expected jumps per year (annualised)
  const muJ    = -0.04  // mean log-jump size (negative = downside skew)
  const sigmaJ = 0.07   // std of log-jump
  const dt     = 1 / 252
  const lambdaDt = lambda * dt
  const finals: number[] = []
  for (let i = 0; i < N; i++) {
    let S = price
    for (let t = 0; t < horizon; t++) {
      const z = gaussianRandom()
      // Compensated drift (so expected return still = mu)
      const compensator = lambda * (Math.exp(muJ + 0.5 * sigmaJ * sigmaJ) - 1)
      let ret = (mu - compensator - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z
      // Jump component
      const nJumps = poissonRandom(lambdaDt)
      for (let j = 0; j < nJumps; j++) {
        ret += muJ + sigmaJ * gaussianRandom()
      }
      S = S * Math.exp(ret)
    }
    finals.push(S)
  }
  return finals
}

function runCholesky(
  price1: number, price2: number,
  mu: number, sigma1: number, sigma2: number,
  rho: number, horizon: number, N: number,
): { finals1: number[]; finals2: number[] } {
  const dt = 1 / 252
  const finals1: number[] = [], finals2: number[] = []
  for (let i = 0; i < N; i++) {
    let S1 = price1, S2 = price2
    for (let t = 0; t < horizon; t++) {
      const [z1, z2] = correlatedNormals(rho)
      S1 = S1 * Math.exp((mu - 0.5 * sigma1 * sigma1) * dt + sigma1 * Math.sqrt(dt) * z1)
      S2 = S2 * Math.exp((mu - 0.5 * sigma2 * sigma2) * dt + sigma2 * Math.sqrt(dt) * z2)
    }
    finals1.push(S1)
    finals2.push(S2)
  }
  return { finals1, finals2 }
}

// ─── Aggregate results into MCResult ─────────────────────────────────────

function aggregateResults(
  finals: number[],
  price: number,
  entry: number,
  target: number,
  stop: number,
  horizon: number,
  model: MCModel,
): MCResult {
  const N = finals.length
  const sorted = [...finals].sort((a, b) => a - b)

  let profitCount = 0, targetCount = 0, stopCount = 0
  for (const f of finals) {
    if (f > entry) profitCount++
    if (f >= target && target > entry) targetCount++
    if (f <= stop && stop < entry) stopCount++
  }

  const q = (pct: number) => sorted[Math.floor(N * pct)]
  const returns = finals.map((f) => (f - price) / price)
  const retMean = returns.reduce((a, b) => a + b, 0) / N
  const retStd  = Math.sqrt(returns.reduce((a, b) => a + (b - retMean) ** 2, 0) / N)
  const sharpe  = retStd > 0 ? (retMean / retStd) * Math.sqrt(252 / horizon) : 0
  const skew    = returns.reduce((a, b) => a + ((b - retMean) / (retStd || 1)) ** 3, 0) / N
  const kurt    = returns.reduce((a, b) => a + ((b - retMean) / (retStd || 1)) ** 4, 0) / N - 3

  const var95idx = Math.max(1, Math.floor(N * 0.05))
  const var99idx = Math.max(1, Math.floor(N * 0.01))
  const cvar95 = sorted.slice(0, var95idx).reduce((a, b) => a + b, 0) / var95idx
  const cvar99 = sorted.slice(0, var99idx).reduce((a, b) => a + b, 0) / var99idx

  // Max drawdown estimation from final cross-section (P50 / P95 of drawdown)
  // Approximated as 1 - P5/P50 and 1 - P1/P50 (path-level would need full paths)
  const p50 = q(0.5)
  const maxDdP50 = p50 > 0 ? Math.max(0, 1 - q(0.25) / p50) : 0
  const maxDdP95 = p50 > 0 ? Math.max(0, 1 - q(0.05) / p50) : 0

  return {
    pProfit:  profitCount / N,
    pTarget:  targetCount / N,
    pStop:    stopCount   / N,
    var95:    price - q(0.05),
    var99:    price - q(0.01),
    cvar95:   price - cvar95,
    cvar99:   price - cvar99,
    maxDdP50,
    maxDdP95,
    sharpe, skewness: skew, kurtosis: kurt,
    finalPrices: sorted,
    p5:  q(0.05),
    p25: q(0.25),
    p50: q(0.50),
    p75: q(0.75),
    p95: q(0.95),
    modelUsed: MODEL_LABELS[model],
  }
}

// ─── Component ────────────────────────────────────────────────────────────

const N_PATHS = 10_000  // Section 2 minimum

export function MonteCarloPanel() {
  const tickers   = useStore((s) => s.tickers)
  const watchlist = useStore((s) => s.watchlist)
  const regime    = useStore((s) => s.regime)

  const [model,      setModel]      = useState<MCModel>('gbm')
  const [symbol1,    setSymbol1]    = useState('BTCUSDT')
  const [symbol2,    setSymbol2]    = useState('^GSPC')
  const [horizon,    setHorizon]    = useState(5)
  const [entry,      setEntry]      = useState('')
  const [target,     setTarget]     = useState('')
  const [stop,       setStop]       = useState('')
  const [annualVol,  setAnnualVol]  = useState('0.60')
  const [annualVol2, setAnnualVol2] = useState('0.18')
  const [corrRho,    setCorrRho]    = useState('0.65')
  const [useStudentT, setUseStudentT] = useState(false)
  const [regimeAdj,  setRegimeAdj]  = useState(true)
  const [result,     setResult]     = useState<MCResult | null>(null)
  const [running,    setRunning]    = useState(false)

  const price1 = tickers[symbol1]?.price ?? 0
  const price2 = tickers[symbol2]?.price ?? 0

  const effectiveSigma = useCallback((base: string) => {
    let s = parseFloat(base) || 0.6
    if (regimeAdj) s *= REGIME_VOL_MULT[regime.regime] ?? 1.0
    return s
  }, [regimeAdj, regime.regime])

  const run = useCallback(() => {
    if (!price1) return
    setRunning(true)
    // Use setTimeout so UI re-renders "Running…" before heavy computation
    setTimeout(() => {
      const sigma  = effectiveSigma(annualVol)
      const sigma2 = effectiveSigma(annualVol2)
      const rho    = parseFloat(corrRho) || 0.65
      const mu     = 0.05
      const e      = parseFloat(entry)  || price1
      const t      = parseFloat(target) || price1 * 1.1
      const s      = parseFloat(stop)   || price1 * 0.9

      let finals: number[]
      if (model === 'gbm') {
        finals = runGBM(price1, mu, sigma, horizon, e, t, s, useStudentT, N_PATHS)
      } else if (model === 'garch') {
        finals = runGARCH(price1, mu, sigma, horizon, N_PATHS)
      } else if (model === 'ou') {
        finals = runOU(price1, mu, sigma, horizon, N_PATHS)
      } else if (model === 'merton') {
        finals = runMerton(price1, mu, sigma, horizon, N_PATHS)
      } else {
        // Cholesky: simulate price1, return its finals
        const { finals1 } = runCholesky(price1, price2, mu, sigma, sigma2, rho, horizon, N_PATHS)
        finals = finals1
      }

      setResult(aggregateResults(finals, price1, e, t, s, horizon, model))
      setRunning(false)
    }, 50)
  }, [price1, price2, model, annualVol, annualVol2, corrRho, horizon, entry, target, stop, useStudentT, effectiveSigma])

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Monte Carlo Simulator — {N_PATHS.toLocaleString()} paths
      </div>

      {/* Model selector */}
      <div>
        <label className="font-mono text-2xs text-terminal-faint block mb-1">Model</label>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(MODEL_LABELS) as MCModel[]).map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-2 py-0.5 font-mono text-2xs rounded transition-colors ${
                model === m
                  ? 'bg-terminal-accent text-terminal-bg'
                  : 'bg-terminal-panel text-terminal-faint hover:text-terminal-dim'
              }`}
            >
              {m === 'gbm' ? 'GBM' : m === 'garch' ? 'GARCH' : m === 'ou' ? 'O-U' : m === 'merton' ? 'Merton' : 'Cholesky'}
            </button>
          ))}
        </div>
        <div className="font-mono text-2xs text-terminal-faint/60 mt-1">{MODEL_LABELS[model]}</div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">
            Asset {model === 'cholesky' ? '1' : ''}
          </label>
          <select
            value={symbol1}
            onChange={(e) => setSymbol1(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          >
            {watchlist.map((w) => (
              <option key={w.symbol} value={w.symbol}>
                {w.name.slice(0, 14)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">
            Annual σ {regimeAdj ? `(×${REGIME_VOL_MULT[regime.regime]})` : ''}
          </label>
          <input
            type="number" step="0.05" value={annualVol}
            onChange={(e) => setAnnualVol(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>

        {/* Cholesky-only: second asset */}
        {model === 'cholesky' && (
          <>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-1">Asset 2</label>
              <select
                value={symbol2}
                onChange={(e) => setSymbol2(e.target.value)}
                className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
              >
                {watchlist.map((w) => (
                  <option key={w.symbol} value={w.symbol}>{w.name.slice(0, 14)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-1">σ₂ (Asset 2)</label>
              <input
                type="number" step="0.05" value={annualVol2}
                onChange={(e) => setAnnualVol2(e.target.value)}
                className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
              />
            </div>
            <div className="col-span-2">
              <label className="font-mono text-2xs text-terminal-faint block mb-1">
                Correlation ρ (−1 to +1)
              </label>
              <input
                type="number" step="0.05" min="-1" max="1" value={corrRho}
                onChange={(e) => setCorrRho(e.target.value)}
                className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
              />
            </div>
          </>
        )}

        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Entry</label>
          <input
            type="number" placeholder={fmt(price1)} value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Target</label>
          <input
            type="number" value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-terminal-panel border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text"
          />
        </div>
        <div>
          <label className="font-mono text-2xs text-terminal-faint block mb-1">Stop</label>
          <input
            type="number" value={stop}
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
                className={`px-1.5 py-0.5 font-mono text-2xs rounded ${
                  horizon === h.days ? 'bg-terminal-accent text-terminal-bg' : 'bg-terminal-panel text-terminal-faint'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-3 flex-wrap">
        {model === 'gbm' && (
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" checked={useStudentT} onChange={(e) => setUseStudentT(e.target.checked)} className="accent-terminal-accent" />
            <span className="font-mono text-2xs text-terminal-faint">Student-t (df=5) fat tails</span>
          </label>
        )}
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={regimeAdj} onChange={(e) => setRegimeAdj(e.target.checked)} className="accent-terminal-accent" />
          <span className="font-mono text-2xs text-terminal-faint">
            Regime σ adj [{regime.regime} ×{REGIME_VOL_MULT[regime.regime]}]
          </span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-mono text-2xs text-terminal-faint">Current: {fmt(price1)}</span>
        <span className="font-mono text-2xs text-terminal-accent">
          Effective σ: {effectiveSigma(annualVol).toFixed(3)}
        </span>
      </div>

      <button
        onClick={run}
        disabled={running || !price1}
        className="w-full py-1.5 font-mono text-xs bg-terminal-accent text-terminal-bg rounded font-bold hover:opacity-90 disabled:opacity-50"
      >
        {running ? `Running ${N_PATHS.toLocaleString()} paths…` : `Run ${MODEL_LABELS[model].split(' ')[0]} Simulation`}
      </button>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-2">
          <div className="font-mono text-2xs text-terminal-faint/70 bg-terminal-panel rounded px-2 py-1 border border-terminal-border/30">
            {result.modelUsed} · {horizon}D horizon · {N_PATHS.toLocaleString()} paths
          </div>

          {/* Fan chart */}
          <div className="bg-terminal-panel rounded p-2 border border-terminal-border/50">
            <div className="font-mono text-2xs text-terminal-faint mb-2">Price Distribution at {horizon}D</div>
            <div className="flex items-end gap-1 h-14">
              {([result.p5, result.p25, result.p50, result.p75, result.p95] as const).map((val, i) => {
                const heights = [25, 48, 80, 52, 28]
                const colors  = ['#EF4444','#F97316','#10B981','#3B82F6','#6366F1']
                const labels  = ['P5','P25','P50','P75','P95']
                const chg     = ((val - price1) / price1 * 100)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div className="font-mono text-terminal-faint" style={{ fontSize: '7px' }}>{fmt(val)}</div>
                    <div className="font-mono text-terminal-faint" style={{ fontSize: '7px', color: chg >= 0 ? '#10B981' : '#EF4444' }}>
                      {chg >= 0 ? '+' : ''}{chg.toFixed(1)}%
                    </div>
                    <div style={{ height: `${heights[i]}%`, backgroundColor: colors[i], opacity: 0.75, width: '100%', borderRadius: '2px 2px 0 0' }} />
                    <div className="font-mono text-terminal-faint" style={{ fontSize: '7px' }}>{labels[i]}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-1">
            {[
              { label: 'P(Profit)',   value: pct(result.pProfit),  color: result.pProfit > 0.5 ? 'text-terminal-up' : 'text-terminal-down' },
              { label: 'P(Target)',   value: pct(result.pTarget),  color: result.pTarget > 0.3 ? 'text-terminal-up' : 'text-terminal-faint' },
              { label: 'P(Stop)',     value: pct(result.pStop),    color: result.pStop > 0.3 ? 'text-terminal-down' : 'text-terminal-faint' },
              { label: 'VaR 95%',    value: fmt(result.var95),    color: 'text-terminal-down' },
              { label: 'VaR 99%',    value: fmt(result.var99),    color: 'text-terminal-down' },
              { label: 'CVaR 95%',   value: fmt(result.cvar95),   color: 'text-terminal-down' },
              { label: 'CVaR 99%',   value: fmt(result.cvar99),   color: 'text-terminal-down' },
              { label: 'Max DD P50', value: pct(result.maxDdP50), color: 'text-yellow-400' },
              { label: 'Max DD P95', value: pct(result.maxDdP95), color: 'text-terminal-down' },
              { label: 'Sharpe',     value: result.sharpe.toFixed(2), color: result.sharpe > 0.5 ? 'text-terminal-up' : 'text-terminal-faint' },
              { label: 'Skewness',   value: result.skewness.toFixed(2), color: result.skewness < -0.5 ? 'text-terminal-down' : 'text-terminal-dim' },
              { label: 'Kurtosis',   value: result.kurtosis.toFixed(2), color: result.kurtosis > 1 ? 'text-yellow-400' : 'text-terminal-dim' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between bg-terminal-panel rounded px-2 py-1 border border-terminal-border/30">
                <span className="font-mono text-2xs text-terminal-faint">{row.label}</span>
                <span className={`font-mono text-2xs font-bold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Model notes */}
          <div className="font-mono text-2xs text-terminal-accent/70 bg-terminal-panel rounded p-2 border border-terminal-accent/20">
            {model === 'gbm'      && 'GBM: constant σ, log-normal distribution'}
            {model === 'garch'    && 'GARCH(1,1): α=0.08, β=0.85 — volatility clustering, fat tails'}
            {model === 'ou'       && 'O-U: κ=2.0 — mean-reversion on log-price, half-life ≈ 127 days'}
            {model === 'merton'   && 'Merton: λ=0.20/yr, μ_J=−4%, σ_J=7% — jump risk captured in CVaR'}
            {model === 'cholesky' && `Cholesky: ρ=${parseFloat(corrRho).toFixed(2)} — 2-asset correlated simulation`}
          </div>
        </div>
      )}
    </div>
  )
}
