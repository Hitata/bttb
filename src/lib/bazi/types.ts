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
  analysis?: ChartAnalysis
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

// ===== Can/Chi Relationships =====

export type RelationshipType =
  | 'canHop'      // Stem combination (5 pairs)
  | 'chiXung'     // Branch clash (6 pairs)
  | 'chiHinh'     // Branch punishment (3 groups)
  | 'chiLucHop'   // Branch six harmony (6 pairs)
  | 'tamHop'      // Three harmony (4 groups)
  | 'tamHoi'      // Three meeting (4 groups)
  | 'banHop'      // Half harmony (partial tam hop)
  | 'banHoi'      // Half meeting (partial tam hoi)

export interface ChartRelationship {
  type: RelationshipType
  label: string           // Vietnamese display name
  indices: number[]       // Pillar indices involved (0=year, 1=month, 2=day, 3=hour)
  element?: FiveElement   // Resulting element for hợp/hội groups
  strength?: 'strong' | 'medium' | 'weak'  // For bán hợp/hội
  description?: string
}

// ===== Seasonal Strength =====

export type SeasonalState = 'Vượng' | 'Tướng' | 'Hưu' | 'Tù' | 'Tử'

export interface ElementStrength {
  element: FiveElement
  state: SeasonalState
  score: number  // 5=Vượng, 4=Tướng, 3=Hưu, 2=Tù, 1=Tử
}

// ===== Stem Rootedness =====

export interface StemRoot {
  pillarIndex: number     // Which pillar contains the root (0-3)
  chiIndex: number        // Branch index containing root
  hiddenStemIndex: number // Which hidden stem is the root
  isChinhKhi: boolean     // Is this the main qi of the branch?
  proximity: 'near' | 'medium' | 'far'
}

export interface StemRootedness {
  canIndex: number
  pillarIndex: number     // Which pillar this stem is in
  canName: string
  element: FiveElement
  roots: StemRoot[]
  isRooted: boolean       // Has at least one root
  rootStrength: 'strong' | 'medium' | 'weak' | 'none'
}

// ===== Factions =====

export interface Faction {
  element: FiveElement
  leaders: { canIndex: number; pillarIndex: number; name: string }[]
  supporters: { chiIndex: number; pillarIndex: number; name: string; type: string }[]
  strength: number        // Computed strength score
  rank: number            // 1 = strongest faction
}

// ===== Positional Interaction Priority =====

export type InteractionStrength = 'strongest' | 'strong' | 'weak' | 'blocked'

export interface PositionalInteraction {
  type: RelationshipType
  label: string
  indices: number[]                // Pillar indices (0=year, 1=month, 2=day, 3=hour)
  positionalStrength: InteractionStrength
  positionalNote: string           // Vietnamese explanation
}

// ===== Extreme Element Dynamics (Ngũ Hành Thái Quá) =====

export type ExtremeDynamicType =
  | 'phanKhac'       // Weak attacks strong → weak gets damaged
  | 'phanSinh'       // Too-strong source overwhelms weak receiver
  | 'suyXungVuong'   // Weak clashing strong → stimulates strong
  | 'hopKhac'        // Both harmonize and clash (e.g. Tỵ-Thân)

export interface ExtremeDynamic {
  type: ExtremeDynamicType
  label: string
  description: string
  elements: [FiveElement, FiveElement]   // [attacker/source, target]
  indices: number[]                       // Pillar indices involved
}

// ===== Cung Vị (Palace Positions) =====

export interface CungVi {
  pillarIndex: number        // 0=year, 1=month, 2=day, 3=hour
  pillarName: string         // Vietnamese: "Niên Trụ"
  canDomain: string          // What the stem represents: "Cha" (father)
  chiDomain: string          // What the branch represents: "Mẹ" (mother)
  lifeDomain: string         // Overall life area: "Gia đình gốc"
  ageRange: string           // "0–17 tuổi"
  ageDescription: string     // "Ảnh hưởng của cha mẹ"
}

// ===== Chart Analysis =====

export interface ChartAnalysis {
  relationships: ChartRelationship[]
  seasonalStrength: ElementStrength[]
  stemRootedness: StemRootedness[]
  factions: Faction[]
  positionalInteractions: PositionalInteraction[]
  extremeDynamics: ExtremeDynamic[]
  cungVi: CungVi[]
}
