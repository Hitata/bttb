// 14 Major Star descriptions — names, elements, nature, keywords

export interface StarInfo {
  readonly id: string
  readonly name: string
  readonly nameEn: string
  readonly group: 'tuVi' | 'thienPhu'
  readonly element: string
  readonly nature: string
  readonly keywords: string
}

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
    id: 'ThienTuong', name: 'Thiên Tướng', nameEn: 'Heavenly Minister',
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

// Quick lookup by star ID
export const STAR_BY_ID = Object.fromEntries(
  MAJOR_STARS.map(s => [s.id, s])
) as Record<string, StarInfo>
