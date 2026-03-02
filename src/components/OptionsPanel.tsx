import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

interface DeribitRR {
  instrument: string
  delta: number
  rrBid: number
  rrAsk: number
  rrMid: number
  expiry: string
}

async function fetchDeribitRR(): Promise<DeribitRR[]> {
  // Deribit public REST - no auth, CORS-open
  const expiries = ['1D', '7D', '14D', '30D']
  const results: DeribitRR[] = []

  try {
    const res = await fetch(
      'https://www.deribit.com/api/v2/public/get_book_summary_by_currency?currency=BTC&kind=option',
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return results
    const data = await res.json()
    const instruments: {
      instrument_name: string
      bid_price: number | null
      ask_price: number | null
    }[] = data.result ?? []

    // Group by expiry — find 25-delta calls and puts
    // Approximate 25-delta from instrument naming: typically ATM ± 1 strike
    // For simplicity, find nearest-expiry options and show IV spread
    const byExpiry: Record<string, { calls: typeof instruments; puts: typeof instruments }> = {}
    for (const inst of instruments) {
      const parts = inst.instrument_name.split('-')
      if (parts.length < 4) continue
      const expiry = parts[1]
      const type = parts[3]
      if (!byExpiry[expiry]) byExpiry[expiry] = { calls: [], puts: [] }
      if (type === 'C') byExpiry[expiry].calls.push(inst)
      if (type === 'P') byExpiry[expiry].puts.push(inst)
    }

    const sortedExpiries = Object.keys(byExpiry).sort().slice(0, 4)
    for (const exp of sortedExpiries) {
      const group = byExpiry[exp]
      const calls = group.calls.filter(c => c.bid_price != null && c.ask_price != null)
      const puts  = group.puts.filter(p => p.bid_price != null && p.ask_price != null)
      if (!calls.length || !puts.length) continue

      // Midpoint of first call minus midpoint of first put as proxy for 25D RR
      const callMid = ((calls[0].bid_price ?? 0) + (calls[0].ask_price ?? 0)) / 2
      const putMid  = ((puts[0].bid_price ?? 0) + (puts[0].ask_price ?? 0)) / 2
      results.push({
        instrument: `BTC ${exp}`,
        delta: 25,
        rrBid: callMid - (putMid + 0.001),
        rrAsk: callMid - (putMid - 0.001),
        rrMid: callMid - putMid,
        expiry: exp,
      })
    }
  } catch {
    // Deribit unavailable — return empty
  }
  return results
}

export function OptionsPanel() {
  const tickers = useStore((s) => s.tickers)
  const [deribitRR, setDeribitRR] = useState<DeribitRR[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchDeribitRR().then((data) => {
      setDeribitRR(data)
      setLoading(false)
    })
    const id = setInterval(() => {
      fetchDeribitRR().then(setDeribitRR)
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  // VIX term structure from Yahoo Finance store
  const vix  = tickers['^VIX']
  const vix3 = tickers['^VIX3M']
  const vix6 = tickers['^VIX6M']

  const vixData = [
    { label: 'VIX (1M)',  val: vix?.price,  ticker: '^VIX'  },
    { label: 'VIX3M',     val: vix3?.price, ticker: '^VIX3M' },
    { label: 'VIX6M',     val: vix6?.price, ticker: '^VIX6M' },
  ]
  const maxVix = Math.max(...vixData.map(v => v.val ?? 0), 30)

  // Contango/backwardation signal
  const termSignal = vix && vix3
    ? vix.price > vix3.price
      ? { label: 'BACKWARDATION', color: 'text-terminal-down', desc: 'Elevated near-term fear — market expects volatility to fall' }
      : { label: 'CONTANGO',     color: 'text-terminal-up',   desc: 'Normal structure — uncertainty grows further out' }
    : null

  return (
    <div className="p-3 space-y-4">
      {/* ── VIX Term Structure ────────────────────────────────────── */}
      <div>
        <div className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest mb-2">
          VIX TERM STRUCTURE
        </div>
        <div className="space-y-2">
          {vixData.map(({ label, val }) => (
            <div key={label} className="space-y-0.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-2xs text-terminal-faint">{label}</span>
                <span className="font-mono text-xs font-bold text-terminal-text">
                  {val != null ? val.toFixed(2) : '—'}
                </span>
              </div>
              <div className="h-1.5 bg-terminal-panel rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    (val ?? 0) > 25 ? 'bg-terminal-down' :
                    (val ?? 0) > 18 ? 'bg-yellow-500' : 'bg-terminal-up'
                  }`}
                  style={{ width: `${Math.min(100, ((val ?? 0) / maxVix) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {termSignal && (
          <div className="mt-2 p-2 bg-terminal-panel rounded border border-terminal-border/40">
            <div className={`font-mono text-2xs font-bold ${termSignal.color}`}>{termSignal.label}</div>
            <div className="font-mono text-2xs text-terminal-faint mt-0.5">{termSignal.desc}</div>
          </div>
        )}

        {/* Regime thresholds */}
        <div className="mt-2 flex gap-2 flex-wrap">
          {[
            { label: '<18 Risk-On', color: 'text-terminal-up' },
            { label: '18-22 Trans.', color: 'text-yellow-400' },
            { label: '>22 Risk-Off', color: 'text-terminal-down' },
            { label: '>30 Crisis', color: 'text-red-400' },
          ].map(({ label, color }) => (
            <span key={label} className={`font-mono text-2xs ${color}`}>{label}</span>
          ))}
        </div>
      </div>

      {/* ── BTC Deribit Risk Reversal ─────────────────────────────── */}
      <div>
        <div className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest mb-2">
          BTC 25Δ RISK REVERSAL
        </div>
        {loading ? (
          <div className="font-mono text-2xs text-terminal-faint">Loading Deribit data…</div>
        ) : deribitRR.length === 0 ? (
          <div className="font-mono text-2xs text-terminal-faint">Deribit data unavailable</div>
        ) : (
          <div className="space-y-1.5">
            {/* Header */}
            <div className="grid grid-cols-4 gap-1">
              <span className="font-mono text-2xs text-terminal-faint">Expiry</span>
              <span className="font-mono text-2xs text-terminal-faint text-right">Mid</span>
              <span className="font-mono text-2xs text-terminal-faint text-right">Bid</span>
              <span className="font-mono text-2xs text-terminal-faint text-right">Ask</span>
            </div>
            {deribitRR.map((rr) => (
              <div key={rr.expiry} className="grid grid-cols-4 gap-1 hover:bg-terminal-panel rounded px-1 py-0.5">
                <span className="font-mono text-2xs text-terminal-dim">{rr.expiry}</span>
                <span className={`font-mono text-2xs font-semibold text-right ${
                  rr.rrMid > 0 ? 'text-terminal-up' : rr.rrMid < 0 ? 'text-terminal-down' : 'text-terminal-faint'
                }`}>
                  {rr.rrMid > 0 ? '+' : ''}{(rr.rrMid * 100).toFixed(1)}%
                </span>
                <span className="font-mono text-2xs text-terminal-faint text-right">
                  {(rr.rrBid * 100).toFixed(1)}%
                </span>
                <span className="font-mono text-2xs text-terminal-faint text-right">
                  {(rr.rrAsk * 100).toFixed(1)}%
                </span>
              </div>
            ))}
            <div className="mt-1 font-mono text-2xs text-terminal-faint leading-relaxed">
              Positive RR → call IV &gt; put IV → bullish skew (market bids upside)
              <br />
              Negative RR → put IV &gt; call IV → bearish skew (market bids downside protection)
            </div>
          </div>
        )}
      </div>

      {/* ── IV Slope ─────────────────────────────────────────────── */}
      {vix && vix3 && (
        <div>
          <div className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest mb-1">
            IV SLOPE (1M vs 3M)
          </div>
          <div className="p-2 bg-terminal-panel rounded border border-terminal-border/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs text-terminal-faint">Slope</span>
              <span className={`font-mono text-xs font-bold ${
                vix.price - vix3.price > 0 ? 'text-terminal-down' : 'text-terminal-up'
              }`}>
                {(vix.price - vix3.price) > 0 ? '+' : ''}
                {(vix.price - vix3.price).toFixed(2)} pts
              </span>
            </div>
            <div className="font-mono text-2xs text-terminal-faint mt-0.5">
              {vix.price - vix3.price > 2
                ? 'Steep backwardation — acute near-term stress'
                : vix.price - vix3.price > 0
                  ? 'Mild backwardation — slight near-term concern'
                  : 'Contango — market calm, vol term premium positive'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
