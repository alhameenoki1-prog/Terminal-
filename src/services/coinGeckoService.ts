import type { Ticker } from '../types'

const BASE = 'https://api.coingecko.com/api/v3'

const COIN_IDS = [
  'bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple',
  'cardano', 'dogecoin', 'avalanche-2', 'polkadot', 'chainlink',
]

export async function fetchCoinPrices(): Promise<Ticker[]> {
  const ids = COIN_IDS.join(',')
  const url =
    `${BASE}/simple/price?ids=${ids}` +
    `&vs_currencies=usd` +
    `&include_24hr_change=true` +
    `&include_market_cap=true` +
    `&include_24hr_vol=true`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`CoinGecko failed: ${res.status}`)
  const data: Record<string, {
    usd: number
    usd_24h_change: number
    usd_market_cap: number
    usd_24h_vol: number
  }> = await res.json()

  return COIN_IDS.map((id) => {
    const d = data[id]
    if (!d) return null
    return {
      symbol:      coinIdToSymbol(id),
      name:        coinIdToName(id),
      price:       d.usd,
      change24h:   (d.usd * d.usd_24h_change) / 100,
      changePct24h: d.usd_24h_change,
      volume24h:   d.usd_24h_vol,
      marketCap:   d.usd_market_cap,
      type:        'crypto',
    } satisfies Ticker
  }).filter(Boolean) as Ticker[]
}

const ID_SYMBOL_MAP: Record<string, string> = {
  bitcoin:       'BTCUSDT',
  ethereum:      'ETHUSDT',
  solana:        'SOLUSDT',
  binancecoin:   'BNBUSDT',
  ripple:        'XRPUSDT',
  cardano:       'ADAUSDT',
  dogecoin:      'DOGEUSDT',
  'avalanche-2': 'AVAXUSDT',
  polkadot:      'DOTUSDT',
  chainlink:     'LINKUSDT',
}
const ID_NAME_MAP: Record<string, string> = {
  bitcoin:       'Bitcoin',
  ethereum:      'Ethereum',
  solana:        'Solana',
  binancecoin:   'BNB',
  ripple:        'XRP',
  cardano:       'Cardano',
  dogecoin:      'Dogecoin',
  'avalanche-2': 'Avalanche',
  polkadot:      'Polkadot',
  chainlink:     'Chainlink',
}
function coinIdToSymbol(id: string) { return ID_SYMBOL_MAP[id] ?? id.toUpperCase() }
function coinIdToName(id: string)   { return ID_NAME_MAP[id]   ?? id }
