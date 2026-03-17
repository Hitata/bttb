import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed MLK celebrity case
  const mlkSlug = 'martin-luther-king-jr'

  const existing = await prisma.baziCase.findUnique({ where: { slug: mlkSlug } })
  if (existing) {
    console.log('MLK case already exists, skipping.')
    return
  }

  // MLK: January 15, 1929, 12:00 PM, Male
  // Year: Mậu-Thìn, Month: Ất-Sửu, Day: Canh-Thân, Hour: Nhâm-Ngọ
  const chartData = {
    date: {
      solar: { year: 1929, month: 1, day: 15 },
      lunar: { year: 1928, month: 12, day: 5 },
      nongLich: { year: 1929, month: 1, day: 15 },
    },
    tutru: {
      thienTru: {
        canIndex: 4, chiIndex: 4,
        can: 'Mậu', chi: 'Thìn',
        canNguHanh: 'Thổ', chiNguHanh: 'Thổ',
        thapThan: { code: 'TT', name: 'Thiên Tài' },
        tangCan: [
          { canIndex: 4, can: 'Mậu', nguHanh: 'Thổ', thapThan: { code: 'TT', name: 'Thiên Tài' } },
          { canIndex: 1, can: 'Ất', nguHanh: 'Mộc', thapThan: { code: 'CQ', name: 'Chính Quan' } },
          { canIndex: 9, can: 'Quý', nguHanh: 'Thủy', thapThan: { code: 'TS', name: 'Thương Sinh' } },
        ],
        naYin: { name: 'Đại Lâm Mộc', element: 'Mộc' },
        vongTruongSinh: { name: 'Dưỡng', index: 11 },
        thanSat: [],
      },
      nguyetTru: {
        canIndex: 1, chiIndex: 1,
        can: 'Ất', chi: 'Sửu',
        canNguHanh: 'Mộc', chiNguHanh: 'Thổ',
        thapThan: { code: 'CQ', name: 'Chính Quan' },
        tangCan: [
          { canIndex: 5, can: 'Kỷ', nguHanh: 'Thổ', thapThan: { code: 'CT', name: 'Chính Tài' } },
          { canIndex: 9, can: 'Quý', nguHanh: 'Thủy', thapThan: { code: 'TS', name: 'Thương Sinh' } },
          { canIndex: 7, can: 'Tân', nguHanh: 'Kim', thapThan: { code: 'KN', name: 'Kiếp Nhận' } },
        ],
        naYin: { name: 'Hải Trung Kim', element: 'Kim' },
        vongTruongSinh: { name: 'Tử', index: 7 },
        thanSat: [],
      },
      nhatTru: {
        canIndex: 6, chiIndex: 8,
        can: 'Canh', chi: 'Thân',
        canNguHanh: 'Kim', chiNguHanh: 'Kim',
        thapThan: { code: 'TK', name: 'Tỷ Kiên' },
        tangCan: [
          { canIndex: 6, can: 'Canh', nguHanh: 'Kim', thapThan: { code: 'TK', name: 'Tỷ Kiên' } },
          { canIndex: 8, can: 'Nhâm', nguHanh: 'Thủy', thapThan: { code: 'TA', name: 'Thực Ấn' } },
          { canIndex: 4, can: 'Mậu', nguHanh: 'Thổ', thapThan: { code: 'TT', name: 'Thiên Tài' } },
        ],
        naYin: { name: 'Thạch Lựu Mộc', element: 'Mộc' },
        vongTruongSinh: { name: 'Lâm Quan', index: 3 },
        thanSat: [],
      },
      thoiTru: {
        canIndex: 8, chiIndex: 6,
        can: 'Nhâm', chi: 'Ngọ',
        canNguHanh: 'Thủy', chiNguHanh: 'Hỏa',
        thapThan: { code: 'TA', name: 'Thực Ấn' },
        tangCan: [
          { canIndex: 3, can: 'Đinh', nguHanh: 'Hỏa', thapThan: { code: 'CQ', name: 'Chính Quan' } },
          { canIndex: 5, can: 'Kỷ', nguHanh: 'Thổ', thapThan: { code: 'CT', name: 'Chính Tài' } },
        ],
        naYin: { name: 'Dương Liễu Mộc', element: 'Mộc' },
        vongTruongSinh: { name: 'Mộc Dục', index: 1 },
        thanSat: [],
      },
    },
    dayMasterIndex: 6,
    daivan: {
      startAge: 3,
      cycles: [
        { startAge: 3, startYear: 1932, canIndex: 2, chiIndex: 2, can: 'Bính', chi: 'Dần', thapThan: { code: 'TQ', name: 'Thiên Quan' }, tangCan: [], naYin: { name: 'Lư Trung Hỏa', element: 'Hỏa' }, vongTruongSinh: { name: 'Tuyệt', index: 9 }, thanSat: [] },
        { startAge: 13, startYear: 1942, canIndex: 3, chiIndex: 3, can: 'Đinh', chi: 'Mão', thapThan: { code: 'CQ', name: 'Chính Quan' }, tangCan: [], naYin: { name: 'Lư Trung Hỏa', element: 'Hỏa' }, vongTruongSinh: { name: 'Thai', index: 10 }, thanSat: [] },
        { startAge: 23, startYear: 1952, canIndex: 4, chiIndex: 4, can: 'Mậu', chi: 'Thìn', thapThan: { code: 'TT', name: 'Thiên Tài' }, tangCan: [], naYin: { name: 'Đại Lâm Mộc', element: 'Mộc' }, vongTruongSinh: { name: 'Dưỡng', index: 11 }, thanSat: [] },
        { startAge: 33, startYear: 1962, canIndex: 5, chiIndex: 5, can: 'Kỷ', chi: 'Tỵ', thapThan: { code: 'CT', name: 'Chính Tài' }, tangCan: [], naYin: { name: 'Đại Lâm Mộc', element: 'Mộc' }, vongTruongSinh: { name: 'Trường Sinh', index: 0 }, thanSat: [] },
        { startAge: 43, startYear: 1972, canIndex: 6, chiIndex: 6, can: 'Canh', chi: 'Ngọ', thapThan: { code: 'TK', name: 'Tỷ Kiên' }, tangCan: [], naYin: { name: 'Lộ Bàng Thổ', element: 'Thổ' }, vongTruongSinh: { name: 'Mộc Dục', index: 1 }, thanSat: [] },
        { startAge: 53, startYear: 1982, canIndex: 7, chiIndex: 7, can: 'Tân', chi: 'Mùi', thapThan: { code: 'KN', name: 'Kiếp Nhận' }, tangCan: [], naYin: { name: 'Lộ Bàng Thổ', element: 'Thổ' }, vongTruongSinh: { name: 'Quan Đới', index: 2 }, thanSat: [] },
        { startAge: 63, startYear: 1992, canIndex: 8, chiIndex: 8, can: 'Nhâm', chi: 'Thân', thapThan: { code: 'TA', name: 'Thực Ấn' }, tangCan: [], naYin: { name: 'Kiếm Phong Kim', element: 'Kim' }, vongTruongSinh: { name: 'Lâm Quan', index: 3 }, thanSat: [] },
        { startAge: 73, startYear: 2002, canIndex: 9, chiIndex: 9, can: 'Quý', chi: 'Dậu', thapThan: { code: 'TS', name: 'Thương Sinh' }, tangCan: [], naYin: { name: 'Kiếm Phong Kim', element: 'Kim' }, vongTruongSinh: { name: 'Đế Vượng', index: 4 }, thanSat: [] },
        { startAge: 83, startYear: 2012, canIndex: 0, chiIndex: 10, can: 'Giáp', chi: 'Tuất', thapThan: { code: 'TQ', name: 'Thiên Quan' }, tangCan: [], naYin: { name: 'Sơn Đầu Hỏa', element: 'Hỏa' }, vongTruongSinh: { name: 'Suy', index: 5 }, thanSat: [] },
      ],
      chuKy: [],
      currentYear: {
        year: 2026, can: 'Bính', chi: 'Ngọ', canIndex: 2, chiIndex: 6,
        yearCanNguHanh: 'Hỏa', yearChiNguHanh: 'Hỏa',
        yearCanThapThan: { code: 'TQ', name: 'Thiên Quan' },
        tangCan: [], naYin: { name: 'Thiên Hà Thủy', element: 'Thủy' },
        vongTruongSinh: { name: 'Mộc Dục', index: 1 }, thanSat: [],
      },
    },
    compass: [],
    thansat: [],
    thaiMenhCung: { thaiCung: { can: 'Mậu', chi: 'Mùi' }, menhCung: { can: 'Nhâm', chi: 'Tỵ' } },
  }

  const traits = [
    { name: 'Leadership', strength: 5, description: 'Canh metal daymaster with strong Quan (Officer) stars indicates natural authority and leadership capacity.', tenGods: ['CQ', 'TQ'] },
    { name: 'Oratory', strength: 5, description: 'Thực Ấn (Eating God) in the hour pillar combined with Thương Sinh reflects exceptional communication skills.', tenGods: ['TA', 'TS'] },
    { name: 'Moral Courage', strength: 5, description: 'Strong Chính Quan presence indicates a deep sense of justice and willingness to stand for principles.', tenGods: ['CQ'] },
    { name: 'Strategic Thinking', strength: 4, description: 'Multiple Tài (Wealth) stars in the chart show ability to mobilize resources and plan strategically.', tenGods: ['TT', 'CT'] },
    { name: 'Resilience', strength: 5, description: 'Canh metal sitting on Thân (Lâm Quan stage) represents peak strength and unyielding determination.', tenGods: ['TK'] },
    { name: 'Compassion', strength: 4, description: 'Hidden Quý water and Ất wood in the pillars bring empathy and concern for others.', tenGods: ['TS', 'CQ'] },
  ]

  const timeline = [
    { year: 1929, age: 0, category: 'Birth', title: 'Born in Atlanta, Georgia', description: 'Born on January 15, 1929 to a Baptist minister family.', annualPillar: 'Mậu-Thìn', luckPillar: '' },
    { year: 1944, age: 15, category: 'Education', title: 'Entered Morehouse College', description: 'Enrolled at Morehouse College at age 15, following family tradition.', annualPillar: 'Giáp-Thân', luckPillar: 'Đinh-Mão' },
    { year: 1955, age: 26, category: 'Activism', title: 'Montgomery Bus Boycott', description: 'Led the Montgomery Bus Boycott, launching the civil rights movement.', annualPillar: 'Ất-Mùi', luckPillar: 'Mậu-Thìn' },
    { year: 1963, age: 34, category: 'Legacy', title: 'March on Washington', description: 'Delivered the famous speech at the March on Washington for Jobs and Freedom.', annualPillar: 'Quý-Mão', luckPillar: 'Kỷ-Tỵ' },
    { year: 1964, age: 35, category: 'Award', title: 'Nobel Peace Prize', description: 'Awarded the Nobel Peace Prize, becoming the youngest recipient at that time.', annualPillar: 'Giáp-Thìn', luckPillar: 'Kỷ-Tỵ' },
    { year: 1968, age: 39, category: 'Legacy', title: 'Assassination in Memphis', description: 'Assassinated on April 4, 1968, in Memphis, Tennessee.', annualPillar: 'Mậu-Thân', luckPillar: 'Kỷ-Tỵ', starBadges: ['Không Vong'] },
  ]

  const faq = [
    { question: 'What is MLK\'s daymaster element?', answer: 'MLK\'s daymaster is Canh (庚) metal, representing strength, justice, and determination. Yang metal is associated with weapons and tools — fitting for someone who wielded words as his instrument of change.' },
    { question: 'How do the Four Pillars explain his oratory skills?', answer: 'The Nhâm water in the hour pillar (Thực Ấn) represents eloquent expression. Water flowing from metal creates beautiful speech. Combined with the Ngọ fire branch, his words carried both intellectual depth and passionate emotion.' },
    { question: 'What made 1963 significant in his chart?', answer: 'The year 1963 (Quý-Mão) brought strong water and wood energy. Quý water is his Thương Sinh (Hurting Officer), which in positive expression represents breaking conventions and creative output — perfectly aligned with his groundbreaking speech.' },
    { question: 'How does his chart show leadership potential?', answer: 'Multiple Quan (Officer) stars — Ất wood as Chính Quan in the month pillar and Đinh fire interactions — indicate someone destined for positions of authority. The Lâm Quan stage on his day pillar means his daymaster is at peak power.' },
  ]

  await prisma.baziCase.create({
    data: {
      slug: mlkSlug,
      name: 'Martin Luther King Jr.',
      birthDate: 'January 15, 1929',
      birthTime: '12:00 PM',
      gender: 'male',
      location: 'Atlanta, Georgia, USA',
      description: 'American Baptist minister and activist who was the most visible spokesman and leader in the American civil rights movement.',
      categories: JSON.stringify(['Civil Rights', 'Leadership', 'Legacy']),
      tags: JSON.stringify(['Nobel Prize', 'Canh Metal', 'Activist', 'Orator']),
      chartData: JSON.stringify(chartData),
      coreAnalysis: 'Canh metal daymaster sitting on Thân (Monkey) at the Lâm Quan (Official) stage represents peak metal strength. The chart shows strong Officer stars indicating natural authority, combined with Eating God energy for exceptional communication.',
      traits: JSON.stringify(traits),
      timeline: JSON.stringify(timeline),
      luckPillars: JSON.stringify(chartData.daivan.cycles),
      faq: JSON.stringify(faq),
      isPublished: true,
      publishedAt: new Date(),
    },
  })

  console.log('Seeded MLK case successfully.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
