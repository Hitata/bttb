// Star descriptions — names, elements, nature, keywords
// Covers all ~108 stars: 14 major + Lục Sát + Lộc Tồn ring + Thái Tuế ring
// + Tràng Sinh ring + key pairs + minor stars

import type { StarGroup } from './types'

export interface StarInfo {
  readonly id: string
  readonly name: string
  readonly nameEn: string
  readonly group: StarGroup
  readonly element: string
  readonly nature: string
  readonly keywords: string
}

// ─── 14 Major Stars (Chính Tinh) ───

export const MAJOR_STARS: readonly StarInfo[] = [
  // Tử Vi Group (6 stars)
  {
    id: 'TuVi', name: 'Tử Vi', nameEn: 'Emperor',
    group: 'tuVi', element: 'Thổ',
    nature: 'Đế tinh, chủ tinh. Sao vua, trung tâm quyền lực.',
    keywords: 'Lãnh đạo, uy quyền, cao quý, tự trọng',
  },
  {
    id: 'LiemTrinh', name: 'Liêm Trinh', nameEn: 'Integrity',
    group: 'tuVi', element: 'Hỏa',
    nature: 'Thứ đào hoa. Chính trực nhưng cứng rắn.',
    keywords: 'Chính trực, đào hoa, nóng nảy, tham vọng',
  },
  {
    id: 'ThienDong', name: 'Thiên Đồng', nameEn: 'Heavenly Youth',
    group: 'tuVi', element: 'Thủy',
    nature: 'Phúc tinh. Sao phúc đức, hưởng thụ.',
    keywords: 'Phúc lộc, hiền lành, lười biếng, nghệ thuật',
  },
  {
    id: 'VuKhuc', name: 'Vũ Khúc', nameEn: 'Military Music',
    group: 'tuVi', element: 'Kim',
    nature: 'Tài tinh. Sao tài lộc, quyết đoán.',
    keywords: 'Tài chính, quyết đoán, cứng cỏi, thực tế',
  },
  {
    id: 'ThaiDuong', name: 'Thái Dương', nameEn: 'Sun',
    group: 'tuVi', element: 'Hỏa',
    nature: 'Quý tinh. Sao mặt trời, quang minh.',
    keywords: 'Quang minh, bác ái, nam tính, chính trị',
  },
  {
    id: 'ThienCo', name: 'Thiên Cơ', nameEn: 'Heavenly Secret',
    group: 'tuVi', element: 'Mộc',
    nature: 'Trí tinh. Sao mưu trí, linh hoạt.',
    keywords: 'Thông minh, mưu trí, thay đổi, tôn giáo',
  },
  // Thiên Phủ Group (8 stars)
  {
    id: 'ThienPhu', name: 'Thiên Phủ', nameEn: 'Heavenly Minister',
    group: 'thienPhu', element: 'Thổ',
    nature: 'Lệnh tinh. Sao kho tàng, ổn định.',
    keywords: 'Ổn định, bảo thủ, kho tàng, đức độ',
  },
  {
    id: 'ThaiAm', name: 'Thái Âm', nameEn: 'Moon',
    group: 'thienPhu', element: 'Thủy',
    nature: 'Phú tinh. Sao mặt trăng, nhu mì.',
    keywords: 'Nữ tính, nhạy cảm, thanh cao, tài sản ẩn',
  },
  {
    id: 'ThamLang', name: 'Tham Lang', nameEn: 'Greedy Wolf',
    group: 'thienPhu', element: 'Thủy/Mộc',
    nature: 'Đào hoa tinh. Sao đa tài đa tình.',
    keywords: 'Đào hoa, đa tài, tham lam, giao thiệp',
  },
  {
    id: 'CuMon', name: 'Cự Môn', nameEn: 'Great Gate',
    group: 'thienPhu', element: 'Thủy',
    nature: 'Ám tinh. Sao khẩu thiệt, tranh luận.',
    keywords: 'Ăn nói, tranh luận, nghi ngờ, thị phi',
  },
  {
    id: 'ThienTuong', name: 'Thiên Tướng', nameEn: 'Heavenly General',
    group: 'thienPhu', element: 'Thủy',
    nature: 'Ấn tinh. Sao phò tá, trung thành.',
    keywords: 'Trung thành, phò tá, từ thiện, giúp đỡ',
  },
  {
    id: 'ThienLuong', name: 'Thiên Lương', nameEn: 'Heavenly Beam',
    group: 'thienPhu', element: 'Mộc',
    nature: 'Ấm tinh. Sao trường thọ, thanh cao.',
    keywords: 'Thanh cao, trường thọ, y dược, tôn giáo',
  },
  {
    id: 'ThatSat', name: 'Thất Sát', nameEn: 'Seven Killings',
    group: 'thienPhu', element: 'Kim',
    nature: 'Tướng tinh. Sao chiến đấu, quyền uy.',
    keywords: 'Quyết liệt, độc lập, quân sự, cô đơn',
  },
  {
    id: 'PhaQuan', name: 'Phá Quân', nameEn: 'Army Breaker',
    group: 'thienPhu', element: 'Thủy',
    nature: 'Hao tinh. Sao phá hoại, đổi mới.',
    keywords: 'Phá cách, đổi mới, mạo hiểm, tiêu hao',
  },
] as const

// ─── Lục Sát (6 Killing Stars) ───

export const LUC_SAT_STARS: readonly StarInfo[] = [
  {
    id: 'KinhDuong', name: 'Kình Dương', nameEn: 'Ram',
    group: 'lucSat', element: 'Kim',
    nature: 'Sát tinh. Cương mãnh, bạo lực.',
    keywords: 'Cương cường, bạo lực, quả cảm, tai nạn',
  },
  {
    id: 'DaLa', name: 'Đà La', nameEn: 'Net',
    group: 'lucSat', element: 'Kim',
    nature: 'Sát tinh. Trì trệ, vướng mắc.',
    keywords: 'Trì hoãn, vướng mắc, ẩn họa, kiên trì',
  },
  {
    id: 'HoaTinh', name: 'Hỏa Tinh', nameEn: 'Mars',
    group: 'lucSat', element: 'Hỏa',
    nature: 'Sát tinh. Nóng nảy, bùng nổ.',
    keywords: 'Nóng nảy, bạo phát, tai họa, dũng cảm',
  },
  {
    id: 'LinhTinh', name: 'Linh Tinh', nameEn: 'Bell Star',
    group: 'lucSat', element: 'Hỏa',
    nature: 'Sát tinh. Âm thầm, bất ngờ.',
    keywords: 'Bất ngờ, âm thầm, cô đơn, lanh lợi',
  },
  {
    id: 'DiaKhong', name: 'Địa Không', nameEn: 'Earth Void',
    group: 'lucSat', element: 'Hỏa',
    nature: 'Sát tinh. Trống rỗng, mất mát.',
    keywords: 'Trống rỗng, phá sản, tôn giáo, sáng tạo',
  },
  {
    id: 'DiaKiep', name: 'Địa Kiếp', nameEn: 'Earth Robbery',
    group: 'lucSat', element: 'Hỏa',
    nature: 'Sát tinh. Cướp đoạt, biến động.',
    keywords: 'Mất mát, bất ngờ, phá sản, phiêu lưu',
  },
] as const

// ─── Lộc Tồn Ring (13 stars) ───

export const LOC_TON_RING_STARS: readonly StarInfo[] = [
  {
    id: 'LocTon', name: 'Lộc Tồn', nameEn: 'Wealth Keeper',
    group: 'locTonRing', element: 'Thổ',
    nature: 'Quý tinh. Sao tài lộc, bảo thủ.',
    keywords: 'Tài lộc, bảo thủ, cô đơn, ổn định',
  },
  {
    id: 'BacSy', name: 'Bác Sỹ', nameEn: 'Doctor',
    group: 'locTonRing', element: 'Thủy',
    nature: 'Phúc tinh. Thông minh, học vấn.',
    keywords: 'Thông minh, y dược, học vấn',
  },
  {
    id: 'LucSi', name: 'Lực Sĩ', nameEn: 'Strong Man',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Phụ tinh. Sức mạnh, quyền lực.',
    keywords: 'Sức mạnh, uy quyền, cứng cỏi',
  },
  {
    id: 'ThanhLong', name: 'Thanh Long', nameEn: 'Azure Dragon',
    group: 'locTonRing', element: 'Thủy',
    nature: 'Phúc tinh. Vui mừng, may mắn.',
    keywords: 'Vui mừng, quý nhân, tài lộc',
  },
  {
    id: 'TieuHao', name: 'Tiểu Hao', nameEn: 'Minor Loss',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Bại tinh. Hao tổn nhỏ.',
    keywords: 'Tiêu hao, tổn thất nhỏ',
  },
  {
    id: 'TuongQuan', name: 'Tướng Quân', nameEn: 'General',
    group: 'locTonRing', element: 'Mộc',
    nature: 'Quyền tinh. Uy phong, chỉ huy.',
    keywords: 'Chỉ huy, uy nghiêm, cương quyết',
  },
  {
    id: 'TauThu', name: 'Tấu Thư', nameEn: 'Memorial',
    group: 'locTonRing', element: 'Kim',
    nature: 'Quý tinh. Văn thư, quan lộc.',
    keywords: 'Văn thư, khoa cử, quan lộc',
  },
  {
    id: 'PhiLiem', name: 'Phi Liêm', nameEn: 'Flying Blade',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Phụ tinh. Thị phi, phiền toái.',
    keywords: 'Thị phi, khẩu thiệt, phiền toái',
  },
  {
    id: 'HyThan', name: 'Hỷ Thần', nameEn: 'Joy Spirit',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Phúc tinh. Vui mừng, hỷ sự.',
    keywords: 'Vui mừng, hỷ sự, may mắn',
  },
  {
    id: 'BenhPhu', name: 'Bệnh Phù', nameEn: 'Illness Talisman',
    group: 'locTonRing', element: 'Thổ',
    nature: 'Bại tinh. Bệnh tật, phiền muộn.',
    keywords: 'Bệnh tật, lo lắng, phiền muộn',
  },
  {
    id: 'DaiHao', name: 'Đại Hao', nameEn: 'Major Loss',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Bại tinh. Hao tổn lớn.',
    keywords: 'Tổn thất lớn, phá tán, tiêu hao',
  },
  {
    id: 'PhucBinh', name: 'Phục Binh', nameEn: 'Ambush',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Ám tinh. Phục kích, ẩn họa.',
    keywords: 'Ẩn họa, bất ngờ, tiểu nhân',
  },
  {
    id: 'QuanPhu2', name: 'Quan Phù', nameEn: 'Litigation',
    group: 'locTonRing', element: 'Hỏa',
    nature: 'Bại tinh. Kiện tụng, thị phi.',
    keywords: 'Kiện cáo, thị phi, tranh chấp',
  },
] as const

// ─── Thái Tuế Ring (12 stars) ───

export const THAI_TUE_RING_STARS: readonly StarInfo[] = [
  {
    id: 'ThaiTue', name: 'Thái Tuế', nameEn: 'Grand Duke',
    group: 'thaiTueRing', element: 'Hỏa',
    nature: 'Uy nghiêm, áp lực.',
    keywords: 'Uy quyền, áp lực, kiện tụng',
  },
  {
    id: 'ThieuDuong', name: 'Thiếu Dương', nameEn: 'Minor Yang',
    group: 'thaiTueRing', element: 'Hỏa',
    nature: 'Phúc tinh. Quý nhân trợ giúp.',
    keywords: 'Quý nhân, giúp đỡ, thuận lợi',
  },
  {
    id: 'TangMon', name: 'Tang Môn', nameEn: 'Mourning Gate',
    group: 'thaiTueRing', element: 'Mộc',
    nature: 'Bại tinh. Tang tóc, buồn phiền.',
    keywords: 'Tang tóc, khóc lóc, buồn phiền',
  },
  {
    id: 'ThieuAm', name: 'Thiếu Âm', nameEn: 'Minor Yin',
    group: 'thaiTueRing', element: 'Thủy',
    nature: 'Phúc tinh. Quý nhân âm thầm.',
    keywords: 'Quý nhân, âm thầm, phụ nữ',
  },
  {
    id: 'QuanPhu3', name: 'Quan Phủ', nameEn: 'Official',
    group: 'thaiTueRing', element: 'Hỏa',
    nature: 'Bại tinh. Quan sự, kiện tụng.',
    keywords: 'Kiện tụng, quan sự, thị phi',
  },
  {
    id: 'TuPhu', name: 'Tử Phù', nameEn: 'Death Talisman',
    group: 'thaiTueRing', element: 'Kim',
    nature: 'Bại tinh. Bệnh tật, tai ương.',
    keywords: 'Bệnh tật, tai ương, tang tóc',
  },
  {
    id: 'TuePha', name: 'Tuế Phá', nameEn: 'Year Breaker',
    group: 'thaiTueRing', element: 'Hỏa',
    nature: 'Bại tinh. Phá hoại, tiêu hao.',
    keywords: 'Phá hoại, hao tổn, mâu thuẫn',
  },
  {
    id: 'LongDuc', name: 'Long Đức', nameEn: 'Dragon Virtue',
    group: 'thaiTueRing', element: 'Thủy',
    nature: 'Phúc tinh. Phúc đức, quý nhân.',
    keywords: 'Phúc đức, quý nhân, may mắn',
  },
  {
    id: 'BachHo', name: 'Bạch Hổ', nameEn: 'White Tiger',
    group: 'thaiTueRing', element: 'Kim',
    nature: 'Bại tinh. Hung dữ, tai nạn.',
    keywords: 'Tang tóc, tai nạn, bạo lực, quả quyết',
  },
  {
    id: 'PhucDuc2', name: 'Phúc Đức', nameEn: 'Fortune Virtue',
    group: 'thaiTueRing', element: 'Thổ',
    nature: 'Phúc tinh. Phúc đức, thuận lợi.',
    keywords: 'Phúc đức, may mắn, thuận lợi',
  },
  {
    id: 'DieuKhach', name: 'Điếu Khách', nameEn: 'Mourning Guest',
    group: 'thaiTueRing', element: 'Hỏa',
    nature: 'Bại tinh. Tang tóc, khóc lóc.',
    keywords: 'Tang tóc, buồn phiền, chia ly',
  },
  {
    id: 'TrucPhu', name: 'Trực Phù', nameEn: 'Direct Talisman',
    group: 'thaiTueRing', element: 'Kim',
    nature: 'Phúc tinh. Phò trợ, thuận lợi.',
    keywords: 'Thuận lợi, phò trợ, bảo vệ',
  },
] as const

// ─── Tràng Sinh Ring (12 stars) ───

export const TRANG_SINH_RING_STARS: readonly StarInfo[] = [
  {
    id: 'TrangSinh', name: 'Tràng Sinh', nameEn: 'Long Life',
    group: 'trangSinhRing', element: 'Thủy',
    nature: 'Phúc tinh. Sức sống, trường thọ.',
    keywords: 'Trường thọ, sức sống, phát triển',
  },
  {
    id: 'MocDuc', name: 'Mộc Dục', nameEn: 'Bathing',
    group: 'trangSinhRing', element: 'Thủy',
    nature: 'Đào hoa tinh. Tắm gội, sắc dục.',
    keywords: 'Đào hoa, sắc dục, nghệ thuật',
  },
  {
    id: 'QuanDoi', name: 'Quan Đới', nameEn: 'Cap & Belt',
    group: 'trangSinhRing', element: 'Kim',
    nature: 'Quyền tinh. Bắt đầu sự nghiệp.',
    keywords: 'Sự nghiệp, khởi đầu, chức vị',
  },
  {
    id: 'LamQuan', name: 'Lâm Quan', nameEn: 'Approach Office',
    group: 'trangSinhRing', element: 'Kim',
    nature: 'Đài các tinh. Thăng tiến, quan lộc.',
    keywords: 'Thăng tiến, quan lộc, danh vọng',
  },
  {
    id: 'DeVuong', name: 'Đế Vượng', nameEn: 'Emperor Peak',
    group: 'trangSinhRing', element: 'Kim',
    nature: 'Phúc tinh. Đỉnh cao, vượng thịnh.',
    keywords: 'Đỉnh cao, vượng thịnh, quyền lực',
  },
  {
    id: 'Suy', name: 'Suy', nameEn: 'Decline',
    group: 'trangSinhRing', element: 'Thủy',
    nature: 'Bại tinh. Suy yếu, giảm sút.',
    keywords: 'Suy yếu, giảm sút, an phận',
  },
  {
    id: 'BenhTS', name: 'Bệnh', nameEn: 'Illness',
    group: 'trangSinhRing', element: 'Hỏa',
    nature: 'Bại tinh. Bệnh tật.',
    keywords: 'Bệnh tật, suy nhược',
  },
  {
    id: 'TuTS', name: 'Tử', nameEn: 'Death',
    group: 'trangSinhRing', element: 'Hỏa',
    nature: 'Bại tinh. Kết thúc.',
    keywords: 'Kết thúc, chuyển biến',
  },
  {
    id: 'MoTS', name: 'Mộ', nameEn: 'Tomb',
    group: 'trangSinhRing', element: 'Thổ',
    nature: 'Bại tinh. Cất giấu, tích trữ.',
    keywords: 'Tích trữ, cất giấu, kết thúc',
  },
  {
    id: 'TuyetTS', name: 'Tuyệt', nameEn: 'Extinction',
    group: 'trangSinhRing', element: 'Thổ',
    nature: 'Bại tinh. Tận cùng, đoạn tuyệt.',
    keywords: 'Tận cùng, cô đơn, ly biệt',
  },
  {
    id: 'ThaiTS', name: 'Thai', nameEn: 'Conception',
    group: 'trangSinhRing', element: 'Thổ',
    nature: 'Đào hoa tinh. Thai nghén, khởi đầu.',
    keywords: 'Thai nghén, bắt đầu mới, sáng tạo',
  },
  {
    id: 'DuongTS', name: 'Dưỡng', nameEn: 'Nurture',
    group: 'trangSinhRing', element: 'Mộc',
    nature: 'Phụ tinh. Nuôi dưỡng, phát triển.',
    keywords: 'Nuôi dưỡng, chăm sóc, phát triển',
  },
] as const

// ─── Phụ Tinh (Auxiliary/Minor Stars) ───

export const PHU_TINH_STARS: readonly StarInfo[] = [
  // Key pairs
  {
    id: 'VanXuong', name: 'Văn Xương', nameEn: 'Literary Star',
    group: 'phuTinh', element: 'Kim',
    nature: 'Văn tinh. Văn chương, khoa cử.',
    keywords: 'Học vấn, văn chương, thi cử, thông minh',
  },
  {
    id: 'VanKhuc', name: 'Văn Khúc', nameEn: 'Literary Melody',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Văn tinh. Nghệ thuật, tài hoa.',
    keywords: 'Nghệ thuật, tài hoa, mưu trí, đào hoa',
  },
  {
    id: 'TaPhu', name: 'Tả Phù', nameEn: 'Left Assistant',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Phụ tinh. Phụ tá bên trái.',
    keywords: 'Trợ giúp, quý nhân, nhân duyên',
  },
  {
    id: 'HuuBat', name: 'Hữu Bật', nameEn: 'Right Assistant',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Phụ tinh. Phụ tá bên phải.',
    keywords: 'Trợ giúp, quý nhân, tế nhị',
  },
  {
    id: 'ThienKhoi', name: 'Thiên Khôi', nameEn: 'Heavenly Leader',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Quý tinh. Quý nhân dương.',
    keywords: 'Quý nhân, học vấn, danh vọng',
  },
  {
    id: 'ThienViet', name: 'Thiên Việt', nameEn: 'Heavenly Virtue',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Quý tinh. Quý nhân âm.',
    keywords: 'Quý nhân, phúc đức, may mắn',
  },
  // Long Trì / Phượng Các
  {
    id: 'LongTri', name: 'Long Trì', nameEn: 'Dragon Pool',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Quý tinh. Long mạch, may mắn.',
    keywords: 'May mắn, quý nhân, phong lưu',
  },
  {
    id: 'PhuongCac', name: 'Phượng Các', nameEn: 'Phoenix Tower',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Quý tinh. Phượng hoàng, cao quý.',
    keywords: 'Cao quý, vinh hoa, nghệ thuật',
  },
  // Tam Thai / Bát Tọa
  {
    id: 'TamThai', name: 'Tam Thai', nameEn: 'Three Platforms',
    group: 'phuTinh', element: 'Mộc',
    nature: 'Đài các tinh. Quan lộc, địa vị.',
    keywords: 'Quan lộc, địa vị, danh vọng',
  },
  {
    id: 'BatToa', name: 'Bát Tọa', nameEn: 'Eight Seats',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Đài các tinh. Quyền quý, tôn trọng.',
    keywords: 'Quyền quý, tôn trọng, uy tín',
  },
  // Ân Quang / Thiên Quý
  {
    id: 'AnQuang', name: 'Ân Quang', nameEn: 'Grace Light',
    group: 'phuTinh', element: 'Mộc',
    nature: 'Quý tinh. Ơn đức, may mắn.',
    keywords: 'Ơn đức, quý nhân, phúc lộc',
  },
  {
    id: 'ThienQuy', name: 'Thiên Quý', nameEn: 'Heavenly Noble',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Quý tinh. Cao quý, tôn trọng.',
    keywords: 'Cao quý, phúc đức, tôn trọng',
  },
  // Thiên Khốc / Thiên Hư
  {
    id: 'ThienKhoc', name: 'Thiên Khốc', nameEn: 'Heavenly Cry',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Bại tinh. Khóc lóc, buồn phiền.',
    keywords: 'Buồn phiền, khóc lóc, tang tóc',
  },
  {
    id: 'ThienHu', name: 'Thiên Hư', nameEn: 'Heavenly Void',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Bại tinh. Hao hụt, trống rỗng.',
    keywords: 'Hao hụt, viển vông, tâm linh',
  },
  // Thiên Đức / Nguyệt Đức
  {
    id: 'ThienDuc', name: 'Thiên Đức', nameEn: 'Heavenly Grace',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Phúc tinh. Đức độ, may mắn.',
    keywords: 'Đức độ, may mắn, hóa giải',
  },
  {
    id: 'NguyetDuc', name: 'Nguyệt Đức', nameEn: 'Monthly Grace',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Phúc tinh. Đức độ, thuận lợi.',
    keywords: 'Đức độ, thuận lợi, phúc lộc',
  },
  // Thiên Hình / Thiên Riêu / Thiên Y
  {
    id: 'ThienHinh', name: 'Thiên Hình', nameEn: 'Heavenly Punishment',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Hình tinh. Hình phạt, kỷ luật.',
    keywords: 'Hình phạt, kỷ luật, pháp luật, cô đơn',
  },
  {
    id: 'ThienRieu', name: 'Thiên Riêu', nameEn: 'Heavenly Charm',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Ám tinh. Sắc dục, mê hoặc.',
    keywords: 'Đào hoa, sắc dục, mê hoặc',
  },
  {
    id: 'ThienY', name: 'Thiên Y', nameEn: 'Heavenly Doctor',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Phúc tinh. Y dược, chữa bệnh.',
    keywords: 'Y dược, sức khỏe, chữa bệnh',
  },
  // Hồng Loan / Thiên Hỷ
  {
    id: 'HongLoan', name: 'Hồng Loan', nameEn: 'Red Phoenix',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Đào hoa tinh. Hôn nhân, tình yêu.',
    keywords: 'Hôn nhân, tình yêu, hỷ sự',
  },
  {
    id: 'ThienHy', name: 'Thiên Hỷ', nameEn: 'Heavenly Joy',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Phúc tinh. Vui mừng, hỷ sự.',
    keywords: 'Vui mừng, hỷ sự, con cái',
  },
  // Cô Thần / Quả Tú
  {
    id: 'CoThan', name: 'Cô Thần', nameEn: 'Lonely Star',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Ám tinh. Cô đơn, độc lập.',
    keywords: 'Cô đơn, độc lập, tu hành',
  },
  {
    id: 'QuaTu', name: 'Quả Tú', nameEn: 'Widow Star',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Ám tinh. Cô quạnh, ly biệt.',
    keywords: 'Cô quạnh, ly biệt, bất hạnh hôn nhân',
  },
  // Thiên Mã
  {
    id: 'ThienMa', name: 'Thiên Mã', nameEn: 'Heavenly Horse',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Quý tinh. Di chuyển, biến động.',
    keywords: 'Di chuyển, thay đổi, nhanh nhẹn',
  },
  // Hoa Cái / Kiếp Sát / Đào Hoa
  {
    id: 'HoaCai', name: 'Hoa Cái', nameEn: 'Canopy',
    group: 'phuTinh', element: 'Kim',
    nature: 'Đào hoa tinh. Che chở, nghệ thuật.',
    keywords: 'Nghệ thuật, tôn giáo, cô đơn',
  },
  {
    id: 'KiepSat', name: 'Kiếp Sát', nameEn: 'Robbery Star',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Sát tinh. Cướp đoạt.',
    keywords: 'Cướp đoạt, tai nạn, biến cố',
  },
  {
    id: 'DaoHoa', name: 'Đào Hoa', nameEn: 'Peach Blossom',
    group: 'phuTinh', element: 'Mộc',
    nature: 'Đào hoa tinh. Sắc đẹp, tình ái.',
    keywords: 'Đào hoa, sắc đẹp, nghệ thuật, tình ái',
  },
  // Phá Toái
  {
    id: 'PhaToai', name: 'Phá Toái', nameEn: 'Broken Pieces',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Bại tinh. Tan vỡ, phá hoại.',
    keywords: 'Tan vỡ, phá hoại, thay đổi',
  },
  // Thiên Quan / Thiên Phúc
  {
    id: 'ThienQuan', name: 'Thiên Quan', nameEn: 'Heavenly Official',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Phúc tinh. Quan lộc, bảo vệ.',
    keywords: 'Quan lộc, bảo vệ, quý nhân',
  },
  {
    id: 'ThienPhuc', name: 'Thiên Phúc', nameEn: 'Heavenly Blessing',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Phúc tinh. Phúc đức, may mắn.',
    keywords: 'Phúc đức, may mắn, hóa giải',
  },
  // Lưu Hà / Thiên Trù
  {
    id: 'LuuHa', name: 'Lưu Hà', nameEn: 'Flowing River',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Bại tinh. Nước lụt, tai nạn nước.',
    keywords: 'Tai nạn nước, trôi dạt, bất ổn',
  },
  {
    id: 'ThienTru', name: 'Thiên Trù', nameEn: 'Heavenly Kitchen',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Phúc tinh. Ẩm thực, no đủ.',
    keywords: 'Ẩm thực, no đủ, phú quý',
  },
  // Văn Tinh / Đường Phù / Quốc Ấn
  {
    id: 'VanTinh', name: 'Văn Tinh', nameEn: 'Literary Essence',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Văn tinh. Văn chương.',
    keywords: 'Văn chương, trí tuệ',
  },
  {
    id: 'DuongPhu', name: 'Đường Phù', nameEn: 'Pathway Talisman',
    group: 'phuTinh', element: 'Mộc',
    nature: 'Quyền tinh. Đường quan lộc.',
    keywords: 'Quan lộc, quyền hành',
  },
  {
    id: 'QuocAn', name: 'Quốc Ấn', nameEn: 'National Seal',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Văn tinh. Quyền ấn, chức vụ.',
    keywords: 'Chức vụ, quyền lực, ấn triện',
  },
  // Thai Phụ / Phong Cáo
  {
    id: 'ThaiPhu', name: 'Thai Phụ', nameEn: 'Grand Tutor',
    group: 'phuTinh', element: 'Kim',
    nature: 'Văn tinh. Thầy dạy, học vấn.',
    keywords: 'Học vấn, dạy dỗ, văn chương',
  },
  {
    id: 'PhongCao', name: 'Phong Cáo', nameEn: 'Proclamation',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Quyền tinh. Phong tước, vinh danh.',
    keywords: 'Phong tước, vinh danh, quan lộc',
  },
  // Thiên Giải / Địa Giải / Giải Thần
  {
    id: 'ThienGiai', name: 'Thiên Giải', nameEn: 'Heavenly Resolution',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Phúc tinh. Hóa giải, may mắn.',
    keywords: 'Hóa giải, may mắn, tai qua nạn khỏi',
  },
  {
    id: 'DiaGiai', name: 'Địa Giải', nameEn: 'Earth Resolution',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Phúc tinh. Hóa giải, bảo vệ.',
    keywords: 'Hóa giải, bảo vệ, bình an',
  },
  {
    id: 'GiaiThan', name: 'Giải Thần', nameEn: 'Resolution Spirit',
    group: 'phuTinh', element: 'Mộc',
    nature: 'Phúc tinh. Giải nạn, quý nhân.',
    keywords: 'Giải nạn, quý nhân, may mắn',
  },
  // Thiên La / Địa Võng
  {
    id: 'ThienLa', name: 'Thiên La', nameEn: 'Heavenly Net',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Bại tinh. Lưới trời, trói buộc.',
    keywords: 'Trói buộc, khó khăn, thị phi',
  },
  {
    id: 'DiaVong', name: 'Địa Võng', nameEn: 'Earth Net',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Bại tinh. Lưới đất, trắc trở.',
    keywords: 'Trắc trở, vướng mắc, khó khăn',
  },
  // Thiên Thương / Thiên Sứ
  {
    id: 'ThienThuong', name: 'Thiên Thương', nameEn: 'Heavenly Wound',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Bại tinh. Tổn thương, bệnh tật.',
    keywords: 'Tổn thương, bệnh tật, tai nạn',
  },
  {
    id: 'ThienSu', name: 'Thiên Sứ', nameEn: 'Heavenly Messenger',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Bại tinh. Bệnh tật, tai ương.',
    keywords: 'Bệnh tật, tai ương, biến cố',
  },
  // Thiên Không
  {
    id: 'ThienKhong', name: 'Thiên Không', nameEn: 'Heavenly Emptiness',
    group: 'phuTinh', element: 'Thủy',
    nature: 'Sát tinh. Trống rỗng, tôn giáo.',
    keywords: 'Trống rỗng, tôn giáo, triết lý',
  },
  // Thiên Tài / Thiên Thọ
  {
    id: 'ThienTai', name: 'Thiên Tài', nameEn: 'Heavenly Talent',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Phụ tinh. Tài năng thiên bẩm.',
    keywords: 'Tài năng, khéo léo, thực tế',
  },
  {
    id: 'ThienTho', name: 'Thiên Thọ', nameEn: 'Heavenly Longevity',
    group: 'phuTinh', element: 'Thổ',
    nature: 'Phúc tinh. Trường thọ.',
    keywords: 'Trường thọ, sức khỏe, phúc đức',
  },
  // Đẩu Quân
  {
    id: 'DauQuan', name: 'Đẩu Quân', nameEn: 'Dipper Commander',
    group: 'phuTinh', element: 'Hỏa',
    nature: 'Phúc tinh. Chỉ huy, dẫn đường.',
    keywords: 'Chỉ huy, dẫn đường, vận mệnh',
  },
] as const

// ─── Combined lookup by ID ───

const ALL_STARS: readonly StarInfo[] = [
  ...MAJOR_STARS,
  ...LUC_SAT_STARS,
  ...LOC_TON_RING_STARS,
  ...THAI_TUE_RING_STARS,
  ...TRANG_SINH_RING_STARS,
  ...PHU_TINH_STARS,
]

export const STAR_BY_ID: Record<string, StarInfo> = Object.fromEntries(
  ALL_STARS.map(s => [s.id, s])
)
