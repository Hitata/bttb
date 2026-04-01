// Human Design Calculator — Main Entry Point
//
// computeHumanDesign: birth input → complete HD chart
// Pure function pipeline: validate → UTC convert → calculate planets → derive chart

import type { HDBirthInput, HumanDesignChart } from './types'
import { calculatePlanetaryPositions } from './calculate-planets'
import { deriveChart } from './derive-chart'

export type { HDBirthInput, HumanDesignChart } from './types'
export type {
  CelestialBody,
  GateActivation,
  PlanetPosition,
  DefinedChannel,
  HDAuthorityType,
  HDTypeId,
} from './types'

// Convert local birth time to UTC using IANA timezone
function localToUTC(input: HDBirthInput): Date {
  // Build an ISO-like string in the local timezone, then use Intl to find the UTC offset
  const { year, month, day, hour, minute, timezone } = input

  // Create a date string and parse it in the given timezone
  // Using Intl.DateTimeFormat to get the UTC offset for the given timezone at the given local time
  const localStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`

  // Use a two-step approach: first create a rough UTC estimate,
  // then use Intl to find the actual offset at that moment
  const roughDate = new Date(localStr + 'Z')
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Format the rough UTC date in the target timezone to find the offset
  const parts = formatter.formatToParts(roughDate)
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '0'
  const tzYear = Number(get('year'))
  const tzMonth = Number(get('month'))
  const tzDay = Number(get('day'))
  const tzHour = Number(get('hour') === '24' ? '0' : get('hour'))
  const tzMinute = Number(get('minute'))

  // The offset is the difference between what we asked for (local time) and what UTC gave us
  const localMs = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`).getTime()
  const tzMs = new Date(`${tzYear}-${String(tzMonth).padStart(2, '0')}-${String(tzDay).padStart(2, '0')}T${String(tzHour).padStart(2, '0')}:${String(tzMinute).padStart(2, '0')}:00Z`).getTime()
  const offsetMs = tzMs - localMs

  // The actual UTC time = local time interpreted as UTC - offset
  // Because: if timezone shows 7:00 when UTC is 0:00, offset is +7h,
  // so local 12:00 in that timezone = 12:00 - 7:00 = 05:00 UTC
  return new Date(localMs - offsetMs)
}

export function computeHumanDesign(input: HDBirthInput): HumanDesignChart {
  const birthDateUTC = localToUTC(input)
  const activations = calculatePlanetaryPositions(birthDateUTC)
  return deriveChart(activations, input)
}
