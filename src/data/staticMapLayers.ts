import type { MapMarker, TradeRoute } from '../types'

// ─── Trade Routes (GeoJSON polylines represented as coordinate arrays) ────────

export const TRADE_ROUTES: TradeRoute[] = [
  {
    id: 'trans-pacific',
    name: 'Trans-Pacific Route',
    coordinates: [[34.052, -118.243], [21.307, -157.858], [35.689, 139.692]],
    volume: '~60,000 vessels/year',
    risk: 'low',
  },
  {
    id: 'trans-atlantic',
    name: 'Trans-Atlantic Route',
    coordinates: [[51.508, -0.128], [40.712, -74.006]],
    volume: '~45,000 vessels/year',
    risk: 'low',
  },
  {
    id: 'suez-canal-route',
    name: 'Europe–Asia via Suez',
    coordinates: [[51.508, -0.128], [36.897, 11.114], [30.006, 32.549], [12.584, 43.389], [1.352, 103.820]],
    volume: '~50,000 vessels/year',
    risk: 'critical',
  },
  {
    id: 'cape-of-good-hope',
    name: 'Cape of Good Hope Route',
    coordinates: [[51.508, -0.128], [0.0, 10.0], [-34.357, 18.473], [1.352, 103.820]],
    volume: '~30,000 vessels/year (diverted from Suez)',
    risk: 'medium',
  },
  {
    id: 'malacca-south-china',
    name: 'Malacca to East Asia',
    coordinates: [[2.197, 102.250], [22.302, 114.172], [35.689, 139.692]],
    volume: '~84,000 vessels/year',
    risk: 'high',
  },
  {
    id: 'us-gulf-atlantic',
    name: 'US Gulf to Atlantic',
    coordinates: [[29.951, -90.071], [25.774, -80.194], [51.508, -0.128]],
    volume: '~20,000 tankers/year',
    risk: 'low',
  },
  {
    id: 'arctic-route',
    name: 'Northern Sea Route (Arctic)',
    coordinates: [[59.913, 10.751], [70.0, 50.0], [72.0, 110.0], [64.539, 40.519], [69.649, 18.957]],
    volume: 'Seasonal — increasing post-ice melt',
    risk: 'medium',
  },
  {
    id: 'persian-gulf-india',
    name: 'Persian Gulf to India',
    coordinates: [[26.565, 56.260], [12.584, 43.389], [12.971, 77.594]],
    volume: '~17Mb/d oil',
    risk: 'high',
  },
  {
    id: 'west-africa-europe',
    name: 'West Africa to Europe',
    coordinates: [[6.524, 3.379], [0.0, 10.0], [36.897, 11.114], [51.508, -0.128]],
    volume: 'LNG + oil',
    risk: 'medium',
  },
]

// ─── Pipeline Markers ─────────────────────────────────────────────────────────

export const PIPELINE_MARKERS: MapMarker[] = [
  { id: 'nord-stream', lat: 55.0, lon: 13.5, type: 'pipelines', label: 'Nord Stream (disabled)', detail: 'Sabotaged 2022 — European gas supply disrupted', severity: 'critical' },
  { id: 'transarabian', lat: 26.0, lon: 40.0, type: 'pipelines', label: 'Trans-Arabian Pipeline', detail: 'Saudi Arabia to Mediterranean — 1,200km', severity: 'medium' },
  { id: 'tapi', lat: 37.0, lon: 62.0, type: 'pipelines', label: 'TAPI Pipeline', detail: 'Turkmenistan-Afghanistan-Pakistan-India', severity: 'high' },
  { id: 'baku-tbilisi', lat: 41.0, lon: 45.0, type: 'pipelines', label: 'BTC Pipeline', detail: 'Baku-Tbilisi-Ceyhan — 1 Mb/d Caspian oil', severity: 'medium' },
  { id: 'east-siberia', lat: 55.0, lon: 115.0, type: 'pipelines', label: 'ESPO Pipeline', detail: 'East Siberia–Pacific Ocean — Russia to China', severity: 'medium' },
  { id: 'igat-gas', lat: 32.0, lon: 52.0, type: 'pipelines', label: 'IGAT Pipeline (Iran)', detail: 'Iran gas to Turkey/Europe — sanctions at risk', severity: 'high' },
  { id: 'yamal', lat: 58.0, lon: 65.0, type: 'pipelines', label: 'Yamal–Europe Pipeline', detail: 'Siberian gas to Europe via Belarus', severity: 'high' },
]

// ─── GCC / Sovereign Wealth Markers ──────────────────────────────────────────

export const GCC_MARKERS: MapMarker[] = [
  { id: 'pif', lat: 24.688, lon: 46.685, type: 'gcc', label: 'PIF (Saudi Arabia)', detail: 'Saudi Public Investment Fund — $700B AUM', severity: 'low' },
  { id: 'adia', lat: 24.466, lon: 54.367, type: 'gcc', label: 'ADIA (Abu Dhabi)', detail: 'Abu Dhabi Investment Authority — $700B AUM', severity: 'low' },
  { id: 'qia', lat: 25.286, lon: 51.533, type: 'gcc', label: 'QIA (Qatar)', detail: 'Qatar Investment Authority — $450B AUM', severity: 'low' },
  { id: 'mubadala', lat: 24.466, lon: 54.367, type: 'gcc', label: 'Mubadala (UAE)', detail: 'Mubadala Investment Company — $300B AUM', severity: 'low' },
  { id: 'dia', lat: 25.204, lon: 55.274, type: 'gcc', label: 'DIA (Dubai)', detail: 'Dubai Investment Authority — $300B AUM', severity: 'low' },
  { id: 'kwia', lat: 29.375, lon: 47.978, type: 'gcc', label: 'KIA (Kuwait)', detail: 'Kuwait Investment Authority — $769B AUM', severity: 'low' },
]

// ─── Cyber Threat Markers (static intelligence) ───────────────────────────────

export const CYBER_MARKERS: MapMarker[] = [
  { id: 'cyber-ru', lat: 55.751, lon: 37.617, type: 'cyber', label: 'APT28/Fancy Bear', detail: 'Russian state-sponsored — NATO targeting', severity: 'critical' },
  { id: 'cyber-cn', lat: 39.918, lon: 116.390, type: 'cyber', label: 'APT41 (China)', detail: 'PLA-linked espionage + financial crime', severity: 'critical' },
  { id: 'cyber-kp', lat: 39.039, lon: 125.762, type: 'cyber', label: 'Lazarus Group (DPRK)', detail: 'Crypto theft — $1B+ annually', severity: 'high' },
  { id: 'cyber-ir', lat: 35.689, lon: 51.389, type: 'cyber', label: 'APT33 (Iran)', detail: 'Energy sector targeting — critical infra', severity: 'high' },
  { id: 'cyber-sandworm', lat: 56.0, lon: 35.0, type: 'cyber', label: 'Sandworm (Russia)', detail: 'Power grid attacks — Ukraine/EU', severity: 'critical' },
]

// ─── Financial Centers ────────────────────────────────────────────────────────

export const FINANCIAL_MARKERS: MapMarker[] = [
  { id: 'fin-ny',     lat: 40.707,  lon: -74.011, type: 'financial', label: 'New York',      detail: 'Global financial capital — NYSE/NASDAQ' },
  { id: 'fin-london', lat: 51.514,  lon: -0.090,  type: 'financial', label: 'London',         detail: 'Forex center — 37% of global FX volume' },
  { id: 'fin-hk',     lat: 22.280,  lon: 114.158, type: 'financial', label: 'Hong Kong',      detail: 'Asia financial gateway — HKEX' },
  { id: 'fin-sing',   lat: 1.352,   lon: 103.820, type: 'financial', label: 'Singapore',      detail: 'ASEAN financial hub — SGX' },
  { id: 'fin-tokyo',  lat: 35.681,  lon: 139.767, type: 'financial', label: 'Tokyo',          detail: 'Asia-Pacific trading — TSE/BOJ' },
  { id: 'fin-zurich', lat: 47.376,  lon: 8.541,   type: 'financial', label: 'Zurich',         detail: 'Private banking capital — SIX' },
  { id: 'fin-frank',  lat: 50.115,  lon: 8.679,   type: 'financial', label: 'Frankfurt',      detail: 'ECB + Deutsche Börse' },
  { id: 'fin-dubai',  lat: 25.204,  lon: 55.274,  type: 'financial', label: 'Dubai (DIFC)',   detail: 'MENA financial gateway — DIFC' },
  { id: 'fin-shangh', lat: 31.231,  lon: 121.473, type: 'financial', label: 'Shanghai',       detail: 'China onshore capital market' },
  { id: 'fin-mumbai', lat: 18.935,  lon: 72.836,  type: 'financial', label: 'Mumbai',         detail: 'India financial center — BSE/NSE' },
]
