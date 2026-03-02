import type { MapMarker } from '../types'

export const MAP_MARKERS: MapMarker[] = [
  // ── Major Stock Exchanges ──────────────────────────────────────────────────
  { id: 'nyse',       lat: 40.707,  lon: -74.011, type: 'exchanges', label: 'NYSE / NASDAQ',     detail: 'New York Stock Exchange' },
  { id: 'lse',        lat: 51.514,  lon: -0.090,  type: 'exchanges', label: 'LSE',               detail: 'London Stock Exchange' },
  { id: 'euronext',   lat: 48.870,  lon: 2.327,   type: 'exchanges', label: 'Euronext Paris',    detail: 'Paris Bourse' },
  { id: 'frankfurt',  lat: 50.115,  lon: 8.679,   type: 'exchanges', label: 'Xetra (DAX)',       detail: 'Frankfurt Stock Exchange' },
  { id: 'tse',        lat: 35.681,  lon: 139.767, type: 'exchanges', label: 'TSE (Nikkei)',      detail: 'Tokyo Stock Exchange' },
  { id: 'hkex',       lat: 22.280,  lon: 114.158, type: 'exchanges', label: 'HKEX',             detail: 'Hong Kong Exchanges' },
  { id: 'sse',        lat: 31.231,  lon: 121.473, type: 'exchanges', label: 'SSE (China)',       detail: 'Shanghai Stock Exchange' },
  { id: 'bse',        lat: 18.935,  lon: 72.836,  type: 'exchanges', label: 'BSE (Sensex)',      detail: 'Bombay Stock Exchange' },
  { id: 'tadawul',    lat: 24.688,  lon: 46.685,  type: 'exchanges', label: 'Tadawul (Aramco)',  detail: 'Saudi Stock Exchange' },
  { id: 'dfm',        lat: 25.204,  lon: 55.274,  type: 'exchanges', label: 'Dubai DFM',        detail: 'Dubai Financial Market' },

  // ── Oil & Commodity Hotspots ───────────────────────────────────────────────
  { id: 'gulfmex',    lat: 25.0,    lon: 52.5,    type: 'oil', label: 'Persian Gulf',    detail: "World's largest oil reserves", severity: 'high' },
  { id: 'ras',        lat: 26.645,  lon: 50.146,  type: 'oil', label: 'Ras Tanura',      detail: 'Saudi Aramco – largest oil terminal', severity: 'high' },
  { id: 'kirkuk',     lat: 35.468,  lon: 44.392,  type: 'oil', label: 'Kirkuk (Iraq)',   detail: 'Major Iraqi oil field', severity: 'medium' },
  { id: 'baku',       lat: 40.409,  lon: 49.867,  type: 'oil', label: 'Baku (Caspian)', detail: 'Azerbaijan energy hub', severity: 'low' },
  { id: 'sabah',      lat: 5.984,   lon: 116.073, type: 'oil', label: 'Sabah (Borneo)',  detail: 'Offshore oil fields', severity: 'low' },

  // ── Strategic Chokepoints ─────────────────────────────────────────────────
  { id: 'suez',       lat: 30.006,  lon: 32.549,  type: 'chokepoints', label: 'Suez Canal',        detail: '12% of global trade', severity: 'critical' },
  { id: 'hormuz',     lat: 26.565,  lon: 56.260,  type: 'chokepoints', label: 'Strait of Hormuz',  detail: '20% of global oil supply', severity: 'critical' },
  { id: 'malacca',    lat: 2.197,   lon: 102.250, type: 'chokepoints', label: 'Strait of Malacca', detail: '25% of global seaborne trade', severity: 'high' },
  { id: 'bab',        lat: 12.584,  lon: 43.389,  type: 'chokepoints', label: 'Bab el-Mandeb',     detail: 'Red Sea gateway – Houthi threat zone', severity: 'critical' },
  { id: 'panama',     lat: 9.080,   lon: -79.682, type: 'chokepoints', label: 'Panama Canal',      detail: '5% of global trade', severity: 'high' },
  { id: 'bosph',      lat: 41.130,  lon: 29.060,  type: 'chokepoints', label: 'Bosphorus',         detail: 'Black Sea oil export route', severity: 'medium' },

  // ── Active Conflict / Risk Zones ──────────────────────────────────────────
  { id: 'ukraine',    lat: 49.0,    lon: 31.0,    type: 'conflicts', label: 'Ukraine War',         detail: 'Grain / energy market disruption', severity: 'critical' },
  { id: 'gaza',       lat: 31.355,  lon: 34.308,  type: 'conflicts', label: 'Gaza / Israel',       detail: 'MENA regional risk', severity: 'critical' },
  { id: 'sudan',      lat: 15.5,    lon: 30.0,    type: 'conflicts', label: 'Sudan Civil War',     detail: 'Humanitarian + gold supply impact', severity: 'high' },
  { id: 'taiwan',     lat: 23.7,    lon: 121.0,   type: 'conflicts', label: 'Taiwan Strait',       detail: 'Chip supply chain risk', severity: 'high' },
  { id: 'sahel',      lat: 13.5,    lon: 2.1,     type: 'conflicts', label: 'Sahel (Niger/Mali)',  detail: 'Political instability', severity: 'medium' },

  // ── Central Banks ─────────────────────────────────────────────────────────
  { id: 'fed',        lat: 38.893,  lon: -77.044, type: 'centralbanks', label: 'Federal Reserve',    detail: 'US monetary policy – 4.25%' },
  { id: 'ecb',        lat: 50.111,  lon: 8.686,   type: 'centralbanks', label: 'ECB Frankfurt',       detail: 'Eurozone rates – 2.50%' },
  { id: 'boe',        lat: 51.514,  lon: -0.089,  type: 'centralbanks', label: 'Bank of England',     detail: 'UK rates – 4.50%' },
  { id: 'boj',        lat: 35.682,  lon: 139.771, type: 'centralbanks', label: 'Bank of Japan',       detail: 'JPY rates – 0.50% (hiking)' },
  { id: 'pboc',       lat: 39.918,  lon: 116.390, type: 'centralbanks', label: 'PBoC Beijing',        detail: 'China rates – 3.10%' },
  { id: 'sama',       lat: 24.691,  lon: 46.684,  type: 'centralbanks', label: 'SAMA (Saudi)',        detail: 'Riyal peg to USD – 6.00%' },

  // ── Undersea Data Cables (key landing points) ────────────────────────────
  { id: 'cable-sing', lat: 1.352,   lon: 103.820, type: 'cables', label: 'Singapore Cable Hub',   detail: 'Asia-Pacific internet nexus' },
  { id: 'cable-egypt',lat: 31.200,  lon: 29.900,  type: 'cables', label: 'Egypt Cable Hub',       detail: 'Europe–Asia cable junction via Suez' },
  { id: 'cable-uk',   lat: 50.817,  lon: -0.372,  type: 'cables', label: 'UK Cable Landings',     detail: 'Transatlantic + European cables' },
  { id: 'cable-mia',  lat: 25.774,  lon: -80.194, type: 'cables', label: 'Miami Cable Hub',       detail: 'Americas internet traffic' },
]
