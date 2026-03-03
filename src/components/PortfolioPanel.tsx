import { useState, useMemo } from 'react'
import { useStore } from '../store/useStore'
import type { Position, TradeDirection } from '../types'

function blank(): Omit<Position, 'id' | 'openedAt'> {
  return {
    symbol: '',
    displayName: '',
    direction: 'LONG',
    entryPrice: 0,
    size: 1,
    stopLoss: undefined,
    takeProfit: undefined,
    note: '',
  }
}

function pnl(pos: Position, livePrice: number): number {
  const mult = pos.direction === 'LONG' ? 1 : -1
  return mult * (livePrice - pos.entryPrice) * pos.size
}

function pnlPct(pos: Position, livePrice: number): number {
  if (pos.entryPrice === 0) return 0
  const mult = pos.direction === 'LONG' ? 1 : -1
  return mult * ((livePrice - pos.entryPrice) / pos.entryPrice) * 100
}

function rr(pos: Position): number | null {
  if (!pos.stopLoss || !pos.takeProfit) return null
  const risk   = Math.abs(pos.entryPrice - pos.stopLoss)
  const reward = Math.abs(pos.takeProfit - pos.entryPrice)
  if (risk === 0) return null
  return reward / risk
}

export function PortfolioPanel() {
  const positions    = useStore((s) => s.positions)
  const addPosition  = useStore((s) => s.addPosition)
  const removePosition = useStore((s) => s.removePosition)
  const closePosition  = useStore((s) => s.closePosition)
  const tickers      = useStore((s) => s.tickers)

  const [showAdd, setShowAdd]     = useState(false)
  const [form, setForm]           = useState(blank())
  const [showClosed, setShowClosed] = useState(false)

  const openPositions   = positions.filter((p) => !p.closedAt)
  const closedPositions = positions.filter((p) => p.closedAt)

  const openPnl = useMemo(() =>
    openPositions.reduce((sum, pos) => {
      const live = tickers[pos.symbol]?.price ?? pos.entryPrice
      return sum + pnl(pos, live)
    }, 0),
    [openPositions, tickers]
  )

  const realizedPnl = useMemo(() =>
    closedPositions.reduce((sum, pos) => {
      if (!pos.closePrice) return sum
      return sum + pnl(pos, pos.closePrice)
    }, 0),
    [closedPositions]
  )

  const save = () => {
    if (!form.symbol.trim() || !form.entryPrice) return
    addPosition({
      ...form,
      id: crypto.randomUUID(),
      openedAt: new Date().toISOString(),
      displayName: form.displayName || form.symbol,
    })
    setForm(blank())
    setShowAdd(false)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest">
          PORTFOLIO TRACKER
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
            showAdd ? 'border-terminal-accent text-terminal-accent' : 'border-terminal-border text-terminal-faint hover:border-terminal-muted'
          }`}
        >
          + Position
        </button>
      </div>

      {/* P&L summary */}
      <div className="grid grid-cols-2 gap-0 border-b border-terminal-border flex-shrink-0">
        <div className="px-3 py-2 border-r border-terminal-border">
          <div className="font-mono text-2xs text-terminal-faint">Open P&L</div>
          <div className={`font-mono text-sm font-bold ${openPnl >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
            {openPnl >= 0 ? '+' : ''}${openPnl.toFixed(2)}
          </div>
          <div className="font-mono text-2xs text-terminal-faint">{openPositions.length} open</div>
        </div>
        <div className="px-3 py-2">
          <div className="font-mono text-2xs text-terminal-faint">Realized P&L</div>
          <div className={`font-mono text-sm font-bold ${realizedPnl >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
            {realizedPnl >= 0 ? '+' : ''}${realizedPnl.toFixed(2)}
          </div>
          <div className="font-mono text-2xs text-terminal-faint">{closedPositions.length} closed</div>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="border-b border-terminal-border bg-terminal-panel/60 p-3 flex-shrink-0 space-y-2">
          <div className="font-mono text-2xs text-terminal-accent tracking-widest mb-1">NEW POSITION</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Symbol (Yahoo)</label>
              <input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                placeholder="BTCUSDT / ^GSPC / GC=F"
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent" />
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Display Name</label>
              <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                placeholder="BTC / S&P 500 / Gold"
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Direction</label>
              <select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value as TradeDirection })}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-faint focus:outline-none focus:border-terminal-accent">
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Entry Price</label>
              <input type="number" value={form.entryPrice || ''} onChange={(e) => setForm({ ...form, entryPrice: parseFloat(e.target.value) })}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text focus:outline-none focus:border-terminal-accent" />
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Size (units)</label>
              <input type="number" value={form.size || ''} onChange={(e) => setForm({ ...form, size: parseFloat(e.target.value) })}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text focus:outline-none focus:border-terminal-accent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Stop Loss</label>
              <input type="number" value={form.stopLoss ?? ''} onChange={(e) => setForm({ ...form, stopLoss: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text focus:outline-none focus:border-terminal-accent" />
            </div>
            <div>
              <label className="font-mono text-2xs text-terminal-faint block mb-0.5">Take Profit</label>
              <input type="number" value={form.takeProfit ?? ''} onChange={(e) => setForm({ ...form, takeProfit: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text focus:outline-none focus:border-terminal-accent" />
            </div>
          </div>
          <input value={form.note ?? ''} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Notes / thesis…"
            className="w-full bg-terminal-bg border border-terminal-border rounded px-2 py-1 font-mono text-xs text-terminal-text placeholder:text-terminal-faint/30 focus:outline-none focus:border-terminal-accent" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1 font-mono text-2xs text-terminal-faint border border-terminal-border rounded">Cancel</button>
            <button onClick={save} disabled={!form.symbol.trim() || !form.entryPrice} className="px-3 py-1 font-mono text-2xs text-terminal-bg bg-terminal-accent rounded disabled:opacity-40">Open</button>
          </div>
        </div>
      )}

      {/* Open positions */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {openPositions.length === 0 && !showAdd && (
          <div className="p-6 text-center font-mono text-xs text-terminal-faint/50">No open positions</div>
        )}

        {openPositions.map((pos) => {
          const live = tickers[pos.symbol]?.price ?? pos.entryPrice
          const unrealizedPnl = pnl(pos, live)
          const unrealizedPct = pnlPct(pos, live)
          const rrVal = rr(pos)
          const atStop   = pos.stopLoss   && (pos.direction === 'LONG' ? live <= pos.stopLoss   : live >= pos.stopLoss)
          const atTarget = pos.takeProfit && (pos.direction === 'LONG' ? live >= pos.takeProfit  : live <= pos.takeProfit)

          return (
            <div key={pos.id} className={`border-b border-terminal-border/30 px-3 py-2.5 hover:bg-terminal-panel/30 transition-colors ${
              atStop ? 'border-l-2 border-l-terminal-down' : atTarget ? 'border-l-2 border-l-terminal-up' : ''
            }`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-2xs font-bold px-1.5 py-0.5 rounded ${
                    pos.direction === 'LONG' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                  }`}>
                    {pos.direction}
                  </span>
                  <span className="font-mono text-xs font-bold text-terminal-text">{pos.displayName}</span>
                  <span className="font-mono text-2xs text-terminal-faint">{pos.symbol}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const closePrice = live
                      closePosition(pos.id, closePrice)
                    }}
                    className="font-mono text-2xs text-terminal-faint hover:text-terminal-accent border border-terminal-border/40 px-1.5 py-0.5 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => removePosition(pos.id)}
                    className="font-mono text-2xs text-terminal-faint/40 hover:text-terminal-down"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">Entry</div>
                  <div className="font-mono text-xs text-terminal-dim">{pos.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">Live</div>
                  <div className="font-mono text-xs text-terminal-text">{live.toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                </div>
                <div>
                  <div className="font-mono text-2xs text-terminal-faint">Size</div>
                  <div className="font-mono text-xs text-terminal-dim">{pos.size}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className={`font-mono text-xs font-bold ${unrealizedPnl >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                  {unrealizedPnl >= 0 ? '+' : ''}${unrealizedPnl.toFixed(2)} ({unrealizedPct >= 0 ? '+' : ''}{unrealizedPct.toFixed(2)}%)
                </div>
                <div className="flex items-center gap-2">
                  {rrVal != null && (
                    <span className="font-mono text-2xs text-terminal-faint">RR {rrVal.toFixed(1)}:1</span>
                  )}
                  {atStop   && <span className="font-mono text-2xs text-terminal-down animate-pulse">⚠ AT STOP</span>}
                  {atTarget && <span className="font-mono text-2xs text-terminal-up animate-pulse">🎯 AT TARGET</span>}
                </div>
              </div>

              {(pos.stopLoss || pos.takeProfit) && (
                <div className="flex gap-3 mt-0.5">
                  {pos.stopLoss   && <span className="font-mono text-2xs text-terminal-down">SL: {pos.stopLoss.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>}
                  {pos.takeProfit && <span className="font-mono text-2xs text-terminal-up">TP: {pos.takeProfit.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>}
                </div>
              )}
              {pos.note && (
                <div className="font-mono text-2xs text-terminal-faint/70 mt-0.5 italic">{pos.note}</div>
              )}
            </div>
          )
        })}

        {/* Closed positions toggle */}
        {closedPositions.length > 0 && (
          <div>
            <button
              onClick={() => setShowClosed(!showClosed)}
              className="w-full px-3 py-2 text-left font-mono text-2xs text-terminal-faint hover:text-terminal-dim border-t border-terminal-border/30"
            >
              {showClosed ? '▼' : '▶'} Closed positions ({closedPositions.length})
            </button>
            {showClosed && closedPositions.map((pos) => {
              const closedPnl = pos.closePrice ? pnl(pos, pos.closePrice) : 0
              return (
                <div key={pos.id} className="border-b border-terminal-border/20 px-3 py-2 opacity-60 hover:opacity-80 transition-opacity">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-2xs font-bold px-1.5 py-0.5 rounded ${pos.direction === 'LONG' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>{pos.direction}</span>
                      <span className="font-mono text-xs text-terminal-dim">{pos.displayName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs font-bold ${closedPnl >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                        {closedPnl >= 0 ? '+' : ''}${closedPnl.toFixed(2)}
                      </span>
                      <button onClick={() => removePosition(pos.id)} className="font-mono text-2xs text-terminal-faint/30 hover:text-terminal-down">✕</button>
                    </div>
                  </div>
                  <div className="font-mono text-2xs text-terminal-faint">
                    Entry {pos.entryPrice} → Close {pos.closePrice ?? '?'} · {new Date(pos.closedAt!).toLocaleDateString()}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
