import { NA_YIN_TABLE, getSexagenaryCycleIndex } from './constants'
import type { NaYin } from './types'

/**
 * Get Na Yin (納音) for a stem-branch pair
 */
export function getNaYin(stemIndex: number, branchIndex: number): NaYin {
  const cycleIdx = getSexagenaryCycleIndex(stemIndex, branchIndex)
  return NA_YIN_TABLE[cycleIdx]
}

/**
 * Get Na Yin description text
 */
export function getNaYinDescription(naYinName: string): string {
  const descriptions: Record<string, string> = {
    'Hải Trung Kim': 'Kim trong biển - Kim ẩn trong nước, bền bỉ và sâu sắc',
    'Lư Trung Hỏa': 'Hỏa trong lò - Lửa trong bếp, ấm áp và ổn định',
    'Đại Lâm Mộc': 'Gỗ rừng lớn - Cây đại thụ, vững chắc và che chở',
    'Lộ Bàng Thổ': 'Đất ven đường - Đất gần đường, hữu ích và thực tế',
    'Kiếm Phong Kim': 'Kim mũi kiếm - Kim sắc bén, quyết đoán',
    'Sơn Đầu Hỏa': 'Hỏa trên núi - Lửa trên đỉnh, tỏa sáng',
    'Giản Hạ Thủy': 'Thủy dưới khe - Nước suối, trong lành',
    'Thành Đầu Thổ': 'Đất trên thành - Đất thành trì, kiên cố',
    'Bạch Lạp Kim': 'Kim bạch lạp - Vàng trắng, quý giá tinh tế',
    'Dương Liễu Mộc': 'Gỗ dương liễu - Cây liễu, mềm mại uyển chuyển',
    'Tuyền Trung Thủy': 'Thủy trong suối - Nước trong nguồn, nguyên sơ',
    'Ốc Thượng Thổ': 'Đất trên nóc - Đất mái nhà, bảo vệ',
    'Tích Lịch Hỏa': 'Hỏa sấm sét - Lửa sấm, mạnh mẽ bùng nổ',
    'Tùng Bách Mộc': 'Gỗ tùng bách - Cây tùng bách, trường thọ',
    'Trường Lưu Thủy': 'Thủy chảy dài - Nước sông dài, bền bỉ',
    'Sa Trung Kim': 'Kim trong cát - Vàng lẫn cát, cần khai phá',
    'Sơn Hạ Hỏa': 'Hỏa dưới núi - Lửa chân núi, tiềm ẩn',
    'Bình Địa Mộc': 'Gỗ đất bằng - Cây đồng bằng, phát triển',
    'Bích Thượng Thổ': 'Đất trên vách - Đất tường, kiến tạo',
    'Kim Bạch Kim': 'Kim vàng bạc - Vàng ròng bạc trắng, cao quý',
    'Phú Đăng Hỏa': 'Hỏa đèn Phật - Lửa đèn thờ, linh thiêng',
    'Thiên Hà Thủy': 'Thủy ngân hà - Nước sông Ngân, bao la',
    'Đại Trạch Thổ': 'Đất bãi lớn - Đất rộng lớn, bao dung',
    'Thoa Xuyến Kim': 'Kim trang sức - Vàng xuyến vòng, xinh đẹp',
    'Tang Đố Mộc': 'Gỗ dâu tằm - Cây dâu, nuôi dưỡng',
    'Đại Khê Thủy': 'Thủy khe lớn - Nước khe suối lớn, mạnh mẽ',
    'Sa Trung Thổ': 'Đất trong cát - Đất pha cát, linh hoạt',
    'Thiên Thượng Hỏa': 'Hỏa trên trời - Lửa thiên thượng, rực rỡ',
    'Thạch Lựu Mộc': 'Gỗ thạch lựu - Cây lựu đá, bền vững',
    'Đại Hải Thủy': 'Thủy biển lớn - Nước đại dương, vô tận',
  }
  return descriptions[naYinName] || naYinName
}
