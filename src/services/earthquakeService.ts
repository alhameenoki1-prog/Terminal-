import type { EarthquakeEvent } from '../types'

interface USGSFeature {
  id: string
  properties: {
    mag: number
    place: string
    time: number
  }
  geometry: {
    coordinates: [number, number, number]  // [lon, lat, depth]
  }
}

interface USGSResponse {
  features: USGSFeature[]
}

const USGS_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'

export async function fetchEarthquakes(): Promise<EarthquakeEvent[]> {
  try {
    const res = await fetch(USGS_URL)
    if (!res.ok) return []
    const data: USGSResponse = await res.json()

    return data.features
      .filter((f) => f.properties.mag >= 3.0)
      .map((f) => ({
        id:        f.id,
        lat:       f.geometry.coordinates[1],
        lon:       f.geometry.coordinates[0],
        depth:     f.geometry.coordinates[2],
        magnitude: f.properties.mag,
        place:     f.properties.place,
        time:      f.properties.time,
      }))
      .sort((a, b) => b.magnitude - a.magnitude)
      .slice(0, 50)
  } catch {
    return []
  }
}
