// Human Design Transit Calculator
//
// Transits = current planetary positions mapped to the gate wheel.
// Same calculation as personality/design, but at the current moment.

import {
  Body,
  type FlexibleDateTime,
  Ecliptic as AstroEcliptic,
  GeoVector,
  MakeTime,
  SunPosition,
} from 'astronomy-engine'
import type { CelestialBody, PlanetPosition } from './types'
import { longitudeToGate } from './gate-table'

const TRANSIT_BODIES: readonly CelestialBody[] = [
  'Sun', 'Earth', 'Moon', 'NorthNode', 'SouthNode',
  'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto',
] as const

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

function dateToJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

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

export function calculateTransits(date: Date = new Date()): readonly PlanetPosition[] {
  return TRANSIT_BODIES.map(name => {
    const longitude = getEclipticLongitude(name, date)
    const { gate, line } = longitudeToGate(longitude)
    return { body: name, longitude, gate, line }
  })
}
