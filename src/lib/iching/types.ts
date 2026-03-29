// Line values from traditional coin casting
export type LineValue = 6 | 7 | 8 | 9

// Individual coin face: 0 = Yin (tails), 1 = Yang (heads)
export type CoinFace = 0 | 1

// Per-line coin result: 3 coins
export type CoinThrow = [CoinFace, CoinFace, CoinFace]

export interface TrigramData {
  index: number       // 0-7
  binary: string      // '000' to '111'
  symbol: string      // ☷ ☶ ☵ ☴ ☳ ☲ ☱ ☰
  name: string        // Vietnamese: Khôn, Cấn, etc.
  zh: string          // Chinese: 坤, 艮, etc.
}

export interface HexagramName {
  vi: string          // Vietnamese
  zh: string          // Chinese
  en: string          // English
}

export interface HexagramInfo {
  number: number      // King Wen number 1-64
  name: HexagramName
  upperTrigram: { symbol: string; name: string }
  lowerTrigram: { symbol: string; name: string }
  nuclearNumber: number
}

export interface CastingResponse {
  lines: LineValue[]
  coins: CoinThrow[]
  primary: HexagramInfo
  changed: HexagramInfo | null
  timestamp: number
  imageHash: string
  intentionTime: number
}

export interface CastingRequest {
  imageHash: string
  /** giờ động tâm — the moment of intention (ms since epoch). Defaults to server time if omitted. */
  intentionTime?: number
}

export interface HexagramData {
  number: number
  nameVi: string
  nameZh: string
  nameEn: string
  structure: string
  nuclearNumber: number
  energyState: string
  physicist: string
  sage: string
  advisor: string
  balance: string
}
