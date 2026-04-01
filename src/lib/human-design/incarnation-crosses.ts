// Human Design Incarnation Cross Names
//
// 192 crosses: 64 Personality Sun gates × 3 angles (Right/Juxtaposition/Left)
// The angle is determined by the profile:
//   Right Angle: 1/3, 1/4, 2/4, 2/5, 3/5, 3/6, 4/6
//   Juxtaposition: 4/1
//   Left Angle: 5/1, 5/2, 6/2, 6/3

export type CrossAngle = 'right' | 'juxtaposition' | 'left'

export interface IncarnationCross {
  readonly gate: number       // Personality Sun gate
  readonly right: string      // Right Angle Cross name
  readonly juxtaposition: string  // Juxtaposition Cross name
  readonly left: string       // Left Angle Cross name
}

// Profile → angle mapping
export function profileToAngle(conscious: number, unconscious: number): CrossAngle {
  if (conscious === 4 && unconscious === 1) return 'juxtaposition'
  if (conscious >= 5) return 'left'
  return 'right'
}

const CROSS_DATA: readonly IncarnationCross[] = [
  { gate: 1, right: 'The Sphinx 4', juxtaposition: 'Self-Expression', left: 'Defiance 2' },
  { gate: 2, right: 'The Sphinx 2', juxtaposition: 'The Driver', left: 'Defiance' },
  { gate: 3, right: 'Laws', juxtaposition: 'Mutation', left: 'Wishes' },
  { gate: 4, right: 'Explanation 3', juxtaposition: 'Formulization', left: 'Revolution 2' },
  { gate: 5, right: 'Consciousness 4', juxtaposition: 'Habits', left: 'Separation 2' },
  { gate: 6, right: 'Eden 3', juxtaposition: 'Conflict', left: 'The Plane 2' },
  { gate: 7, right: 'The Sphinx 3', juxtaposition: 'Interaction', left: 'Masks 2' },
  { gate: 8, right: 'Contagion 2', juxtaposition: 'Contribution', left: 'Uncertainty' },
  { gate: 9, right: 'Planning 4', juxtaposition: 'Focus', left: 'Identification 2' },
  { gate: 10, right: 'Vessel of Love 4', juxtaposition: 'Behavior', left: 'Prevention 2' },
  { gate: 11, right: 'Eden 4', juxtaposition: 'Ideas', left: 'Education 2' },
  { gate: 12, right: 'Eden 2', juxtaposition: 'Articulation', left: 'Education' },
  { gate: 13, right: 'The Sphinx', juxtaposition: 'Listening', left: 'Masks' },
  { gate: 14, right: 'Contagion 4', juxtaposition: 'Empowering', left: 'Uncertainty 2' },
  { gate: 15, right: 'Vessel of Love 2', juxtaposition: 'Extremes', left: 'Prevention' },
  { gate: 16, right: 'Planning 2', juxtaposition: 'Experimentation', left: 'Identification' },
  { gate: 17, right: 'Service', juxtaposition: 'Opinions', left: 'Upheaval' },
  { gate: 18, right: 'Service 3', juxtaposition: 'Correction', left: 'Upheaval 2' },
  { gate: 19, right: 'The Four Ways 4', juxtaposition: 'Need', left: 'Refinement 2' },
  { gate: 20, right: 'The Sleeping Phoenix 2', juxtaposition: 'The Now', left: 'Duality' },
  { gate: 21, right: 'Tension', juxtaposition: 'Control', left: 'Endeavour' },
  { gate: 22, right: 'Rulership', juxtaposition: 'Grace', left: 'Informing' },
  { gate: 23, right: 'Explanation 2', juxtaposition: 'Assimilation', left: 'Dedication' },
  { gate: 24, right: 'The Four Ways', juxtaposition: 'Rationalization', left: 'Incarnation' },
  { gate: 25, right: 'Vessel of Love', juxtaposition: 'Innocence', left: 'Healing' },
  { gate: 26, right: 'Rulership 4', juxtaposition: 'The Trickster', left: 'Confrontation 2' },
  { gate: 27, right: 'The Unexpected', juxtaposition: 'Caring', left: 'Alignment' },
  { gate: 28, right: 'The Unexpected 3', juxtaposition: 'Risks', left: 'Alignment 2' },
  { gate: 29, right: 'Contagion 3', juxtaposition: 'Commitment', left: 'Industry 2' },
  { gate: 30, right: 'Contagion', juxtaposition: 'Fates', left: 'Industry' },
  { gate: 31, right: 'The Unexpected 2', juxtaposition: 'Influence', left: 'The Alpha' },
  { gate: 32, right: 'Maya 3', juxtaposition: 'Conservation', left: 'Limitation 2' },
  { gate: 33, right: 'The Four Ways 2', juxtaposition: 'Retreat', left: 'Refinement' },
  { gate: 34, right: 'The Sleeping Phoenix 4', juxtaposition: 'Power', left: 'Duality 2' },
  { gate: 35, right: 'Consciousness 2', juxtaposition: 'Experience', left: 'Separation' },
  { gate: 36, right: 'Eden', juxtaposition: 'Crisis', left: 'The Plane' },
  { gate: 37, right: 'Planning', juxtaposition: 'Bargains', left: 'Migration' },
  { gate: 38, right: 'Tension 4', juxtaposition: 'Opposition', left: 'Individualism 2' },
  { gate: 39, right: 'Tension 2', juxtaposition: 'Provocation', left: 'Individualism' },
  { gate: 40, right: 'Planning 3', juxtaposition: 'Denial', left: 'Migration 2' },
  { gate: 41, right: 'The Unexpected 4', juxtaposition: 'Fantasy', left: 'The Alpha 2' },
  { gate: 42, right: 'Maya', juxtaposition: 'Completion', left: 'Limitation' },
  { gate: 43, right: 'Explanation 4', juxtaposition: 'Insight', left: 'Dedication 2' },
  { gate: 44, right: 'The Four Ways 3', juxtaposition: 'Alertness', left: 'Incarnation 2' },
  { gate: 45, right: 'Rulership 2', juxtaposition: 'Possession', left: 'Confrontation' },
  { gate: 46, right: 'Vessel of Love 3', juxtaposition: 'Serendipity', left: 'Healing 2' },
  { gate: 47, right: 'Rulership 3', juxtaposition: 'Oppression', left: 'Informing 2' },
  { gate: 48, right: 'Tension 3', juxtaposition: 'Depth', left: 'Endeavour 2' },
  { gate: 49, right: 'Explanation', juxtaposition: 'Principles', left: 'Revolution' },
  { gate: 50, right: 'Laws 3', juxtaposition: 'Values', left: 'Wishes 2' },
  { gate: 51, right: 'Penetration', juxtaposition: 'Shock', left: 'The Clarion' },
  { gate: 52, right: 'Service 2', juxtaposition: 'Stillness', left: 'Demands' },
  { gate: 53, right: 'Penetration 2', juxtaposition: 'Beginnings', left: 'Cycles' },
  { gate: 54, right: 'Penetration 4', juxtaposition: 'Ambition', left: 'Cycles 2' },
  { gate: 55, right: 'The Sleeping Phoenix 3', juxtaposition: 'Moods', left: 'Spirit 2' },
  { gate: 56, right: 'Laws 4', juxtaposition: 'Stimulation', left: 'Distraction 2' },
  { gate: 57, right: 'Penetration 3', juxtaposition: 'Intuition', left: 'The Clarion 2' },
  { gate: 58, right: 'Service 4', juxtaposition: 'Vitality', left: 'Demands 2' },
  { gate: 59, right: 'The Sleeping Phoenix', juxtaposition: 'Strategy', left: 'Spirit' },
  { gate: 60, right: 'Laws 2', juxtaposition: 'Limitation', left: 'Distraction' },
  { gate: 61, right: 'Maya 4', juxtaposition: 'Thinking', left: 'Obscuration 2' },
  { gate: 62, right: 'Maya 2', juxtaposition: 'Detail', left: 'Obscuration' },
  { gate: 63, right: 'Consciousness 3', juxtaposition: 'Doubts', left: 'Dominion 2' },
  { gate: 64, right: 'Consciousness', juxtaposition: 'Confusion', left: 'Dominion' },
]

const CROSS_MAP = new Map(CROSS_DATA.map(c => [c.gate, c]))

export function getIncarnationCross(
  personalitySunGate: number,
  conscious: number,
  unconscious: number,
): { name: string; angle: CrossAngle; fullName: string } | undefined {
  const cross = CROSS_MAP.get(personalitySunGate)
  if (!cross) return undefined

  const angle = profileToAngle(conscious, unconscious)
  const prefix = angle === 'right' ? 'Right Angle Cross of '
    : angle === 'juxtaposition' ? 'Juxtaposition Cross of '
      : 'Left Angle Cross of '

  const name = angle === 'right' ? cross.right
    : angle === 'juxtaposition' ? cross.juxtaposition
      : cross.left

  return { name, angle, fullName: prefix + name }
}
