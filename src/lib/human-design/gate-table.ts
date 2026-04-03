// Human Design Gate Table — Pure Functional Lookup
//
// The HD wheel maps 64 gates onto the 360° ecliptic.
// Each gate spans exactly 5.625° (360/64), each line spans 0.9375° (5.625/6).
// Gate 41 starts at 2°00' Aquarius = 332.0° ecliptic longitude.

const GATE_WHEEL_ORDER: readonly number[] = [
  41, 19, 13, 49, 30, 55, 37, 63,  // Aquarius → Pisces
  22, 36, 25, 17, 21, 51, 42, 3,   // Pisces → Aries → Taurus
  27, 24, 2, 23, 8, 20, 16, 35,    // Taurus → Gemini
  45, 12, 15, 52, 39, 53, 62, 56,  // Gemini → Cancer
  31, 33, 7, 4, 29, 59, 40, 64,    // Leo → Virgo
  47, 6, 46, 18, 48, 57, 32, 50,   // Virgo → Libra
  28, 44, 1, 43, 14, 34, 9, 5,     // Scorpio → Sagittarius
  26, 11, 10, 58, 38, 54, 61, 60,  // Sagittarius → Capricorn
] as const

const WHEEL_START_DEGREE = 332.0
const DEGREES_PER_GATE = 5.625
const DEGREES_PER_LINE = 0.9375

export function longitudeToGate(longitude: number): { gate: number; line: number } {
  const normalized = ((longitude % 360) + 360) % 360
  const offset = ((normalized - WHEEL_START_DEGREE) % 360 + 360) % 360
  const gateIndex = Math.floor(offset / DEGREES_PER_GATE)
  const lineOffset = offset - (gateIndex * DEGREES_PER_GATE)
  const line = Math.floor(lineOffset / DEGREES_PER_LINE) + 1

  return {
    gate: GATE_WHEEL_ORDER[gateIndex % 64],
    line: Math.min(line, 6),
  }
}
