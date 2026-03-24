import { createHash } from 'crypto'
import { TRUNG } from './trung'
import { lookupHexagram } from './hexagram'
import type { LineValue, CoinFace, CoinThrow, CastingResponse } from './types'

/**
 * Generate a hexagram from an image hash.
 * Algorithm:
 * 1. seed = SHA-256(imageHash + ":" + TRUNG + ":" + timestamp)
 * 2. Extract 18 bits from seed — 3 bits per line, 1 bit per coin
 * 3. Map coin sums to line values (6/7/8/9)
 * 4. Look up primary hexagram from King Wen table
 * 5. If moving lines exist, flip them and look up changed hexagram
 */
export function castHexagram(imageHash: string, intentionTime?: number): CastingResponse {
  const timestamp = Date.now()
  // giờ động tâm: use the time difference between intention and upload as extra entropy
  const timeDelta = intentionTime ? timestamp - intentionTime : 0
  const seedString = `${imageHash}:${TRUNG}:${timeDelta}:${timestamp}`
  const buffer = createHash('sha256').update(seedString).digest()

  const lines: LineValue[] = []
  const coins: CoinThrow[] = []

  for (let i = 0; i < 6; i++) {
    const throw_: CoinThrow = [0, 0, 0]
    let sum = 0

    for (let j = 0; j < 3; j++) {
      const bitIndex = i * 3 + j
      const byteIndex = Math.floor(bitIndex / 8)
      const bitPosition = bitIndex % 8
      const coinValue = (buffer[byteIndex] >> bitPosition) & 1
      const face = coinValue as CoinFace
      throw_[j] = face
      sum += face
    }

    coins.push(throw_)

    let lineValue: LineValue
    if (sum === 3) {
      lineValue = 9  // Old Yang / Lão Dương — moving
    } else if (sum === 2) {
      lineValue = 7  // Young Yang / Thiếu Dương — stable
    } else if (sum === 1) {
      lineValue = 8  // Young Yin / Thiếu Âm — stable
    } else {
      lineValue = 6  // Old Yin / Lão Âm — moving
    }

    lines.push(lineValue)
  }

  const primary = lookupHexagram(lines)

  const hasMovingLines = lines.some(v => v === 6 || v === 9)
  let changed: CastingResponse['changed'] = null

  if (hasMovingLines) {
    const changedLines = lines.map(v => {
      if (v === 6) return 7 as LineValue
      if (v === 9) return 8 as LineValue
      return v
    })
    changed = lookupHexagram(changedLines)
  }

  return {
    lines,
    coins,
    primary,
    changed,
    timestamp,
    imageHash,
    intentionTime: intentionTime ?? timestamp,
  }
}

/** Validate imageHash is a non-empty hex string */
export function isValidImageHash(hash: unknown): hash is string {
  return typeof hash === 'string' && /^[0-9a-f]+$/i.test(hash)
}
