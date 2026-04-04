// Tử Vi Đẩu Số — Type Definitions
// All types are readonly for functional style (mirrors HD pattern)

export type EarthlyBranch =
  | 'Tý' | 'Sửu' | 'Dần' | 'Mão' | 'Thìn' | 'Tỵ'
  | 'Ngọ' | 'Mùi' | 'Thân' | 'Dậu' | 'Tuất' | 'Hợi'

export type HeavenlyStem =
  | 'Giáp' | 'Ất' | 'Bính' | 'Đinh' | 'Mậu'
  | 'Kỷ' | 'Canh' | 'Tân' | 'Nhâm' | 'Quý'

export type StarGroup =
  | 'tuVi'        // 6 Tử Vi group major stars
  | 'thienPhu'    // 8 Thiên Phủ group major stars
  | 'lucSat'      // 6 killing stars
  | 'locTonRing'  // Lộc Tồn + 12 companion stars
  | 'trangSinhRing' // 12 Tràng Sinh cycle stars
  | 'thaiTueRing' // 12 Thái Tuế cycle stars
  | 'phuTinh'     // auxiliary/minor stars (Văn Xương, Tả Phù, etc.)

export type StarBrightness = 'mieu' | 'vuong' | 'dac' | 'binh' | 'ham'

export type CucType = 2 | 3 | 4 | 5 | 6

export type TuHoaType = 'loc' | 'quyen' | 'khoa' | 'ky'

export type Element = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'

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
  readonly daiHan?: DaiHanPeriod    // Major 10-year period
  readonly isTuan?: boolean         // In Tuần void
  readonly isTriet?: boolean        // In Triệt void
}

export interface DaiHanPeriod {
  readonly startAge: number
  readonly endAge: number
}

export interface TuViProfile {
  readonly menhElement: string      // Ngũ Hành of Mệnh Cục
  readonly cucName: string          // e.g. "Thủy Nhị Cục"
  readonly cucValue: CucType
  readonly menhPalaceIndex: number  // Which palace is Mệnh
  readonly thanPalaceIndex: number  // Which palace is Thân
  readonly yearStem: HeavenlyStem
  readonly yearBranch: EarthlyBranch
  readonly menhChu: string          // Ruling star of Mệnh
  readonly thanChu: string          // Ruling star of Thân
  readonly napAm: NapAmInfo         // Nạp Âm of birth year
  readonly sinhKhac: SinhKhacResult // Mệnh vs Cục relationship
}

export interface NapAmInfo {
  readonly name: string             // e.g. "Hải Trung Kim"
  readonly element: Element         // e.g. "Kim"
}

export interface SinhKhacResult {
  readonly relation: 'sinh' | 'khac' | 'hoa'
  readonly direction: string        // e.g. "Mệnh sinh Cục", "Cục khắc Mệnh"
  readonly description: string
}

export interface LunarDate {
  readonly lunarYear: number
  readonly lunarMonth: number
  readonly lunarDay: number
  readonly isLeapMonth: boolean
}

export interface TuanTriet {
  readonly tuan: readonly [number, number]   // Two palace indices in Tuần
  readonly triet: readonly [number, number]  // Two palace indices in Triệt
}

export interface TuViChart {
  readonly input: TuViBirthInput
  readonly lunar: LunarDate
  readonly profile: TuViProfile
  readonly palaces: readonly Palace[]
  readonly tuHoa: readonly { readonly type: TuHoaType; readonly starId: string; readonly starName: string }[]
  readonly tuanTriet: TuanTriet
  readonly scope: 'full'
}
