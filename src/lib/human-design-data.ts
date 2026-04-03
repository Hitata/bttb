// ============================================================
// Human Design Learning Data
// ============================================================

export type CenterType = 'pressure' | 'motor' | 'awareness' | 'expression' | 'identity'

export interface HdCenter {
  id: string
  vn: string
  en: string
  types: CenterType[]
  biologicalCorrelation: string
  definedTheme: { vn: string; en: string }
  undefinedTheme: { vn: string; en: string }
  notSelfQuestion: { vn: string; en: string }
  shape: 'triangle-up' | 'triangle-down' | 'square' | 'diamond' | 'trapezoid'
  color: string
  position: { x: number; y: number }
  chakraOrigin?: string
}

export interface HdChannel {
  id: string
  gates: [number, number]
  fromCenter: string
  toCenter: string
  vn: string
  en: string
}

export interface HdType {
  id: string
  vn: string
  en: string
  percentage: number
  sacralDefined: boolean
  motorToThroat: boolean
  strategy: { vn: string; en: string }
  authority: string[]
  signature: { vn: string; en: string }
  notSelf: { vn: string; en: string }
  description: { vn: string; en: string }
  color: string
}

export interface HdLine {
  num: number
  archetype: { vn: string; en: string }
  trigram: 'lower' | 'upper'
  theme: { vn: string; en: string }
  description: { vn: string; en: string }
  mirror: number
}

export interface HdProfile {
  conscious: number
  unconscious: number
  angle: 'right' | 'left' | 'juxtaposition'
  label: string
  vn: string
  en: string
  description: { vn: string; en: string }
}

export interface HdChapter {
  slug: string
  order: number
  title: { vn: string; en: string }
  subtitle: { vn: string; en: string }
  icon: string
  color: string
}

// ============================================================
// Constants
// ============================================================

export const CENTER_TYPE_LABELS: Record<CenterType, { vn: string; en: string; color: string }> = {
  pressure: { vn: 'Áp lực', en: 'Pressure', color: '#ef4444' },
  motor: { vn: 'Động cơ', en: 'Motor', color: '#f59e0b' },
  awareness: { vn: 'Nhận thức', en: 'Awareness', color: '#3b82f6' },
  expression: { vn: 'Biểu đạt', en: 'Expression', color: '#8b5cf6' },
  identity: { vn: 'Bản thể', en: 'Identity', color: '#10b981' },
}

export const HD_CENTERS: HdCenter[] = [
  {
    id: 'head',
    vn: 'Trung Tâm Đầu',
    en: 'Head Center',
    types: ['pressure'],
    biologicalCorrelation: 'Pineal gland',
    definedTheme: { vn: 'Nguồn cảm hứng ổn định, áp lực suy nghĩ nhất quán', en: 'Consistent inspiration and mental pressure' },
    undefinedTheme: { vn: 'Khuếch đại cảm hứng từ bên ngoài, dễ bị phân tâm', en: 'Amplifies external inspiration, easily distracted' },
    notSelfQuestion: { vn: 'Mình có đang cố trả lời câu hỏi của người khác?', en: 'Am I trying to answer everybody else\'s questions?' },
    shape: 'triangle-up',
    color: '#f5c542',
    position: { x: 150, y: 30 },
    chakraOrigin: 'Crown (Sahasrāra)',
  },
  {
    id: 'ajna',
    vn: 'Trung Tâm Ajna',
    en: 'Ajna Center',
    types: ['awareness'],
    biologicalCorrelation: 'Pituitary gland',
    definedTheme: { vn: 'Tư duy nhất quán, cách xử lý thông tin cố định', en: 'Consistent way of processing information' },
    undefinedTheme: { vn: 'Linh hoạt trong tư duy, dễ bị ảnh hưởng quan điểm', en: 'Flexible thinking, influenced by others\' opinions' },
    notSelfQuestion: { vn: 'Mình có đang giả vờ chắc chắn?', en: 'Am I pretending to be certain?' },
    shape: 'triangle-down',
    color: '#4ade80',
    position: { x: 150, y: 85 },
    chakraOrigin: 'Third Eye (Ājñā)',
  },
  {
    id: 'throat',
    vn: 'Trung Tâm Cổ Họng',
    en: 'Throat Center',
    types: ['expression'],
    biologicalCorrelation: 'Thyroid & parathyroid',
    definedTheme: { vn: 'Cách biểu đạt và hành động nhất quán', en: 'Consistent way of expressing and acting' },
    undefinedTheme: { vn: 'Linh hoạt trong biểu đạt, áp lực phải nói/hành động', en: 'Flexible expression, pressure to speak or act' },
    notSelfQuestion: { vn: 'Mình có đang cố gắng thu hút sự chú ý?', en: 'Am I trying to attract attention?' },
    shape: 'square',
    color: '#c084fc',
    position: { x: 150, y: 150 },
    chakraOrigin: 'Throat (Viśuddha)',
  },
  {
    id: 'g',
    vn: 'Trung Tâm G',
    en: 'G Center',
    types: ['identity'],
    biologicalCorrelation: 'Liver & blood',
    definedTheme: { vn: 'Cảm giác bản thể ổn định, hướng đi rõ ràng', en: 'Fixed sense of identity and direction' },
    undefinedTheme: { vn: 'Tìm kiếm bản thân qua môi trường và người khác', en: 'Seeking identity through environment and others' },
    notSelfQuestion: { vn: 'Mình có đang tìm kiếm tình yêu và phương hướng?', en: 'Am I searching for love and direction?' },
    shape: 'diamond',
    color: '#f5c542',
    position: { x: 150, y: 220 },
    chakraOrigin: 'Heart (Anāhata) — split',
  },
  {
    id: 'heart',
    vn: 'Trung Tâm Tim/Ý Chí',
    en: 'Heart/Will Center',
    types: ['motor'],
    biologicalCorrelation: 'Heart, stomach, gallbladder, thymus',
    definedTheme: { vn: 'Ý chí mạnh mẽ, khả năng cam kết nhất quán', en: 'Strong willpower, consistent ability to commit' },
    undefinedTheme: { vn: 'Không có ý chí nhất quán, dễ bị ép cam kết', en: 'No consistent willpower, pressured to prove worth' },
    notSelfQuestion: { vn: 'Mình có đang cố chứng minh bản thân?', en: 'Am I trying to prove myself?' },
    shape: 'triangle-down',
    color: '#ef4444',
    position: { x: 210, y: 260 },
    chakraOrigin: 'Heart (Anāhata) — split',
  },
  {
    id: 'sacral',
    vn: 'Trung Tâm Sacral',
    en: 'Sacral Center',
    types: ['motor'],
    biologicalCorrelation: 'Ovaries & testes',
    definedTheme: { vn: 'Năng lượng sống và sinh sản dồi dào, bền bỉ', en: 'Abundant life force and sustainable energy' },
    undefinedTheme: { vn: 'Không có năng lượng nhất quán, dễ kiệt sức', en: 'No consistent energy, easily exhausted' },
    notSelfQuestion: { vn: 'Mình có biết khi nào là đủ?', en: 'Do I know when enough is enough?' },
    shape: 'square',
    color: '#ef4444',
    position: { x: 150, y: 320 },
    chakraOrigin: 'Sacral (Svādhiṣṭhāna)',
  },
  {
    id: 'solar-plexus',
    vn: 'Trung Tâm Đám Rối TK',
    en: 'Solar Plexus Center',
    types: ['motor', 'awareness'],
    biologicalCorrelation: 'Kidneys, prostate, pancreas, lungs, nervous system',
    definedTheme: { vn: 'Sóng cảm xúc nhất quán, cần chờ sự rõ ràng', en: 'Consistent emotional wave, must wait for clarity' },
    undefinedTheme: { vn: 'Khuếch đại cảm xúc người khác, tránh đối đầu', en: 'Amplifies others\' emotions, avoids confrontation' },
    notSelfQuestion: { vn: 'Mình có đang tránh đối đầu và sự thật?', en: 'Am I avoiding confrontation and truth?' },
    shape: 'triangle-up',
    color: '#f59e0b',
    position: { x: 90, y: 310 },
    chakraOrigin: 'Solar Plexus (Maṇipūra) — split',
  },
  {
    id: 'spleen',
    vn: 'Trung Tâm Lá Lách',
    en: 'Spleen Center',
    types: ['awareness'],
    biologicalCorrelation: 'Lymphatic system, spleen, T-cells',
    definedTheme: { vn: 'Trực giác sinh tồn nhất quán, hệ miễn dịch mạnh', en: 'Consistent survival intuition, strong immune system' },
    undefinedTheme: { vn: 'Không có cảm giác an toàn nhất quán, bám víu', en: 'No consistent sense of safety, holds on too long' },
    notSelfQuestion: { vn: 'Mình có đang bám víu điều không tốt cho mình?', en: 'Am I holding on to what isn\'t good for me?' },
    shape: 'triangle-up',
    color: '#3b82f6',
    position: { x: 80, y: 260 },
    chakraOrigin: 'Solar Plexus (Maṇipūra) — split',
  },
  {
    id: 'root',
    vn: 'Trung Tâm Gốc',
    en: 'Root Center',
    types: ['pressure', 'motor'],
    biologicalCorrelation: 'Adrenal glands',
    definedTheme: { vn: 'Áp lực adrenaline nhất quán, năng lượng thúc đẩy', en: 'Consistent adrenaline pressure, driving energy' },
    undefinedTheme: { vn: 'Khuếch đại áp lực, vội vàng hoàn thành', en: 'Amplifies stress, rushes to get things done' },
    notSelfQuestion: { vn: 'Mình có đang vội vàng để thoát khỏi áp lực?', en: 'Am I in a hurry to be free of pressure?' },
    shape: 'square',
    color: '#f59e0b',
    position: { x: 150, y: 400 },
    chakraOrigin: 'Root (Mūlādhāra)',
  },
]

export const HD_CHANNELS: HdChannel[] = [
  { id: '64-47', gates: [64, 47], fromCenter: 'head', toCenter: 'ajna', vn: 'Trừu Tượng', en: 'Abstraction' },
  { id: '61-24', gates: [61, 24], fromCenter: 'head', toCenter: 'ajna', vn: 'Nhận Biết', en: 'Awareness' },
  { id: '63-4', gates: [63, 4], fromCenter: 'head', toCenter: 'ajna', vn: 'Logic', en: 'Logic' },
  { id: '17-62', gates: [17, 62], fromCenter: 'ajna', toCenter: 'throat', vn: 'Chấp Nhận', en: 'Acceptance' },
  { id: '43-23', gates: [43, 23], fromCenter: 'ajna', toCenter: 'throat', vn: 'Cấu Trúc', en: 'Structuring' },
  { id: '11-56', gates: [11, 56], fromCenter: 'ajna', toCenter: 'throat', vn: 'Tò Mò', en: 'Curiosity' },
  { id: '16-48', gates: [16, 48], fromCenter: 'throat', toCenter: 'spleen', vn: 'Tài Năng', en: 'The Wavelength' },
  { id: '20-57', gates: [20, 57], fromCenter: 'throat', toCenter: 'spleen', vn: 'Trực Giác', en: 'The Brainwave' },
  { id: '20-34', gates: [20, 34], fromCenter: 'throat', toCenter: 'sacral', vn: 'Hấp Dẫn', en: 'Charisma' },
  { id: '20-10', gates: [20, 10], fromCenter: 'throat', toCenter: 'g', vn: 'Thức Tỉnh', en: 'Awakening' },
  { id: '10-57', gates: [10, 57], fromCenter: 'g', toCenter: 'spleen', vn: 'Hoàn Hảo', en: 'Perfected Form' },
  { id: '31-7', gates: [31, 7], fromCenter: 'throat', toCenter: 'g', vn: 'Lãnh Đạo', en: 'The Alpha' },
  { id: '33-13', gates: [33, 13], fromCenter: 'throat', toCenter: 'g', vn: 'Đứa Con Hoang', en: 'The Prodigal' },
  { id: '8-1', gates: [8, 1], fromCenter: 'throat', toCenter: 'g', vn: 'Cảm Hứng', en: 'Inspiration' },
  { id: '35-36', gates: [35, 36], fromCenter: 'throat', toCenter: 'solar-plexus', vn: 'Tạm Thời', en: 'Transitoriness' },
  { id: '12-22', gates: [12, 22], fromCenter: 'throat', toCenter: 'solar-plexus', vn: 'Cởi Mở', en: 'Openness' },
  { id: '45-21', gates: [45, 21], fromCenter: 'throat', toCenter: 'heart', vn: 'Tiền Bạc', en: 'The Money Line' },
  { id: '26-44', gates: [26, 44], fromCenter: 'heart', toCenter: 'spleen', vn: 'Đầu Hàng', en: 'Surrender' },
  { id: '51-25', gates: [51, 25], fromCenter: 'heart', toCenter: 'g', vn: 'Khai Sáng', en: 'Initiation' },
  { id: '40-37', gates: [40, 37], fromCenter: 'heart', toCenter: 'solar-plexus', vn: 'Cộng Đồng', en: 'Community' },
  { id: '10-34', gates: [10, 34], fromCenter: 'g', toCenter: 'sacral', vn: 'Khám Phá', en: 'Exploration' },
  { id: '15-5', gates: [15, 5], fromCenter: 'g', toCenter: 'sacral', vn: 'Nhịp Điệu', en: 'Rhythm' },
  { id: '46-29', gates: [46, 29], fromCenter: 'g', toCenter: 'sacral', vn: 'Khám Phá', en: 'Discovery' },
  { id: '2-14', gates: [2, 14], fromCenter: 'g', toCenter: 'sacral', vn: 'Nhịp Đập', en: 'The Beat' },
  { id: '57-34', gates: [57, 34], fromCenter: 'spleen', toCenter: 'sacral', vn: 'Quyền Lực', en: 'Power' },
  { id: '50-27', gates: [50, 27], fromCenter: 'spleen', toCenter: 'sacral', vn: 'Bảo Vệ', en: 'Preservation' },
  { id: '28-38', gates: [28, 38], fromCenter: 'spleen', toCenter: 'root', vn: 'Đấu Tranh', en: 'Struggle' },
  { id: '18-58', gates: [18, 58], fromCenter: 'spleen', toCenter: 'root', vn: 'Phán Xét', en: 'Judgment' },
  { id: '32-54', gates: [32, 54], fromCenter: 'spleen', toCenter: 'root', vn: 'Chuyển Đổi', en: 'Transformation' },
  { id: '6-59', gates: [6, 59], fromCenter: 'solar-plexus', toCenter: 'sacral', vn: 'Thân Mật', en: 'Intimacy' },
  { id: '49-19', gates: [49, 19], fromCenter: 'solar-plexus', toCenter: 'root', vn: 'Nguyên Tắc', en: 'Sensitivity' },
  { id: '55-39', gates: [55, 39], fromCenter: 'solar-plexus', toCenter: 'root', vn: 'Cảm Xúc', en: 'Emoting' },
  { id: '30-41', gates: [30, 41], fromCenter: 'solar-plexus', toCenter: 'root', vn: 'Nhận Ra', en: 'Recognition' },
  { id: '3-60', gates: [3, 60], fromCenter: 'sacral', toCenter: 'root', vn: 'Đột Biến', en: 'Mutation' },
  { id: '42-53', gates: [42, 53], fromCenter: 'sacral', toCenter: 'root', vn: 'Trưởng Thành', en: 'Maturation' },
  { id: '9-52', gates: [9, 52], fromCenter: 'sacral', toCenter: 'root', vn: 'Tập Trung', en: 'Concentration' },
]

export const HD_TYPES: HdType[] = [
  {
    id: 'generator',
    vn: 'Máy Phát',
    en: 'Generator',
    percentage: 37,
    sacralDefined: true,
    motorToThroat: false,
    strategy: { vn: 'Chờ để phản hồi', en: 'Wait to respond' },
    authority: ['Sacral', 'Emotional'],
    signature: { vn: 'Thỏa mãn', en: 'Satisfaction' },
    notSelf: { vn: 'Thất vọng', en: 'Frustration' },
    description: {
      vn: 'Sacral được định nghĩa nhưng không nối trực tiếp đến Cổ Họng qua motor. Năng lượng sống dồi dào, bền bỉ. Cần chờ tín hiệu từ bên ngoài để phản hồi, không nên khởi xướng.',
      en: 'Defined Sacral with no motor-to-Throat connection. Abundant, sustainable life force energy. Must wait for external cues to respond rather than initiating.'
    },
    color: '#ef4444',
  },
  {
    id: 'manifesting-generator',
    vn: 'Máy Phát Biểu Hiện',
    en: 'Manifesting Generator',
    percentage: 33,
    sacralDefined: true,
    motorToThroat: true,
    strategy: { vn: 'Chờ để phản hồi, rồi thông báo', en: 'Wait to respond, then inform' },
    authority: ['Sacral', 'Emotional'],
    signature: { vn: 'Thỏa mãn', en: 'Satisfaction' },
    notSelf: { vn: 'Thất vọng & Giận dữ', en: 'Frustration & Anger' },
    description: {
      vn: 'Sacral được định nghĩa VÀ có kết nối motor đến Cổ Họng. Đa nhiệm, nhanh nhẹn, bỏ qua bước. Cần phản hồi trước, sau đó thông báo trước khi hành động.',
      en: 'Defined Sacral WITH motor-to-Throat connection. Multi-tasker, fast-moving, skips steps. Must respond first, then inform before acting.'
    },
    color: '#f59e0b',
  },
  {
    id: 'projector',
    vn: 'Người Hướng Dẫn',
    en: 'Projector',
    percentage: 20,
    sacralDefined: false,
    motorToThroat: false,
    strategy: { vn: 'Chờ được mời gọi', en: 'Wait for the invitation' },
    authority: ['Emotional', 'Splenic', 'Ego/Heart', 'Self-Projected', 'Mental'],
    signature: { vn: 'Thành công', en: 'Success' },
    notSelf: { vn: 'Cay đắng', en: 'Bitterness' },
    description: {
      vn: 'Không có Sacral, không có motor nối Cổ Họng. Thiên tài trong việc nhìn thấu hệ thống và con người. Cần được công nhận và mời gọi trước khi chia sẻ.',
      en: 'No defined Sacral, no motor-to-Throat. Gifted at seeing into systems and people. Must be recognized and invited before sharing guidance.'
    },
    color: '#3b82f6',
  },
  {
    id: 'manifestor',
    vn: 'Người Biểu Hiện',
    en: 'Manifestor',
    percentage: 9,
    sacralDefined: false,
    motorToThroat: true,
    strategy: { vn: 'Thông báo trước khi hành động', en: 'Inform before acting' },
    authority: ['Emotional', 'Splenic', 'Ego'],
    signature: { vn: 'Bình an', en: 'Peace' },
    notSelf: { vn: 'Giận dữ', en: 'Anger' },
    description: {
      vn: 'Không có Sacral nhưng CÓ motor nối đến Cổ Họng. Là người khởi xướng duy nhất. Năng lượng bùng nổ nhưng không bền. Cần thông báo để giảm kháng cự từ người khác.',
      en: 'No Sacral but HAS motor-to-Throat connection. The only true initiator. Burst energy, not sustainable. Must inform to reduce resistance from others.'
    },
    color: '#8b5cf6',
  },
  {
    id: 'reflector',
    vn: 'Người Phản Chiếu',
    en: 'Reflector',
    percentage: 1,
    sacralDefined: false,
    motorToThroat: false,
    strategy: { vn: 'Chờ một chu kỳ Mặt Trăng (28 ngày)', en: 'Wait a full lunar cycle (28 days)' },
    authority: ['Lunar'],
    signature: { vn: 'Ngạc nhiên', en: 'Surprise' },
    notSelf: { vn: 'Thất vọng', en: 'Disappointment' },
    description: {
      vn: 'KHÔNG có trung tâm nào được định nghĩa. Cực kỳ hiếm (~1%). Phản chiếu sức khỏe của cộng đồng. Cần chờ đủ 28 ngày (1 chu kỳ Mặt Trăng) cho các quyết định lớn.',
      en: 'NO defined centers at all. Extremely rare (~1%). Mirrors the health of community. Must wait 28 days (one lunar cycle) for major decisions.'
    },
    color: '#6b7280',
  },
]

export const HD_LINES: HdLine[] = [
  {
    num: 1,
    archetype: { vn: 'Nhà Nghiên Cứu', en: 'Investigator' },
    trigram: 'lower',
    theme: { vn: 'Nền tảng, nghiên cứu sâu', en: 'Foundation, deep research' },
    description: {
      vn: 'Bất an cho đến khi kiến thức vững chắc. Cần nền tảng trước khi hành động. Luôn tìm hiểu kỹ trước.',
      en: 'Insecure until knowledge is solid. Needs a foundation before acting. Always researches thoroughly first.'
    },
    mirror: 4,
  },
  {
    num: 2,
    archetype: { vn: 'Ẩn Sĩ', en: 'Hermit' },
    trigram: 'lower',
    theme: { vn: 'Tài năng tự nhiên, được gọi ra', en: 'Natural talent, called out by others' },
    description: {
      vn: 'Có tài năng bẩm sinh nhưng không tự nhận ra. Cần được người khác nhìn thấy và gọi ra. Thích ở một mình.',
      en: 'Has innate talent but doesn\'t see it. Needs others to recognize and call it out. Prefers solitude.'
    },
    mirror: 5,
  },
  {
    num: 3,
    archetype: { vn: 'Người Thử Nghiệm', en: 'Martyr' },
    trigram: 'lower',
    theme: { vn: 'Thử và sai, gắn kết và đứt gãy', en: 'Trial and error, bonds made and broken' },
    description: {
      vn: 'Học qua trải nghiệm trực tiếp. Tạo và phá vỡ liên kết. Cuộc sống đầy biến động nhưng tích lũy trí tuệ thực tiễn.',
      en: 'Learns through direct experience. Makes and breaks bonds. Life full of upheaval but accumulates practical wisdom.'
    },
    mirror: 6,
  },
  {
    num: 4,
    archetype: { vn: 'Nhà Cơ Hội', en: 'Opportunist' },
    trigram: 'upper',
    theme: { vn: 'Mạng lưới, mối quan hệ', en: 'Networks, relationships' },
    description: {
      vn: 'Thành công qua mạng lưới quan hệ. Cần được người quen giới thiệu. Ảnh hưởng lan tỏa qua cộng đồng thân cận.',
      en: 'Succeeds through relationship networks. Needs introductions from acquaintances. Influence spreads through close community.'
    },
    mirror: 1,
  },
  {
    num: 5,
    archetype: { vn: 'Kẻ Dị Giáo', en: 'Heretic' },
    trigram: 'upper',
    theme: { vn: 'Trường chiếu xạ, phổ quát hóa', en: 'Projection field, universalizing' },
    description: {
      vn: 'Mang trường chiếu xạ mạnh — người khác kỳ vọng và gán vai cứu tinh. Giải pháp thực tế cho số đông. Dễ bị hiểu lầm nếu không đáp ứng kỳ vọng.',
      en: 'Carries a strong projection field — others project savior expectations. Practical solutions for the many. Misunderstood when expectations aren\'t met.'
    },
    mirror: 2,
  },
  {
    num: 6,
    archetype: { vn: 'Hình Mẫu', en: 'Role Model' },
    trigram: 'upper',
    theme: { vn: 'Ba giai đoạn sống, trí tuệ sống', en: 'Three life phases, lived wisdom' },
    description: {
      vn: 'Ba giai đoạn: (0-30) thử nghiệm như Hào 3, (30-50) rút lui quan sát "trên mái nhà", (50+) trở thành hình mẫu với trí tuệ sống.',
      en: 'Three phases: (0-30) trial-and-error like Line 3, (30-50) withdraws to observe "on the roof", (50+) becomes a role model with lived wisdom.'
    },
    mirror: 3,
  },
]

export const HD_PROFILES: HdProfile[] = [
  { conscious: 1, unconscious: 3, angle: 'right', label: '1/3', vn: 'Nhà Nghiên Cứu / Người Thử Nghiệm', en: 'Investigator / Martyr', description: { vn: 'Nghiên cứu kỹ rồi thử nghiệm thực tế. Tự khám phá qua trải nghiệm cá nhân.', en: 'Researches thoroughly then tests in practice. Self-discovery through personal experience.' } },
  { conscious: 1, unconscious: 4, angle: 'right', label: '1/4', vn: 'Nhà Nghiên Cứu / Nhà Cơ Hội', en: 'Investigator / Opportunist', description: { vn: 'Xây nền tảng kiến thức rồi chia sẻ qua mạng lưới. Cần cả chiều sâu lẫn kết nối.', en: 'Builds knowledge foundation then shares through network. Needs both depth and connection.' } },
  { conscious: 2, unconscious: 4, angle: 'right', label: '2/4', vn: 'Ẩn Sĩ / Nhà Cơ Hội', en: 'Hermit / Opportunist', description: { vn: 'Tài năng tự nhiên được gọi ra qua mạng lưới. Cần cả không gian riêng lẫn cộng đồng.', en: 'Natural talent called out through network. Needs both alone time and community.' } },
  { conscious: 2, unconscious: 5, angle: 'right', label: '2/5', vn: 'Ẩn Sĩ / Kẻ Dị Giáo', en: 'Hermit / Heretic', description: { vn: 'Tài năng bẩm sinh với trường chiếu xạ mạnh. Người khác tìm đến xin giải pháp.', en: 'Innate talent with strong projection field. Others seek practical solutions.' } },
  { conscious: 3, unconscious: 5, angle: 'right', label: '3/5', vn: 'Người Thử Nghiệm / Kẻ Dị Giáo', en: 'Martyr / Heretic', description: { vn: 'Thử nghiệm thực tế + khả năng phổ quát hóa giải pháp. Trải nghiệm cá nhân phục vụ số đông.', en: 'Practical experimentation + ability to universalize solutions. Personal experience serves the many.' } },
  { conscious: 3, unconscious: 6, angle: 'right', label: '3/6', vn: 'Người Thử Nghiệm / Hình Mẫu', en: 'Martyr / Role Model', description: { vn: 'Nửa đầu đời thử nghiệm, nửa sau trở thành hình mẫu. Trí tuệ đến từ va chạm thực tế.', en: 'First half experimenting, second half becoming role model. Wisdom from real-world friction.' } },
  { conscious: 4, unconscious: 6, angle: 'right', label: '4/6', vn: 'Nhà Cơ Hội / Hình Mẫu', en: 'Opportunist / Role Model', description: { vn: 'Ảnh hưởng qua mạng lưới, dần trở thành hình mẫu. Kết nối sâu tạo nền tảng cho trí tuệ sống.', en: 'Influences through network, gradually becomes role model. Deep connections build foundation for lived wisdom.' } },
  { conscious: 4, unconscious: 1, angle: 'juxtaposition', label: '4/1', vn: 'Nhà Cơ Hội / Nhà Nghiên Cứu', en: 'Opportunist / Investigator', description: { vn: 'Profile duy nhất "số phận cố định". Nền tảng kiến thức + mạng lưới = con đường rõ ràng và không đổi.', en: 'The only "fixed fate" profile. Knowledge foundation + network = clear, unchanging path.' } },
  { conscious: 5, unconscious: 1, angle: 'left', label: '5/1', vn: 'Kẻ Dị Giáo / Nhà Nghiên Cứu', en: 'Heretic / Investigator', description: { vn: 'Trường chiếu xạ mạnh được hỗ trợ bởi nền tảng nghiên cứu. Giải pháp phổ quát dựa trên kiến thức sâu.', en: 'Strong projection field supported by research foundation. Universal solutions grounded in deep knowledge.' } },
  { conscious: 5, unconscious: 2, angle: 'left', label: '5/2', vn: 'Kẻ Dị Giáo / Ẩn Sĩ', en: 'Heretic / Hermit', description: { vn: 'Được gọi ra để giải quyết vấn đề, nhưng cần không gian riêng để phục hồi. Karma liên nhân.', en: 'Called out to solve problems but needs alone time to recharge. Transpersonal karma.' } },
  { conscious: 6, unconscious: 2, angle: 'left', label: '6/2', vn: 'Hình Mẫu / Ẩn Sĩ', en: 'Role Model / Hermit', description: { vn: 'Ba giai đoạn sống + tài năng bẩm sinh. Trưởng thành thành hình mẫu tự nhiên, không gượng ép.', en: 'Three life phases + innate talent. Matures into natural role model, unforced.' } },
  { conscious: 6, unconscious: 3, angle: 'left', label: '6/3', vn: 'Hình Mẫu / Người Thử Nghiệm', en: 'Role Model / Martyr', description: { vn: 'Cuộc sống đầy trải nghiệm ở mọi giai đoạn. Trí tuệ đến từ cả quan sát lẫn va chạm liên tục.', en: 'Life full of experience at every phase. Wisdom from both observation and continuous friction.' } },
]

export const HD_CHAPTERS: HdChapter[] = [
  {
    slug: 'origins',
    order: 1,
    title: { vn: 'Nguồn Gốc', en: 'Origins' },
    subtitle: { vn: 'Ra Uru Hu, 1987, và sự tổng hợp', en: 'Ra Uru Hu, 1987, and the synthesis' },
    icon: '✦',
    color: '#f5c542',
  },
  {
    slug: 'iching-gates',
    order: 2,
    title: { vn: '64 Cổng & Kinh Dịch', en: '64 Gates & I Ching' },
    subtitle: { vn: 'Cổng = Quẻ, Rave Mandala, 384 Hào', en: 'Gates = Hexagrams, Rave Mandala, 384 Lines' },
    icon: '☰',
    color: '#ef4444',
  },
  {
    slug: 'kabbalah-bodygraph',
    order: 3,
    title: { vn: 'Cây Sự Sống & Bodygraph', en: 'Tree of Life & Bodygraph' },
    subtitle: { vn: 'Kabbalah, kênh kết nối giữa các trung tâm', en: 'Kabbalah mapping and channels between centers' },
    icon: '🕎',
    color: '#c084fc',
  },
  {
    slug: 'nine-centers',
    order: 4,
    title: { vn: 'Chín Trung Tâm', en: 'Nine Centers' },
    subtitle: { vn: 'Từ 7 luân xa đến 9, defined vs undefined', en: 'From 7 chakras to 9, defined vs undefined' },
    icon: '◉',
    color: '#3b82f6',
  },
  {
    slug: 'astrology-calculation',
    order: 5,
    title: { vn: 'Chiêm Tinh & Tính Toán', en: 'Astrology & Calculation' },
    subtitle: { vn: '13 thiên thể, tính toán kép, Personality vs Design', en: '13 celestial bodies, dual calculation, Personality vs Design' },
    icon: '☉',
    color: '#f59e0b',
  },
  {
    slug: 'five-types',
    order: 6,
    title: { vn: 'Năm Loại Hình', en: 'Five Types' },
    subtitle: { vn: 'Generator, MG, Manifestor, Projector, Reflector', en: 'Strategy, Authority, and the Not-Self' },
    icon: '⬡',
    color: '#10b981',
  },
  {
    slug: 'lines-profiles',
    order: 7,
    title: { vn: 'Sáu Hào & Profile', en: 'Six Lines & Profiles' },
    subtitle: { vn: '6 nguyên mẫu, 12 Profile, 3 góc nhìn', en: '6 archetypes, 12 Profiles, 3 angles' },
    icon: '⚋',
    color: '#8b5cf6',
  },
  {
    slug: 'philosophy',
    order: 8,
    title: { vn: 'Triết Lý', en: 'Philosophy' },
    subtitle: { vn: 'Not-Self, giải điều kiện, Rave Cosmology', en: 'Not-Self, deconditioning, Rave Cosmology' },
    icon: '∞',
    color: '#6b7280',
  },
]

// ============================================================
// Helpers
// ============================================================

export function getCenterById(id: string): HdCenter | undefined {
  return HD_CENTERS.find(c => c.id === id)
}

export function getChannelsForCenter(centerId: string): HdChannel[] {
  return HD_CHANNELS.filter(ch => ch.fromCenter === centerId || ch.toCenter === centerId)
}

export function getChapterBySlug(slug: string): HdChapter | undefined {
  return HD_CHAPTERS.find(ch => ch.slug === slug)
}

export function getAdjacentChapters(slug: string): { prev: HdChapter | undefined; next: HdChapter | undefined } {
  const idx = HD_CHAPTERS.findIndex(ch => ch.slug === slug)
  return {
    prev: idx > 0 ? HD_CHAPTERS[idx - 1] : undefined,
    next: idx < HD_CHAPTERS.length - 1 ? HD_CHAPTERS[idx + 1] : undefined,
  }
}
