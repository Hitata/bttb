// Tử Vi Đẩu Số — Type Definitions
// All types are readonly for functional style (mirrors HD pattern)

export type EarthlyBranch =
  | 'Tý' | 'Sửu' | 'Dần' | 'Mão' | 'Thìn' | 'Tỵ'
  | 'Ngọ' | 'Mùi' | 'Thân' | 'Dậu' | 'Tuất' | 'Hợi'

export type HeavenlyStem =
  | 'Giáp' | 'Ất' | 'Bính' | 'Đinh' | 'Mậu'
  | 'Kỷ' | 'Canh' | 'Tân' | 'Nhâm' | 'Quý'

export type StarGroup = 'tuVi' | 'thienPhu'

export type StarBrightness = 'mieu' | 'vuong' | 'dac' | 'binh' | 'ham'

export type CucType = 2 | 3 | 4 | 5 | 6

export type TuHoaType = 'loc' | 'quyen' | 'khoa' | 'ky'

export interface TuViBirthInput {
  readonly name: string
  readonly year: number       // Solar year
  readonly month: number      // Solar month (1-12)
  readonly day: number        // Solar day (1-31)
  readonly hour: number       // 0-23
  readonly minute: number     // 0-59
  readonly timezone: string   // IANA timezone
  readonly latitude: number
  readonly longitude: number
  readonly gender: 'Nam' | 'Nữ'
  readonly birthPlace: string
}

export interface Star {
  readonly id: string
  readonly name: string
  readonly nameEn: string
  readonly group: StarGroup
  readonly element: string
  readonly brightness: StarBrightness
  readonly tuHoa?: TuHoaType
}

export interface Palace {
  readonly position: number         // 0-11 (Earthly Branch index)
  readonly earthlyBranch: EarthlyBranch
  readonly name: string             // Vietnamese palace name
  readonly nameEn: string
  readonly domain: string           // Life domain description
  readonly stars: readonly Star[]
}

export interface TuViProfile {
  readonly menhElement: string      // Ngũ Hành of Mệnh Cục
  readonly cucName: string          // e.g. "Thủy Nhị Cục"
  readonly cucValue: CucType
  readonly menhPalaceIndex: number  // Which palace is Mệnh
  readonly thanPalaceIndex: number  // Which palace is Thân
  readonly yearStem: HeavenlyStem
  readonly yearBranch: EarthlyBranch
}

export interface LunarDate {
  readonly lunarYear: number
  readonly lunarMonth: number
  readonly lunarDay: number
  readonly isLeapMonth: boolean
}

export interface TuViChart {
  readonly input: TuViBirthInput
  readonly lunar: LunarDate
  readonly profile: TuViProfile
  readonly palaces: readonly Palace[]
  readonly tuHoa: readonly { readonly type: TuHoaType; readonly starId: string; readonly starName: string }[]
  readonly scope: 'chinh-tinh'      // Phase 1: 14 major stars + Tứ Hóa only
}
