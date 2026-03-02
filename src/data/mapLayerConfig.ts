import type { MapLayerType } from '../types'

export const LAYER_CONFIG: Record<MapLayerType, { label: string; color: string; icon: string; description: string }> = {
  exchanges:    { label: 'Exchanges',      color: '#3B82F6', icon: '📈', description: '92 global stock exchanges' },
  financial:    { label: 'Financial Hubs', color: '#6366F1', icon: '💰', description: 'Major financial centers' },
  centralbanks: { label: 'Central Banks',  color: '#10B981', icon: '🏦', description: '50+ central banks with rates' },
  commodities:  { label: 'Commodities',    color: '#F59E0B', icon: '📦', description: 'Oil fields, mines, agri hubs' },
  gcc:          { label: 'GCC/SWF',        color: '#D97706', icon: '🌐', description: 'GCC sovereign wealth flows' },
  traderoutes:  { label: 'Trade Routes',   color: '#0EA5E9', icon: '🚢', description: '19 major shipping routes' },
  cables:       { label: 'Data Cables',    color: '#8B5CF6', icon: '🔌', description: 'Undersea fiber cables' },
  pipelines:    { label: 'Pipelines',      color: '#78716C', icon: '🛢', description: 'Oil & gas pipelines' },
  outages:      { label: 'Net Outages',    color: '#EC4899', icon: '📡', description: 'Internet disruptions live' },
  weather:      { label: 'Weather',        color: '#06B6D4', icon: '⛈', description: 'Severe weather alerts' },
  economic:     { label: 'Economic Hubs',  color: '#84CC16', icon: '💹', description: 'Economic indicator centers' },
  waterways:    { label: 'Chokepoints',    color: '#F97316', icon: '⚓', description: '12 strategic waterways' },
  natural:      { label: 'Natural Events', color: '#EF4444', icon: '🌋', description: 'Live earthquakes & fires' },
  cyber:        { label: 'Cyber Threats',  color: '#A855F7', icon: '🛡', description: 'Threat intelligence' },
  daynight:     { label: 'Day/Night',      color: '#64748B', icon: '🌓', description: 'Sun terminator overlay' },
  // Legacy
  oil:          { label: 'Oil/Energy',     color: '#F59E0B', icon: '🛢️', description: 'Oil hotspots' },
  conflicts:    { label: 'Conflicts',      color: '#EF4444', icon: '⚠️', description: 'Active conflict zones' },
  chokepoints:  { label: 'Chokepoints',    color: '#F97316', icon: '⚓', description: 'Strategic waterways' },
}

// Groups for the layer toggle UI
export const LAYER_GROUPS: { label: string; layers: MapLayerType[] }[] = [
  { label: 'Markets', layers: ['exchanges', 'financial', 'centralbanks', 'economic'] },
  { label: 'Energy',  layers: ['commodities', 'gcc', 'pipelines', 'oil'] },
  { label: 'Infra',   layers: ['traderoutes', 'cables', 'waterways', 'chokepoints'] },
  { label: 'Risk',    layers: ['conflicts', 'natural', 'outages', 'weather', 'cyber', 'daynight'] },
]
