// NEXUS Weekly/Monthly Macro Scorecard
// Compares US vs Japan, US vs EU across key macro indicators
// Uses FRED data (from store) + live Yahoo tickers for market-implied metrics

import { useStore } from '../store/useStore'
import { fmt } from '../utils/format'

interface ScorecardRow {
  indicator: string
  us: string
  jp: string
  eu: string
  uk: string
  signal: string
  signalColor: string
}

// ─── Regime transmission rules ───────────────────────────────────────────────

function rateSignal(us: number, jp: number, eu: number): string {
  const spread = us - jp
  if (spread > 3.5) return 'Carry: LONG USDJPY (wide spread)'
  if (spread > 2.5) return 'Carry: Mild USDJPY long'
  if (spread < 1.0) return 'Carry: USDJPY pressure — spread compressing'
  const useu = us - eu
  if (useu > 2.5) return 'USD strength vs EUR — watch dollar'
  return 'Neutral differential'
}

function yieldCurveSignal(tenY: number, twoY: number): string {
  const spread = tenY - twoY
  if (spread < -0.5) return `Inverted ${spread.toFixed(0)}bp — recession signal`
  if (spread < 0)    return `Near flat ${spread.toFixed(0)}bp — caution`
  if (spread < 0.5)  return `Flat ${spread.toFixed(0)}bp — mixed`
  return `Normal +${spread.toFixed(0)}bp`
}

export function MacroScorecardPanel() {
  const tickers  = useStore((s) => s.tickers)
  const fredData = useStore((s) => s.fredData)

  // Pull live market prices
  const us10y  = tickers['^TNX']?.price   ?? 0
  const us2y   = tickers['^IRX']?.price   ?? 0   // 3M proxy for short end
  const us5y   = tickers['^FVX']?.price   ?? 0
  const us30y  = tickers['^TYX']?.price   ?? 0
  const jp10y  = tickers['^JN10Y']?.price ?? 0
  const usdjpy = tickers['USDJPY=X']?.price ?? 0
  const eurusd = tickers['EURUSD=X']?.price ?? 0
  const gbpusd = tickers['GBPUSD=X']?.price ?? 0
  const spx    = tickers['^GSPC']?.price  ?? 0
  const n225   = tickers['^N225']?.price  ?? 0
  const dax    = tickers['^GDAXI']?.price ?? 0
  const vix    = tickers['^VIX']?.price   ?? 0
  const vvix   = tickers['^VVIX']?.price  ?? 0
  const gold   = tickers['GC=F']?.price   ?? 0
  const wti    = tickers['CL=F']?.price   ?? 0
  const brent  = tickers['BZ=F']?.price   ?? 0
  const copper = tickers['HG=F']?.price   ?? 0

  // Spreads
  const spread5s30s = us30y - us5y
  const spreadUsJp  = us10y - jp10y
  const spreadUsEu  = us10y - (tickers['EURUSD=X']?.changePct24h ?? 0)  // DE10Y not in ticker — use placeholder

  // FRED data extraction
  const fredMap = Object.fromEntries(fredData.map((s) => [s.id, s]))
  const cpiUS  = fredMap['CPIAUCSL']?.latestValue ?? null
  const pceUS  = fredMap['PCEPI']?.latestValue    ?? null
  const gdpUS  = fredMap['GDP']?.latestValue      ?? null
  const unemp  = fredMap['UNRATE']?.latestValue   ?? null

  const pct = (v: number, dec = 1) => `${v >= 0 ? '+' : ''}${v.toFixed(dec)}%`
  const bp  = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(0)}bp`

  // Sector heat (% change 24h)
  const sectors = ['XLF', 'XLE', 'XLK', 'XLV', 'XLI', 'XLB', 'XLU', 'XLY', 'XLP', 'XLC']
  const sectorData = sectors.map((s) => ({
    name: s.replace('XL', ''),
    chg:  tickers[s]?.changePct24h ?? 0,
  })).sort((a, b) => b.chg - a.chg)

  // EM FX stress gauge
  const emFx = [
    { name: 'MXN', sym: 'USDMXN=X', inverse: true },
    { name: 'ZAR', sym: 'USDZAR=X', inverse: true },
    { name: 'TRY', sym: 'USDTRY=X', inverse: true },
    { name: 'BRL', sym: 'USDBRL=X', inverse: true },
  ]
  const emFxRows = emFx.map((e) => ({
    name: e.name,
    chg:  tickers[e.sym]?.changePct24h ?? 0,
    price: tickers[e.sym]?.price ?? 0,
  }))
  const emStress = emFxRows.filter((e) => Math.abs(e.chg) > 1.0).length >= 2

  // Scorecard rows
  const rows: ScorecardRow[] = [
    {
      indicator: 'Policy Rate',
      us: '4.25–4.50%', jp: '0.50%', eu: '2.65%', uk: '4.50%',
      signal: rateSignal(4.375, 0.5, 2.65),
      signalColor: '#10B981',
    },
    {
      indicator: '10Y Yield',
      us: us10y ? `${us10y.toFixed(2)}%` : '—',
      jp: jp10y ? `${jp10y.toFixed(2)}%` : '—',
      eu: '—', uk: '—',
      signal: us10y && jp10y ? `US-JP: ${bp((us10y - jp10y) / 100)} spread` : '—',
      signalColor: '#9CA3AF',
    },
    {
      indicator: '5s30s Slope',
      us: `${bp(spread5s30s / 100)}`,
      jp: '—', eu: '—', uk: '—',
      signal: spread5s30s > 0.5 ? 'Steepening — growth optimism' : spread5s30s < 0 ? 'Inverted — stress' : 'Flat',
      signalColor: spread5s30s > 0 ? '#10B981' : '#EF4444',
    },
    {
      indicator: 'CPI YoY (FRED)',
      us: cpiUS != null ? `${cpiUS.toFixed(1)}%` : '—',
      jp: '3.7%', eu: '2.4%', uk: '2.8%',
      signal: cpiUS && cpiUS > 3 ? 'US inflation elevated — restrictive bias' : cpiUS && cpiUS < 2 ? 'Below target — cuts possible' : 'Near target',
      signalColor: cpiUS && cpiUS > 3 ? '#EF4444' : '#10B981',
    },
    {
      indicator: 'PCE Core (FRED)',
      us: pceUS != null ? `${pceUS.toFixed(1)}%` : '—',
      jp: '—', eu: '—', uk: '—',
      signal: pceUS && pceUS > 2.5 ? 'Fed primary target above 2.5%' : 'Approaching target',
      signalColor: pceUS && pceUS > 2.5 ? '#F59E0B' : '#10B981',
    },
    {
      indicator: 'GDP (FRED)',
      us: gdpUS != null ? `$${(gdpUS / 1000).toFixed(0)}T` : '—',
      jp: '$4.2T', eu: '$15.8T', uk: '$3.1T',
      signal: '—',
      signalColor: '#9CA3AF',
    },
    {
      indicator: 'Unemployment (FRED)',
      us: unemp != null ? `${unemp.toFixed(1)}%` : '—',
      jp: '2.5%', eu: '6.1%', uk: '4.4%',
      signal: unemp && unemp > 5 ? 'Rising — labor slack building' : 'Near NAIRU — tight labor',
      signalColor: unemp && unemp > 5 ? '#EF4444' : '#10B981',
    },
    {
      indicator: 'VIX / VVIX',
      us: vix ? `${vix.toFixed(1)} / ${vvix ? vvix.toFixed(0) : '—'}` : '—',
      jp: '—', eu: '—', uk: '—',
      signal: vix > 25 ? 'Stress: vol regime Risk-Off' : vix > 18 ? 'Transitional' : 'Vol subdued — Risk-On',
      signalColor: vix > 25 ? '#EF4444' : vix > 18 ? '#F59E0B' : '#10B981',
    },
    {
      indicator: 'Commodities',
      us: gold ? `Au $${gold.toFixed(0)}` : '—',
      jp: wti ? `WTI $${wti.toFixed(0)}` : '—',
      eu: brent ? `Brent $${brent.toFixed(0)}` : '—',
      uk: copper ? `Cu $${copper.toFixed(2)}` : '—',
      signal: copper > 0 && gold > 0
        ? copper / gold > 0.008 ? 'Cu/Au ratio high — risk-on' : 'Cu/Au low — risk-off'
        : '—',
      signalColor: '#9CA3AF',
    },
    {
      indicator: 'FX Spot',
      us: usdjpy ? `¥${usdjpy.toFixed(1)}` : '—',
      jp: eurusd ? eurusd.toFixed(4) : '—',
      eu: gbpusd ? gbpusd.toFixed(4) : '—',
      uk: '—',
      signal: usdjpy > 155 ? 'JPY intervention risk zone >155' : usdjpy < 140 ? 'JPY strength — risk-off signal' : 'USDJPY range-bound',
      signalColor: usdjpy > 155 ? '#EF4444' : '#9CA3AF',
    },
  ]

  return (
    <div className="p-3 flex flex-col gap-3">
      <div className="font-mono text-2xs text-terminal-accent tracking-widest uppercase">
        Macro Scorecard — Weekly Cross-Regional
      </div>

      {/* Scorecard Table */}
      <div>
        <div className="grid grid-cols-6 gap-0.5 mb-1 px-1">
          {['Indicator', 'US', 'JP', 'EU', 'UK', 'NEXUS Signal'].map((h) => (
            <span key={h} className="font-mono text-2xs text-terminal-faint/60">{h}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.indicator} className="grid grid-cols-6 gap-0.5 px-1 py-1 border-b border-terminal-border/20 hover:bg-terminal-panel/30">
            <span className="font-mono text-2xs text-terminal-dim truncate">{row.indicator}</span>
            <span className="font-mono text-2xs text-terminal-text truncate">{row.us}</span>
            <span className="font-mono text-2xs text-terminal-faint truncate">{row.jp}</span>
            <span className="font-mono text-2xs text-terminal-faint truncate">{row.eu}</span>
            <span className="font-mono text-2xs text-terminal-faint truncate">{row.uk}</span>
            <span className="font-mono text-2xs truncate" style={{ color: row.signalColor }}>{row.signal}</span>
          </div>
        ))}
      </div>

      {/* Sector Rotation */}
      <div>
        <div className="font-mono text-2xs text-terminal-faint mb-1">Sector Rotation (24h)</div>
        <div className="flex flex-wrap gap-1">
          {sectorData.map((s) => (
            <div
              key={s.name}
              className={`px-2 py-0.5 rounded font-mono text-2xs border ${
                s.chg > 0 ? 'border-green-800/50 bg-green-950/20' : 'border-red-800/50 bg-red-950/20'
              }`}
            >
              <span className="text-terminal-dim">{s.name}</span>
              <span className={`ml-1 font-bold ${s.chg >= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                {s.chg >= 0 ? '+' : ''}{s.chg.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        {sectorData.length > 0 && (
          <div className="font-mono text-2xs text-terminal-faint/60 mt-1">
            Leader: {sectorData[0]?.name} ({pct(sectorData[0]?.chg ?? 0)}) · Laggard: {sectorData[sectorData.length - 1]?.name} ({pct(sectorData[sectorData.length - 1]?.chg ?? 0)})
          </div>
        )}
      </div>

      {/* EM FX Stress */}
      <div>
        <div className="font-mono text-2xs text-terminal-faint mb-1">
          EM FX Stress {emStress && <span className="text-terminal-down font-bold">⚠ ELEVATED</span>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {emFxRows.map((e) => (
            <div key={e.name} className="bg-terminal-panel rounded px-2 py-1 border border-terminal-border/30">
              <div className="font-mono text-2xs text-terminal-faint">{e.name}</div>
              <div className="font-mono text-xs text-terminal-text">{e.price > 0 ? fmt(e.price) : '—'}</div>
              <div className={`font-mono text-2xs ${e.chg <= 0 ? 'text-terminal-up' : 'text-terminal-down'}`}>
                {/* Inverted: USD weaker vs EM = EM strengthening = green */}
                {e.chg >= 0 ? '+' : ''}{e.chg.toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spread Dashboard */}
      <div className="bg-terminal-panel rounded p-2 border border-terminal-border/30">
        <div className="font-mono text-2xs text-terminal-accent mb-2">Key Spreads</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'US 5s30s', value: spread5s30s, format: (v: number) => `${(v * 100).toFixed(0)}bp`, threshold: 0 },
            { label: 'US–JP 10Y', value: spreadUsJp, format: (v: number) => `${(v * 100).toFixed(0)}bp`, threshold: 2.0 },
            { label: 'US 10Y/2Y (3M proxy)', value: us10y - us2y, format: (v: number) => `${(v * 100).toFixed(0)}bp`, threshold: 0 },
            { label: 'US 10Y/5Y', value: us10y - us5y, format: (v: number) => `${(v * 100).toFixed(0)}bp`, threshold: 0 },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="font-mono text-2xs text-terminal-faint">{s.label}</span>
              <span className={`font-mono text-2xs font-bold ${
                s.value > s.threshold ? 'text-terminal-up' : 'text-terminal-down'
              }`}>
                {s.value !== 0 ? s.format(s.value) : '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="font-mono text-2xs text-terminal-faint/40">
        Sources: Yahoo Finance (live) · FRED (6h cache) · Static CB data (Mar 2026)
      </div>
    </div>
  )
}
