// NEXUS Crypto Derivatives Service
// Sources:
//   - Binance: futures funding rates, open interest (perpetuals)
//   - CoinGlass-compatible: aggregated funding rates
// All public endpoints — no API key required

export interface FundingRateRow {
  symbol: string
  name: string
  fundingRate: number      // current (annualised %)
  nextFundingTime: number  // Unix ms
  openInterest: number     // in USD
  oiChange24h: number      // % change
  signal: string
  signalColor: string
}

export interface BasisRow {
  symbol: string
  spotPrice: number
  futuresPrice: number
  basis: number       // futures - spot
  basisPct: number    // % premium
  annualisedBasis: number
}

const PERP_SYMBOLS = [
  { symbol: 'BTCUSDT',  name: 'Bitcoin'  },
  { symbol: 'ETHUSDT',  name: 'Ethereum' },
  { symbol: 'SOLUSDT',  name: 'Solana'   },
  { symbol: 'BNBUSDT',  name: 'BNB'      },
  { symbol: 'XRPUSDT',  name: 'XRP'      },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
]

// Interpret funding rate
function interpretFunding(annualisedPct: number): { signal: string; color: string } {
  if (annualisedPct > 50)  return { signal: 'EXTREME LONGS — overheating, fade risk', color: '#EF4444' }
  if (annualisedPct > 20)  return { signal: 'HIGH LONGS — cautious, crowded trade',    color: '#F97316' }
  if (annualisedPct > 5)   return { signal: 'Mild longs — normal carry',               color: '#F59E0B' }
  if (annualisedPct > -5)  return { signal: 'Neutral — balanced positioning',           color: '#9CA3AF' }
  if (annualisedPct > -20) return { signal: 'Mild shorts — bearish lean',              color: '#60A5FA' }
  return { signal: 'EXTREME SHORTS — fear/oversold, squeeze risk', color: '#10B981' }
}

export async function fetchFundingRates(): Promise<FundingRateRow[]> {
  const results: FundingRateRow[] = []
  try {
    // Binance USDT-M perpetual funding rate endpoint
    const res = await fetch(
      '/api/binance/fapi/v1/premiumIndex',
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) return results
    const data: {
      symbol: string
      lastFundingRate: string
      nextFundingTime: number
      markPrice: string
    }[] = await res.json()

    // Fetch open interest in parallel
    const oiMap: Record<string, number> = {}
    try {
      const oiRes = await fetch('/api/binance/fapi/v1/openInterest?symbol=BTCUSDT')
      // We'll fetch OI per-symbol below
    } catch { /* ignore */ }

    for (const sym of PERP_SYMBOLS) {
      const row = data.find((d) => d.symbol === sym.symbol)
      if (!row) continue

      const fundingRate8h = parseFloat(row.lastFundingRate)
      const annualised    = fundingRate8h * 3 * 365 * 100  // 3 funding periods/day × 365

      // Fetch OI for this symbol
      let oi = 0
      try {
        const oiRes = await fetch(`/api/binance/fapi/v1/openInterest?symbol=${sym.symbol}`, { signal: AbortSignal.timeout(3000) })
        if (oiRes.ok) {
          const oiData: { openInterest: string; symbol: string } = await oiRes.json()
          oi = parseFloat(oiData.openInterest) * parseFloat(row.markPrice)
        }
      } catch { /* ignore */ }

      const { signal, color } = interpretFunding(annualised)

      results.push({
        symbol:          sym.symbol,
        name:            sym.name,
        fundingRate:     annualised,
        nextFundingTime: row.nextFundingTime,
        openInterest:    oi,
        oiChange24h:     0,  // would need historical OI endpoint
        signal,
        signalColor: color,
      })
    }
  } catch {
    // Binance futures unavailable
  }
  return results
}

// Fetch CME-equivalent basis: compare Binance spot vs Binance futures
export async function fetchCryptoBasis(): Promise<BasisRow[]> {
  const results: BasisRow[] = []
  try {
    // Fetch continuous futures and spot for BTC, ETH
    const symbols = ['BTCUSDT', 'ETHUSDT']
    for (const sym of symbols) {
      // Spot price from Binance spot
      const spotRes = await fetch(`/api/binance/api/v3/ticker/price?symbol=${sym}`, { signal: AbortSignal.timeout(4000) })
      // Perp mark price
      const perpRes = await fetch(`/api/binance/fapi/v1/premiumIndex?symbol=${sym}`, { signal: AbortSignal.timeout(4000) })

      if (!spotRes.ok || !perpRes.ok) continue

      const spot: { price: string } = await spotRes.json()
      const perp: { markPrice: string } = await perpRes.json()

      const spotP  = parseFloat(spot.price)
      const perpP  = parseFloat(perp.markPrice)
      const basis  = perpP - spotP
      const basisP = (basis / spotP) * 100

      results.push({
        symbol: sym,
        spotPrice: spotP,
        futuresPrice: perpP,
        basis,
        basisPct:        basisP,
        annualisedBasis: basisP * 365 / 1,  // annualised daily (rough)
      })
    }
  } catch { /* ignore */ }
  return results
}

// Fetch Binance on-chain-adjacent: long/short ratio
export interface LongShortRatio {
  symbol: string
  longAccount: number
  shortAccount: number
  longRatio: number
  shortRatio: number
  timestamp: number
}

export async function fetchLongShortRatio(symbol = 'BTCUSDT'): Promise<LongShortRatio[]> {
  try {
    const res = await fetch(
      `/api/binance/fapi/v1/globalLongShortAccountRatio?symbol=${symbol}&period=5m&limit=12`,
      { signal: AbortSignal.timeout(4000) }
    )
    if (!res.ok) return []
    const data: { longAccount: string; shortAccount: string; longShortRatio: string; timestamp: number }[] = await res.json()
    return data.map((d) => ({
      symbol,
      longAccount:  parseFloat(d.longAccount),
      shortAccount: parseFloat(d.shortAccount),
      longRatio:    parseFloat(d.longAccount)    * 100,
      shortRatio:   parseFloat(d.shortAccount)   * 100,
      timestamp:    d.timestamp,
    }))
  } catch {
    return []
  }
}
