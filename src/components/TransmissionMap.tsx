// NEXUS Rate Transmission Map — Section 6
// Shows risk transmission chains with live market data and directional arrows
// Chains: BOJ→USDJPY→Carry→ES/GOLD | Fed→US10Y→Mortgage→Housing | ECB→EURUSD→EUR crosses
// Regime-conditional signal interpretation per NEXUS framework

import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'

type NodeId =
  | 'fed' | 'boj' | 'ecb' | 'us10y' | 'us2y' | 'jp10y' | 'de10y'
  | 'usdjpy' | 'eurusd' | 'gbpusd' | 'audjpy' | 'eurjpy'
  | 'spx' | 'nq' | 'n225' | 'vix' | 'gold' | 'oil' | 'copper' | 'btc'
  | 'us_spread' | 'jp_carry' | 'em_fx'

interface Node {
  id: NodeId
  label: string
  symbol: string
  unit?: string
  category: 'cb' | 'yield' | 'fx' | 'equity' | 'commodity' | 'crypto' | 'spread'
}

interface Chain {
  name: string
  nodes: NodeId[]
  rule: string
  active: boolean
}

const NODES: Node[] = [
  // Central Banks (static)
  { id: 'fed',      label: 'Fed Funds',  symbol: '_fed',     category: 'cb'        },
  { id: 'boj',      label: 'BoJ Rate',   symbol: '_boj',     category: 'cb'        },
  { id: 'ecb',      label: 'ECB Rate',   symbol: '_ecb',     category: 'cb'        },
  // Yields
  { id: 'us10y',    label: 'US 10Y',     symbol: '^TNX',     unit: '%', category: 'yield' },
  { id: 'us2y',     label: 'US 3M (2Y)', symbol: '^IRX',     unit: '%', category: 'yield' },
  { id: 'jp10y',    label: 'JP 10Y',     symbol: '^JN10Y',   unit: '%', category: 'yield' },
  { id: 'us_spread',label: 'US-JP Spd',  symbol: '_spread',  unit: 'bp', category: 'spread'},
  { id: 'jp_carry', label: 'Carry Spd',  symbol: '_carry',   unit: 'bp', category: 'spread'},
  // FX
  { id: 'usdjpy',   label: 'USD/JPY',    symbol: 'USDJPY=X', category: 'fx'        },
  { id: 'eurusd',   label: 'EUR/USD',    symbol: 'EURUSD=X', category: 'fx'        },
  { id: 'gbpusd',   label: 'GBP/USD',    symbol: 'GBPUSD=X', category: 'fx'        },
  { id: 'audjpy',   label: 'AUD/JPY',    symbol: 'AUDJPY=X', category: 'fx'        },
  { id: 'eurjpy',   label: 'EUR/JPY',    symbol: 'EURJPY=X', category: 'fx'        },
  { id: 'em_fx',    label: 'EM FX Idx',  symbol: '_emfx',    category: 'spread'    },
  // Equity
  { id: 'spx',      label: 'S&P 500',    symbol: '^GSPC',    category: 'equity'    },
  { id: 'nq',       label: 'Nasdaq',     symbol: '^IXIC',    category: 'equity'    },
  { id: 'n225',     label: 'Nikkei',     symbol: '^N225',    category: 'equity'    },
  { id: 'vix',      label: 'VIX',        symbol: '^VIX',     category: 'equity'    },
  // Commodities
  { id: 'gold',     label: 'Gold',       symbol: 'GC=F',     unit: '$', category: 'commodity' },
  { id: 'oil',      label: 'WTI',        symbol: 'CL=F',     unit: '$', category: 'commodity' },
  { id: 'copper',   label: 'Copper',     symbol: 'HG=F',     unit: '$', category: 'commodity' },
  // Crypto
  { id: 'btc',      label: 'Bitcoin',    symbol: 'BTCUSDT',  unit: '$', category: 'crypto'    },
]

const CATEGORY_COLOR: Record<Node['category'], string> = {
  cb:        '#6366F1',
  yield:     '#3B82F6',
  fx:        '#10B981',
  equity:    '#F97316',
  commodity: '#F59E0B',
  crypto:    '#8B5CF6',
  spread:    '#9CA3AF',
}

// Transmission chains (rule-based)
const CHAINS: Chain[] = [
  {
    name: 'JPY Carry Trade',
    nodes: ['boj', 'jp10y', 'us_spread', 'usdjpy', 'jp_carry', 'spx', 'gold'],
    rule: 'BoJ hikes → JP10Y ↑ → US-JP spread compresses → USDJPY falls → carry unwind → SPX sells off, Gold bid',
    active: true,
  },
  {
    name: 'Fed Tightening',
    nodes: ['fed', 'us10y', 'us2y', 'usdjpy', 'eurusd', 'vix', 'spx'],
    rule: 'Fed hikes → US yields ↑ → USD strengthens vs majors → VIX spikes if too fast → SPX pressure',
    active: true,
  },
  {
    name: 'ECB-EUR Transmission',
    nodes: ['ecb', 'us10y', 'eurusd', 'eurjpy', 'gbpusd', 'gold'],
    rule: 'ECB diverges from Fed → EUR/USD reacts → crosses reprice → safe havens bid if risk-off',
    active: true,
  },
  {
    name: 'Risk-Off Flight',
    nodes: ['vix', 'usdjpy', 'gold', 'oil', 'btc', 'em_fx'],
    rule: 'VIX spike → JPY/CHF safe haven bid → Gold up → Oil and BTC risk-off, EM FX weakens',
    active: true,
  },
  {
    name: 'Copper-AUD Cycle',
    nodes: ['copper', 'audjpy', 'n225', 'spx', 'btc'],
    rule: 'Copper (global growth proxy) → AUD/JPY carries → Nikkei, SPX follow → BTC correlates in risk-on',
    active: true,
  },
]

function arrowDir(chg: number): string {
  if (chg > 0.5)  return '↑'
  if (chg > 0.1)  return '↗'
  if (chg < -0.5) return '↓'
  if (chg < -0.1) return '↘'
  return '→'
}

export function TransmissionMap() {
  const tickers = useStore((s) => s.tickers)
  const regime  = useStore((s) => s.regime)

  // Static CB rates (March 2026)
  const CB_RATES: Record<string, { rate: number; label: string }> = {
    '_fed': { rate: 4.375, label: '4.25–4.50%' },
    '_boj': { rate: 0.50,  label: '0.50%'       },
    '_ecb': { rate: 2.65,  label: '2.65%'        },
  }

  function getNodeData(node: Node): { price: number; change: number; label: string } | null {
    if (node.symbol.startsWith('_')) {
      if (node.id === '_spread' || node.id === 'us_spread') {
        const us10y = tickers['^TNX']?.price
        const jp10y = tickers['^JN10Y']?.price
        if (us10y && jp10y) return { price: (us10y - jp10y) * 100, change: 0, label: `${((us10y - jp10y) * 100).toFixed(0)}bp` }
        return null
      }
      if (node.id === 'jp_carry') {
        const us10y = tickers['^TNX']?.price
        const jp10y = tickers['^JN10Y']?.price
        if (us10y && jp10y) {
          const carry = (us10y - jp10y) * 100
          return { price: carry, change: 0, label: carry > 200 ? 'Active carry (>200bp)' : 'Narrow carry' }
        }
        return null
      }
      if (node.id === 'em_fx') {
        // Average EM FX stress: avg % chg of USDMXN, USDZAR, USDTRY, USDBRL (all positive = USD strength)
        const em = ['USDMXN=X', 'USDZAR=X', 'USDTRY=X', 'USDBRL=X']
        const changes = em.map((s) => tickers[s]?.changePct24h ?? 0)
        const avg = changes.reduce((a, b) => a + b, 0) / changes.length
        return { price: avg, change: avg, label: `${avg >= 0 ? '+' : ''}${avg.toFixed(1)}%` }
      }
      const cb = CB_RATES[node.symbol]
      if (cb) return { price: cb.rate, change: 0, label: cb.label }
      return null
    }

    const t = tickers[node.symbol]
    if (!t) return null
    let label: string
    if (node.unit === '%') label = `${t.price.toFixed(2)}%`
    else if (node.unit === 'bp') label = `${(t.price * 100).toFixed(0)}bp`
    else if (node.unit === '$') label = `$${t.price >= 1000 ? t.price.toFixed(0) : t.price.toFixed(2)}`
    else label = fmt(t.price)
    return { price: t.price, change: t.changePct24h, label }
  }

  const [selectedChain, setSelectedChain] = useState<number>(0)
  const chain = CHAINS[selectedChain]
  const chainNodes = chain.nodes.map((id) => NODES.find((n) => n.id === id)!).filter(Boolean)

  // Regime-driven active chain highlight
  const regimeChainHint = regime.regime === 'risk-off' || regime.regime === 'crisis'
    ? 'Risk-Off Flight'
    : regime.regime === 'risk-on'
    ? 'Copper-AUD Cycle'
    : 'JPY Carry Trade'

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Risk Transmission Map
      </div>

      {/* Regime hint */}
      <div className="font-mono text-2xs bg-terminal-panel rounded px-2 py-1 border border-terminal-border/30">
        <span className="text-terminal-accent">Active regime [{regime.regime}] → </span>
        <span className="text-terminal-dim">Watch: {regimeChainHint}</span>
      </div>

      {/* Chain selector */}
      <div className="flex flex-wrap gap-1">
        {CHAINS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSelectedChain(i)}
            className={`px-1.5 py-0.5 font-mono text-2xs rounded ${
              i === selectedChain ? 'bg-terminal-accent text-terminal-bg' : 'bg-terminal-panel text-terminal-faint hover:text-terminal-dim'
            } ${c.name === regimeChainHint ? 'ring-1 ring-terminal-accent/40' : ''}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Chain visualization */}
      <div className="flex flex-col gap-1">
        {chainNodes.map((node, i) => {
          const data = getNodeData(node)
          const isLast = i === chainNodes.length - 1
          const catColor = CATEGORY_COLOR[node.category]

          return (
            <div key={node.id}>
              <div className="flex items-center gap-2 bg-terminal-panel rounded px-3 py-2 border border-terminal-border/40">
                <div
                  className="w-1.5 h-full rounded self-stretch"
                  style={{ backgroundColor: catColor, opacity: 0.7, minHeight: '20px' }}
                />
                <div className="flex-1">
                  <div className="font-mono text-xs text-terminal-text">{node.label}</div>
                  <div className="font-mono text-2xs text-terminal-faint/60">{node.category.toUpperCase()}</div>
                </div>
                {data ? (
                  <div className="text-right">
                    <div className="font-mono text-xs text-terminal-text">{data.label}</div>
                    {data.change !== 0 && (
                      <div className={`font-mono text-2xs font-bold ${data.change > 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                        {arrowDir(data.change)} {Math.abs(data.change).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="font-mono text-2xs text-terminal-faint/40">—</span>
                )}
              </div>
              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <span className="font-mono text-terminal-accent text-xs">↓</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Chain rule */}
      <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <div className="font-mono text-2xs text-terminal-accent mb-1">NEXUS Transmission Rule</div>
        <div className="font-mono text-2xs text-terminal-dim leading-relaxed">{chain.rule}</div>
      </div>

      {/* All nodes overview */}
      <div>
        <div className="font-mono text-2xs text-terminal-faint mb-1">All Nodes (Live)</div>
        <div className="grid grid-cols-2 gap-1">
          {NODES.filter((n) => !n.id.startsWith('_') && !['fed', 'boj', 'ecb', 'us_spread', 'jp_carry', 'em_fx'].includes(n.id)).map((node) => {
            const data = getNodeData(node)
            const catColor = CATEGORY_COLOR[node.category]
            return (
              <div key={node.id} className="flex items-center gap-1 bg-terminal-panel/50 rounded px-1.5 py-0.5">
                <div className="w-1 h-3 rounded" style={{ backgroundColor: catColor, opacity: 0.7 }} />
                <span className="font-mono text-2xs text-terminal-faint flex-1 truncate">{node.label}</span>
                <span className={`font-mono text-2xs ${!data ? 'text-terminal-faint/30' : data.change > 0 ? 'text-terminal-up' : data.change < 0 ? 'text-terminal-down' : 'text-terminal-dim'}`}>
                  {data ? data.label : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Need useState for chain selection
import { useState } from 'react'
