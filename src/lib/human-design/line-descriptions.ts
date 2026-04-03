// Human Design Line Descriptions
//
// 384 entries: 6 lines × 64 gates
// Each line has a keynote describing its specific expression within the gate theme.
// Lines 1-3 are lower trigram (personal process), lines 4-6 are upper trigram (transpersonal).

export interface LineDescription {
  readonly gate: number
  readonly line: number
  readonly keynote: string       // Short HD keynote
  readonly theme: { readonly vn: string; readonly en: string }
}

// Compact format: [gate, line, keynote, themeVn, themeEn]
type LineEntry = [number, number, string, string, string]

const LINE_DATA: readonly LineEntry[] = [
  // Gate 1 — Self-Expression / The Creative
  [1, 1, 'Creation is Independent', 'Sáng tạo cá nhân, tự lập', 'Personal creativity, independence'],
  [1, 2, 'Love is Light', 'Tình yêu khai sáng sáng tạo', 'Love illuminates creativity'],
  [1, 3, 'The Energy to Sustain', 'Năng lượng duy trì sáng tạo', 'Energy to sustain creative work'],
  [1, 4, 'Aloneness as Medium', 'Cô đơn là phương tiện sáng tạo', 'Aloneness as creative medium'],
  [1, 5, 'Energy of Attraction', 'Năng lượng hấp dẫn sáng tạo', 'Attractive creative energy'],
  [1, 6, 'Objectivity', 'Khách quan trong biểu đạt', 'Objectivity in expression'],

  // Gate 2 — Direction of the Self / The Receptive
  [2, 1, 'Intuition', 'Trực giác hướng dẫn phương hướng', 'Intuition guides direction'],
  [2, 2, 'Genius', 'Thiên tài qua thụ động tiếp nhận', 'Genius through receptive knowing'],
  [2, 3, 'Patience', 'Kiên nhẫn trong quá trình tiếp nhận', 'Patience in the receptive process'],
  [2, 4, 'Secretiveness', 'Bí mật giữ phương hướng riêng', 'Keeping direction private'],
  [2, 5, 'Intelligent Application', 'Ứng dụng thông minh hướng đi', 'Intelligent application of direction'],
  [2, 6, 'Fixation', 'Cố định trong hướng đi đã chọn', 'Fixed in chosen direction'],

  // Gate 3 — Ordering / Difficulty at the Beginning
  [3, 1, 'Synthesis', 'Tổng hợp từ khó khăn ban đầu', 'Synthesis from initial difficulty'],
  [3, 2, 'Immaturity', 'Chưa trưởng thành, cần thời gian', 'Immaturity, needing time'],
  [3, 3, 'Survival', 'Sinh tồn qua đổi mới', 'Survival through innovation'],
  [3, 4, 'Charisma', 'Hấp dẫn trong quá trình sáng tạo', 'Charisma in creative process'],
  [3, 5, 'Victimization', 'Nạn nhân hóa hoặc vượt qua', 'Victimization or transcendence'],
  [3, 6, 'Surrender', 'Đầu hàng cho quá trình', 'Surrendering to the process'],

  // Gate 4 — Formulization / Youthful Folly
  [4, 1, 'Pleasure', 'Niềm vui trong tìm kiếm câu trả lời', 'Pleasure in seeking answers'],
  [4, 2, 'Acceptance', 'Chấp nhận giới hạn hiểu biết', 'Accepting limits of understanding'],
  [4, 3, 'Irresponsibility', 'Vô trách nhiệm trong suy nghĩ', 'Irresponsibility in thinking'],
  [4, 4, 'The Liar', 'Kẻ dối trá hoặc người biết sự thật', 'The liar or truth-knower'],
  [4, 5, 'Seduction', 'Quyến rũ bằng logic', 'Seduction through logic'],
  [4, 6, 'Excess', 'Quá mức trong công thức hóa', 'Excess in formulization'],

  // Gate 5 — Fixed Rhythms / Waiting
  [5, 1, 'Perseverance', 'Kiên trì trong nhịp điệu', 'Perseverance in rhythm'],
  [5, 2, 'Inner Peace', 'An bình nội tại qua chờ đợi', 'Inner peace through waiting'],
  [5, 3, 'Compulsiveness', 'Bắt buộc theo nhịp điệu', 'Compulsive adherence to rhythm'],
  [5, 4, 'The Hunter', 'Người săn đúng thời điểm', 'Hunting the right timing'],
  [5, 5, 'Joy', 'Niềm vui trong nhịp sống tự nhiên', 'Joy in natural life rhythm'],
  [5, 6, 'Yielding', 'Nhường nhịn cho dòng chảy', 'Yielding to the flow'],

  // Gate 6 — Friction / Conflict
  [6, 1, 'Retreat', 'Rút lui khi cảm xúc dâng cao', 'Retreating when emotions rise'],
  [6, 2, 'The Guerrilla', 'Du kích cảm xúc', 'Emotional guerrilla'],
  [6, 3, 'Allegiance', 'Trung thành trong xung đột', 'Allegiance in conflict'],
  [6, 4, 'Triumph', 'Chiến thắng qua kiên nhẫn cảm xúc', 'Triumph through emotional patience'],
  [6, 5, 'Arbitration', 'Hòa giải, trung gian cảm xúc', 'Arbitration, emotional mediation'],
  [6, 6, 'The Peacemaker', 'Người tạo hòa bình', 'The peacemaker'],

  // Gate 7 — The Role of the Self / The Army
  [7, 1, 'The Authoritarian', 'Người độc đoán hoặc lãnh đạo tự nhiên', 'Authoritarian or natural leader'],
  [7, 2, 'The Democrat', 'Lãnh đạo dân chủ', 'Democratic leader'],
  [7, 3, 'The Anarchist', 'Người phản kháng vai trò', 'Role rebel'],
  [7, 4, 'The Abdicator', 'Người từ bỏ vai trò', 'The one who abdicates'],
  [7, 5, 'The General', 'Vị tướng, lãnh đạo chiến lược', 'The general, strategic leader'],
  [7, 6, 'The Administrator', 'Người quản lý vai trò', 'The administrator of roles'],

  // Gate 8 — Contribution / Holding Together
  [8, 1, 'Honesty', 'Trung thực trong đóng góp', 'Honesty in contribution'],
  [8, 2, 'Service', 'Phục vụ qua phong cách riêng', 'Service through unique style'],
  [8, 3, 'The Phony', 'Giả tạo hoặc chân thật', 'The phony or the authentic'],
  [8, 4, 'Respect', 'Tôn trọng trong biểu đạt cá nhân', 'Respect in individual expression'],
  [8, 5, 'Dharma', 'Pháp, sứ mệnh đóng góp', 'Dharma, mission of contribution'],
  [8, 6, 'Communion', 'Hiệp thông qua đóng góp', 'Communion through contribution'],

  // Gate 9 — Focus / The Taming Power of the Small
  [9, 1, 'Sensibility', 'Nhạy cảm trong tập trung', 'Sensibility in focus'],
  [9, 2, 'Misery Loves Company', 'Chia sẻ khó khăn tập trung', 'Sharing difficulties of focus'],
  [9, 3, 'The Straw that Breaks', 'Giọt nước tràn ly', 'The straw that breaks the camel\'s back'],
  [9, 4, 'Dedication', 'Cống hiến cho chi tiết', 'Dedication to detail'],
  [9, 5, 'Faith', 'Niềm tin vào quá trình', 'Faith in the process'],
  [9, 6, 'Gratitude', 'Biết ơn trong tập trung', 'Gratitude in focus'],

  // Gate 10 — Behavior of the Self / Treading
  [10, 1, 'Modesty', 'Khiêm tốn trong hành vi', 'Modesty in behavior'],
  [10, 2, 'The Hermit', 'Ẩn sĩ, yêu bản thân qua cô độc', 'The hermit, self-love through solitude'],
  [10, 3, 'The Martyr', 'Người tử đạo hành vi', 'The martyr of behavior'],
  [10, 4, 'The Opportunist', 'Cơ hội trong hành vi bản thể', 'Opportunism in self-behavior'],
  [10, 5, 'The Heretic', 'Kẻ dị giáo, thách thức chuẩn mực', 'The heretic, challenging norms'],
  [10, 6, 'The Role Model', 'Hình mẫu hành vi', 'The role model of behavior'],

  // Gate 11 — Ideas / Peace
  [11, 1, 'Attunement', 'Hòa hợp với ý tưởng', 'Attunement to ideas'],
  [11, 2, 'Rigor', 'Nghiêm khắc trong ý tưởng', 'Rigor in ideas'],
  [11, 3, 'The Realist', 'Người thực tế trong tưởng tượng', 'The realist in imagination'],
  [11, 4, 'The Teacher', 'Người thầy chia sẻ ý tưởng', 'The teacher sharing ideas'],
  [11, 5, 'The Philanthropist', 'Nhà từ thiện ý tưởng', 'The philanthropist of ideas'],
  [11, 6, 'Adaptability', 'Thích ứng ý tưởng', 'Adaptability of ideas'],

  // Gate 12 — Caution / Standstill
  [12, 1, 'The Monk', 'Tu sĩ, thận trọng biểu đạt', 'The monk, cautious expression'],
  [12, 2, 'Purification', 'Thanh lọc trước biểu đạt', 'Purification before expression'],
  [12, 3, 'Confession', 'Thú nhận cảm xúc', 'Confession of feelings'],
  [12, 4, 'The Prophet', 'Nhà tiên tri, biểu đạt sâu sắc', 'The prophet, profound expression'],
  [12, 5, 'The Pragmatist', 'Thực dụng trong biểu đạt', 'Pragmatic in expression'],
  [12, 6, 'Metamorphosis', 'Biến hình qua biểu đạt', 'Metamorphosis through expression'],

  // Gate 13 — The Listener / Fellowship
  [13, 1, 'Empathy', 'Đồng cảm trong lắng nghe', 'Empathy in listening'],
  [13, 2, 'Bigotry', 'Định kiến hoặc cởi mở', 'Bigotry or openness'],
  [13, 3, 'Pessimism', 'Bi quan hoặc thực tế', 'Pessimism or realism'],
  [13, 4, 'Fatigue', 'Mệt mỏi từ lắng nghe', 'Fatigue from listening'],
  [13, 5, 'The Savior', 'Người cứu rỗi qua lắng nghe', 'The savior through listening'],
  [13, 6, 'The Optimist', 'Lạc quan trong chia sẻ', 'The optimist in sharing'],

  // Gate 14 — Power Skills / Possession in Great Measure
  [14, 1, 'Money Isn\'t Everything', 'Tiền không phải tất cả', 'Money isn\'t everything'],
  [14, 2, 'Management', 'Quản lý tài nguyên', 'Managing resources'],
  [14, 3, 'Service', 'Phục vụ qua tài nguyên', 'Service through resources'],
  [14, 4, 'Security', 'An toàn tài chính', 'Financial security'],
  [14, 5, 'Arrogance', 'Kiêu ngạo hoặc tự tin', 'Arrogance or confidence'],
  [14, 6, 'Humility', 'Khiêm tốn với tài nguyên', 'Humility with resources'],

  // Gate 15 — Extremes / Modesty
  [15, 1, 'Duty', 'Bổn phận với nhân loại', 'Duty to humanity'],
  [15, 2, 'Influence', 'Ảnh hưởng qua nhịp điệu', 'Influence through rhythm'],
  [15, 3, 'Ego Inflation', 'Phồng tự ngã hoặc khiêm nhường', 'Ego inflation or humility'],
  [15, 4, 'The Wallflower', 'Người quan sát bên lề', 'The wallflower observer'],
  [15, 5, 'Sensitivity', 'Nhạy cảm với nhịp điệu', 'Sensitivity to rhythm'],
  [15, 6, 'Communion', 'Hiệp thông với nhân loại', 'Communion with humanity'],

  // Gate 16 — Skills / Enthusiasm
  [16, 1, 'Delusion', 'Ảo tưởng hoặc nhiệt huyết thật', 'Delusion or real enthusiasm'],
  [16, 2, 'The Cynic', 'Người hoài nghi kỹ năng', 'The cynic of skills'],
  [16, 3, 'Independence', 'Độc lập trong kỹ năng', 'Independence in skills'],
  [16, 4, 'The Leader', 'Người dẫn đầu kỹ năng', 'The leader of skills'],
  [16, 5, 'The Grinch', 'Người phá hoại hoặc bảo vệ', 'The grinch or guardian'],
  [16, 6, 'Gullibility', 'Cả tin hoặc đức tin', 'Gullibility or faith'],

  // Gate 17 — Opinions / Following
  [17, 1, 'Openness', 'Cởi mở với quan điểm', 'Openness to opinions'],
  [17, 2, 'Discrimination', 'Phân biệt logic', 'Logical discrimination'],
  [17, 3, 'Understanding', 'Hiểu biết qua quan điểm', 'Understanding through opinions'],
  [17, 4, 'The Personnel Manager', 'Quản lý nhân sự logic', 'Logical personnel manager'],
  [17, 5, 'No Human is an Island', 'Không ai là ốc đảo', 'No human is an island'],
  [17, 6, 'The Bodhisattva', 'Bồ tát, phục vụ qua hiểu biết', 'Bodhisattva, serving through understanding'],

  // Gate 18 — Correction / Work on What Has Been Spoiled
  [18, 1, 'Conservatism', 'Bảo thủ trong sửa chữa', 'Conservatism in correction'],
  [18, 2, 'Terminal Disease', 'Bệnh nan y, sửa chữa cấp bách', 'Terminal condition, urgent correction'],
  [18, 3, 'The Zealot', 'Người cuồng tín sửa chữa', 'The zealot of correction'],
  [18, 4, 'The Incompetent', 'Bất tài hoặc khiêm nhường', 'Incompetence or humility'],
  [18, 5, 'Therapy', 'Trị liệu qua sửa chữa', 'Therapy through correction'],
  [18, 6, 'Buddhahood', 'Phật tính, sửa chữa tối thượng', 'Buddhahood, ultimate correction'],

  // Gate 19 — Wanting / Approach
  [19, 1, 'Interdependence', 'Phụ thuộc lẫn nhau', 'Interdependence'],
  [19, 2, 'Service', 'Phục vụ nhu cầu cơ bản', 'Service to basic needs'],
  [19, 3, 'Dedication', 'Cống hiến cho nhu cầu', 'Dedication to needs'],
  [19, 4, 'The Team Player', 'Người chơi đội nhóm', 'The team player'],
  [19, 5, 'Sacrifice', 'Hy sinh cho nhu cầu chung', 'Sacrifice for communal needs'],
  [19, 6, 'The Recluse', 'Ẩn sĩ, rút lui khỏi nhu cầu', 'The recluse, withdrawing from needs'],

  // Gate 20 — The Now / Contemplation
  [20, 1, 'Superficiality', 'Hời hợt hoặc trực tiếp', 'Superficiality or directness'],
  [20, 2, 'The Dogmatist', 'Giáo điều hoặc chân thật', 'Dogmatic or authentic'],
  [20, 3, 'Self-Awareness', 'Tự nhận thức hiện tại', 'Self-awareness in the now'],
  [20, 4, 'Application', 'Ứng dụng chiêm nghiệm', 'Applying contemplation'],
  [20, 5, 'Realism', 'Thực tế trong khoảnh khắc', 'Realism in the moment'],
  [20, 6, 'Wisdom', 'Trí tuệ từ hiện tại', 'Wisdom from the present'],

  // Gate 21 — The Hunter / Biting Through
  [21, 1, 'Warning', 'Cảnh báo, kiểm soát sớm', 'Warning, early control'],
  [21, 2, 'Might is Right', 'Sức mạnh là chính nghĩa', 'Might is right'],
  [21, 3, 'Powerlessness', 'Bất lực hoặc chấp nhận', 'Powerlessness or acceptance'],
  [21, 4, 'Strategy', 'Chiến lược kiểm soát', 'Strategy of control'],
  [21, 5, 'Objectivity', 'Khách quan trong kiểm soát', 'Objectivity in control'],
  [21, 6, 'Chaos', 'Hỗn loạn hoặc trật tự mới', 'Chaos or new order'],

  // Gate 22 — Openness / Grace
  [22, 1, 'Second Class Ticket', 'Vé hạng hai, duyên dáng khiêm tốn', 'Second class ticket, humble grace'],
  [22, 2, 'Charm School', 'Trường duyên dáng', 'Charm school'],
  [22, 3, 'The Enchanter', 'Người mê hoặc', 'The enchanter'],
  [22, 4, 'Sensitivity', 'Nhạy cảm cảm xúc', 'Emotional sensitivity'],
  [22, 5, 'Directness', 'Trực tiếp trong cảm xúc', 'Direct in emotions'],
  [22, 6, 'Maturity', 'Trưởng thành cảm xúc', 'Emotional maturity'],

  // Gate 23 — Assimilation / Splitting Apart
  [23, 1, 'Proselytization', 'Truyền giáo hoặc chia sẻ', 'Proselytization or sharing'],
  [23, 2, 'Self-Defense', 'Tự vệ trong diễn đạt', 'Self-defense in expression'],
  [23, 3, 'Individuality', 'Cá tính trong đồng hóa', 'Individuality in assimilation'],
  [23, 4, 'Fragmentation', 'Phân mảnh hoặc tổng hợp', 'Fragmentation or synthesis'],
  [23, 5, 'Assimilation', 'Đồng hóa thực sự', 'True assimilation'],
  [23, 6, 'Fusion', 'Hợp nhất cái mới', 'Fusion of the new'],

  // Gate 24 — Rationalization / Return
  [24, 1, 'The Sin of Omission', 'Tội thiếu sót', 'The sin of omission'],
  [24, 2, 'Recognition', 'Nhận ra sự trở lại', 'Recognizing the return'],
  [24, 3, 'The Addict', 'Người nghiện suy nghĩ', 'The addict of thinking'],
  [24, 4, 'The Hermit', 'Ẩn sĩ suy tư', 'The thinking hermit'],
  [24, 5, 'The Fixer', 'Người sửa chữa bằng lý trí', 'The fixer through reason'],
  [24, 6, 'The Gift', 'Món quà của trực giác', 'The gift of intuition'],

  // Gate 25 — Innocence / The Spirit of the Self
  [25, 1, 'Selflessness', 'Vô ngã, tình yêu vô điều kiện', 'Selflessness, unconditional love'],
  [25, 2, 'Existentialism', 'Hiện sinh trong ngây thơ', 'Existentialism in innocence'],
  [25, 3, 'Sensibility', 'Nhạy cảm tâm linh', 'Spiritual sensibility'],
  [25, 4, 'Survival', 'Sinh tồn của tinh thần', 'Survival of spirit'],
  [25, 5, 'Recuperation', 'Hồi phục tinh thần', 'Spiritual recuperation'],
  [25, 6, 'Ignorance', 'Ngây thơ hoặc minh triết', 'Ignorance or wisdom'],

  // Gates 26-64: continuing the same pattern
  [26, 1, 'A Bird in the Hand', 'Chim trong tay, nắm chắc', 'A bird in the hand'],
  [26, 2, 'The History Lesson', 'Bài học lịch sử', 'The history lesson'],
  [26, 3, 'Influence', 'Ảnh hưởng thuyết phục', 'Persuasive influence'],
  [26, 4, 'Censorship', 'Kiểm duyệt hoặc minh bạch', 'Censorship or transparency'],
  [26, 5, 'Adaptability', 'Thích ứng trong thuyết phục', 'Adaptability in persuasion'],
  [26, 6, 'Authority', 'Quyền lực thuyết phục', 'Persuasive authority'],

  [27, 1, 'Selfishness', 'Ích kỷ hoặc chăm sóc bản thân', 'Selfishness or self-care'],
  [27, 2, 'Self-Sufficiency', 'Tự cung tự cấp', 'Self-sufficiency'],
  [27, 3, 'Greed', 'Tham lam hoặc nuôi dưỡng', 'Greed or nourishment'],
  [27, 4, 'Generosity', 'Rộng lượng trong chăm sóc', 'Generosity in caring'],
  [27, 5, 'The Executor', 'Người thực thi chăm sóc', 'The executor of caring'],
  [27, 6, 'Wariness', 'Cảnh giác trong nuôi dưỡng', 'Wariness in nourishment'],

  [28, 1, 'Preparation', 'Chuẩn bị cho đấu tranh', 'Preparation for struggle'],
  [28, 2, 'Shaking Hands with the Devil', 'Bắt tay với quỷ, chấp nhận rủi ro', 'Shaking hands with the devil'],
  [28, 3, 'Adventurism', 'Phiêu lưu tìm ý nghĩa', 'Adventurism seeking meaning'],
  [28, 4, 'Holding On', 'Bám trụ trong khó khăn', 'Holding on through difficulty'],
  [28, 5, 'Treachery', 'Phản bội hoặc trung thành', 'Treachery or loyalty'],
  [28, 6, 'Blaze of Glory', 'Rực rỡ vinh quang', 'Blaze of glory'],

  [29, 1, 'The Draftee', 'Người bị gọi, cam kết bất đắc dĩ', 'The draftee, reluctant commitment'],
  [29, 2, 'Assessment', 'Đánh giá trước cam kết', 'Assessment before commitment'],
  [29, 3, 'Evaluation', 'Đánh giá liên tục', 'Continuous evaluation'],
  [29, 4, 'Directness', 'Trực tiếp trong cam kết', 'Directness in commitment'],
  [29, 5, 'Overreach', 'Quá tay hoặc đủ', 'Overreach or enough'],
  [29, 6, 'Confusion', 'Hoang mang trước cam kết', 'Confusion before commitment'],

  [30, 1, 'Composure', 'Bình tĩnh trong cảm xúc', 'Composure in feelings'],
  [30, 2, 'Pragmatism', 'Thực dụng với cảm xúc', 'Pragmatism with feelings'],
  [30, 3, 'Resignation', 'Cam chịu hoặc chấp nhận', 'Resignation or acceptance'],
  [30, 4, 'Burnout', 'Kiệt sức cảm xúc', 'Emotional burnout'],
  [30, 5, 'Irony', 'Mỉa mai trong cảm xúc', 'Irony in feelings'],
  [30, 6, 'Enforcement', 'Thực thi cảm xúc', 'Enforcement of feelings'],

  [31, 1, 'Manifestation', 'Biểu hiện lãnh đạo', 'Manifestation of leadership'],
  [31, 2, 'Arrogance', 'Kiêu ngạo hoặc tự tin lãnh đạo', 'Arrogance or confident leadership'],
  [31, 3, 'Selectivity', 'Chọn lọc trong ảnh hưởng', 'Selectivity in influence'],
  [31, 4, 'Intent', 'Ý định lãnh đạo', 'Leadership intent'],
  [31, 5, 'Self-Righteousness', 'Tự cho mình đúng', 'Self-righteousness'],
  [31, 6, 'Application', 'Ứng dụng ảnh hưởng', 'Applying influence'],

  [32, 1, 'Conservation', 'Bảo tồn, giữ gìn', 'Conservation, preservation'],
  [32, 2, 'Restraint', 'Kiềm chế trong biến đổi', 'Restraint in transformation'],
  [32, 3, 'Absence of Will', 'Thiếu ý chí hoặc nhẹ nhàng', 'Absence of will or gentleness'],
  [32, 4, 'Right is Might', 'Chính nghĩa là sức mạnh', 'Right is might'],
  [32, 5, 'Flexibility', 'Linh hoạt trong bền vững', 'Flexibility in continuity'],
  [32, 6, 'Tranquility', 'Yên bình trong bền vững', 'Tranquility in continuity'],

  [33, 1, 'Avoidance', 'Tránh né hoặc rút lui chiến lược', 'Avoidance or strategic retreat'],
  [33, 2, 'Surrender', 'Đầu hàng, buông bỏ quá khứ', 'Surrender, releasing the past'],
  [33, 3, 'Spirit', 'Tinh thần trong rút lui', 'Spirit in retreat'],
  [33, 4, 'Dignity', 'Phẩm giá trong riêng tư', 'Dignity in privacy'],
  [33, 5, 'Timing', 'Thời điểm rút lui', 'Timing of retreat'],
  [33, 6, 'Disassociation', 'Tách rời, quan sát từ xa', 'Disassociation, observing from afar'],

  [34, 1, 'The Bully', 'Kẻ bắt nạt hoặc người bảo vệ', 'The bully or protector'],
  [34, 2, 'Momentum', 'Đà sức mạnh', 'Momentum of power'],
  [34, 3, 'Machismo', 'Nam tính cường điệu', 'Exaggerated machismo'],
  [34, 4, 'Triumph', 'Chiến thắng bằng sức mạnh', 'Triumph through power'],
  [34, 5, 'Annihilation', 'Hủy diệt hoặc chuyển hóa', 'Annihilation or transformation'],
  [34, 6, 'Common Sense', 'Thường thức trong sức mạnh', 'Common sense in power'],

  [35, 1, 'Humility', 'Khiêm tốn trong trải nghiệm', 'Humility in experience'],
  [35, 2, 'Creative Block', 'Tắc nghẽn sáng tạo', 'Creative block'],
  [35, 3, 'Collaboration', 'Hợp tác trong thay đổi', 'Collaboration in change'],
  [35, 4, 'Hunger', 'Khao khát trải nghiệm mới', 'Hunger for new experience'],
  [35, 5, 'Altruism', 'Vị tha trong tiến bộ', 'Altruism in progress'],
  [35, 6, 'Rectification', 'Chỉnh sửa qua kinh nghiệm', 'Rectification through experience'],

  [36, 1, 'Resistance', 'Kháng cự khủng hoảng', 'Resistance to crisis'],
  [36, 2, 'Support', 'Hỗ trợ qua khủng hoảng', 'Support through crisis'],
  [36, 3, 'Transition', 'Chuyển tiếp cảm xúc', 'Emotional transition'],
  [36, 4, 'Espionage', 'Gián điệp cảm xúc', 'Emotional espionage'],
  [36, 5, 'The Underground', 'Ngầm, ẩn giấu cảm xúc', 'Underground, hidden emotions'],
  [36, 6, 'Justice', 'Công lý qua trải nghiệm', 'Justice through experience'],

  [37, 1, 'The Mother/Father', 'Cha mẹ, chăm sóc gia đình', 'Parent, family care'],
  [37, 2, 'Responsibility', 'Trách nhiệm gia đình', 'Family responsibility'],
  [37, 3, 'Evenhandedness', 'Công bằng trong gia đình', 'Evenhandedness in family'],
  [37, 4, 'Leadership by Example', 'Lãnh đạo bằng gương mẫu', 'Leadership by example'],
  [37, 5, 'Love', 'Tình yêu gia đình', 'Family love'],
  [37, 6, 'Purpose', 'Mục đích gia đình', 'Family purpose'],

  [38, 1, 'Qualification', 'Phẩm chất chiến đấu', 'Qualification for fight'],
  [38, 2, 'Politeness', 'Lịch sự trong đối kháng', 'Politeness in opposition'],
  [38, 3, 'Alliance', 'Liên minh chiến đấu', 'Fighting alliance'],
  [38, 4, 'Investigation', 'Điều tra trước chiến đấu', 'Investigation before fight'],
  [38, 5, 'Alienation', 'Xa lánh hoặc tập trung', 'Alienation or focus'],
  [38, 6, 'Misunderstanding', 'Hiểu lầm trong đấu tranh', 'Misunderstanding in struggle'],

  [39, 1, 'Disengagement', 'Rút lui khỏi khiêu khích', 'Disengaging from provocation'],
  [39, 2, 'Confrontation', 'Đối đầu trực tiếp', 'Direct confrontation'],
  [39, 3, 'Responsibility', 'Trách nhiệm khiêu khích', 'Responsible provocation'],
  [39, 4, 'Temperance', 'Điều độ trong khiêu khích', 'Temperance in provocation'],
  [39, 5, 'Single-Mindedness', 'Nhất tâm trong khiêu khích', 'Single-mindedness in provocation'],
  [39, 6, 'The Troubleshooter', 'Người giải quyết rắc rối', 'The troubleshooter'],

  [40, 1, 'Recuperation', 'Hồi phục qua cô đơn', 'Recovery through aloneness'],
  [40, 2, 'Firmness', 'Kiên định trong cô đơn', 'Firmness in aloneness'],
  [40, 3, 'Humility', 'Khiêm tốn trong cô đơn', 'Humility in aloneness'],
  [40, 4, 'Organization', 'Tổ chức qua nghỉ ngơi', 'Organization through rest'],
  [40, 5, 'Rigidity', 'Cứng nhắc hoặc kỷ luật', 'Rigidity or discipline'],
  [40, 6, 'Decapitation', 'Cắt đầu, giải phóng triệt để', 'Decapitation, radical liberation'],

  [41, 1, 'Reasonableness', 'Hợp lý trong tưởng tượng', 'Reasonableness in imagination'],
  [41, 2, 'Caution', 'Thận trọng với tưởng tượng', 'Caution with imagination'],
  [41, 3, 'Efficiency', 'Hiệu quả trong thu hẹp', 'Efficiency in contraction'],
  [41, 4, 'Correction', 'Sửa chữa tưởng tượng', 'Correcting imagination'],
  [41, 5, 'Authorization', 'Cho phép tưởng tượng', 'Authorizing imagination'],
  [41, 6, 'Contagion', 'Lây lan tưởng tượng', 'Contagious imagination'],

  [42, 1, 'Diversification', 'Đa dạng hóa phát triển', 'Diversifying growth'],
  [42, 2, 'Identification', 'Nhận diện chu kỳ', 'Identifying cycles'],
  [42, 3, 'Trial and Error', 'Thử và sai trong phát triển', 'Trial and error in growth'],
  [42, 4, 'The Middle Man', 'Người trung gian', 'The middle man'],
  [42, 5, 'Self-Actualization', 'Tự hiện thực hóa', 'Self-actualization'],
  [42, 6, 'Nurturing', 'Nuôi dưỡng chu kỳ', 'Nurturing cycles'],

  [43, 1, 'Patience', 'Kiên nhẫn với thấu hiểu', 'Patience with insight'],
  [43, 2, 'Dedication', 'Cống hiến cho thấu hiểu', 'Dedication to insight'],
  [43, 3, 'Expediency', 'Tiện lợi trong đột phá', 'Expediency in breakthrough'],
  [43, 4, 'The One-Track Mind', 'Một chiều trong suy nghĩ', 'One-track thinking'],
  [43, 5, 'Progression', 'Tiến bộ qua thấu hiểu', 'Progression through insight'],
  [43, 6, 'Breakthrough', 'Đột phá thực sự', 'True breakthrough'],

  [44, 1, 'Conditions', 'Điều kiện nhận biết', 'Conditions of alertness'],
  [44, 2, 'Management', 'Quản lý mẫu hình', 'Managing patterns'],
  [44, 3, 'Interference', 'Can thiệp hoặc cảnh giác', 'Interference or alertness'],
  [44, 4, 'Honesty', 'Trung thực trong nhận biết', 'Honesty in alertness'],
  [44, 5, 'Manipulation', 'Thao túng hoặc khéo léo', 'Manipulation or skill'],
  [44, 6, 'Objectivity', 'Khách quan trong mẫu hình', 'Objectivity in patterns'],

  [45, 1, 'Canvassing', 'Vận động tập hợp', 'Canvassing for gathering'],
  [45, 2, 'Consensus', 'Đồng thuận tài nguyên', 'Resource consensus'],
  [45, 3, 'Exclusion', 'Loại trừ hoặc bao gồm', 'Exclusion or inclusion'],
  [45, 4, 'Direction', 'Chỉ đạo tài nguyên', 'Directing resources'],
  [45, 5, 'Leadership', 'Lãnh đạo tập hợp', 'Gathering leadership'],
  [45, 6, 'Reconsideration', 'Tái xem xét tài nguyên', 'Reconsidering resources'],

  [46, 1, 'Being Discovered', 'Được phát hiện', 'Being discovered'],
  [46, 2, 'The Prima Donna', 'Ngôi sao, quyết tâm bản thể', 'The prima donna, self-determination'],
  [46, 3, 'Projection', 'Chiếu xạ bản thể', 'Self-projection'],
  [46, 4, 'Impact', 'Tác động thân thể', 'Bodily impact'],
  [46, 5, 'Pacing', 'Nhịp độ bản thể', 'Self-pacing'],
  [46, 6, 'Integrity', 'Toàn vẹn bản thể', 'Self-integrity'],

  [47, 1, 'Taking Stock', 'Kiểm kê trừu tượng', 'Taking abstract stock'],
  [47, 2, 'Ambition', 'Tham vọng nhận ra', 'Ambition to realize'],
  [47, 3, 'Self-Oppression', 'Tự áp bức suy nghĩ', 'Self-oppression in thinking'],
  [47, 4, 'Censorship', 'Kiểm duyệt suy nghĩ', 'Thought censorship'],
  [47, 5, 'The Saint', 'Thánh nhân, nhận ra sâu sắc', 'The saint, deep realization'],
  [47, 6, 'Futility', 'Vô ích hoặc đầu hàng', 'Futility or surrender'],

  [48, 1, 'Insignificance', 'Tầm thường hoặc nền tảng', 'Insignificance or foundation'],
  [48, 2, 'Degeneracy', 'Thoái hóa hoặc chiều sâu', 'Degeneracy or depth'],
  [48, 3, 'Incommunicado', 'Không giao tiếp, chiều sâu nội tại', 'Incommunicado, inner depth'],
  [48, 4, 'Restructuring', 'Tái cấu trúc tri thức', 'Restructuring knowledge'],
  [48, 5, 'Action', 'Hành động từ chiều sâu', 'Action from depth'],
  [48, 6, 'Self-Fulfillment', 'Tự hoàn thiện tri thức', 'Self-fulfillment in knowledge'],

  [49, 1, 'The Law of Necessity', 'Luật tất yếu', 'The law of necessity'],
  [49, 2, 'The Last Resort', 'Phương sách cuối cùng', 'The last resort'],
  [49, 3, 'Popular Discontent', 'Bất mãn đại chúng', 'Popular discontent'],
  [49, 4, 'Platform', 'Nền tảng nguyên tắc', 'Platform of principles'],
  [49, 5, 'Organization', 'Tổ chức cách mạng', 'Revolutionary organization'],
  [49, 6, 'Attraction', 'Sức hút nguyên tắc', 'Attraction of principles'],

  [50, 1, 'The Immigrant', 'Người nhập cư, giá trị mới', 'The immigrant, new values'],
  [50, 2, 'Determination', 'Quyết tâm giá trị', 'Determination of values'],
  [50, 3, 'Adaptability', 'Thích ứng giá trị', 'Adaptability of values'],
  [50, 4, 'Corruption', 'Tham nhũng hoặc trong sạch', 'Corruption or integrity'],
  [50, 5, 'Consistency', 'Nhất quán giá trị', 'Consistency of values'],
  [50, 6, 'Leadership', 'Lãnh đạo giá trị', 'Values leadership'],

  [51, 1, 'Reference', 'Tham chiếu, phản ứng sốc', 'Reference, reaction to shock'],
  [51, 2, 'Withdrawal', 'Rút lui sau sốc', 'Withdrawal after shock'],
  [51, 3, 'Adaptation', 'Thích ứng với sốc', 'Adaptation to shock'],
  [51, 4, 'Limitation', 'Giới hạn cạnh tranh', 'Limiting competition'],
  [51, 5, 'Symmetry', 'Đối xứng trong cạnh tranh', 'Symmetry in competition'],
  [51, 6, 'Separation', 'Tách biệt qua sốc', 'Separation through shock'],

  [52, 1, 'Think Before You Speak', 'Suy nghĩ trước khi nói', 'Think before you speak'],
  [52, 2, 'Concern', 'Lo lắng hoặc tập trung', 'Concern or concentration'],
  [52, 3, 'Controls', 'Kiểm soát tĩnh lặng', 'Controls of stillness'],
  [52, 4, 'Self-Discipline', 'Tự kỷ luật', 'Self-discipline'],
  [52, 5, 'Explanation', 'Giải thích qua tĩnh lặng', 'Explanation through stillness'],
  [52, 6, 'Peacefulness', 'Bình an tĩnh lặng', 'Peaceful stillness'],

  [53, 1, 'Accumulation', 'Tích lũy cho khởi đầu', 'Accumulation for beginnings'],
  [53, 2, 'Momentum', 'Đà khởi đầu', 'Momentum of beginning'],
  [53, 3, 'Practicality', 'Thực tế trong khởi đầu', 'Practicality in beginning'],
  [53, 4, 'Assuredness', 'Chắc chắn trong khởi đầu', 'Assuredness in beginning'],
  [53, 5, 'Assertion', 'Khẳng định khởi đầu', 'Asserting the beginning'],
  [53, 6, 'Phasing', 'Phân giai đoạn chu kỳ', 'Phasing of cycles'],

  [54, 1, 'Influence', 'Ảnh hưởng tham vọng', 'Ambitious influence'],
  [54, 2, 'Discretion', 'Kín đáo trong tham vọng', 'Discretion in ambition'],
  [54, 3, 'Covert Interaction', 'Tương tác ngầm', 'Covert interaction'],
  [54, 4, 'Enlightenment/Endarkenment', 'Giác ngộ hoặc u mê', 'Enlightenment or endarkenment'],
  [54, 5, 'Magnanimity', 'Cao thượng trong tham vọng', 'Magnanimity in ambition'],
  [54, 6, 'Selectivity', 'Chọn lọc trong tham vọng', 'Selectivity in ambition'],

  [55, 1, 'Co-operation', 'Hợp tác tinh thần', 'Spiritual cooperation'],
  [55, 2, 'Distrust', 'Nghi ngờ hoặc cảnh giác', 'Distrust or vigilance'],
  [55, 3, 'Innocence', 'Ngây thơ tinh thần', 'Spiritual innocence'],
  [55, 4, 'Assimilation', 'Đồng hóa cảm xúc', 'Emotional assimilation'],
  [55, 5, 'Growth', 'Phát triển tinh thần', 'Spiritual growth'],
  [55, 6, 'Selfishness', 'Ích kỷ hoặc tự chăm sóc', 'Selfishness or self-care'],

  [56, 1, 'Quality', 'Chất lượng kích thích', 'Quality of stimulation'],
  [56, 2, 'Linkage', 'Kết nối câu chuyện', 'Story linkage'],
  [56, 3, 'Alienation', 'Xa lánh hoặc kết nối', 'Alienation or connection'],
  [56, 4, 'Expediency', 'Tiện lợi trong kể chuyện', 'Expediency in storytelling'],
  [56, 5, 'Attracting Attention', 'Thu hút chú ý', 'Attracting attention'],
  [56, 6, 'Caution', 'Thận trọng trong kích thích', 'Caution in stimulation'],

  [57, 1, 'Confusion', 'Hoang mang hoặc rõ ràng', 'Confusion or clarity'],
  [57, 2, 'Cleansing', 'Thanh lọc trực giác', 'Intuitive cleansing'],
  [57, 3, 'Acuteness', 'Sắc bén trực giác', 'Intuitive acuteness'],
  [57, 4, 'The Director', 'Đạo diễn trực giác', 'The intuitive director'],
  [57, 5, 'Progression', 'Tiến bộ qua trực giác', 'Progression through intuition'],
  [57, 6, 'Utilization', 'Sử dụng trực giác', 'Utilizing intuition'],

  [58, 1, 'Love of Life', 'Yêu đời, sinh lực', 'Love of life, vitality'],
  [58, 2, 'Perversion', 'Lệch lạc hoặc thuần khiết', 'Perversion or purity'],
  [58, 3, 'Electricity', 'Điện năng sinh lực', 'Electric vitality'],
  [58, 4, 'Focusing', 'Tập trung niềm vui', 'Focusing joy'],
  [58, 5, 'Defense', 'Bảo vệ niềm vui sống', 'Defending joy of life'],
  [58, 6, 'Carried Away', 'Cuốn đi hoặc kỷ luật', 'Carried away or disciplined'],

  [59, 1, 'The Preemptive Strike', 'Đánh phủ đầu thân mật', 'Preemptive strike of intimacy'],
  [59, 2, 'Shyness', 'Nhút nhát trong thân mật', 'Shyness in intimacy'],
  [59, 3, 'Openness', 'Cởi mở thân mật', 'Openness in intimacy'],
  [59, 4, 'Brotherhood/Sisterhood', 'Tình anh em', 'Brotherhood/sisterhood'],
  [59, 5, 'The Femme Fatale/Casanova', 'Quyến rũ mạnh mẽ', 'Powerful seduction'],
  [59, 6, 'The One Night Stand', 'Thoáng qua hoặc sâu sắc', 'Fleeting or deep'],

  [60, 1, 'Acceptance', 'Chấp nhận giới hạn', 'Accepting limitation'],
  [60, 2, 'Decisiveness', 'Quyết đoán trong giới hạn', 'Decisiveness in limitation'],
  [60, 3, 'Conservatism', 'Bảo thủ trong đột biến', 'Conservatism in mutation'],
  [60, 4, 'Resourcefulness', 'Tháo vát trong giới hạn', 'Resourcefulness in limitation'],
  [60, 5, 'Leadership', 'Lãnh đạo qua giới hạn', 'Leadership through limitation'],
  [60, 6, 'Rigidity', 'Cứng nhắc hoặc kỷ luật', 'Rigidity or discipline'],

  [61, 1, 'Occult Knowledge', 'Tri thức huyền bí', 'Occult knowledge'],
  [61, 2, 'Natural Brilliance', 'Tài năng tự nhiên bí ẩn', 'Natural mysterious brilliance'],
  [61, 3, 'Interdependence', 'Phụ thuộc lẫn nhau trong bí ẩn', 'Interdependence in mystery'],
  [61, 4, 'Research', 'Nghiên cứu sự thật nội tại', 'Researching inner truth'],
  [61, 5, 'Influence', 'Ảnh hưởng bí ẩn', 'Mysterious influence'],
  [61, 6, 'Appeal', 'Kêu gọi từ sự thật nội tại', 'Appeal from inner truth'],

  [62, 1, 'Routine', 'Thói quen trong chi tiết', 'Routine in details'],
  [62, 2, 'Restraint', 'Kiềm chế trong biểu đạt', 'Restraint in expression'],
  [62, 3, 'Discovery', 'Khám phá chi tiết mới', 'Discovering new details'],
  [62, 4, 'Asceticism', 'Khổ hạnh logic', 'Logical asceticism'],
  [62, 5, 'Metamorphosis', 'Biến hình qua chi tiết', 'Metamorphosis through details'],
  [62, 6, 'Self-Discipline', 'Tự kỷ luật chi tiết', 'Self-discipline in details'],

  [63, 1, 'Composure', 'Bình tĩnh trong hoài nghi', 'Composure in doubt'],
  [63, 2, 'Structuring', 'Cấu trúc hoài nghi', 'Structuring doubt'],
  [63, 3, 'Continuance', 'Tiếp tục qua hoài nghi', 'Continuing through doubt'],
  [63, 4, 'Memory', 'Trí nhớ logic', 'Logical memory'],
  [63, 5, 'Affirmation', 'Khẳng định qua hoài nghi', 'Affirmation through doubt'],
  [63, 6, 'Nostalgia', 'Hoài niệm hoặc tổng kết', 'Nostalgia or summation'],

  [64, 1, 'Conditions', 'Điều kiện trước hoàn thành', 'Conditions before completion'],
  [64, 2, 'Qualification', 'Phẩm chất trong hoang mang', 'Qualification in confusion'],
  [64, 3, 'Overextension', 'Quá sức hoặc kiên trì', 'Overextension or perseverance'],
  [64, 4, 'Conviction', 'Niềm tin qua hoang mang', 'Conviction through confusion'],
  [64, 5, 'Promise', 'Hứa hẹn hoàn thành', 'Promise of completion'],
  [64, 6, 'Victory', 'Chiến thắng, hoàn thành', 'Victory, completion'],
]

// Build lookup map: "gate-line" → LineDescription
const LINE_MAP = new Map<string, LineDescription>()
for (const [gate, line, keynote, vn, en] of LINE_DATA) {
  LINE_MAP.set(`${gate}-${line}`, { gate, line, keynote, theme: { vn, en } })
}

export function getLineDescription(gate: number, line: number): LineDescription | undefined {
  return LINE_MAP.get(`${gate}-${line}`)
}
