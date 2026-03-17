// ===== Five Elements & Polarity =====
export type FiveElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'
export type Polarity = '+' | '-'
export type Gender = 'male' | 'female'

// ===== Base Structures =====
export interface Stem {
  index: number
  name: string        // Vietnamese: "Giáp"
  romaji: string      // Pinyin: "Jia"
  zh: string          // Chinese: "甲"
  element: FiveElement
  polarity: Polarity
  color: string       // Tailwind class: "text-green-600"
}

export interface Branch {
  index: number
  name: string        // Vietnamese: "Tý"
  romaji: string      // Pinyin: "Zi"
  zh: string          // Chinese: "子"
  element: FiveElement
  polarity: Polarity
  hiddenStems: number[] // indices into HEAVENLY_STEMS
  zodiac: string      // Vietnamese: "Chuột"
}

// ===== Ten Gods =====
export interface TenGodInfo {
  code: string        // "TK" (abbreviation)
  name: string        // "Tỷ Kiên" (full name)
  sid: string         // Short description
  content: string     // HTML content with positive/negative traits
}

export interface TenGodRef {
  code: string        // "TK"
  name: string        // "Tỷ Kiên"
}

// ===== Na Yin =====
export interface NaYin {
  name: string        // "Hải Trung Kim"
  element: FiveElement
}

// ===== Vong Truong Sinh =====
export interface VongTruongSinhInfo {
  name: string        // "Trường Sinh"
  index: number       // 0–11
}

// ===== Than Sat =====
export interface ThanSatItem {
  name: string
  type: 'good' | 'bad' | 'neutral'
  description?: string
}

// ===== Tang Can (Hidden Stems) =====
export interface TangCanItem {
  canIndex: number    // Index into HEAVENLY_STEMS
  can: string         // Stem name
  nguHanh: string     // Five element name
  thapThan: TenGodRef // Ten God relationship to daymaster
}

// ===== Pillar =====
export interface Pillar {
  canIndex: number
  chiIndex: number
  can: string         // Stem name
  chi: string         // Branch name
  canNguHanh: string  // Stem five element
  chiNguHanh: string  // Branch five element
  thapThan: TenGodRef // Ten God of the stem relative to daymaster
  tangCan: TangCanItem[]
  naYin: NaYin
  vongTruongSinh: VongTruongSinhInfo
  thanSat: ThanSatItem[]
}

// ===== Tu Tru (Four Pillars) =====
export interface TuTru {
  thienTru: Pillar  // Year Pillar
  nguyetTru: Pillar // Month Pillar
  nhatTru: Pillar   // Day Pillar (daymaster)
  thoiTru: Pillar   // Hour Pillar
}

// ===== Date Info =====
export interface DateInfo {
  year: number | string
  month: number | string
  day: number | string
}

// ===== Dai Van (Grand Luck Cycle) =====
export interface DaiVanCycle {
  startAge: number
  startYear: number
  canIndex: number
  chiIndex: number
  can: string
  chi: string
  thapThan: TenGodRef
  tangCan: TangCanItem[]
  naYin: NaYin
  vongTruongSinh: VongTruongSinhInfo
  thanSat: ThanSatItem[]
}

// ===== Chu Ky Year (Cycle Year) =====
export interface ChuKyYear {
  year: number
  age: number
  canIndex: number
  chiIndex: number
  canChi: string
  cycleIndex: number
}

// ===== Current Year =====
export interface CurrentYearData {
  year: number
  can: string
  chi: string
  canIndex: number
  chiIndex: number
  yearCanNguHanh: string
  yearChiNguHanh: string
  yearCanThapThan: TenGodRef
  tangCan: TangCanItem[]
  naYin: NaYin
  vongTruongSinh: VongTruongSinhInfo
  thanSat: ThanSatItem[]
}

// ===== Compass Direction =====
export interface CompassDirection {
  name: string        // Direction name
  compass: string     // Degree/direction text
  zodiac: string      // Associated zodiac
  fiveElements: string // Associated element
}

export interface CompassData {
  good: CompassDirection[]
  bad: CompassDirection[]
}

// ===== Thai Menh Cung =====
export interface ThaiMenhCung {
  thaiCung: { can: string; chi: string }
  menhCung: { can: string; chi: string }
}

// ===== Than Sat Annual =====
export interface ThanSatAnnual {
  name: string
  day: string
  year: string
}

// ===== Full Bazi Result =====
export interface BaziResult {
  date: {
    solar: DateInfo
    lunar: DateInfo
    nongLich: DateInfo
  }
  tutru: TuTru
  dayMasterIndex: number
  daivan: {
    startAge: number
    cycles: DaiVanCycle[]
    chuKy: ChuKyYear[]
    currentYear: CurrentYearData
  }
  compass: CompassData[]
  thansat: ThanSatAnnual[]
  thaiMenhCung?: ThaiMenhCung
}

// ===== Input =====
export interface BirthInput {
  name: string
  gender: Gender
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

// ===== Cases =====
export interface TraitItem {
  name: string
  strength: number   // 1-5
  description: string
  tenGods?: string[]
}

export interface TimelineEvent {
  year: number
  age: number
  category: string
  title: string
  description: string
  baziAnalysis?: string
  annualPillar?: string
  luckPillar?: string
  starBadges?: string[]
}

export interface FAQItem {
  question: string
  answer: string
}
