// Tử Vi Đẩu Số Calculator — Main Entry Point
//
// computeTuVi: birth input → complete Tử Vi chart
// Pure function pipeline: validate → lunar convert → place all stars → assign brightness

import type {
  TuViBirthInput, TuViChart, Palace, Star,
  EarthlyBranch, HeavenlyStem, TuHoaType, DaiHanPeriod,
} from './types'
import { solarToLunar } from '../bazi/solar-lunar'
import { EARTHLY_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES, CUC_INFO, hourToBranchIndex } from './palace-data'
import { STAR_BY_ID } from './star-descriptions'
import { getStarBrightness } from './star-brightness'
import {
  assignMenhPalace, assignThanPalace, calculateCuc,
  placeTuViStar, placeTuViGroup, deriveThienPhu, placeThienPhuGroup,
  placeTuHoa, getYearStemIndex, getYearBranchIndex,
  getDirection, placeLocTon, placeKinhDuong, placeDaLa,
  placeLocTonRing, placeHoaLinh, placeDiaKhongKiep,
  placeVanXuongKhuc, placeTaPhuHuuBat, placeThienKhoiViet,
  placeThaiTueRing, placeTrangSinhRing,
  calculateTriet, calculateTuan, calculateDaiHan,
  getMenhChu, getThanChu, getNapAm, calculateSinhKhac,
  placeLongTriPhuongCac, placeTamThaiBatToa, placeAnQuangThienQuy,
  placeThienKhocHu, placeThienTaiTho, placeHongLoanThienHy,
  placeThienHinh, placeThienRieu, placeThienY,
  placeCoThan, placeQuaTu, placeThienMa, placeHoaCai,
  placeKiepSat, placeDaoHoa, placePhaToai,
  placeThienQuanPhuc, placeLuuHaThienTru,
  placeVanTinhDuongPhuQuocAn, placeThaiPhuPhongCao,
  placeGiaiThan, placeThienKhong, THIEN_LA, DIA_VONG,
  placeThienThuongSu, placeDauQuan,
} from './star-placement'

export type { TuViBirthInput, TuViChart, Palace, Star } from './types'
export type { StarBrightness, CucType, TuHoaType, EarthlyBranch, TuanTriet, DaiHanPeriod, NapAmInfo, SinhKhacResult } from './types'

export function computeTuVi(input: TuViBirthInput): TuViChart {
  // 1. Convert solar → lunar
  const lunar = solarToLunar(input.year, input.month, input.day)
  const effectiveLunarMonth = lunar.lunarMonth

  // 2. Determine year stem/branch from lunar year
  const yearStemIndex = getYearStemIndex(lunar.lunarYear)
  const yearBranchIndex = getYearBranchIndex(lunar.lunarYear)
  const yearStem = HEAVENLY_STEMS[yearStemIndex] as HeavenlyStem
  const yearBranch = EARTHLY_BRANCHES[yearBranchIndex] as EarthlyBranch

  // 3. Map birth hour to Earthly Branch index
  const hourIndex = hourToBranchIndex(input.hour)

  // 4. Direction for gender-sensitive placements
  const direction = getDirection(yearStemIndex, input.gender)

  // 5. Assign Mệnh and Thân palace positions
  const menhPos = assignMenhPalace(effectiveLunarMonth, hourIndex)
  const thanPos = assignThanPalace(effectiveLunarMonth, hourIndex)

  // 6. Calculate Cục
  const cuc = calculateCuc(yearStemIndex, menhPos)
  const cucInfo = CUC_INFO[cuc]

  // 7. Place all 14 major stars
  const tuViPos = placeTuViStar(cuc, lunar.lunarDay)
  const tuViGroupPositions = placeTuViGroup(tuViPos)
  const thienPhuPos = deriveThienPhu(tuViPos)
  const thienPhuGroupPositions = placeThienPhuGroup(thienPhuPos)

  // 8. Place Lục Sát
  const locTonPos = placeLocTon(yearStemIndex)
  const kinhDuongPos = placeKinhDuong(locTonPos)
  const daLaPos = placeDaLa(locTonPos)
  const { hoaTinh, linhTinh } = placeHoaLinh(yearBranchIndex, hourIndex, direction)
  const { diaKhong, diaKiep } = placeDiaKhongKiep(hourIndex)

  // 9. Place Lộc Tồn ring
  const locTonRingPositions = placeLocTonRing(locTonPos, direction)

  // 10. Place key pairs
  const { vanXuong, vanKhuc } = placeVanXuongKhuc(hourIndex)
  const { taPhu, huuBat } = placeTaPhuHuuBat(effectiveLunarMonth)
  const { thienKhoi, thienViet } = placeThienKhoiViet(yearStemIndex)

  // 11. Place Thái Tuế ring
  const thaiTueRingPositions = placeThaiTueRing(yearBranchIndex)

  // 12. Place Tràng Sinh ring
  const trangSinhRingPositions = placeTrangSinhRing(cuc, direction)

  // 13. Place minor stars
  const { longTri, phuongCac } = placeLongTriPhuongCac(yearBranchIndex)
  const { tamThai, batToa } = placeTamThaiBatToa(effectiveLunarMonth, lunar.lunarDay)
  const { anQuang, thienQuy } = placeAnQuangThienQuy(vanXuong, lunar.lunarDay)
  const { thienKhoc, thienHu } = placeThienKhocHu(yearBranchIndex)
  const { thienTai, thienTho } = placeThienTaiTho(menhPos, thanPos, yearBranchIndex)
  const { hongLoan, thienHy } = placeHongLoanThienHy(yearBranchIndex)
  const thienHinhPos = placeThienHinh(effectiveLunarMonth)
  const thienRieuPos = placeThienRieu(thienHinhPos)
  const thienYPos = placeThienY(thienRieuPos)
  const coThanPos = placeCoThan(yearBranchIndex)
  const quaTuPos = placeQuaTu(coThanPos)
  const thienMaPos = placeThienMa(yearBranchIndex)
  const hoaCaiPos = placeHoaCai(thienMaPos)
  const kiepSatPos = placeKiepSat(thienMaPos)
  const daoHoaPos = placeDaoHoa(kiepSatPos)
  const phaToaiPos = placePhaToai(yearBranchIndex)
  const { thienQuan, thienPhuc } = placeThienQuanPhuc(yearStemIndex)
  const { luuHa, thienTru } = placeLuuHaThienTru(yearStemIndex)
  const { vanTinh, duongPhu, quocAn } = placeVanTinhDuongPhuQuocAn(kinhDuongPos)
  const { thaiPhu, phongCao } = placeThaiPhuPhongCao(vanKhuc)
  const { thienGiai, diaGiai } = placeGiaiThan(effectiveLunarMonth, taPhu)
  const thienKhongPos = placeThienKhong(yearBranchIndex)
  const { thienThuong, thienSu } = placeThienThuongSu(menhPos)
  const dauQuanPos = placeDauQuan(yearBranchIndex, effectiveLunarMonth, hourIndex)

  // Thiên Đức at PhúcĐức2 position (+9 from Thái Tuế)
  const thienDucPos = thaiTueRingPositions.PhucDuc2
  // Nguyệt Đức at Tử Phù position (+5 from Thái Tuế)
  const nguyetDucPos = thaiTueRingPositions.TuPhu

  // 14. Collect all star positions
  const allStarPositions: Record<string, number> = {
    // 14 Major
    ...tuViGroupPositions,
    ...thienPhuGroupPositions,
    // Lục Sát
    KinhDuong: kinhDuongPos,
    DaLa: daLaPos,
    HoaTinh: hoaTinh,
    LinhTinh: linhTinh,
    DiaKhong: diaKhong,
    DiaKiep: diaKiep,
    // Lộc Tồn ring
    ...locTonRingPositions,
    // Key pairs
    VanXuong: vanXuong,
    VanKhuc: vanKhuc,
    TaPhu: taPhu,
    HuuBat: huuBat,
    ThienKhoi: thienKhoi,
    ThienViet: thienViet,
    // Thái Tuế ring
    ...thaiTueRingPositions,
    // Tràng Sinh ring
    ...trangSinhRingPositions,
    // Minor stars
    LongTri: longTri,
    PhuongCac: phuongCac,
    TamThai: tamThai,
    BatToa: batToa,
    AnQuang: anQuang,
    ThienQuy: thienQuy,
    ThienKhoc: thienKhoc,
    ThienHu: thienHu,
    ThienDuc: thienDucPos,
    NguyetDuc: nguyetDucPos,
    ThienTai: thienTai,
    ThienTho: thienTho,
    HongLoan: hongLoan,
    ThienHy: thienHy,
    ThienHinh: thienHinhPos,
    ThienRieu: thienRieuPos,
    ThienY: thienYPos,
    CoThan: coThanPos,
    QuaTu: quaTuPos,
    ThienMa: thienMaPos,
    HoaCai: hoaCaiPos,
    KiepSat: kiepSatPos,
    DaoHoa: daoHoaPos,
    PhaToai: phaToaiPos,
    ThienQuan: thienQuan,
    ThienPhuc: thienPhuc,
    LuuHa: luuHa,
    ThienTru: thienTru,
    VanTinh: vanTinh,
    DuongPhu: duongPhu,
    QuocAn: quocAn,
    ThaiPhu: thaiPhu,
    PhongCao: phongCao,
    ThienGiai: thienGiai,
    DiaGiai: diaGiai,
    GiaiThan: phuongCac, // Giải Thần at same palace as Phượng Các
    ThienLa: THIEN_LA,
    DiaVong: DIA_VONG,
    ThienThuong: thienThuong,
    ThienSu: thienSu,
    ThienKhong: thienKhongPos,
    DauQuan: dauQuanPos,
  }

  // 15. Place Tứ Hóa (now includes minor stars like Văn Xương, Văn Khúc, Hữu Bật)
  const tuHoaAssignments = placeTuHoa(yearStemIndex)
  const tuHoaMap = new Map<string, TuHoaType>()
  for (const { starId, type } of tuHoaAssignments) {
    tuHoaMap.set(starId, type)
  }

  // 16. Calculate Tuần / Triệt
  const triet = calculateTriet(yearStemIndex)
  const tuan = calculateTuan(yearStemIndex, yearBranchIndex)

  // 17. Calculate Đại Hạn
  const daiHanPeriods = calculateDaiHan(cuc, menhPos, direction)
  const daiHanByBranch = new Map<number, DaiHanPeriod>()
  for (const p of daiHanPeriods) {
    daiHanByBranch.set(p.branchIndex, { startAge: p.startAge, endAge: p.endAge })
  }

  // 18. Build 12 palaces with all stars, brightness, Đại Hạn, Tuần/Triệt
  const palaces: Palace[] = []
  for (let i = 0; i < 12; i++) {
    const branchIndex = ((menhPos - i) % 12 + 12) % 12
    const palaceDef = PALACE_NAMES[i]

    // Find which stars land in this branch position
    const starsInPalace: Star[] = []
    for (const [starId, starPos] of Object.entries(allStarPositions)) {
      if (starPos === branchIndex) {
        const info = STAR_BY_ID[starId]
        if (info) {
          starsInPalace.push({
            id: starId,
            name: info.name,
            nameEn: info.nameEn,
            group: info.group,
            element: info.element,
            brightness: getStarBrightness(starId, branchIndex),
            tuHoa: tuHoaMap.get(starId),
          })
        }
      }
    }

    palaces.push({
      position: branchIndex,
      earthlyBranch: EARTHLY_BRANCHES[branchIndex],
      name: palaceDef.name,
      nameEn: palaceDef.nameEn,
      domain: palaceDef.domain,
      stars: starsInPalace,
      daiHan: daiHanByBranch.get(branchIndex),
      isTuan: tuan[0] === branchIndex || tuan[1] === branchIndex,
      isTriet: triet[0] === branchIndex || triet[1] === branchIndex,
    })
  }

  // 19. Build Tứ Hóa summary
  const tuHoa = tuHoaAssignments.map(({ starId, type }) => ({
    type,
    starId,
    starName: STAR_BY_ID[starId]?.name ?? starId,
  }))

  // 20. Profile with Mệnh Chủ, Thân Chủ, Nạp Âm, Sinh Khắc
  const napAm = getNapAm(yearStemIndex, yearBranchIndex)
  const sinhKhac = calculateSinhKhac(napAm.element, cucInfo.element)

  return {
    input,
    lunar: {
      lunarYear: lunar.lunarYear,
      lunarMonth: lunar.lunarMonth,
      lunarDay: lunar.lunarDay,
      isLeapMonth: lunar.isLeapMonth,
    },
    profile: {
      menhElement: cucInfo.element,
      cucName: cucInfo.name,
      cucValue: cuc,
      menhPalaceIndex: 0,
      thanPalaceIndex: palaces.findIndex(p => p.position === thanPos),
      yearStem,
      yearBranch,
      menhChu: STAR_BY_ID[getMenhChu(yearBranchIndex)]?.name ?? getMenhChu(yearBranchIndex),
      thanChu: STAR_BY_ID[getThanChu(yearBranchIndex)]?.name ?? getThanChu(yearBranchIndex),
      napAm,
      sinhKhac,
    },
    palaces,
    tuHoa,
    tuanTriet: { tuan, triet },
    scope: 'full',
  }
}
