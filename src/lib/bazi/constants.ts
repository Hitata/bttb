import type { Stem, Branch, NaYin, TenGodInfo, FiveElement } from './types'

// ===== 10 Heavenly Stems (Thiên Can) =====
export const HEAVENLY_STEMS: Stem[] = [
  { index: 0, name: 'Giáp', romaji: 'Jia',  zh: '甲', element: 'Mộc',  polarity: '+', color: 'text-green-600' },
  { index: 1, name: 'Ất',   romaji: 'Yi',   zh: '乙', element: 'Mộc',  polarity: '-', color: 'text-green-500' },
  { index: 2, name: 'Bính', romaji: 'Bing', zh: '丙', element: 'Hỏa',  polarity: '+', color: 'text-red-600' },
  { index: 3, name: 'Đinh', romaji: 'Ding', zh: '丁', element: 'Hỏa',  polarity: '-', color: 'text-red-500' },
  { index: 4, name: 'Mậu',  romaji: 'Wu',   zh: '戊', element: 'Thổ',  polarity: '+', color: 'text-amber-700' },
  { index: 5, name: 'Kỷ',   romaji: 'Ji',   zh: '己', element: 'Thổ',  polarity: '-', color: 'text-amber-600' },
  { index: 6, name: 'Canh', romaji: 'Geng', zh: '庚', element: 'Kim',  polarity: '+', color: 'text-gray-500' },
  { index: 7, name: 'Tân',  romaji: 'Xin',  zh: '辛', element: 'Kim',  polarity: '-', color: 'text-gray-400' },
  { index: 8, name: 'Nhâm', romaji: 'Ren',  zh: '壬', element: 'Thủy', polarity: '+', color: 'text-blue-600' },
  { index: 9, name: 'Quý',  romaji: 'Gui',  zh: '癸', element: 'Thủy', polarity: '-', color: 'text-blue-500' },
]

// ===== 12 Earthly Branches (Địa Chi) =====
export const EARTHLY_BRANCHES: Branch[] = [
  { index: 0,  name: 'Tý',   romaji: 'Zi',   zh: '子', element: 'Thủy', polarity: '+', hiddenStems: [9],    zodiac: 'Chuột' },
  { index: 1,  name: 'Sửu',  romaji: 'Chou', zh: '丑', element: 'Thổ',  polarity: '-', hiddenStems: [5,9,7], zodiac: 'Trâu' },
  { index: 2,  name: 'Dần',  romaji: 'Yin',  zh: '寅', element: 'Mộc',  polarity: '+', hiddenStems: [0,2,4], zodiac: 'Hổ' },
  { index: 3,  name: 'Mão',  romaji: 'Mao',  zh: '卯', element: 'Mộc',  polarity: '-', hiddenStems: [1],    zodiac: 'Mèo' },
  { index: 4,  name: 'Thìn', romaji: 'Chen', zh: '辰', element: 'Thổ',  polarity: '+', hiddenStems: [4,1,9], zodiac: 'Rồng' },
  { index: 5,  name: 'Tỵ',   romaji: 'Si',   zh: '巳', element: 'Hỏa',  polarity: '-', hiddenStems: [2,6,4], zodiac: 'Rắn' },
  { index: 6,  name: 'Ngọ',  romaji: 'Wu',   zh: '午', element: 'Hỏa',  polarity: '+', hiddenStems: [3,5],  zodiac: 'Ngựa' },
  { index: 7,  name: 'Mùi',  romaji: 'Wei',  zh: '未', element: 'Thổ',  polarity: '-', hiddenStems: [5,3,1], zodiac: 'Dê' },
  { index: 8,  name: 'Thân', romaji: 'Shen', zh: '申', element: 'Kim',  polarity: '+', hiddenStems: [6,8,4], zodiac: 'Khỉ' },
  { index: 9,  name: 'Dậu',  romaji: 'You',  zh: '酉', element: 'Kim',  polarity: '-', hiddenStems: [7],    zodiac: 'Gà' },
  { index: 10, name: 'Tuất', romaji: 'Xu',   zh: '戌', element: 'Thổ',  polarity: '+', hiddenStems: [4,3,7], zodiac: 'Chó' },
  { index: 11, name: 'Hợi',  romaji: 'Hai',  zh: '亥', element: 'Thủy', polarity: '-', hiddenStems: [8,0],  zodiac: 'Lợn' },
]

// ===== 60 Sexagenary Cycle Na Yin =====
// Each pair of consecutive indices shares the same Na Yin
// Index = (stemIndex + branchIndex * 5) % 60... actually it's stemIdx + the cycle position
// The 60 cycle: pair i has stem = i%10, branch = i%12
export const NA_YIN_TABLE: NaYin[] = [
  // 0-1: Giáp Tý, Ất Sửu
  { name: 'Hải Trung Kim', element: 'Kim' },
  { name: 'Hải Trung Kim', element: 'Kim' },
  // 2-3: Bính Dần, Đinh Mão
  { name: 'Lư Trung Hỏa', element: 'Hỏa' },
  { name: 'Lư Trung Hỏa', element: 'Hỏa' },
  // 4-5: Mậu Thìn, Kỷ Tỵ
  { name: 'Đại Lâm Mộc', element: 'Mộc' },
  { name: 'Đại Lâm Mộc', element: 'Mộc' },
  // 6-7: Canh Ngọ, Tân Mùi
  { name: 'Lộ Bàng Thổ', element: 'Thổ' },
  { name: 'Lộ Bàng Thổ', element: 'Thổ' },
  // 8-9: Nhâm Thân, Quý Dậu
  { name: 'Kiếm Phong Kim', element: 'Kim' },
  { name: 'Kiếm Phong Kim', element: 'Kim' },
  // 10-11: Giáp Tuất, Ất Hợi
  { name: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  { name: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  // 12-13: Bính Tý, Đinh Sửu
  { name: 'Giản Hạ Thủy', element: 'Thủy' },
  { name: 'Giản Hạ Thủy', element: 'Thủy' },
  // 14-15: Mậu Dần, Kỷ Mão
  { name: 'Thành Đầu Thổ', element: 'Thổ' },
  { name: 'Thành Đầu Thổ', element: 'Thổ' },
  // 16-17: Canh Thìn, Tân Tỵ
  { name: 'Bạch Lạp Kim', element: 'Kim' },
  { name: 'Bạch Lạp Kim', element: 'Kim' },
  // 18-19: Nhâm Ngọ, Quý Mùi
  { name: 'Dương Liễu Mộc', element: 'Mộc' },
  { name: 'Dương Liễu Mộc', element: 'Mộc' },
  // 20-21: Giáp Thân, Ất Dậu
  { name: 'Tuyền Trung Thủy', element: 'Thủy' },
  { name: 'Tuyền Trung Thủy', element: 'Thủy' },
  // 22-23: Bính Tuất, Đinh Hợi
  { name: 'Ốc Thượng Thổ', element: 'Thổ' },
  { name: 'Ốc Thượng Thổ', element: 'Thổ' },
  // 24-25: Mậu Tý, Kỷ Sửu
  { name: 'Tích Lịch Hỏa', element: 'Hỏa' },
  { name: 'Tích Lịch Hỏa', element: 'Hỏa' },
  // 26-27: Canh Dần, Tân Mão
  { name: 'Tùng Bách Mộc', element: 'Mộc' },
  { name: 'Tùng Bách Mộc', element: 'Mộc' },
  // 28-29: Nhâm Thìn, Quý Tỵ
  { name: 'Trường Lưu Thủy', element: 'Thủy' },
  { name: 'Trường Lưu Thủy', element: 'Thủy' },
  // 30-31: Giáp Ngọ, Ất Mùi
  { name: 'Sa Trung Kim', element: 'Kim' },
  { name: 'Sa Trung Kim', element: 'Kim' },
  // 32-33: Bính Thân, Đinh Dậu
  { name: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  { name: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  // 34-35: Mậu Tuất, Kỷ Hợi
  { name: 'Bình Địa Mộc', element: 'Mộc' },
  { name: 'Bình Địa Mộc', element: 'Mộc' },
  // 36-37: Canh Tý, Tân Sửu
  { name: 'Bích Thượng Thổ', element: 'Thổ' },
  { name: 'Bích Thượng Thổ', element: 'Thổ' },
  // 38-39: Nhâm Dần, Quý Mão
  { name: 'Kim Bạch Kim', element: 'Kim' },
  { name: 'Kim Bạch Kim', element: 'Kim' },
  // 40-41: Giáp Thìn, Ất Tỵ
  { name: 'Phú Đăng Hỏa', element: 'Hỏa' },
  { name: 'Phú Đăng Hỏa', element: 'Hỏa' },
  // 42-43: Bính Ngọ, Đinh Mùi
  { name: 'Thiên Hà Thủy', element: 'Thủy' },
  { name: 'Thiên Hà Thủy', element: 'Thủy' },
  // 44-45: Mậu Thân, Kỷ Dậu
  { name: 'Đại Trạch Thổ', element: 'Thổ' },
  { name: 'Đại Trạch Thổ', element: 'Thổ' },
  // 46-47: Canh Tuất, Tân Hợi
  { name: 'Thoa Xuyến Kim', element: 'Kim' },
  { name: 'Thoa Xuyến Kim', element: 'Kim' },
  // 48-49: Nhâm Tý, Quý Sửu
  { name: 'Tang Đố Mộc', element: 'Mộc' },
  { name: 'Tang Đố Mộc', element: 'Mộc' },
  // 50-51: Giáp Dần, Ất Mão
  { name: 'Đại Khê Thủy', element: 'Thủy' },
  { name: 'Đại Khê Thủy', element: 'Thủy' },
  // 52-53: Bính Thìn, Đinh Tỵ
  { name: 'Sa Trung Thổ', element: 'Thổ' },
  { name: 'Sa Trung Thổ', element: 'Thổ' },
  // 54-55: Mậu Ngọ, Kỷ Mùi
  { name: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  { name: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  // 56-57: Canh Thân, Tân Dậu
  { name: 'Thạch Lựu Mộc', element: 'Mộc' },
  { name: 'Thạch Lựu Mộc', element: 'Mộc' },
  // 58-59: Nhâm Tuất, Quý Hợi
  { name: 'Đại Hải Thủy', element: 'Thủy' },
  { name: 'Đại Hải Thủy', element: 'Thủy' },
]

// ===== 12 Life Cycle Stages (Vong Trường Sinh) =====
export const LIFE_CYCLE_STAGES = [
  'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan',
  'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng',
] as const

// Starting branch index for each yang stem's Trường Sinh position
// Yang Wood (Giáp+) starts at Hợi(11), Yang Fire (Bính+) starts at Dần(2),
// Yang Earth (Mậu+) starts at Dần(2), Yang Metal (Canh+) starts at Tỵ(5),
// Yang Water (Nhâm+) starts at Thân(8)
// Yin stems go reverse
export const TRUONG_SINH_START: Record<string, number> = {
  'Giáp': 11, // Hợi
  'Ất': 6,    // Ngọ (reverse)
  'Bính': 2,  // Dần
  'Đinh': 9,  // Dậu (reverse)
  'Mậu': 2,   // Dần (same as Bính)
  'Kỷ': 9,    // Dậu (same as Đinh)
  'Canh': 5,  // Tỵ
  'Tân': 0,   // Tý (reverse)
  'Nhâm': 8,  // Thân
  'Quý': 3,   // Mão (reverse)
}

// ===== Ten God Matrix =====
// Given daymaster element and target element, determine the Ten God
// The relationship depends on:
// 1. The five-element relationship (same, produces, produced-by, controls, controlled-by)
// 2. The polarity (same or different)

// Element indices: Mộc=0, Hỏa=1, Thổ=2, Kim=3, Thủy=4
export const ELEMENT_ORDER: FiveElement[] = ['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy']

// Ten God codes in Vietnamese
export const TEN_GOD_NAMES: Record<string, { code: string; name: string }> = {
  'same_same':    { code: 'TK', name: 'Tỷ Kiên' },      // Same element, same polarity
  'same_diff':    { code: 'KT', name: 'Kiếp Tài' },      // Same element, diff polarity
  'produce_same': { code: 'TH', name: 'Thực Thần' },     // I produce, same polarity
  'produce_diff': { code: 'TQ', name: 'Thương Quan' },    // I produce, diff polarity
  'wealth_same':  { code: 'CT', name: 'Chính Tài' },     // I control, diff polarity
  'wealth_diff':  { code: 'TT2', name: 'Thiên Tài' },    // I control, same polarity (Thiên Tài uses TT2 to avoid conflict)
  'power_same':   { code: 'CQ', name: 'Chính Quan' },    // Controls me, diff polarity
  'power_diff':   { code: 'TS', name: 'Thất Sát' },      // Controls me, same polarity
  'resource_same':{ code: 'CA', name: 'Chính Ấn' },      // Produces me, diff polarity
  'resource_diff':{ code: 'TA', name: 'Thiên Ấn' },      // Produces me, same polarity
}

// Producing cycle: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc
// Controlling cycle: Mộc→Thổ, Thổ→Thủy, Thủy→Hỏa, Hỏa→Kim, Kim→Mộc
export function getElementRelation(
  dayMasterElement: FiveElement,
  targetElement: FiveElement
): 'same' | 'produce' | 'wealth' | 'power' | 'resource' {
  const dmIdx = ELEMENT_ORDER.indexOf(dayMasterElement)
  const tIdx = ELEMENT_ORDER.indexOf(targetElement)

  if (dmIdx === tIdx) return 'same'
  if ((dmIdx + 1) % 5 === tIdx) return 'produce'   // I produce target
  if ((dmIdx + 2) % 5 === tIdx) return 'wealth'     // I control target
  if ((dmIdx + 3) % 5 === tIdx) return 'power'      // Target controls me
  return 'resource'                                   // Target produces me
}

// ===== Ten God Descriptions (from Kabala source) =====
export const TEN_GOD_DESCRIPTIONS: TenGodInfo[] = [
  {
    code: 'TK',
    name: 'Tỷ Kiên',
    sid: 'Anh em bạn bè, người tranh tài đoạt lợi, người hợp tác.',
    content: 'Tích cực: Cứng rắn nhưng khôn ngoan. Thích phát triển bản thân. Có sức mạnh ý chí tinh thần. Duyên dáng và rộng lượng. Xem bạn bè là bình đẳng. Tinh thần làm việc độc lập. Tự tin ngầm.\nTiêu cực: Thích đổ lỗi. Thích xen vào việc người khác. Suy nghĩ không linh hoạt, cứng đầu một chiều.',
  },
  {
    code: 'KT',
    name: 'Kiếp Tài',
    sid: 'Anh em bạn bè, người tranh tài đoạt lợi, người hợp tác.',
    content: 'Tích cực: Nói nhiều, vui vẻ. Người dễ dãi, rộng rãi. Kết bạn nhanh. Hướng ngoại. Có khả năng thuyết phục, bán hàng tốt. Bản tính lạc quan.\nTiêu cực: Khó giữ bí mật. Tự ti nhưng thể hiện tự tin. Cái tôi quá lớn. Chi tiêu quá độ.',
  },
  {
    code: 'TH',
    name: 'Thực Thần',
    sid: 'Con cái, thực lộc, phúc thọ, quan vận, nguồn tài nguyên, tài năng, văn nghệ.',
    content: 'Tích cực: Hướng nội. Suy nghĩ sâu sắc, thấu đáo. Tỉ mĩ, chi tiết, sống ngăn nắp. Óc phân tích khách quan. Có tính nghệ sĩ sáng tạo.\nTiêu cực: Mơ mộng không thực tế. Cứng đầu. Sống cô đơn. Thích cạnh khóe và mỉa mai.',
  },
  {
    code: 'TQ',
    name: 'Thương Quan',
    sid: 'Con cái, thực lộc, phúc thọ, quan vận, nguồn tài nguyên, tài năng, văn nghệ, thân thể béo phì.',
    content: 'Tích cực: Hướng ngoại. Lanh lợi, giao tiếp tốt. Thông minh sáng tạo. Quyết liệt, kiên trì. Thích thử thách. Yêu thích ánh đèn sân khấu.\nTiêu cực: Thích gây sốc. Phá vỡ luật lệ. Cứng đầu ngoan cố. Tâm trạng thất thường.',
  },
  {
    code: 'CT',
    name: 'Chính Tài',
    sid: 'Tài sản, lương, quản lý tiền tài, CHA, VỢ, người phụ nữ có tình cảm.',
    content: 'Tích cực: Có trách nhiệm. Đáng tin cậy. Quan niệm đúng sai rõ ràng. Sống thực tế, giản đơn. Sống có nguyên tắc. Thích lên kế hoạch.\nTiêu cực: Kiểm soát quá mức. Đầu óc cứng nhắc. Keo kiệt. Không thích rủi ro.',
  },
  {
    code: 'TT',
    name: 'Thiên Tài',
    sid: 'Tài sản, lương, quản lý tiền tài, CHA, VỢ, người phụ nữ có tình cảm.',
    content: 'Tích cực: Rộng rãi hào phóng. Óc kinh doanh sắc bén. Tầm nhìn lớn. Trực giác tốt. Thích mạo hiểm, cơ hội. Người đa nhiệm.\nTiêu cực: Không đáng tin về tài chính. Quá hào phóng. Thiếu kiên nhẫn. Làm việc ngẫu hứng.',
  },
  {
    code: 'CQ',
    name: 'Chính Quan',
    sid: 'Chức danh, địa vị, danh dự. Chồng, con cái, nghề nghiệp, tư pháp.',
    content: 'Tích cực: Trọng danh dự, thẳng thắn, sống nguyên tắc. Lịch sự, cư xử đúng mực. Tôn trọng truyền thống. Tính cách độc lập, ôn hòa.\nTiêu cực: Cứng nhắc không linh hoạt. Sợ thay đổi. Khó tính. Nhát, hay lo sợ.',
  },
  {
    code: 'TS',
    name: 'Thất Sát',
    sid: 'Chức danh, địa vị, danh dự. Chồng, con cái, nghề nghiệp, tư pháp, hung sát.',
    content: 'Tích cực: Ra lệnh và thích chỉ huy. Có hào quang cuốn hút. Không bao giờ tuyệt vọng. Đặt mục tiêu cao. Sắc bén, suy nghĩ nhanh.\nTiêu cực: Tâm trạng thất thường. Đại bàng cô đơn. Lạm dụng quyền lực. Độc tài.',
  },
  {
    code: 'CA',
    name: 'Chính Ấn',
    sid: 'Quyền lợi, địa vị, sự nghiệp, học vị. Có thể thành công: nghệ thuật, biểu diễn, nghề y, luật, tôn giáo.',
    content: 'Tích cực: Hiểu biết và có văn hóa. Tò mò. Xem trọng lời hứa. Cảm thông, sống có tình cảm. Lạc quan. Vị tha. Kiên nhẫn. Yêu hòa bình.\nTiêu cực: Phiền muộn. Quá vị tha. Thiếu thực tế. Sống cảm xúc.',
  },
  {
    code: 'TA',
    name: 'Thiên Ấn',
    sid: 'Quyền lợi, địa vị, sự nghiệp, học vị. Có thể thành công: nghệ thuật, biểu diễn, nghề y, luật, tôn giáo, tự do, dịch vụ.',
    content: 'Tích cực: Trực giác tốt. Khả năng học hỏi nhanh. Tính cách thoải mái. Kiến thức rộng về nhiều chủ đề. Người suy nghĩ sâu sắc.\nTiêu cực: Buông thả. Hay đa nghi. Khép mình nội tâm. Thiếu thực tế. Mê tín.',
  },
]

// ===== Five Element Colors =====
export const ELEMENT_COLORS: Record<FiveElement, string> = {
  'Mộc': 'text-green-600',
  'Hỏa': 'text-red-600',
  'Thổ': 'text-amber-700',
  'Kim': 'text-gray-500',
  'Thủy': 'text-blue-600',
}

export const ELEMENT_BG_COLORS: Record<FiveElement, string> = {
  'Mộc': 'bg-green-100',
  'Hỏa': 'bg-red-100',
  'Thổ': 'bg-amber-100',
  'Kim': 'bg-gray-100',
  'Thủy': 'bg-blue-100',
}

// ===== Nông Lịch Solar Terms =====
export const SOLAR_TERMS = [
  'Tiểu Hàn', 'Đại Hàn',     // Month 1 (Sửu)
  'Lập Xuân', 'Vũ Thủy',     // Month 2 (Dần)
  'Kinh Trập', 'Xuân Phân',   // Month 3 (Mão)
  'Thanh Minh', 'Cốc Vũ',     // Month 4 (Thìn)
  'Lập Hạ', 'Tiểu Mãn',      // Month 5 (Tỵ)
  'Mang Chủng', 'Hạ Chí',     // Month 6 (Ngọ)
  'Tiểu Thử', 'Đại Thử',     // Month 7 (Mùi)
  'Lập Thu', 'Xử Thử',       // Month 8 (Thân)
  'Bạch Lộ', 'Thu Phân',      // Month 9 (Dậu)
  'Hàn Lộ', 'Sương Giáng',    // Month 10 (Tuất)
  'Lập Đông', 'Tiểu Tuyết',   // Month 11 (Hợi)
  'Đại Tuyết', 'Đông Chí',    // Month 12 (Tý)
] as const

// The "Jie Qi" (節氣) major solar terms that mark month boundaries
// These are the odd-indexed solar terms (Lập Xuân, Kinh Trập, Thanh Minh, etc.)
export const MONTH_BOUNDARY_TERMS = [
  'Lập Xuân',   // Start of month 1 (Dần) - around Feb 4
  'Kinh Trập',  // Start of month 2 (Mão) - around Mar 6
  'Thanh Minh', // Start of month 3 (Thìn) - around Apr 5
  'Lập Hạ',     // Start of month 4 (Tỵ) - around May 6
  'Mang Chủng', // Start of month 5 (Ngọ) - around Jun 6
  'Tiểu Thử',   // Start of month 6 (Mùi) - around Jul 7
  'Lập Thu',     // Start of month 7 (Thân) - around Aug 7
  'Bạch Lộ',    // Start of month 8 (Dậu) - around Sep 8
  'Hàn Lộ',     // Start of month 9 (Tuất) - around Oct 8
  'Lập Đông',   // Start of month 10 (Hợi) - around Nov 7
  'Đại Tuyết',  // Start of month 11 (Tý) - around Dec 7
  'Tiểu Hàn',   // Start of month 12 (Sửu) - around Jan 6
] as const

// Month branch mapping: month 1 = Dần(2), month 2 = Mão(3), ..., month 12 = Sửu(1)
export const MONTH_BRANCH_INDEX = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1]

// ===== Double Hours =====
export const DOUBLE_HOURS = [
  { name: 'Tý',   start: 23, end: 1 },
  { name: 'Sửu',  start: 1,  end: 3 },
  { name: 'Dần',  start: 3,  end: 5 },
  { name: 'Mão',  start: 5,  end: 7 },
  { name: 'Thìn', start: 7,  end: 9 },
  { name: 'Tỵ',   start: 9,  end: 11 },
  { name: 'Ngọ',  start: 11, end: 13 },
  { name: 'Mùi',  start: 13, end: 15 },
  { name: 'Thân', start: 15, end: 17 },
  { name: 'Dậu',  start: 17, end: 19 },
  { name: 'Tuất', start: 19, end: 21 },
  { name: 'Hợi',  start: 21, end: 23 },
] as const

// Helper to get sexagenary cycle index from stem and branch indices
export function getSexagenaryCycleIndex(stemIdx: number, branchIdx: number): number {
  // The 60-cycle works because stem cycles every 10 and branch every 12
  // Only same-parity combinations are valid
  // Formula: find i where i%10==stemIdx and i%12==branchIdx, 0<=i<60
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stemIdx && i % 12 === branchIdx) return i
  }
  return 0 // fallback
}

// Helper to get Can Chi name from indices
export function getCanChiName(stemIdx: number, branchIdx: number): string {
  return `${HEAVENLY_STEMS[stemIdx].name} ${EARTHLY_BRANCHES[branchIdx].name}`
}
