import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useStore } from '../store/useStore'
import { MAP_MARKERS } from '../services/mapData'
import type { MapLayerType, MapMarker } from '../types'

// MENA-centered initial view (matching worldmonitor finance URL)
const INITIAL_CENTER: [number, number] = [28.0, 43.82]
const INITIAL_ZOOM = 3.5

const LAYER_CONFIG: Record<MapLayerType, { label: string; color: string; icon: string }> = {
  exchanges:    { label: 'Exchanges',     color: '#3B82F6', icon: '📈' },
  oil:          { label: 'Oil/Energy',    color: '#F59E0B', icon: '🛢️' },
  conflicts:    { label: 'Conflicts',     color: '#EF4444', icon: '⚠️' },
  cables:       { label: 'Data Cables',   color: '#8B5CF6', icon: '🔌' },
  centralbanks: { label: 'Central Banks', color: '#10B981', icon: '🏦' },
  chokepoints:  { label: 'Chokepoints',   color: '#F97316', icon: '⚓' },
}

const SEVERITY_RADIUS: Record<string, number> = {
  critical: 12,
  high:     9,
  medium:   7,
  low:      5,
}

function markerColor(marker: MapMarker): string {
  return LAYER_CONFIG[marker.type]?.color ?? '#9CA3AF'
}

function markerRadius(marker: MapMarker): number {
  return SEVERITY_RADIUS[marker.severity ?? 'low'] ?? 6
}

function SetView() {
  const map = useMap()
  useEffect(() => {
    map.setView(INITIAL_CENTER, INITIAL_ZOOM)
  }, [map])
  return null
}

export function WorldMap() {
  const activeLayers = useStore((s) => s.activeLayers)
  const toggleLayer  = useStore((s) => s.toggleLayer)

  const visibleMarkers = MAP_MARKERS.filter((m) => activeLayers.has(m.type))

  return (
    <div className="flex flex-col h-full bg-terminal-bg border-t border-terminal-border">
      {/* Header + layer toggles */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-surface flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase">
          Global Intelligence Map
        </span>
        <div className="flex items-center gap-1 flex-wrap">
          {(Object.keys(LAYER_CONFIG) as MapLayerType[]).map((layer) => {
            const cfg = LAYER_CONFIG[layer]
            const active = activeLayers.has(layer)
            return (
              <button
                key={layer}
                onClick={() => toggleLayer(layer)}
                className={`
                  flex items-center gap-1 px-2 py-0.5 rounded font-mono text-2xs
                  border transition-all
                  ${active
                    ? 'border-opacity-60 text-terminal-text'
                    : 'border-terminal-border/30 text-terminal-faint opacity-50'}
                `}
                style={active ? { borderColor: cfg.color, color: cfg.color } : {}}
              >
                <span>{cfg.icon}</span>
                <span>{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={INITIAL_CENTER}
          zoom={INITIAL_ZOOM}
          style={{ height: '100%', width: '100%', background: '#050A14' }}
          zoomControl={false}
          attributionControl={false}
        >
          {/* CartoDB Dark Matter tiles — free, no API key */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <SetView />

          {visibleMarkers.map((marker) => {
            const color  = markerColor(marker)
            const radius = markerRadius(marker)
            const isPulsing = marker.severity === 'critical' || marker.severity === 'high'

            return (
              <CircleMarker
                key={marker.id}
                center={[marker.lat, marker.lon]}
                radius={radius}
                pathOptions={{
                  fillColor:   color,
                  fillOpacity: isPulsing ? 0.85 : 0.65,
                  color:       color,
                  weight:      isPulsing ? 2 : 1,
                  opacity:     1,
                }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -radius]}
                  className="terminal-tooltip"
                >
                  <div className="font-mono text-xs">
                    <div className="font-bold text-white">{marker.label}</div>
                    {marker.detail && (
                      <div className="text-gray-400 mt-0.5 max-w-[200px]">{marker.detail}</div>
                    )}
                    {marker.severity && (
                      <div className="mt-0.5" style={{ color }}>
                        {marker.severity.toUpperCase()} severity
                      </div>
                    )}
                  </div>
                </Tooltip>
              </CircleMarker>
            )
          })}
        </MapContainer>

        {/* Attribution overlay */}
        <div className="absolute bottom-1 right-1 z-[1000] font-mono text-2xs text-terminal-faint/60 pointer-events-none">
          © OSM © CARTO
        </div>
      </div>
    </div>
  )
}
