import { HEAVENLY_STEMS, LIFE_CYCLE_STAGES, TRUONG_SINH_START } from './constants'
import type { VongTruongSinhInfo } from './types'

/**
 * Get the Vong Truong Sinh (生旺死絕) life cycle stage
 * for a given daymaster and target branch
 */
export function getVongTruongSinh(dayMasterIndex: number, branchIndex: number): VongTruongSinhInfo {
  const stem = HEAVENLY_STEMS[dayMasterIndex]
  const startBranch = TRUONG_SINH_START[stem.name]

  let stageIndex: number
  if (stem.polarity === '+') {
    // Yang stems: count forward
    stageIndex = ((branchIndex - startBranch) % 12 + 12) % 12
  } else {
    // Yin stems: count backward
    stageIndex = ((startBranch - branchIndex) % 12 + 12) % 12
  }

  return {
    name: LIFE_CYCLE_STAGES[stageIndex],
    index: stageIndex,
  }
}

/**
 * Get description for a life cycle stage
 */
export function getVongTruongSinhDescription(stageName: string): string {
  const descriptions: Record<string, string> = {
    'Trường Sinh': 'Sinh ra, khởi đầu mới, được nuôi dưỡng. Tương tự như em bé mới sinh.',
    'Mộc Dục': 'Tắm rửa, thanh lọc. Giai đoạn dễ bị tổn thương nhưng cũng là cơ hội làm mới.',
    'Quan Đới': 'Đội mũ, trưởng thành. Bắt đầu có trách nhiệm và được công nhận.',
    'Lâm Quan': 'Nhậm chức, thăng tiến. Đạt đến vị trí quyền lực và ảnh hưởng.',
    'Đế Vượng': 'Đỉnh cao, cực thịnh. Năng lượng mạnh nhất nhưng cũng là điểm bắt đầu suy.',
    'Suy': 'Bắt đầu suy yếu. Cần biết giữ gìn và bảo tồn.',
    'Bệnh': 'Ốm đau, yếu đuối. Cần nghỉ ngơi và phục hồi.',
    'Tử': 'Kết thúc một chu kỳ. Không nhất thiết xấu, có thể là sự chuyển hóa.',
    'Mộ': 'Chôn cất, lưu trữ. Năng lượng được cất giữ, tích lũy.',
    'Tuyệt': 'Tuyệt diệt, cạn kiệt. Giai đoạn thấp nhất trước khi tái sinh.',
    'Thai': 'Thụ thai, mầm mống. Bắt đầu hình thành năng lượng mới.',
    'Dưỡng': 'Nuôi dưỡng, thai nghén. Chuẩn bị cho sự ra đời mới.',
  }
  return descriptions[stageName] || stageName
}
