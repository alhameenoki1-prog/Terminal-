import { useRef, useEffect } from 'react'
import Globe from 'react-globe.gl'
import type { GlobeMethods } from 'react-globe.gl'
import { LAYER_CONFIG } from '../data/mapLayerConfig'
import { getCountryByCode, COUNTRY_PROFILES } from '../data/countryProfiles'
import type { MapMarker } from '../types'
import { useStore } from '../store/useStore'

interface Props {
  markers: MapMarker[]
  worldGeoJson: GeoJSON.FeatureCollection | null
}

function getCountryCapColor(isoCode: string): string {
  const profile = COUNTRY_PROFILES[isoCode?.toUpperCase() ?? '']
  if (!profile) return 'rgba(30,40,60,0.2)'
  const s = profile.instabilityScore
  if (s >= 70) return 'rgba(239,68,68,0.5)'
  if (s >= 50) return 'rgba(249,115,22,0.45)'
  if (s >= 30) return 'rgba(234,179,8,0.4)'
  return 'rgba(16,185,129,0.25)'
}

export default function GlobeView({ markers, worldGeoJson }: Props) {
  const globeRef = useRef<GlobeMethods>()
  const setSelectedCountry = useStore((s) => s.setSelectedCountry)

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 28, lng: 43, altitude: 2.0 }, 500)
    }
  }, [])

  const pointsData = markers.map((m) => ({
    lat: m.lat,
    lng: m.lon,
    color: LAYER_CONFIG[m.type]?.color ?? '#9CA3AF',
    size: (m.magnitude ?? 0) > 0 ? Math.min(1.5, m.magnitude! * 0.2) : 0.4,
    label: m.label,
    detail: m.detail ?? '',
  }))

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      atmosphereColor="#1e40af"
      atmosphereAltitude={0.15}
      // Country polygons
      polygonsData={worldGeoJson?.features ?? []}
      polygonCapColor={(d) => {
        const feature = d as GeoJSON.Feature
        return getCountryCapColor((feature.properties?.iso_a2 as string) ?? '')
      }}
      polygonSideColor={() => 'rgba(0,0,0,0)'}
      polygonStrokeColor={() => '#1e293b'}
      polygonLabel={(d) => {
        const feature = d as GeoJSON.Feature
        const code = (feature.properties?.iso_a2 as string | undefined)?.toUpperCase() ?? ''
        const profile = getCountryByCode(code)
        if (!profile) return ''
        return `<div style="font-family:monospace;font-size:11px;background:#050a14;padding:4px 8px;border:1px solid #1e293b;border-radius:4px"><b>${profile.flag} ${profile.name}</b><br/>CB Rate: ${profile.cbRate}%<br/>Instability: ${profile.instabilityScore}/100</div>`
      }}
      onPolygonClick={(d) => {
        const feature = d as GeoJSON.Feature
        const code = (feature.properties?.iso_a2 as string | undefined)?.toUpperCase() ?? ''
        const profile = getCountryByCode(code)
        if (profile) setSelectedCountry(profile)
      }}
      // Point markers
      pointsData={pointsData}
      pointColor={(d) => (d as typeof pointsData[0]).color}
      pointAltitude={0.01}
      pointRadius={(d) => (d as typeof pointsData[0]).size}
      pointLabel={(d) => {
        const p = d as typeof pointsData[0]
        return `<div style="font-family:monospace;font-size:11px;background:#050a14;padding:4px 8px;border:1px solid #1e293b;border-radius:4px"><b>${p.label}</b><br/><span style="color:#9ca3af">${p.detail}</span></div>`
      }}
      width={window.innerWidth}
      height={window.innerHeight * 0.4}
    />
  )
}
