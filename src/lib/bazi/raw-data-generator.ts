import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './constants'
import type { BaziResult, BirthInput } from './types'

/**
 * Generate raw text data for AI analysis
 * This creates a structured prompt that can be copied and pasted
 * into ChatGPT, Gemini, or other AI chatbots for Bazi reading.
 */
export function generateRawDataForAI(result: BaziResult, input: BirthInput): string {
  const { tutru, daivan } = result
  const { thienTru, nguyetTru, nhatTru, thoiTru } = tutru

  const lines: string[] = []

  lines.push('=== THÔNG TIN BÁT TỰ / BAZI CHART ===')
  lines.push('')
  lines.push(`Họ tên: ${input.name}`)
  lines.push(`Giới tính: ${input.gender === 'male' ? 'Nam' : 'Nữ'}`)
  lines.push(`Ngày sinh dương lịch: ${input.day}/${input.month}/${input.year}`)
  lines.push(`Giờ sinh: ${input.hour}:${String(input.minute).padStart(2, '0')}`)
  lines.push(`Ngày sinh âm lịch: ${result.date.lunar.day}/${result.date.lunar.month}/${result.date.lunar.year}`)
  lines.push('')

  // Four Pillars
  lines.push('=== TỨ TRỤ (BỐN CỘT) ===')
  lines.push('')
  lines.push('         | Năm (年柱)    | Tháng (月柱)   | Ngày (日柱)    | Giờ (時柱)')
  lines.push('---------+--------------+---------------+--------------+--------------')
  lines.push(`Thiên Can | ${thienTru.can.padEnd(12)} | ${nguyetTru.can.padEnd(13)} | ${nhatTru.can.padEnd(12)} | ${thoiTru.can}`)
  lines.push(`Ngũ Hành  | ${thienTru.canNguHanh.padEnd(12)} | ${nguyetTru.canNguHanh.padEnd(13)} | ${nhatTru.canNguHanh.padEnd(12)} | ${thoiTru.canNguHanh}`)
  lines.push(`Thập Thần | ${thienTru.thapThan.name.padEnd(12)} | ${nguyetTru.thapThan.name.padEnd(13)} | ${nhatTru.thapThan.name.padEnd(12)} | ${thoiTru.thapThan.name}`)
  lines.push(`Địa Chi  | ${thienTru.chi.padEnd(12)} | ${nguyetTru.chi.padEnd(13)} | ${nhatTru.chi.padEnd(12)} | ${thoiTru.chi}`)
  lines.push(`Ngũ Hành  | ${thienTru.chiNguHanh.padEnd(12)} | ${nguyetTru.chiNguHanh.padEnd(13)} | ${nhatTru.chiNguHanh.padEnd(12)} | ${thoiTru.chiNguHanh}`)
  lines.push('')

  // Hidden Stems
  lines.push('Tàng Can:')
  const formatTangCan = (tc: typeof thienTru.tangCan) =>
    tc.map(t => `${t.thapThan.code}:${t.can}(${t.nguHanh})`).join(', ')
  lines.push(`  Năm:   ${formatTangCan(thienTru.tangCan)}`)
  lines.push(`  Tháng: ${formatTangCan(nguyetTru.tangCan)}`)
  lines.push(`  Ngày:  ${formatTangCan(nhatTru.tangCan)}`)
  lines.push(`  Giờ:   ${formatTangCan(thoiTru.tangCan)}`)
  lines.push('')

  // Na Yin
  lines.push('Nạp Âm:')
  lines.push(`  Năm:   ${thienTru.naYin.name} (${thienTru.naYin.element})`)
  lines.push(`  Tháng: ${nguyetTru.naYin.name} (${nguyetTru.naYin.element})`)
  lines.push(`  Ngày:  ${nhatTru.naYin.name} (${nhatTru.naYin.element})`)
  lines.push(`  Giờ:   ${thoiTru.naYin.name} (${thoiTru.naYin.element})`)
  lines.push('')

  // Day Master
  lines.push(`Nhật Chủ (Day Master): ${nhatTru.can} (${nhatTru.canNguHanh})`)
  lines.push('')

  // Dai Van
  lines.push('=== ĐẠI VẬN (LUCK CYCLES) ===')
  lines.push('')
  for (const cycle of daivan.cycles) {
    lines.push(`Tuổi ${cycle.startAge}-${cycle.startAge + 9} (${cycle.startYear}-${cycle.startYear + 9}): ${cycle.can} ${cycle.chi} | ${cycle.thapThan.name} | ${cycle.naYin.name} | ${cycle.vongTruongSinh.name}`)
  }
  lines.push('')

  // Instructions for AI
  lines.push('=== YÊU CẦU PHÂN TÍCH ===')
  lines.push('')
  lines.push('Dựa trên thông tin Bát Tự ở trên, hãy phân tích chi tiết:')
  lines.push('1. Tính cách và đặc điểm nổi bật của người này')
  lines.push('2. Điểm mạnh và điểm yếu')
  lines.push('3. Sự nghiệp và tài chính')
  lines.push('4. Tình cảm và hôn nhân')
  lines.push('5. Sức khỏe')
  lines.push('6. Phân tích đại vận hiện tại và tương lai')

  // Chart Analysis
  if (result.analysis) {
    lines.push('')
    lines.push('=== QUAN HỆ CAN CHI ===')
    for (const rel of result.analysis.relationships) {
      lines.push(`${rel.label}${rel.strength ? ` (${rel.strength})` : ''}`)
    }

    lines.push('')
    lines.push('=== VƯỢNG SUY THEO THÁNG ===')
    for (const s of result.analysis.seasonalStrength) {
      lines.push(`${s.element}: ${s.state}`)
    }

    lines.push('')
    lines.push('=== GỐC RỄ THIÊN CAN ===')
    const pillarNames = ['Năm', 'Tháng', 'Ngày', 'Giờ']
    for (const sr of result.analysis.stemRootedness) {
      lines.push(`${pillarNames[sr.pillarIndex]} ${sr.canName}: ${sr.isRooted ? `có gốc (${sr.rootStrength})` : 'hư phù'}`)
    }

    lines.push('')
    lines.push('=== ĐẢNG THẾ NGŨ HÀNH ===')
    for (const f of result.analysis.factions.filter(f => f.strength > 0)) {
      lines.push(`#${f.rank} ${f.element}: ${f.leaders.length} lãnh đạo, ${f.supporters.length} chi hỗ trợ, sức mạnh ${f.strength}`)
    }
  }

  return lines.join('\n')
}

/**
 * 50 Deep Destiny Questions for random selection
 */
export const DESTINY_QUESTIONS = [
  'Nhật chủ của tôi thuộc ngũ hành gì và điều đó nói gì về tính cách cốt lõi?',
  'Thập Thần nào chiếm ưu thế trong lá số và ảnh hưởng thế nào đến cuộc sống?',
  'Ngũ hành nào thiếu hoặc yếu trong lá số và cần bổ sung như thế nào?',
  'Đại vận hiện tại ảnh hưởng thế nào đến sự nghiệp và tài chính?',
  'Khi nào là thời điểm tốt nhất để khởi nghiệp hoặc đầu tư?',
  'Lá số cho thấy gì về khả năng lãnh đạo và quản lý?',
  'Tàng can trong các cột cho biết gì về tiềm năng ẩn giấu?',
  'Mối quan hệ giữa các trụ cho thấy gì về gia đình?',
  'Thần sát nào đáng chú ý nhất trong lá số?',
  'Nạp âm của ngày sinh cho biết gì về bản chất sâu xa?',
  'Đào Hoa và Hồng Diễm cho thấy gì về đời sống tình cảm?',
  'Lá số cho thấy gì về sức khỏe và tuổi thọ?',
  'Khi nào là giai đoạn khó khăn nhất và cách vượt qua?',
  'Nghề nghiệp nào phù hợp nhất dựa trên ngũ hành?',
  'Phương hướng nào tốt nhất cho công việc và sinh sống?',
  'Lá số cho biết gì về tài lộc và cách quản lý tiền bạc?',
  'Mối quan hệ vợ chồng/bạn đời sẽ như thế nào?',
  'Con cái trong lá số thể hiện ra sao?',
  'Đại vận nào sẽ mang lại nhiều may mắn nhất?',
  'Lá số cho thấy gì về khả năng học tập và tri thức?',
  'Kiếp Tài hoặc Tỷ Kiên trong lá số ảnh hưởng gì?',
  'Thương Quan hoặc Thực Thần nói gì về tài năng sáng tạo?',
  'Chính Quan hoặc Thất Sát cho biết gì về sự nghiệp công quyền?',
  'Chính Ấn hoặc Thiên Ấn ảnh hưởng thế nào đến học vấn?',
  'Chính Tài hoặc Thiên Tài cho biết gì về thu nhập?',
  'Hành vận năm nay có thuận lợi không?',
  'Có nên thay đổi công việc trong giai đoạn này?',
  'Lá số có dấu hiệu đi nước ngoài hay di cư không?',
  'Vong Trường Sinh ở các cột cho biết gì về năng lượng sống?',
  'Xung, Hợp giữa các chi cho thấy điều gì?',
  'Có nên kết hôn hoặc hợp tác trong giai đoạn này?',
  'Lá số cho thấy gì về quan hệ với bố mẹ?',
  'Đại vận tiếp theo sẽ mang lại thay đổi gì lớn?',
  'Lá số có dấu hiệu của sự nổi tiếng hay thành công lớn?',
  'Màu sắc và con số may mắn dựa trên ngũ hành?',
  'Thai Cung và Mệnh Cung cho biết gì về tiền kiếp?',
  'Cách cân bằng ngũ hành trong cuộc sống hàng ngày?',
  'Lá số có phù hợp với kinh doanh riêng không?',
  'Giai đoạn nào nên cẩn thận về sức khỏe?',
  'Có nên đầu tư bất động sản trong giai đoạn này?',
  'Lá số cho thấy gì về tâm linh và trực giác?',
  'Người sinh cùng ngày nhưng khác giờ sẽ khác nhau thế nào?',
  'Cách khắc phục khi ngũ hành bất cân bằng?',
  'Lá số có dấu hiệu của tài năng nghệ thuật không?',
  'Mùa nào trong năm thuận lợi nhất cho tôi?',
  'Có nên thay đổi nơi ở hoặc di chuyển?',
  'Lá số cho thấy gì về mối quan hệ với anh chị em?',
  'Cách tận dụng đại vận thuận lợi sắp tới?',
  'Lá số có cho thấy khả năng giàu có lớn không?',
  'Điều gì cần cảnh giác nhất trong 5 năm tới?',
]

/**
 * Get random destiny questions
 */
export function getRandomQuestions(count: number = 5): string[] {
  const shuffled = [...DESTINY_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
