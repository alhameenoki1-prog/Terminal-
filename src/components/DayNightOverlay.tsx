import { useEffect, useState } from 'react'
import { Polygon } from 'react-leaflet'
import SunCalc from 'suncalc'

// Compute the terminator polygon (night side of Earth) for a given date
function getNightPolygon(date: Date): [number, number][] {
  // Sun's position changes throughout the day
  // We compute the sub-solar point (where sun is directly overhead)
  // then build the terminator as a great circle 90° away

  // Approximate sub-solar point
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  const solarLng = -15 * (utcHours - 12)  // ~15°/hour, noon at 0°

  // Declination via J2000 approximation
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  )
  const declDeg = 23.45 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365)
  const declRad = declDeg * Math.PI / 180

  // Terminator: for each longitude, solve for latitude where solar altitude = 0
  // cos(0) = sin(decl)*sin(lat) + cos(decl)*cos(lat)*cos(ha)
  // => 1 = sin(decl)*sin(lat) + cos(decl)*cos(lat)*cos(ha)
  // Rearranged: tan(lat) = -cos(ha) / tan(decl)
  const terminator: [number, number][] = []
  for (let lng = -180; lng <= 180; lng += 2) {
    const ha = (lng - solarLng) * Math.PI / 180
    if (Math.abs(Math.tan(declRad)) < 1e-6) {
      terminator.push([0, lng])
      continue
    }
    const latRad = Math.atan(-Math.cos(ha) / Math.tan(declRad))
    terminator.push([latRad * 180 / Math.PI, lng])
  }

  // Close the night polygon by adding the pole opposite to the sun
  // If declination > 0 (northern summer), south pole is fully in night
  const closingPole: number = declDeg >= 0 ? -90 : 90
  const nightPolygon: [number, number][] = [
    [closingPole, -180],
    ...terminator,
    [closingPole, 180],
    [closingPole, -180],
  ]
  return nightPolygon
}

export function DayNightOverlay() {
  const [polygon, setPolygon] = useState<[number, number][]>(() => getNightPolygon(new Date()))

  useEffect(() => {
    // Update every 15 minutes
    const tick = () => setPolygon(getNightPolygon(new Date()))
    const id = setInterval(tick, 15 * 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <Polygon
      positions={polygon}
      pathOptions={{
        fillColor: '#000820',
        fillOpacity: 0.45,
        color: '#1e40af',
        weight: 1,
        opacity: 0.5,
        dashArray: '4 4',
      }}
    />
  )
}

// Also export a hook for sun position data
export function useSunPosition() {
  const [sunPos, setSunPos] = useState<{ lat: number; lng: number; altitude: number }>(() => {
    const now = new Date()
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60
    const solarLng = -15 * (utcHours - 12)
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000)
    const declDeg = 23.45 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365)
    const pos = SunCalc.getPosition(now, 0, 0)
    return { lat: declDeg, lng: solarLng, altitude: pos.altitude * 180 / Math.PI }
  })

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60
      const solarLng = -15 * (utcHours - 12)
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000)
      const declDeg = 23.45 * Math.sin((2 * Math.PI * (dayOfYear - 81)) / 365)
      const pos = SunCalc.getPosition(now, 0, 0)
      setSunPos({ lat: declDeg, lng: solarLng, altitude: pos.altitude * 180 / Math.PI })
    }
    const id = setInterval(tick, 15 * 60_000)
    return () => clearInterval(id)
  }, [])

  return sunPos
}
