// Human Design Gate Descriptions
//
// Each HD gate = one I Ching hexagram (same number).
// This file provides HD-specific themes for each gate.
// I Ching names (nameVi, nameZh, nameEn) are loaded from the Hexagram DB model at runtime.

export interface GateDescription {
  readonly gate: number
  readonly hdName: string          // HD-specific gate name
  readonly theme: { readonly vn: string; readonly en: string }
  readonly center: string          // which center this gate belongs to
}

// Gate-to-center mapping (which center each gate resides in)
const GATE_CENTERS: Record<number, string> = {
  // Head
  64: 'head', 61: 'head', 63: 'head',
  // Ajna
  47: 'ajna', 24: 'ajna', 4: 'ajna', 17: 'ajna', 43: 'ajna', 11: 'ajna',
  // Throat
  62: 'throat', 23: 'throat', 56: 'throat', 16: 'throat', 20: 'throat',
  31: 'throat', 8: 'throat', 33: 'throat', 35: 'throat', 12: 'throat', 45: 'throat',
  // G Center
  7: 'g', 1: 'g', 13: 'g', 10: 'g', 25: 'g', 46: 'g', 2: 'g', 15: 'g',
  // Heart/Will
  21: 'heart', 26: 'heart', 51: 'heart', 40: 'heart',
  // Sacral
  34: 'sacral', 5: 'sacral', 14: 'sacral', 29: 'sacral', 59: 'sacral',
  9: 'sacral', 3: 'sacral', 42: 'sacral', 27: 'sacral',
  // Solar Plexus
  36: 'solar-plexus', 22: 'solar-plexus', 37: 'solar-plexus', 6: 'solar-plexus',
  49: 'solar-plexus', 55: 'solar-plexus', 30: 'solar-plexus',
  // Spleen
  48: 'spleen', 57: 'spleen', 44: 'spleen', 50: 'spleen',
  32: 'spleen', 28: 'spleen', 18: 'spleen',
  // Root
  58: 'root', 38: 'root', 54: 'root', 53: 'root', 60: 'root',
  52: 'root', 19: 'root', 39: 'root', 41: 'root',
}

// HD gate themes (name + Vietnamese/English theme)
const GATE_DATA: readonly GateDescription[] = [
  { gate: 1, hdName: 'Self-Expression', theme: { vn: 'Biểu đạt sáng tạo bản thân', en: 'Creative self-expression' }, center: 'g' },
  { gate: 2, hdName: 'The Direction of the Self', theme: { vn: 'Hướng đi của bản thể, thụ động tiếp nhận', en: 'Direction of the self, receptive knowing' }, center: 'g' },
  { gate: 3, hdName: 'Ordering', theme: { vn: 'Đổi mới qua khó khăn ban đầu', en: 'Innovation through initial difficulty' }, center: 'sacral' },
  { gate: 4, hdName: 'Formulization', theme: { vn: 'Công thức hóa câu trả lời logic', en: 'Formulating logical answers' }, center: 'ajna' },
  { gate: 5, hdName: 'Fixed Rhythms', theme: { vn: 'Nhịp điệu cố định, chờ đợi tự nhiên', en: 'Fixed rhythms, natural waiting' }, center: 'sacral' },
  { gate: 6, hdName: 'Friction', theme: { vn: 'Ma sát cảm xúc dẫn đến thân mật', en: 'Emotional friction leading to intimacy' }, center: 'solar-plexus' },
  { gate: 7, hdName: 'The Role of the Self', theme: { vn: 'Vai trò lãnh đạo, hướng dẫn tương lai', en: 'Leadership role, guiding the future' }, center: 'g' },
  { gate: 8, hdName: 'Contribution', theme: { vn: 'Đóng góp cá nhân, phong cách riêng', en: 'Individual contribution, unique style' }, center: 'throat' },
  { gate: 9, hdName: 'The Taming Power of the Small', theme: { vn: 'Sức mạnh tập trung vào chi tiết', en: 'Power of focus on details' }, center: 'sacral' },
  { gate: 10, hdName: 'Treading (Behavior of the Self)', theme: { vn: 'Hành vi bản thể, yêu bản thân', en: 'Behavior of the self, self-love' }, center: 'g' },
  { gate: 11, hdName: 'Peace (Ideas)', theme: { vn: 'Ý tưởng dồi dào, chia sẻ tầm nhìn', en: 'Abundance of ideas, sharing vision' }, center: 'ajna' },
  { gate: 12, hdName: 'Caution (Standstill)', theme: { vn: 'Thận trọng trong biểu đạt cảm xúc', en: 'Caution in emotional expression' }, center: 'throat' },
  { gate: 13, hdName: 'The Listener', theme: { vn: 'Người lắng nghe, giữ bí mật', en: 'The listener, keeper of secrets' }, center: 'g' },
  { gate: 14, hdName: 'Power Skills', theme: { vn: 'Kỹ năng quyền lực, phong phú tài nguyên', en: 'Power skills, abundance of resources' }, center: 'sacral' },
  { gate: 15, hdName: 'Extremes', theme: { vn: 'Nhịp điệu cực đoan, yêu nhân loại', en: 'Extremes of rhythm, love of humanity' }, center: 'g' },
  { gate: 16, hdName: 'Skills (Enthusiasm)', theme: { vn: 'Kỹ năng và nhiệt huyết biểu đạt', en: 'Skills and enthusiasm in expression' }, center: 'throat' },
  { gate: 17, hdName: 'Opinions', theme: { vn: 'Quan điểm logic, theo dõi mẫu hình', en: 'Logical opinions, following patterns' }, center: 'ajna' },
  { gate: 18, hdName: 'Correction', theme: { vn: 'Sửa chữa, phán xét để cải thiện', en: 'Correction, judgment for improvement' }, center: 'spleen' },
  { gate: 19, hdName: 'Wanting (Approach)', theme: { vn: 'Muốn, tiếp cận nhu cầu cơ bản', en: 'Wanting, approaching basic needs' }, center: 'root' },
  { gate: 20, hdName: 'The Now (Contemplation)', theme: { vn: 'Hiện tại, chiêm nghiệm khoảnh khắc', en: 'The now, contemplation of the moment' }, center: 'throat' },
  { gate: 21, hdName: 'The Hunter/Huntress', theme: { vn: 'Kiểm soát, ý chí chinh phục', en: 'Control, willpower to conquer' }, center: 'heart' },
  { gate: 22, hdName: 'Openness (Grace)', theme: { vn: 'Duyên dáng cảm xúc, cởi mở', en: 'Emotional grace, openness' }, center: 'solar-plexus' },
  { gate: 23, hdName: 'Assimilation (Splitting Apart)', theme: { vn: 'Đồng hóa, dịch cái mới thành lời', en: 'Assimilation, translating the new into words' }, center: 'throat' },
  { gate: 24, hdName: 'Rationalization (Return)', theme: { vn: 'Hợp lý hóa, suy nghĩ trở lại', en: 'Rationalization, returning thought' }, center: 'ajna' },
  { gate: 25, hdName: 'The Spirit of the Self (Innocence)', theme: { vn: 'Tinh thần ngây thơ, tình yêu vũ trụ', en: 'Spirit of innocence, universal love' }, center: 'g' },
  { gate: 26, hdName: 'The Egoist (Taming Power of the Great)', theme: { vn: 'Người tự kỷ, sức mạnh thuyết phục', en: 'The egoist, power of persuasion' }, center: 'heart' },
  { gate: 27, hdName: 'Nourishment (Caring)', theme: { vn: 'Nuôi dưỡng, chăm sóc người khác', en: 'Nourishment, caring for others' }, center: 'sacral' },
  { gate: 28, hdName: 'The Game Player (Preponderance of the Great)', theme: { vn: 'Đấu tranh tìm ý nghĩa cuộc sống', en: 'Struggling to find meaning in life' }, center: 'spleen' },
  { gate: 29, hdName: 'The Abysmal (Saying Yes)', theme: { vn: 'Cam kết, nói đồng ý với trải nghiệm', en: 'Commitment, saying yes to experience' }, center: 'sacral' },
  { gate: 30, hdName: 'The Clinging Fire (Feelings)', theme: { vn: 'Bám víu cảm xúc, khao khát trải nghiệm', en: 'Clinging feelings, desire for experience' }, center: 'solar-plexus' },
  { gate: 31, hdName: 'Influence (Leading)', theme: { vn: 'Ảnh hưởng, lãnh đạo dân chủ', en: 'Influence, democratic leadership' }, center: 'throat' },
  { gate: 32, hdName: 'Continuity (Duration)', theme: { vn: 'Liên tục, bản năng sinh tồn', en: 'Continuity, survival instinct' }, center: 'spleen' },
  { gate: 33, hdName: 'Privacy (Retreat)', theme: { vn: 'Rút lui, ghi nhớ quá khứ', en: 'Retreat, remembering the past' }, center: 'throat' },
  { gate: 34, hdName: 'The Power of the Great', theme: { vn: 'Sức mạnh thuần túy, năng lượng dồi dào', en: 'Pure power, abundant energy' }, center: 'sacral' },
  { gate: 35, hdName: 'Change (Progress)', theme: { vn: 'Thay đổi, khao khát trải nghiệm mới', en: 'Change, craving new experience' }, center: 'throat' },
  { gate: 36, hdName: 'The Darkening of the Light (Crisis)', theme: { vn: 'Khủng hoảng cảm xúc dẫn đến trải nghiệm', en: 'Emotional crisis leading to experience' }, center: 'solar-plexus' },
  { gate: 37, hdName: 'Friendship (The Family)', theme: { vn: 'Tình bạn, giao ước gia đình', en: 'Friendship, family bargains' }, center: 'solar-plexus' },
  { gate: 38, hdName: 'The Fighter (Opposition)', theme: { vn: 'Chiến binh, đấu tranh cho mục đích', en: 'The fighter, struggling for purpose' }, center: 'root' },
  { gate: 39, hdName: 'Provocation (Obstruction)', theme: { vn: 'Khiêu khích, kích thích tinh thần', en: 'Provocation, stimulating spirit' }, center: 'root' },
  { gate: 40, hdName: 'Aloneness (Deliverance)', theme: { vn: 'Cô đơn, giải thoát qua nghỉ ngơi', en: 'Aloneness, deliverance through rest' }, center: 'heart' },
  { gate: 41, hdName: 'Contraction (Decrease)', theme: { vn: 'Thu hẹp, tưởng tượng khả năng', en: 'Contraction, imagining possibilities' }, center: 'root' },
  { gate: 42, hdName: 'Growth (Increase)', theme: { vn: 'Phát triển, hoàn thành chu kỳ', en: 'Growth, completing cycles' }, center: 'sacral' },
  { gate: 43, hdName: 'Insight (Breakthrough)', theme: { vn: 'Thấu hiểu đột phá, nghe nội tâm', en: 'Breakthrough insight, inner hearing' }, center: 'ajna' },
  { gate: 44, hdName: 'Coming to Meet (Alertness)', theme: { vn: 'Cảnh giác, nhận biết mẫu hình', en: 'Alertness, recognizing patterns' }, center: 'spleen' },
  { gate: 45, hdName: 'The Gatherer (Gathering Together)', theme: { vn: 'Tập hợp, vua/nữ hoàng tài nguyên', en: 'Gathering, king/queen of resources' }, center: 'throat' },
  { gate: 46, hdName: 'Pushing Upward (The Determination of the Self)', theme: { vn: 'Quyết tâm bản thể, yêu thân thể', en: 'Determination of the self, love of the body' }, center: 'g' },
  { gate: 47, hdName: 'Realization (Oppression)', theme: { vn: 'Nhận ra, hiểu biết trừu tượng', en: 'Realization, abstract understanding' }, center: 'ajna' },
  { gate: 48, hdName: 'Depth (The Well)', theme: { vn: 'Chiều sâu, giếng tri thức', en: 'Depth, the well of knowledge' }, center: 'spleen' },
  { gate: 49, hdName: 'Principles (Revolution)', theme: { vn: 'Nguyên tắc, cách mạng từ chối/chấp nhận', en: 'Principles, revolution of rejection/acceptance' }, center: 'solar-plexus' },
  { gate: 50, hdName: 'Values (The Cauldron)', theme: { vn: 'Giá trị, trách nhiệm với bộ lạc', en: 'Values, responsibility to the tribe' }, center: 'spleen' },
  { gate: 51, hdName: 'Shock (The Arousing)', theme: { vn: 'Sốc, cạnh tranh cá nhân', en: 'Shock, individual competition' }, center: 'heart' },
  { gate: 52, hdName: 'Stillness (Keeping Still)', theme: { vn: 'Tĩnh lặng, tập trung áp lực', en: 'Stillness, focused pressure' }, center: 'root' },
  { gate: 53, hdName: 'Development (Beginnings)', theme: { vn: 'Khởi đầu, áp lực bắt đầu chu kỳ', en: 'Beginnings, pressure to start cycles' }, center: 'root' },
  { gate: 54, hdName: 'Ambition (The Marrying Maiden)', theme: { vn: 'Tham vọng, thúc đẩy vươn lên', en: 'Ambition, drive to rise' }, center: 'root' },
  { gate: 55, hdName: 'Spirit (Abundance)', theme: { vn: 'Tinh thần phong phú, sóng cảm xúc', en: 'Abundant spirit, emotional wave' }, center: 'solar-plexus' },
  { gate: 56, hdName: 'Stimulation (The Wanderer)', theme: { vn: 'Kích thích, kể chuyện lang thang', en: 'Stimulation, wandering storyteller' }, center: 'throat' },
  { gate: 57, hdName: 'The Gentle (Intuitive Clarity)', theme: { vn: 'Rõ ràng trực giác, nhẹ nhàng thấu hiểu', en: 'Intuitive clarity, gentle penetration' }, center: 'spleen' },
  { gate: 58, hdName: 'The Joyous (Vitality)', theme: { vn: 'Niềm vui sống, sinh lực phán xét', en: 'Joy of life, vital judgment' }, center: 'root' },
  { gate: 59, hdName: 'Sexuality (Dispersion)', theme: { vn: 'Tính dục, phá vỡ rào cản', en: 'Sexuality, breaking down barriers' }, center: 'sacral' },
  { gate: 60, hdName: 'Limitation (Acceptance)', theme: { vn: 'Giới hạn, chấp nhận áp lực đột biến', en: 'Limitation, accepting mutative pressure' }, center: 'root' },
  { gate: 61, hdName: 'Inner Truth (Mystery)', theme: { vn: 'Sự thật nội tâm, áp lực biết', en: 'Inner truth, pressure to know' }, center: 'head' },
  { gate: 62, hdName: 'Preponderance of the Small (Details)', theme: { vn: 'Chi tiết, biểu đạt sự thật logic', en: 'Details, expressing logical facts' }, center: 'throat' },
  { gate: 63, hdName: 'After Completion (Doubt)', theme: { vn: 'Hoài nghi logic, áp lực câu hỏi', en: 'Logical doubt, pressure to question' }, center: 'head' },
  { gate: 64, hdName: 'Before Completion (Confusion)', theme: { vn: 'Hoang mang trước khi hoàn thành, áp lực hiểu', en: 'Confusion before completion, pressure to make sense' }, center: 'head' },
]

// Fast lookup by gate number
const GATE_MAP = new Map(GATE_DATA.map(g => [g.gate, g]))

export function getGateDescription(gate: number): GateDescription | undefined {
  return GATE_MAP.get(gate)
}

export function getGateCenter(gate: number): string | undefined {
  return GATE_CENTERS[gate]
}

export { GATE_DATA }
