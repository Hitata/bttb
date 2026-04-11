/**
 * Generate a short personality description based on Bazi chart data.
 * Uses the Day Master (Nhật Chủ) and element balance to describe the person.
 */

import { HEAVENLY_STEMS } from './constants'
import type { BaziResult } from './types'

// Day Master personality archetypes (Vietnamese)
const DAY_MASTER_DESCRIPTIONS: Record<string, { nature: string; traits: string }> = {
  'Giáp': {
    nature: 'cây đại thụ',
    traits: 'chính trực, có chí tiến thủ, thích dẫn đầu và bảo vệ người khác',
  },
  'Ất': {
    nature: 'cỏ hoa mềm mại',
    traits: 'linh hoạt, khéo léo thích nghi, có sức sống bền bỉ và tinh tế',
  },
  'Bính': {
    nature: 'mặt trời rực rỡ',
    traits: 'nhiệt tình, hào phóng, tỏa sáng và truyền cảm hứng cho mọi người',
  },
  'Đinh': {
    nature: 'ngọn nến ấm áp',
    traits: 'chu đáo, sâu sắc, ấm áp trong tình cảm và tinh tế trong suy nghĩ',
  },
  'Mậu': {
    nature: 'núi non vững chãi',
    traits: 'đáng tin cậy, kiên định, bao dung và là chỗ dựa cho người khác',
  },
  'Kỷ': {
    nature: 'đất ruộng màu mỡ',
    traits: 'cẩn thận, biết nuôi dưỡng, thực tế và chu đáo trong từng chi tiết',
  },
  'Canh': {
    nature: 'kim loại cứng cỏi',
    traits: 'quyết đoán, thẳng thắn, có tinh thần nghĩa hiệp và ý chí mạnh mẽ',
  },
  'Tân': {
    nature: 'trang sức tinh xảo',
    traits: 'tinh tế, có gu thẩm mỹ cao, nhạy cảm và đầy sáng tạo',
  },
  'Nhâm': {
    nature: 'dòng sông cuồn cuộn',
    traits: 'thông minh, năng động, thích tự do và có tầm nhìn rộng lớn',
  },
  'Quý': {
    nature: 'giọt sương mai',
    traits: 'trực giác tốt, dịu dàng, giàu trí tuệ và biết quan sát tinh tường',
  },
}

/**
 * Generate a short Vietnamese description of the person based on their Bazi chart.
 */
export function generateDescription(baziResult: BaziResult): string {
  const stem = HEAVENLY_STEMS[baziResult.dayMasterIndex]
  const desc = DAY_MASTER_DESCRIPTIONS[stem.name]
  if (!desc) return ''

  const elementMap: Record<string, string> = {
    'Mộc': 'Mộc (Gỗ)',
    'Hỏa': 'Hỏa (Lửa)',
    'Thổ': 'Thổ (Đất)',
    'Kim': 'Kim (Kim loại)',
    'Thủy': 'Thủy (Nước)',
  }

  const elementLabel = elementMap[stem.element] ?? stem.element
  const polarity = stem.polarity === '+' ? 'Dương' : 'Âm'

  return `Nhật Chủ ${stem.name} mang bản chất ${desc.nature}, thuộc hành ${elementLabel} ${polarity}. Người ${desc.traits}.`
}
