import { useEffect, useState, Suspense, lazy } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMap } from 'react-leaflet'
import type { Layer } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useStore } from '../store/useStore'
import { MAP_MARKERS } from '../services/mapData'
import { PIPELINE_MARKERS, GCC_MARKERS, CYBER_MARKERS, FINANCIAL_MARKERS } from '../data/staticMapLayers'
import { LAYER_CONFIG, LAYER_GROUPS } from '../data/mapLayerConfig'
import { getCountryByCode, COUNTRY_PROFILES } from '../data/countryProfiles'
import { fetchEarthquakes } from '../services/earthquakeService'
import type { MapLayerType, MapMarker, CountryProfile } from '../types'

const GlobeView = lazy(() => import('./GlobeView'))

const INITIAL_CENTER: [number, number] = [28.0, 43.82]
const INITIAL_ZOOM = 3

const SEVERITY_RADIUS: Record<string, number> = {
  critical: 12, high: 9, medium: 7, low: 5,
}

function markerColor(marker: MapMarker): string {
  return LAYER_CONFIG[marker.type]?.color ?? '#9CA3AF'
}

function markerRadius(marker: MapMarker): number {
  if (marker.magnitude) return Math.min(18, Math.max(4, marker.magnitude * 2.5))
  return SEVERITY_RADIUS[marker.severity ?? 'low'] ?? 6
}

function SetView() {
  const map = useMap()
  useEffect(() => { map.setView(INITIAL_CENTER, INITIAL_ZOOM) }, [map])
  return null
}

function getCountryFill(isoCode: string): string {
  const profile = COUNTRY_PROFILES[isoCode.toUpperCase()]
  if (!profile) return 'rgba(30,40,60,0.3)'
  const score = profile.instabilityScore
  if (score >= 70) return 'rgba(239,68,68,0.35)'
  if (score >= 50) return 'rgba(249,115,22,0.3)'
  if (score >= 30) return 'rgba(234,179,8,0.25)'
  return 'rgba(16,185,129,0.15)'
}

export function WorldMap() {
  const activeLayers       = useStore((s) => s.activeLayers)
  const toggleLayer        = useStore((s) => s.toggleLayer)
  const earthquakes        = useStore((s) => s.earthquakes)
  const setEarthquakes     = useStore((s) => s.setEarthquakes)
  const setSelectedCountry = useStore((s) => s.setSelectedCountry)
  const showGlobe          = useStore((s) => s.showGlobe)
  const setShowGlobe       = useStore((s) => s.setShowGlobe)

  const [worldGeoJson, setWorldGeoJson] = useState<GeoJSON.FeatureCollection | null>(null)
  const [showLayerPanel, setShowLayerPanel] = useState(false)

  // Load world GeoJSON once
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then((r) => r.json())
      .then(setWorldGeoJson)
      .catch(() => {})
  }, [])

  // Fetch earthquakes every 10 min when natural layer is active
  useEffect(() => {
    if (!activeLayers.has('natural')) return
    fetchEarthquakes().then(setEarthquakes).catch(() => {})
    const id = setInterval(() => {
      fetchEarthquakes().then(setEarthquakes).catch(() => {})
    }, 10 * 60 * 1000)
    return () => clearInterval(id)
  }, [activeLayers, setEarthquakes])

  const allStaticMarkers: MapMarker[] = [
    ...MAP_MARKERS,
    ...PIPELINE_MARKERS,
    ...GCC_MARKERS,
    ...CYBER_MARKERS,
    ...FINANCIAL_MARKERS,
  ]
  const visibleMarkers = allStaticMarkers.filter((m) => activeLayers.has(m.type))

  const eqMarkers: MapMarker[] = activeLayers.has('natural')
    ? earthquakes.map((eq) => ({
        id: eq.id, lat: eq.lat, lon: eq.lon, type: 'natural' as MapLayerType,
        label: `M${eq.magnitude.toFixed(1)} Earthquake`,
        detail: eq.place,
        magnitude: eq.magnitude,
        severity: eq.magnitude >= 6 ? 'critical' as const : eq.magnitude >= 5 ? 'high' as const : 'medium' as const,
      }))
    : []

  const combinedMarkers = [...visibleMarkers, ...eqMarkers]

  function handleCountryClick(feature: GeoJSON.Feature) {
    const code = (feature.properties?.iso_a2 as string | undefined)?.toUpperCase()
    if (!code) return
    const profile = getCountryByCode(code)
    if (profile) setSelectedCountry(profile)
  }

  return (
    <div className="flex flex-col h-full bg-terminal-bg border-t border-terminal-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border bg-terminal-surface flex-shrink-0">
        <span className="font-mono text-2xs font-semibold text-terminal-accent tracking-widest uppercase">
          Global Intelligence Map
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGlobe(!showGlobe)}
            className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
              showGlobe
                ? 'border-terminal-accent text-terminal-accent'
                : 'border-terminal-border text-terminal-faint hover:border-terminal-muted'
            }`}
          >
            {showGlobe ? '🗺 Map' : '🌐 Globe'}
          </button>
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`px-2 py-0.5 font-mono text-2xs rounded border transition-all ${
              showLayerPanel
                ? 'border-terminal-accent text-terminal-accent'
                : 'border-terminal-border text-terminal-faint hover:border-terminal-muted'
            }`}
          >
            ⚙ Layers ({activeLayers.size})
          </button>
        </div>
      </div>

      {/* Layer panel */}
      {showLayerPanel && (
        <div className="bg-terminal-surface border-b border-terminal-border px-3 py-2 flex-shrink-0 overflow-x-auto">
          <div className="flex gap-4">
            {LAYER_GROUPS.map((group) => (
              <div key={group.label} className="flex-shrink-0">
                <div className="font-mono text-2xs text-terminal-faint mb-1">{group.label}</div>
                <div className="flex flex-col gap-0.5">
                  {group.layers.map((layer) => {
                    const cfg = LAYER_CONFIG[layer]
                    const active = activeLayers.has(layer)
                    return (
                      <button
                        key={layer}
                        onClick={() => toggleLayer(layer)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded font-mono text-2xs border transition-all whitespace-nowrap ${
                          active ? 'text-terminal-text' : 'border-terminal-border/30 text-terminal-faint/50'
                        }`}
                        style={active ? { borderColor: cfg.color, color: cfg.color } : {}}
                      >
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map or Globe */}
      <div className="flex-1 relative overflow-hidden">
        {showGlobe ? (
          <Suspense fallback={
            <div className="flex items-center justify-center h-full text-terminal-faint font-mono text-xs">
              Loading 3D globe...
            </div>
          }>
            <GlobeView markers={combinedMarkers} worldGeoJson={worldGeoJson} />
          </Suspense>
        ) : (
          <MapContainer
            center={INITIAL_CENTER}
            zoom={INITIAL_ZOOM}
            style={{ height: '100%', width: '100%', background: '#050A14' }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OSM &copy; CARTO'
            />
            <SetView />

            {worldGeoJson && (
              <GeoJSON
                key="world"
                data={worldGeoJson}
                style={(feature) => {
                  const code = (feature?.properties?.iso_a2 as string | undefined)?.toUpperCase() ?? ''
                  return {
                    fillColor:   getCountryFill(code),
                    fillOpacity: 0.6,
                    color:       '#1e293b',
                    weight:      0.5,
                    opacity:     0.5,
                  }
                }}
                onEachFeature={(feature: GeoJSON.Feature, layer: Layer) => {
                  const code = (feature?.properties?.iso_a2 as string | undefined)?.toUpperCase() ?? ''
                  const profile: CountryProfile | null = code ? getCountryByCode(code) : null
                  const l = layer as unknown as {
                    on: (e: string, h: () => void) => void
                    bindTooltip: (c: string, o?: object) => void
                  }
                  l.on('click', () => handleCountryClick(feature))
                  if (profile) {
                    l.bindTooltip(
                      `<div style="font-family:monospace;font-size:11px"><b>${profile.flag} ${profile.name}</b><br/>Instability: ${profile.instabilityScore}/100<br/>${profile.centralBank}: ${profile.cbRate}%</div>`,
                      { sticky: true }
                    )
                  }
                }}
              />
            )}

            {combinedMarkers.map((marker) => (
              <CircleMarker
                key={marker.id}
                center={[marker.lat, marker.lon]}
                radius={markerRadius(marker)}
                pathOptions={{
                  fillColor:   markerColor(marker),
                  fillOpacity: 0.8,
                  color:       markerColor(marker),
                  weight:      1,
                  opacity:     1,
                }}
              >
                <Tooltip direction="top" offset={[0, -markerRadius(marker)]} className="terminal-tooltip">
                  <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    <div style={{ fontWeight: 'bold', color: 'white' }}>{marker.label}</div>
                    {marker.detail && <div style={{ color: '#9ca3af', marginTop: '2px', maxWidth: '200px' }}>{marker.detail}</div>}
                    {marker.magnitude && <div style={{ color: '#fb923c', marginTop: '2px' }}>Magnitude {marker.magnitude.toFixed(1)}</div>}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        )}

        <div className="absolute bottom-1 right-1 z-[1000] font-mono text-2xs text-terminal-faint/60 pointer-events-none">
          Click country for intel · {combinedMarkers.length} markers
        </div>
      </div>
    </div>
  )
}
