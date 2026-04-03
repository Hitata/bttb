// Human Design Planet Calculator
//
// Calculates ecliptic longitudes for 13 celestial bodies at two timestamps:
// - Personality (birth moment)
// - Design (when Sun was 88° earlier in ecliptic longitude)
//
// astronomy-engine API:
// - Sun: SunPosition(t).elon
// - Earth: (Sun + 180) % 360 (geocentric Earth is always opposite Sun)
// - Moon + planets: GeoVector(body, t, true) → Ecliptic() → .elon
// - NorthNode: NOT in astronomy-engine — use mean lunar node formula
// - SouthNode: (NorthNode + 180) % 360

import {
  Body,
  type FlexibleDateTime,
  Ecliptic as AstroEcliptic,
  GeoVector,
  MakeTime,
  SearchSunLongitude,
  SunPosition,
} from 'astronomy-engine'
import type { CelestialBody, PlanetPosition, PersonalityDesignActivations } from './types'
import { longitudeToGate } from './gate-table'

const HD_BODIES: readonly CelestialBody[] = [
  'Sun', 'Earth', 'Moon', 'NorthNode', 'SouthNode',
  'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto',
] as const

// Map our body names to astronomy-engine Body enum
const BODY_MAP: Partial<Record<CelestialBody, typeof Body[keyof typeof Body]>> = {
  Moon: Body.Moon,
  Mercury: Body.Mercury,
  Venus: Body.Venus,
  Mars: Body.Mars,
  Jupiter: Body.Jupiter,
  Saturn: Body.Saturn,
  Uranus: Body.Uranus,
  Neptune: Body.Neptune,
  Pluto: Body.Pluto,
}

// Julian Day from Date
function dateToJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

// Mean Lunar Node: Omega = 125.04452 - 1934.136261 * T
// T = Julian centuries from J2000.0
function meanLunarNode(date: Date): number {
  const jd = dateToJulianDay(date)
  const T = (jd - 2451545.0) / 36525
  return ((125.04452 - 1934.136261 * T) % 360 + 360) % 360
}

function getEclipticLongitude(body: CelestialBody, date: Date): number {
  const t = MakeTime(date as unknown as FlexibleDateTime)
  switch (body) {
    case 'Sun':
      return SunPosition(t).elon
    case 'Earth':
      return (SunPosition(t).elon + 180) % 360
    case 'NorthNode':
      return meanLunarNode(date)
    case 'SouthNode':
      return (meanLunarNode(date) + 180) % 360
    default: {
      const astroBody = BODY_MAP[body]
      if (!astroBody) throw new Error(`Unknown body: ${body}`)
      const geo = GeoVector(astroBody, t, true)
      return AstroEcliptic(geo).elon
    }
  }
}

function calculateBodyPositions(date: Date): readonly PlanetPosition[] {
  return HD_BODIES.map(name => {
    const longitude = getEclipticLongitude(name, date)
    const { gate, line } = longitudeToGate(longitude)
    return { body: name, longitude, gate, line }
  })
}

// Find Design date: when Sun was at (birthSunLong - 88°)
function findDesignDate(birthDateUTC: Date): Date {
  const t = MakeTime(birthDateUTC as unknown as FlexibleDateTime)
  const birthSunLong = SunPosition(t).elon
  const targetLong = ((birthSunLong - 88) % 360 + 360) % 360
  // Search forward from 100 days before birth
  const searchStart = new Date(birthDateUTC.getTime() - 100 * 86400000)
  const result = SearchSunLongitude(
    targetLong,
    MakeTime(searchStart as unknown as FlexibleDateTime),
    120,
  )
  if (!result) throw new Error('Could not determine Design date')
  return result.date
}

export function calculatePlanetaryPositions(birthDateUTC: Date): PersonalityDesignActivations {
  const designDate = findDesignDate(birthDateUTC)
  return {
    personality: calculateBodyPositions(birthDateUTC),
    design: calculateBodyPositions(designDate),
    designDate,
    birthDateUTC,
  }
}
